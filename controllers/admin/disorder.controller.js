import mongoose from "mongoose";
import disordersSchema from "../../models/admin/disorder.model.js";
import specialitiesSchema from "../../models/admin/spciality.model.js";
import disorderSectionSchema from "../../models/admin/disorderSection.model.js";
import slugify from "slugify";

export const createDisorder = async (req, res) => {
  try {
    const { sort_order_no, name, slug, speciality_id, isActive } = req.body;
    let { disordersDetails } = req.body;

    if (!mongoose.Types.ObjectId.isValid(speciality_id)) {
      return res.status(400).send({ message: "Invalid speciality_id format.", isSuccess: false });
    }

    const specialityExists = await specialitiesSchema.findById(speciality_id);
    if (!specialityExists) {
      return res.status(400).send({ message: "Speciality not found.", isSuccess: false });
    }

    const cleanedSlug = slugify(slug || name, { lower: true, strict: true });
    const existingSlug = await disordersSchema.findOne({ slug: cleanedSlug });
    if (existingSlug) {
      return res.status(400).send({ message: "Slug already exists.", isSuccess: false });
    }

    // Parse disordersDetails to array of valid ObjectIds
    if (typeof disordersDetails === "string") {
      try {
        disordersDetails = JSON.parse(disordersDetails);
      } catch {
        disordersDetails = disordersDetails.split(",").map(d => d.trim());
      }
    }
    if (!Array.isArray(disordersDetails)) disordersDetails = [];
    disordersDetails = disordersDetails.filter(d => mongoose.Types.ObjectId.isValid(d));

    // Only keep IDs that actually exist
    const validDisorders = await disorderSectionSchema.find({ _id: { $in: disordersDetails } });
    const validDisorderIds = validDisorders.map(d => d._id);

    const newDisorder = new disordersSchema({
      sort_order_no,
      name,
      slug: cleanedSlug,
      speciality_id,
      isActive: typeof isActive === "boolean" ? isActive : true,
      disordersDetails: validDisorderIds,
    });

    const saved = await newDisorder.save();

    return res.status(200).send({ isSuccess: true, message: "Disorder created successfully.", data: saved });
  } catch (error) {
    return res.status(500).send({ message: error.message, isSuccess: false });
  }
};



export const updateDisorder = async (req, res) => {
  try {
    const { disorder_id, sort_order_no, name, slug, speciality_id, isActive } = req.body;
    let { disordersDetails } = req.body;

    if (!mongoose.Types.ObjectId.isValid(disorder_id)) {
      return res.status(400).send({ message: "Invalid disorder_id format.", isSuccess: false });
    }

    const existing = await disordersSchema.findById(disorder_id);
    if (!existing) {
      return res.status(404).send({ message: "Disorder not found.", isSuccess: false });
    }

    if (speciality_id && !mongoose.Types.ObjectId.isValid(speciality_id)) {
      return res.status(400).send({ message: "Invalid speciality_id format.", isSuccess: false });
    }

    const cleanedSlug = slugify(slug || name, { lower: true, strict: true });
    const duplicate = await disordersSchema.findOne({ slug: cleanedSlug, _id: { $ne: disorder_id } });
    if (duplicate) {
      return res.status(400).send({ message: "Slug already in use.", isSuccess: false });
    }

    // Parse disordersDetails
    if (typeof disordersDetails === "string") {
      try {
        disordersDetails = JSON.parse(disordersDetails);
      } catch {
        disordersDetails = disordersDetails.split(",").map(d => d.trim());
      }
    }
    if (!Array.isArray(disordersDetails)) disordersDetails = [];
    disordersDetails = disordersDetails.filter(d => mongoose.Types.ObjectId.isValid(d));

    const validDisorders = await disorderSectionSchema.find({ _id: { $in: disordersDetails } });
    const validDisorderIds = validDisorders.map(d => d._id);

    const updateObj = {
      sort_order_no,
      name,
      slug: cleanedSlug,
      isActive,
      disordersDetails: validDisorderIds,
    };
    if (speciality_id) updateObj.speciality_id = speciality_id;

    const updated = await disordersSchema.findByIdAndUpdate(disorder_id, updateObj, { new: true });

    return res.status(200).send({ isSuccess: true, message: "Disorder updated successfully.", data: updated });
  } catch (error) {
    return res.status(500).send({ message: error.message, isSuccess: false });
  }
};


export const deleteDisorder = async (req, res) => {
  try {
     const disorder_id = req.query.disorder_id;
    if (!mongoose.Types.ObjectId.isValid(disorder_id)) {
      return res.status(400).send({
        message: "Invalid disorder_id format.",
        isSuccess: false,
      });
    }

    const deleted = await disordersSchema.findByIdAndDelete(disorder_id);
    if (!deleted) {
      return res
        .status(404)
        .send({ message: "Data not found!", isSuccess: false });
    }

    return res.status(200).send({
      isSuccess: true,
      message: "Data deleted successfully.",
    });
  } catch (error) {
    return res.status(500).send({ message: error.message, isSuccess: false });
  }
};

export const getAllDisorders = async (req, res) => {
  try {
    const data = await disordersSchema
      .find()
      .populate("speciality_id", "title")
      .sort({ sort_order_no: 1 });
    return res.status(200).send({
      isSuccess: true,
      message: "Data listing successfully.",
      data,
    });
  } catch (error) {
    return res.status(500).send({ message: error.message, isSuccess: false });
  }
};

