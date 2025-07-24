import doctorSchema from "../../models/admin/ourTeam.model.js";
import doctorDetailsSchema from "../../models/admin/doctorDetails.model.js"; 
import { deleteImage } from "../../helpers/common.js";
import slugify from "slugify";

// helper to parse socialMedia field safely
function parseSocialMediaField(socialMedia, res) {
  if (typeof socialMedia === "string") {
    try {
      return JSON.parse(socialMedia);
    } catch (e) {
      res.status(400).send({
        message: "Invalid JSON in socialMedia field",
        isSuccess: false,
      });
      return null;
    }
  }
  return socialMedia;
}

// Create team member
export const createTeam = async (req, res) => {
  try {
    let { sort_order_no, name, designation, socialMedia, isActive, slug } = req.body;
    slug = slugify(slug || name, { lower: true, strict: true });

    const parsedSocialMedia = parseSocialMediaField(socialMedia, res);
    if (parsedSocialMedia === null) return;

    const existing = await doctorSchema.findOne({ slug });
    if (existing) {
      return res.status(400).send({
        message: "Slug already exists. Please use a unique slug.",
        isSuccess: false,
      });
    }

    const imageFile = req.files?.find(f => f.fieldname === "doctor_image");
    const doctor_image = imageFile ? "ourTeam/" + imageFile.filename : "";

    const createObj = {
      sort_order_no,
      slug,
      name,
      designation,
      socialMedia: parsedSocialMedia,
      isActive,
    };
    if (doctor_image) createObj.doctor_image = doctor_image;

    const saveData = new doctorSchema(createObj);
    await saveData.save();

    return res.status(200).send({
      isSuccess: true,
      message: "Data created successfully.",
      data: saveData,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).send({ message: error.message, isSuccess: false });
  }
};

// Update team member
export const updateTeam = async (req, res) => {
  try {
    let { doctor_id, sort_order_no, name, designation, socialMedia, isActive, slug } = req.body;

    if (!doctor_id) {
      return res.status(400).send({ message: "doctor_id is required.", isSuccess: false });
    }

    const existingData = await doctorSchema.findById(doctor_id);
    if (!existingData) {
      return res.status(404).send({ message: "Data not found!", isSuccess: false });
    }

    slug = slugify(slug || name, { lower: true, strict: true });

    if (slug !== existingData.slug) {
      const existingSlug = await doctorSchema.findOne({ slug });
      if (existingSlug) {
        return res.status(400).send({
          message: "Slug already exists. Please use a unique slug.",
          isSuccess: false,
        });
      }
    }

    const parsedSocialMedia = parseSocialMediaField(socialMedia, res);
    if (parsedSocialMedia === null) return;

    const imageFile = req.files?.find(f => f.fieldname === "doctor_image");
    const doctor_image = imageFile ? "ourTeam/" + imageFile.filename : "";

    const updateObj = {
      sort_order_no,
      slug,
      name,
      designation,
      socialMedia: parsedSocialMedia,
      isActive,
    };

    if (imageFile && existingData.doctor_image) {
      await deleteImage(existingData.doctor_image);
    }
    if (imageFile) {
      updateObj.doctor_image = "ourTeam/" + imageFile.filename;
    }


    const updated = await doctorSchema.findByIdAndUpdate(doctor_id, updateObj, { new: true });

    return res.status(200).send({
      isSuccess: true,
      message: "Data updated successfully.",
      data: updated,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).send({ message: error.message, isSuccess: false });
  }
};
// Delete team member
export const deleteTeam = async (req, res) => {
  try {
    const doctor_id = req.query.doctor_id;

    const findData = await doctorSchema.findById(doctor_id);
    if (!findData) {
      return res.status(404).send({ message: "Data not found!", isSuccess: false });
    }

    if (findData.doctor_image) {
      await deleteImage(findData.doctor_image);
    }

    await doctorSchema.findByIdAndDelete(doctor_id);

    return res.status(200).send({
      isSuccess: true,
      message: "Data deleted successfully.",
    });
  } catch (error) {
    return res.status(500).send({ message: error.message, isSuccess: false });
  }
};

// Get all team members
export const getAllTeam = async (req, res) => {
  try {
    const data = await doctorSchema.find().sort({ sort_order_no: 1 });
    return res.status(200).send({
      isSuccess: true,
      message: "Data listing successfully.",
      data,
    });
  } catch (error) {
    return res.status(500).send({ message: error.message, isSuccess: false });
  }
};

// Get team member by ID
export const getDataById = async (req, res) => {
  try {
    const { doctor_id } = req.body;
    const data = await doctorSchema.findById(doctor_id);
    return res.status(200).send({
      isSuccess: true,
      message: "Get data successfully.",
      data,
    });
  } catch (error) {
    return res.status(500).send({ message: error.message, isSuccess: false });
  }
};

// Pagination
export const getPaginationData = async (req, res) => {
  try {
    let { page = 1, limit = 10 } = req.body;
    page = parseInt(page);
    limit = parseInt(limit);
    const skip = (page - 1) * limit;

    // Fetch doctors paginated
    const doctors = await doctorSchema
      .find()
      .sort({ sort_order_no: 1 })
      .skip(skip)
      .limit(limit);

    const totalRecords = await doctorSchema.countDocuments();

    // For each doctor, count related doctor details
    const data = await Promise.all(
      doctors.map(async (doctor) => {
        const doctorDetailsCount = await doctorDetailsSchema.countDocuments({ doctor_id: doctor._id });
        return { ...doctor._doc, doctorDetailsCount };
      })
    );

    return res.status(200).send({
      isSuccess: true,
      currentPageNo: page,
      totalPages: Math.ceil(totalRecords / limit),
      totalRecords,
      message: "Data listing successfully.",
      data,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).send({ message: error.message, isSuccess: false });
  }
};



// Get last sort order number
export const getLastSrNo = async (req, res) => {
  try {
    const lastItem = await doctorSchema.findOne().sort({ sort_order_no: -1 });
    return res.status(200).send({ isSuccess: true, data: lastItem });
  } catch (error) {
    return res.status(500).send({ message: error.message, isSuccess: false });
  }
};

export const updateTeamIsActive = async (req, res) => {
  try {
    const doctor_id = req.params.id;
    const team = await doctorSchema.findById(doctor_id);
    if (!team) {
      return res.status(404).send({ message: "disorder section not found", isSuccess: false });
    }
    team.isActive = !team.isActive;
    await team.save();
    return res.status(200).send({
      isSuccess: true,
      message: "Status updated successfully.",
      isActive: team.isActive,
    });
  } catch (error) {
    return res.status(500).send({ message: error.message, isSuccess: false });
  }
};