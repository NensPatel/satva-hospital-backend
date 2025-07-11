import mongoose from "mongoose";
import specialitySchema from "../../models/admin/spciality.model.js";
import { deleteImage } from "../../helpers/common.js";
import disorderSchema from "../../models/admin/disorder.model.js";

export const createSpeciality = async (req, res) => {
  try {
    const { sort_order_no, title, short_desc, full_desc, isActive } = req.body;
    let { disorders } = req.body;

    // Parse disorders input
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

    const imageFile = req.files?.image?.[0];
    const bannerFile = req.files?.banner?.[0];

    if (!imageFile || !bannerFile) {
      return res.status(400).json({
        message: "Both image and banner are required.",
        isSuccess: false,
      });
    }

    const imagePath = "public/speciality/image/" + imageFile.filename;
    const bannerPath = "public/speciality/banner/" + bannerFile.filename;

    const newSpeciality = new specialitySchema({
      sort_order_no,
      title,
      short_desc,
      full_desc,
      disorders: validDisorderIds,
      isActive,
      image: imagePath,
      banner: bannerPath,
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

    const imageFile = req.files?.image?.[0];
    const bannerFile = req.files?.banner?.[0];

    const updateObj = {
      sort_order_no,
      title,
      short_desc,
      full_desc,
      disorders: validDisorderIds,
      isActive,
    };

    if (imageFile) {
      if (findData.image) await deleteImage(findData.image);
      updateObj.image = "public/speciality/image/" + imageFile.filename;
    }

    if (bannerFile) {
      if (findData.banner) await deleteImage(findData.banner);
      updateObj.banner = "public/speciality/banner/" + bannerFile.filename;
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

export const deleteSpeciality = async (req, res) => {
  try {
    const { speciality_id } = req.body;
    const findData = await specialitySchema.findById(speciality_id);
    if (!findData) {
      return res
        .status(404)
        .send({ message: "Data not found!", isSuccess: false });
    }

    if (findData.image) await deleteImage(findData.image);
    if (findData.banner) await deleteImage(findData.banner);

    await specialitySchema.findByIdAndDelete(speciality_id);

    return res
      .status(200)
      .send({ isSuccess: true, message: "Data deleted successfully." });
  } catch (error) {
    return res.status(500).send({ message: error.message, isSuccess: false });
  }
};

export const getAllSpeciality = async (req, res) => {
  try {
    const getData = await specialitySchema
      .find()
      .populate("disorders")
      .sort({ sort_order_no: 1 });
    return res
      .status(200)
      .send({
        isSuccess: true,
        message: "Data listing successfully.",
        data: getData,
      });
  } catch (error) {
    return res.status(500).send({ message: error.message, isSuccess: false });
  }
};

export const getDataById = async (req, res) => {
  try {
    const { speciality_id } = req.body;
    const getData = await specialitySchema
      .findById(speciality_id)
      .populate("disorders");
    return res
      .status(200)
      .send({
        isSuccess: true,
        message: "Get data successfully.",
        data: getData,
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

    const getData = await specialitySchema
      .find()
      .populate("disorders")
      .sort({ sort_order_no: 1 })
      .skip(skip)
      .limit(limit);
    const totalRecords = await specialitySchema.countDocuments();

    return res.status(200).send({
      isSuccess: true,
      currentPageNo: page,
      totalPages: Math.ceil(totalRecords / limit),
      totalRecords,
      message: "Data listing successfully.",
      data: getData,
    });
  } catch (error) {
    return res.status(500).send({ message: error.message, isSuccess: false });
  }
};

export const getLastSrNo = async (req, res) => {
  try {
    const lastSortOrderItem = await specialitySchema
      .findOne()
      .sort({ sort_order_no: -1 });
    return res.status(200)
    .send({ 
      isSuccess: true, 
      data: lastSortOrderItem 
    });
  } catch (error) {
    return res.status(500)
    .send({ 
      message: error.message, 
      isSuccess: false 
    });
  }
};
