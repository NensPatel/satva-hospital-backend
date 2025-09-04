import gallaryISchema from "../../models/admin/gallaryImage.model.js";
import gallaryTSchema from "../../models/admin/gallaryTitle.model.js";
import gallaryCategorySchema from "../../models/admin/gallaryCategory.model.js";
import { deleteImage } from "../../helpers/common.js";
import mongoose from "mongoose";

export const createGalleryImage = async (req, res) => {
  try {
    const { sort_order_no, img_title,galleryCategoryId, isActive } = req.body;

    const titleExists = await gallaryCategorySchema.findById(galleryCategoryId);
    if (!titleExists) {
      return res.status(400).send({
        isSuccess: false,
        message: "Invalid galleryCategoryId. Gallery category does not exist.",
      });
    }

    const imageFile = req.files?.find(
      (file) => file.fieldname === "gallary_image"
    );
    const gallary_image = imageFile ? "gallery/" + imageFile.filename : "";

    const createObj = {
      sort_order_no,
      galleryCategoryId,
      img_title,
      isActive,
    };

    if (gallary_image) {
      createObj.gallary_image = gallary_image;
    }

    const saveData = new gallaryISchema(createObj);
    await saveData.save();

    await gallaryCategorySchema.findByIdAndUpdate(galleryCategoryId, {
      $push: { galleryImages: saveData._id },
    });

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
    const {
      gallary_image_id,
      sort_order_no,
      galleryCategoryId,
      img_title,
      isActive,
    } = req.body;

    const findData = await gallaryISchema.findById(gallary_image_id);
    if (!findData) {
      return res
        .status(404)
        .send({ message: "Data not found!", isSuccess: false });
    }

    const titleExists = await gallaryCategorySchema.findById(galleryCategoryId);
    if (!titleExists) {
      return res.status(400).send({
        isSuccess: false,
        message: "Invalid galleryCategoryId. Gallery title does not exist.",
      });
    }

    const imageFile = req.files?.find(
      (file) => file.fieldname === "gallary_image"
    );
    const gallary_image = imageFile ? "gallery/" + imageFile.filename : "";

    const updateObj = {
      sort_order_no,
      galleryCategoryId,
      img_title,
      isActive,
    };

    if (imageFile && findData.gallary_image) {
      await deleteImage(findData.gallary_image);
    }
    if (imageFile) {
      updateObj.gallary_image = "gallery/" + imageFile.filename;
    }

      if (galleryCategoryId) {
      updateObj.galleryCategoryId = galleryCategoryId;
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
    const gallary_image_id = req.query.gallary_image_id;
    const findData = await gallaryISchema.findById(gallary_image_id);
    if (!findData) {
      return res
        .status(404)
        .send({ message: "Data not found!", isSuccess: false });
    }

    await gallaryCategorySchema.findByIdAndUpdate(findData.galleryCategoryId, {
      $pull: { galleryImages: gallary_image_id },
    });

    if (findData.gallary_image) {
      await deleteImage(findData.gallary_image);
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
    const data = await gallaryISchema
      .find({ isActive: true })
      .populate("galleryCategoryId", "name")
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
    const { gallary_image_id } = req.body;
    const data = await gallaryISchema
      .findOne({ _id: gallary_image_id, isActive: true })
      .populate("galleryCategoryId", "name");
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
    let { page = 1, limit = 10, galleryCategoryId } = req.body;
    page = parseInt(page);
    limit = parseInt(limit);
    const skip = (page - 1) * limit;

    const filter = galleryCategoryId ? { galleryCategoryId } : {};

    const data = await gallaryISchema
      .find(filter)
      .sort({ sort_order_no: 1 })
      .skip(skip)
      .limit(limit)
      .populate("galleryCategoryId", "name");

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

export const updateGallaryImageIsActive = async (req, res) => {
  try {
    const gallary_image_id = req.params.id;
    const gallaryImage = await gallaryISchema.findById(gallary_image_id);
    if (!gallaryImage) {
      return res
        .status(404)
        .send({ message: "image section not found", isSuccess: false });
    }
    gallaryImage.isActive = !gallaryImage.isActive;
    await gallaryImage.save();
    return res.status(200).send({
      isSuccess: true,
      message: "Status updated successfully.",
      isActive: gallaryImage.isActive,
    });
  } catch (error) {
    return res.status(500).send({ message: error.message, isSuccess: false });
  }
};

export const updateGallaryImagePosition = async (req, res) => {
  try {
    const { id, direction } = req.body;
    const currentItem = await gallaryISchema.findById(id);
    if (!currentItem) {
      return res
        .status(404)
        .send({ message: "Gallery Image Details not found", isSuccess: false });
    }

    let swapItem;
    if (direction === "up") {
      swapItem = await gallaryISchema
        .findOne({
          sort_order_no: { $lt: currentItem.sort_order_no },
          galleryCategoryId: currentItem.galleryCategoryId || null,
        })
        .sort({ sort_order_no: -1 });
    } else if (direction === "down") {
      swapItem = await gallaryISchema
        .findOne({
          sort_order_no: { $gt: currentItem.sort_order_no },
          galleryCategoryId: currentItem.galleryCategoryId || null,
        })
        .sort({ sort_order_no: 1 });
    } else {
      return res
        .status(400)
        .send({ message: "Invalid direction", isSuccess: false });
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

export const getImageByGalleryCategory = async (req, res) => {
  try {
    const { galleryCategoryId } = req.params;
    let { page = 1, limit = 10 } = req.query;

    if (!galleryCategoryId || !mongoose.Types.ObjectId.isValid(galleryCategoryId)) {
      return res
        .status(400)
        .json({ isSuccess: false, message: "Valid galleryCategoryId is required" });
    }

    page = parseInt(page);
    limit = parseInt(limit);
    const skip = (page - 1) * limit;

    const sections = await gallaryISchema
      .find({ galleryCategoryId: new mongoose.Types.ObjectId(galleryCategoryId) })
      .sort({ sort_order_no: 1 })
      .skip(skip)
      .limit(limit);

    const totalCount = await gallaryISchema.countDocuments({
      galleryCategoryId: new mongoose.Types.ObjectId(galleryCategoryId),
    });
    const totalPages = Math.ceil(totalCount / limit);

    return res.status(200).json({
      isSuccess: true,
      message: "Details fetched successfully",
      data: sections,
      totalPages,
      totalCount,
    });
  } catch (error) {
    console.error("Error fetching sections:", error);
    return res.status(500).json({ isSuccess: false, message: "Server error" });
  }
};

export const getLastSrNoByGalleryCategory = async (req, res) => {
  try {
    const { galleryCategoryId } = req.params;

    if (!galleryCategoryId) {
      return res.status(400).json({
        isSuccess: false,
        message: "galleryCategoryId is required",
      });
    }

    const objectId = new mongoose.Types.ObjectId(galleryCategoryId);

    const lastDetail = await gallaryISchema
      .findOne({ galleryCategoryId: objectId })
      .sort({ sort_order_no: -1 });

    const lastNo = lastDetail ? lastDetail.sort_order_no : 0;

    res.status(200).json({
      isSuccess: true,
      message: "Last sort order number fetched successfully",
      data: { sort_order_no: lastNo },
    });
  } catch (error) {
    console.error("Error in getLastSrNoByGallaryTitle:", error);
    res.status(500).json({
      isSuccess: false,
      message: "Something went wrong while fetching last sort order number",
    });
  }
};
