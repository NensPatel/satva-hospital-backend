import gallaryISchema from "../../models/admin/gallaryImage.model.js";
import galleryTSchema from "../../models/admin/gallaryTitle.model.js";
import { deleteImage } from "../../helpers/common.js";
import path from "path";

export const createGalleryImage = async (req, res) => {
  try {
    const { sort_order_no, galleryTitleId,img_title,createdAt, isActive } = req.body;

    const titleExists = await galleryTSchema.findById(galleryTitleId);
    if (!titleExists) {
      return res.status(400).send({
        isSuccess: false,
        message: "Invalid galleryTitleId. Gallery title does not exist.",
      });
    }

    const imageFile = req.files?.find((file) => file.fieldname === "gallary_image");
    const gallary_image = imageFile ? "gallery/" + imageFile.filename : "";

    const createObj = {
      sort_order_no,
      galleryTitleId,
      img_title,
      createdAt,
      isActive
    };

    if (gallary_image) {
      createObj.gallary_image = gallary_image;
    }

    const saveData = new gallaryISchema(createObj);
    await saveData.save();

    return res.status(200).send({
      isSuccess: true,
      message: "Data created successfully.",
      data: saveData,
    });
  } catch (error) {
    return res.status(500).send({ message: error.message, isSuccess: false });
  }
};

export const updateGalleryImage = async (req, res) => {
  try {
    const { gallary_image_id, sort_order_no, galleryTitleId,img_title,createdAt, isActive } = req.body;

    const findData = await gallaryISchema.findById(gallary_image_id);
    if (!findData) {
      return res.status(404).send({ message: "Data not found!", isSuccess: false });
    }

    const titleExists = await galleryTSchema.findById(galleryTitleId);
    if (!titleExists) {
      return res.status(400).send({
        isSuccess: false,
        message: "Invalid galleryTitleId. Gallery title does not exist.",
      });
    }

    const imageFile = req.files?.find((file) => file.fieldname === "gallary_image");
    const gallary_image = imageFile ? "gallery/" + imageFile.filename : "";

    const updateObj = {
      sort_order_no,
      galleryTitleId,
      img_title,
      createdAt,
      isActive,
    };

    if (gallary_image) {
      if (findData.gallary_image) {
        const oldPath = path.join("public", findData.gallary_image);
        await deleteImage(oldPath);
      }
      updateObj.gallary_image = gallary_image;
    }

    const updated = await gallaryISchema.findByIdAndUpdate(
      gallary_image_id,
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

export const deleteGalleryImage = async (req, res) => {
  try {
    const { gallary_image_id } = req.body;
    const findData = await gallaryISchema.findById(gallary_image_id);
    if (!findData) {
      return res.status(404).send({ message: "Data not found!", isSuccess: false });
    }

    if (findData.gallary_image) {
      const imagePath = path.join("public", findData.gallary_image);
      await deleteImage(imagePath);
    }

    await gallaryISchema.findByIdAndDelete(gallary_image_id);

    return res.status(200).send({
      isSuccess: true,
      message: "Data deleted successfully.",
    });
  } catch (error) {
    return res.status(500).send({ message: error.message, isSuccess: false });
  }
};

export const getAllGalleryImages = async (req, res) => {
  try {
    const data = await gallaryISchema.find().sort({ sort_order_no: 1 });
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
    const { gallary_image_id } = req.body;
    const data = await gallaryISchema.findById(gallary_image_id);
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
    let { page = 1, limit = 10, galleryTitleId } = req.body;
    page = parseInt(page);
    limit = parseInt(limit);
    const skip = (page - 1) * limit;

    const filter = galleryTitleId ? { galleryTitleId } : {};

    const data = await gallaryISchema
      .find(filter)
      .sort({ sort_order_no: 1 })
      .skip(skip)
      .limit(limit);

    const totalRecords = await gallaryISchema.countDocuments(filter);

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
    const lastSortOrderItem = await gallaryISchema
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

export const getImagesByGalleryTitleId = async (req, res) => {
  try {
    const { galleryTitleId } = req.body;
    const data = await gallaryISchema.find({ galleryTitleId }).sort({ sort_order_no: 1 });
    return res.status(200).send({
      isSuccess: true,
      message: "Data listing successfully.",
      data,
    });
  } catch (error) {
    return res.status(500).send({ message: error.message, isSuccess: false });
  }
};
