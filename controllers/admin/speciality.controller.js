import mongoose from "mongoose";
import specialitySchema from "../../models/admin/spciality.model.js";
import { deleteImage } from "../../helpers/common.js";
import disorderSchema from "../../models/admin/disorder.model.js";

// Create Speciality
export const createSpeciality = async (req, res) => {
  try {
    const { sort_order_no, title, short_desc, full_desc, isActive } = req.body;
    let { disorders } = req.body;

    // Parse disorders
    if (typeof disorders === "string") {
      try {
        disorders = JSON.parse(disorders);
      } catch {
        disorders = disorders.split(",").map((d) => d.trim());
      }
    }
    if (!Array.isArray(disorders)) disorders = [];
    disorders = disorders.filter((d) => mongoose.Types.ObjectId.isValid(d));

    const validDisorders = await disorderSchema.find({
      _id: { $in: disorders },
    });
    const validDisorderIds = validDisorders.map((d) => d._id);

    // Only one image now
    const imageFile = req.files?.find(
      (file) => file.fieldname === "speciality_img"
    );
    const speciality_img = imageFile
      ? "public/speciality/" + imageFile.filename
      : "";

    if (!imageFile) {
      return res.status(400).json({
        message: "Speciality image is required.",
        isSuccess: false,
      });
    }
    const newSpeciality = new specialitySchema({
      sort_order_no,
      title,
      short_desc,
      full_desc,
      disorders: validDisorderIds,
      isActive,
      speciality_img,
    });

    await newSpeciality.save();

    return res.status(200).json({
      message: "Speciality created successfully.",
      isSuccess: true,
      data: newSpeciality,
    });
  } catch (error) {
    return res.status(500).json({ message: error.message, isSuccess: false });
  }
};

// Update Speciality
export const updateSpeciality = async (req, res) => {
  try {
    const {
      speciality_id,
      sort_order_no,
      title,
      short_desc,
      full_desc,
      isActive,
    } = req.body;
    let { disorders } = req.body;

    const findData = await specialitySchema.findById(speciality_id);
    if (!findData) {
      return res
        .status(404)
        .send({ message: "Data not found!", isSuccess: false });
    }

    if (typeof disorders === "string") {
      try {
        disorders = JSON.parse(disorders);
      } catch {
        disorders = disorders.split(",").map((d) => d.trim());
      }
    }
    if (!Array.isArray(disorders)) disorders = [];
    disorders = disorders.filter((d) => mongoose.Types.ObjectId.isValid(d));

    const validDisorders = await disorderSchema.find({
      _id: { $in: disorders },
    });
    const validDisorderIds = validDisorders.map((d) => d._id);

    let imageFile;
    if (Array.isArray(req.files)) {
      imageFile = req.files.find((file) => file.fieldname === "speciality_img");
    } else if (req.files?.speciality_img) {
      imageFile = req.files.speciality_img[0];
    }

    const updateObj = {
      sort_order_no,
      title,
      short_desc,
      full_desc,
      disorders: validDisorderIds,
      isActive,
    };

    if (imageFile) {
      if (findData.speciality_img) await deleteImage(findData.speciality_img);
      updateObj.speciality_img = "public/speciality/" + imageFile.filename;
    }

    const updated = await specialitySchema.findByIdAndUpdate(
      speciality_id,
      updateObj,
      { new: true }
    );

    return res.status(200).send({
      isSuccess: true,
      message: "Data updated successfully.",
      data: updated,
    });
  } catch (error) {
    return res.status(500).send({ message: error.message, isSuccess: false });
  }
};

// Delete Speciality
export const deleteSpeciality = async (req, res) => {
  try {
    const speciality_id = req.query.speciality_id;
    const findData = await specialitySchema.findById(speciality_id);
    if (!findData) {
      return res
        .status(404)
        .send({ message: "Data not found!", isSuccess: false });
    }

    if (findData.speciality_img) await deleteImage(findData.speciality_img);

    await specialitySchema.findByIdAndDelete(speciality_id);

    return res
      .status(200)
      .send({ isSuccess: true, message: "Data deleted successfully." });
  } catch (error) {
    return res.status(500).send({ message: error.message, isSuccess: false });
  }
};

// Get all Specialities
export const getAllSpeciality = async (req, res) => {
  try {
    const getData = await specialitySchema
      .find()
      .populate("disorders")
      .sort({ sort_order_no: 1 });
    return res.status(200).send({
      isSuccess: true,
      message: "Data listing successfully.",
      data: getData,
    });
  } catch (error) {
    return res.status(500).send({ message: error.message, isSuccess: false });
  }
};

// Get by ID
export const getDataById = async (req, res) => {
  try {
    const { speciality_id } = req.body;
    const getData = await specialitySchema
      .findById(speciality_id)
      .populate("disorders");
    return res.status(200).send({
      isSuccess: true,
      message: "Get data successfully.",
      data: getData,
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

    // Get specialities
    const specialities = await specialitySchema
      .find()
      .sort({ sort_order_no: 1 })
      .skip(skip)
      .limit(limit);

    const totalRecords = await specialitySchema.countDocuments();

    // For each speciality, count its disorders
    const data = await Promise.all(
      specialities.map(async (speciality) => {
        const disorderCount = await disorderSchema.countDocuments({
          speciality_id: speciality._id,
        });
        return { ...speciality._doc, disorderCount };
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
    return res.status(500).send({ message: error.message, isSuccess: false });
  }
};

// Get last sort number
export const getLastSrNo = async (req, res) => {
  try {
    const lastSortOrderItem = await specialitySchema
      .findOne()
      .sort({ sort_order_no: -1 });
    return res.status(200).send({
      isSuccess: true,
      data: lastSortOrderItem,
    });
  } catch (error) {
    return res.status(500).send({
      message: error.message,
      isSuccess: false,
    });
  }
};

export const updateSpecilityIsActive = async (req, res) => {
  try {
    const speciality_id = req.params.id;
    const speciality = await specialitySchema.findById(speciality_id);
    if (!speciality) {
      return res
        .status(404)
        .send({ message: "speciality not found", isSuccess: false });
    }
    speciality.isActive = !speciality.isActive;
    await speciality.save();
    return res.status(200).send({
      isSuccess: true,
      message: "Status updated successfully.",
      isActive: speciality.isActive,
    });
  } catch (error) {
    return res.status(500).send({ message: error.message, isSuccess: false });
  }
};
