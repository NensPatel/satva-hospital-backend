import tieUpTSchema from "../../models/admin/tieUpTitle.model.js";
import tieUpISchema from "../../models/admin/tieUpImage.model.js";
import { deleteImage } from "../../helpers/common.js";
import mongoose from "mongoose";

export const createTieUpImage = async (req, res) => {
  try {
    const { sort_order_no, tieUpTitle_id,img_title,createdAt, isActive } = req.body;

    const titleExists = await tieUpTSchema.findById(tieUpTitle_id);
    if (!titleExists) {
      return res.status(400).send({
        isSuccess: false,
        message: "Invalid tieUpTitle_id. Tie Up title does not exist.",
      });
    }

    const imageFile = req.files?.find((file) => file.fieldname === "tieUp_image");
    const tieUp_image = imageFile ? "tieUp/" + imageFile.filename : "";

    const createObj = {
      sort_order_no,
      tieUpTitle_id,
      img_title,
      createdAt,
      isActive
    };

    if (tieUp_image) {
      createObj.tieUp_image = tieUp_image;
    }

    const saveData = new tieUpISchema(createObj);
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

export const updateTieUpImage = async (req, res) => {
  try {
    const { tieUp_image_id, sort_order_no, tieUpTitle_id,img_title,createdAt, isActive } = req.body;

    const findData = await tieUpISchema.findById(tieUp_image_id);
    if (!findData) {
      return res.status(404).send({ message: "Data not found!", isSuccess: false });
    }

    const titleExists = await tieUpTSchema.findById(tieUpTitle_id);
    if (!titleExists) {
      return res.status(400).send({
        isSuccess: false,
        message: "Invalid tieUpTitle_id. Tie Up title does not exist.",
      });
    }

    const imageFile = req.files?.find((file) => file.fieldname === "tieUp_image");
    const tieUp_image = imageFile ? "tieUp/" + imageFile.filename : "";

    const updateObj = {
      sort_order_no,
      tieUpTitle_id,
      img_title,
      createdAt,
      isActive,
    };

  if (imageFile && findData.tieUp_image) {
      await deleteImage(findData.tieUp_image);
    }
    if (imageFile) {
      updateObj.tieUp_image = "tieUp/" + imageFile.filename;
    }


    const updated = await tieUpISchema.findByIdAndUpdate(
      tieUp_image_id,
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

export const deleteTieUpImage = async (req, res) => {
  try {
      const tieUp_image_id = req.query.tieUp_image_id;
    const findData = await tieUpISchema.findById(tieUp_image_id);
    if (!findData) {
      return res.status(404).send({ message: "Data not found!", isSuccess: false });
    }

     if (findData.tieUp_image) {
      await deleteImage(findData.tieUp_image);
    }

    await tieUpISchema.findByIdAndDelete(tieUp_image_id);

    return res.status(200).send({
      isSuccess: true,
      message: "Data deleted successfully.",
    });
  } catch (error) {
    return res.status(500).send({ message: error.message, isSuccess: false });
  }
};

export const getAllTieUpImage = async (req, res) => {
  try {
    const data = await tieUpISchema.find().sort({ sort_order_no: 1 });
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
    const { tieUp_image_id } = req.body;
    const data = await tieUpISchema.findById(tieUp_image_id);
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
    let { page = 1, limit = 10, tieUpTitle_id } = req.body;
    page = parseInt(page);
    limit = parseInt(limit);
    const skip = (page - 1) * limit;

    const filter = tieUpTitle_id ? { tieUpTitle_id } : {};

    const data = await tieUpISchema
      .find(filter)
      .sort({ sort_order_no: 1 })
      .skip(skip)
      .limit(limit);

    const totalRecords = await tieUpISchema.countDocuments(filter);

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
    const lastSortOrderItem = await tieUpISchema
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

export const updateTieUpImageIsActive = async (req, res) => {
  try {
    const tieUp_image_id = req.params.id;
    const tieUpImage = await tieUpISchema.findById(tieUp_image_id);
    if (!tieUpImage) {
      return res.status(404).send({ message: "image section not found", isSuccess: false });
    }
    tieUpImage.isActive = !tieUpImage.isActive;
    await tieUpImage.save();
    return res.status(200).send({
      isSuccess: true,
      message: "Status updated successfully.",
      isActive: tieUpImage.isActive,
    });
  } catch (error) {
    return res.status(500).send({ message: error.message, isSuccess: false });
  }
};

export const updateTieUpImagePosition = async (req, res) => {
  try {
    const { id, direction } = req.body;
    const currentItem = await tieUpISchema.findById(id);
    if (!currentItem) {
      return res.status(404).send({ message: "Tie Up Image Details not found", isSuccess: false });
    }

    let swapItem;
    if (direction === "up") {
      swapItem = await tieUpISchema.findOne({
        sort_order_no: { $lt: currentItem.sort_order_no },
        tieUp_id: currentItem.tieUp_id || null,
      }).sort({ sort_order_no: -1 });
    } else if (direction === "down") {
      swapItem = await tieUpISchema.findOne({
        sort_order_no: { $gt: currentItem.sort_order_no },
        tieUp_id: currentItem.tieUp_id || null,
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


export const getImageByTieUpId = async (req, res) => {
  try {
    const { tieUp_id } = req.params;
    let { page = 1, limit = 10 } = req.query;

    if (!tieUp_id || !mongoose.Types.ObjectId.isValid(tieUp_id)) {
      return res.status(400).json({ isSuccess: false, message: "Valid tieUp_id is required" });
    }

    page = parseInt(page);
    limit = parseInt(limit);
    const skip = (page - 1) * limit;

    const sections = await tieUpISchema.find({ tieUpTitle_id: new mongoose.Types.ObjectId(tieUp_id) })
      .sort({ sort_order_no: 1 })
      .skip(skip)
      .limit(limit);

    const totalCount = await tieUpISchema.countDocuments({ tieUpTitle_id: new mongoose.Types.ObjectId(tieUp_id) });
    const totalPages = Math.ceil(totalCount / limit);

    return res.status(200).json({
      isSuccess: true,
      message: "Details fetched successfully",
      data: sections,
      totalPages,
      totalCount
    });
  } catch (error) {
    console.error("Error fetching sections:", error);
    return res.status(500).json({ isSuccess: false, message: "Server error" });
  }
};