export const getDataById = async (req, res) => {
  try {
    const { disorder_id } = req.body;
    if (!mongoose.Types.ObjectId.isValid(disorder_id)) {
      return res.status(400).send({
        message: "Invalid disorder_id format.",
        isSuccess: false,
      });
    }

    const data = await disordersSchema
      .findById(disorder_id)
      .populate("speciality_id", "title");
    return res.status(200).send({
      isSuccess: true,
      message: "Get data successfully.",
      data,
    });
  } catch (error) {
    return res.status(500).send({ message: error.message, isSuccess: false });
  }
};

export const getPaginationData = async (req, res) => {
  try {
    let { page = 1, limit = 10 } = req.body;
    page = parseInt(page);
    limit = parseInt(limit);
    const skip = (page - 1) * limit;

    const [data, totalRecords] = await Promise.all([
      disordersSchema
        .find()
        .sort({ sort_order_no: 1 })
        .skip(skip)
        .limit(limit)
        .populate("speciality_id", "title"),
      disordersSchema.countDocuments(),
    ]);

    return res.status(200).send({
      isSuccess: true,
      currentPageNo: page,
      totalPages: Math.ceil(totalRecords / limit),
      totalRecords,
      message: "Data listing successfully.",
      data,
    });
  } catch (error) {
    return res.status(500).send({ message: error.message, isSuccess: false });
  }
};

export const getLastSrNo = async (req, res) => {
  try {
    const lastItem = await disordersSchema
      .findOne()
      .sort({ sort_order_no: -1 });
    return res.status(200).send({ isSuccess: true, data: lastItem });
  } catch (error) {
    return res.status(500).send({ message: error.message, isSuccess: false });
  }
};

export const getDataBySlug = async (req, res) => {
  try {
    const { slug } = req.body;
    const data = await disordersSchema.findOne({ slug });
    return res.status(200).send({
      isSuccess: true,
      message: "Get data successfully.",
      data,
    });
  } catch (error) {
    return res.status(500).send({ message: error.message, isSuccess: false });
  }
};

export const listDisordersBySpeciality = async (req, res) => {
  try {
    const { speciality_id } = req.params;
    let { page = 1, limit = 10 } = req.query;

    page = parseInt(page);
    limit = parseInt(limit);

    if (isNaN(page) || page < 1) page = 1;
    if (isNaN(limit) || limit < 1) limit = 10;

    const skip = (page - 1) * limit;

    // Find disorders by speciality
   const disorders = await disordersSchema
  .find({ speciality_id: new mongoose.Types.ObjectId(speciality_id) })
  .populate()  // populate the details
  .sort({ sort_order_no: 1 })
  .skip(skip)
  .limit(limit);

    const totalRecords = await disordersSchema.countDocuments({ speciality_id: new mongoose.Types.ObjectId(speciality_id) });

    // Add disorderDetailsCount for each disorder
    const data = await Promise.all(
      disorders.map(async (disorder) => {
        const disorderDetailsCount = await disorderSectionSchema.countDocuments({ disorder_id: disorder._id });
        return { ...disorder._doc, disorderDetailsCount };
      })
    );
    

    res.status(200).send({
      isSuccess: true,
      data,
      currentPage: page,
      totalPages: Math.ceil(totalRecords / limit),
      totalRecords,
      message: "Data fetched successfully."
    });
  } catch (error) {
    res.status(500).send({ message: error.message, isSuccess: false });
  }
};

export const updateDisorderIsActive = async (req, res) => {
  try {
    const disorder_id = req.params.id;
    const disorder = await disordersSchema.findById(disorder_id);
    if (!disorder) {
      return res.status(404).send({ message: "disorder not found", isSuccess: false });
    }
    disorder.isActive = !disorder.isActive;
    await disorder.save();
    return res.status(200).send({
      isSuccess: true,
      message: "Status updated successfully.",
      isActive: disorder.isActive,
    });
  } catch (error) {
    return res.status(500).send({ message: error.message, isSuccess: false });
  }
};

export const updateDisorderPosition = async (req, res) => {
  try {
    const { id, direction } = req.body;
    const currentItem = await disordersSchema.findById(id);
    if (!currentItem) {
      return res.status(404).send({ message: "Disorder not found", isSuccess: false });
    }

    let swapItem;
    if (direction === "up") {
      swapItem = await disordersSchema.findOne({
        sort_order_no: { $lt: currentItem.sort_order_no },
        speciality_id: currentItem.speciality_id || null,
      }).sort({ sort_order_no: -1 });
    } else if (direction === "down") {
      swapItem = await disordersSchema.findOne({
        sort_order_no: { $gt: currentItem.sort_order_no },
        speciality_id: currentItem.speciality_id || null,
      }).sort({ sort_order_no: 1 });
    } else {
      return res.status(400).send({ message: "Invalid direction", isSuccess: false });
    }

    if (!swapItem) {
      return res.status(200).send({
        isSuccess: false,
        message: "Cannot move further",
      });
    }

    const temp = currentItem.sort_order_no;
    currentItem.sort_order_no = swapItem.sort_order_no;
    swapItem.sort_order_no = temp;

    await currentItem.save();
    await swapItem.save();

    return res.status(200).send({
      isSuccess: true,
      message: "Position updated successfully.",
    });
  } catch (error) {
    return res.status(500).send({ message: error.message, isSuccess: false });
  }
};
