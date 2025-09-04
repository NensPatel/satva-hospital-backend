import mongoose from "mongoose";
import specialitySchema from "../../models/admin/spciality.model.js";
import { deleteImage } from "../../helpers/common.js";
import disorderSchema from "../../models/admin/disorder.model.js";
import disorderSectionSchema from "../../models/admin/disorderSection.model.js";
import slugify from "slugify";

// Create Speciality
export const createSpeciality = async (req, res) => {
  try {
    const { sort_order_no, title, short_desc, full_desc, isActive } = req.body;
    let { slug } = req.body;
    slug = slugify(slug || title, { lower: true, strict: true });

    const existingSlug = await specialitySchema.findOne({ slug });
    if (existingSlug) {
      return res.status(400).json({
        message: "Slug already exists. Please use a unique slug.",
        isSuccess: false,
      });
    }

    const imageFile = req.files?.find(
      (file) => file.fieldname === "speciality_img"
    );
    if (!imageFile) {
      return res.status(400).json({
        message: "Speciality image is required.",
        isSuccess: false,
      });
    }

    const speciality_img = "speciality/" + imageFile.filename;

    // Create speciality first (disorders empty initially)
    const newSpeciality = new specialitySchema({
      sort_order_no,
      title,
      slug,
      short_desc,
      full_desc,
      disorders: [],
      isActive,
      speciality_img,
    });
    await newSpeciality.save();

    // Now find disorders that belong to this speciality
    const linkedDisorders = await disorderSchema.find({
      speciality_id: newSpeciality._id,
    });

    // Update the speciality with disorder IDs
    newSpeciality.disorders = linkedDisorders.map((d) => d._id);
    await newSpeciality.save();

    // Optionally populate to send full data
    const populated = await specialitySchema
      .findById(newSpeciality._id)
      .populate("disorders");

    return res.status(200).json({
      message: "Speciality created successfully.",
      isSuccess: true,
      data: populated,
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
    let { slug } = req.body;

    const findData = await specialitySchema.findById(speciality_id);
    if (!findData) {
      return res
        .status(404)
        .send({ message: "Data not found!", isSuccess: false });
    }

    slug = slugify(slug || title, { lower: true, strict: true });

    if (slug !== findData.slug) {
      const existingSlug = await specialitySchema.findOne({ slug });
      if (existingSlug) {
        return res.status(400).json({
          message: "Slug already exists. Please use a unique slug.",
          isSuccess: false,
        });
      }
    }

    let imageFile;
    if (Array.isArray(req.files)) {
      imageFile = req.files.find((file) => file.fieldname === "speciality_img");
    } else if (req.files?.speciality_img) {
      imageFile = req.files.speciality_img[0];
    }

    if (imageFile && findData.speciality_img) {
      await deleteImage(findData.speciality_img);
    }

    const updateObj = {
      sort_order_no,
      title,
      slug,
      short_desc,
      full_desc,
      isActive,
    };
    if (imageFile) {
      updateObj.speciality_img = "speciality/" + imageFile.filename;
    }

    // Update speciality data first
    const updatedSpeciality = await specialitySchema.findByIdAndUpdate(
      speciality_id,
      updateObj,
      { new: true }
    );

    // Now auto‑link disorders again
    const linkedDisorders = await disorderSchema.find({
      speciality_id: speciality_id,
    });
    updatedSpeciality.disorders = linkedDisorders.map((d) => d._id);
    await updatedSpeciality.save();

    // Optionally populate
    const populated = await specialitySchema
      .findById(speciality_id)
      .populate("disorders");

    return res.status(200).send({
      isSuccess: true,
      message: "Data updated successfully.",
      data: populated,
    });
  } catch (error) {
    return res.status(500).send({ message: error.message, isSuccess: false });
  }
};

// Delete Speciality
export const deleteSpeciality = async (req, res) => {
  try {
    const { speciality_id } = req.query;

    // 1. Check if speciality exists
    const speciality = await specialitySchema.findById(speciality_id);
    if (!speciality) {
      return res.status(404).send({
        isSuccess: false,
        message: "Speciality not found",
      });
    }

    const disorders = await disorderSchema.find({ speciality_id });
    const disorderIds = disorders.map((d) => d._id);

    const sectionResult = await disorderSectionSchema.deleteMany({
      disorder_id: { $in: disorderIds },
    });

    const disorderResult = await disorderSchema.deleteMany({ speciality_id });

    await specialitySchema.findByIdAndDelete(speciality_id);

    return res.status(200).send({
      isSuccess: true,
      message: "Speciality, its disorders, and disorder sections deleted successfully",
    });
  } catch (error) {
    console.error("Error in deleteSpeciality:", error);
    return res.status(500).send({
      isSuccess: false,
      message: error.message,
    });
  }
};

// Get all Specialities
export const getAllSpeciality = async (req, res) => {
  try {
    const getData = await specialitySchema
      .find({ isActive: true })
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
      .findOne({ _id: speciality_id, isActive: true })
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

// Get speciality data by slug (with list of disorders)
export const getDataBySlug = async (req, res) => {
  try {
    const { slug } = req.params;
    if (!slug) {
      return res.status(400).json({
        isSuccess: false,
        message: "Slug is required.",
      });
    }

    const speciality = await specialitySchema
      .findOne({ slug })
      .populate("disorders")
      .lean();

    if (!speciality) {
      return res.status(404).json({
        isSuccess: false,
        message: "Speciality not found.",
      });
    }

    return res.status(200).json({
      isSuccess: true,
      message: "Data fetched successfully.",
      data: speciality,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      isSuccess: false,
      message: error.message,
    });
  }
};
