// controllers/counter.controller.js (ESM)

import path from "path";
import { fileURLToPath } from "url";
import countersSchema from "../../models/admin/counter.model.js";
import { deleteImage } from "../../helpers/common.js";

export const createCounters = async (req, res) => {
  try {
    const { sort_order_no, count, label, isActive } = req.body;
    const imageFile = req.files?.find((file) => file.fieldname === "icon");
    const icon = imageFile ? "public/counter/" + imageFile.filename : "";

    const createObj = {
      sort_order_no,
      count,
      label,
      isActive,
    };

    if (icon) {
      createObj.icon = icon;
    }

    const saveData = new countersSchema(createObj);
    await saveData.save();

    return res.status(200).send({
      isSuccess: true,
      message: "Data created successfully.",
      data: saveData,
    });
  } catch (error) {
    return res.status(500).send({
      message: error.message,
      isSuccess: false,
    });
  }
};

export const updateCounters = async (req, res) => {
  try {
    const { counter_id, sort_order_no, count, label, isActive } = req.body;
    const findData = await countersSchema.findById(counter_id);
    if (!findData) {
      return res
        .status(404)
        .send({ message: "Data not found!", isSuccess: false });
    }

    const imageFile = req.files?.find((file) => file.fieldname === "icon");
    const icon = imageFile ? "public/counter/" + imageFile.filename : "";

    const updateObj = {
      sort_order_no,
      count,
      label,
      isActive,
    };

    if (icon) {
      if (findData.icon) {
        let iconPath = findData.icon;
        if (!iconPath.startsWith("public/")) {
          iconPath = "public/" + iconPath;
        }
        await deleteImage(iconPath);
      }
      updateObj.icon = icon;
    }

    const updated = await countersSchema.findByIdAndUpdate(
      counter_id,
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

export const deleteCounters = async (req, res) => {
  try {
    const { counter_id } = req.body;
    const findData = await countersSchema.findById(counter_id);
    if (!findData) {
      return res
        .status(404)
        .send({ message: "Data not found!", isSuccess: false });
    }

    if (findData.icon) {
      await deleteImage(findData.icon);
    }

    await countersSchema.findByIdAndDelete(counter_id);

    return res.status(200).send({
      isSuccess: true,
      message: "Data deleted successfully.",
    });
  } catch (error) {
    return res.status(500).send({ message: error.message, isSuccess: false });
  }
};

export const getAllCounters = async (req, res) => {
  try {
    const getData = await countersSchema.find().sort({ sort_order_no: 1 });
    return res.status(200).send({
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
    const { counter_id } = req.body;
    const getData = await countersSchema.findById(counter_id);
    return res.status(200).send({
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

    const getData = await countersSchema
      .find()
      .sort({ sort_order_no: 1 })
      .skip(skip)
      .limit(limit);
    const totalRecords = await countersSchema.countDocuments();

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
    const lastSortOrderItem = await countersSchema
      .findOne()
      .sort({ sort_order_no: -1 });
    return res.status(200).send({ isSuccess: true, data: lastSortOrderItem });
  } catch (error) {
    return res.status(500).send({ message: error.message, isSuccess: false });
  }
};
