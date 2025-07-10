// controllers/counter.controller.js (ESM)

import path from "path";
import { fileURLToPath } from "url";
import coreServiceSchema from "../../models/admin/coreServices.model.js";
import { deleteImage } from "../../helpers/common.js";

export const createCoreService = async (req, res) => {
  try {
    const { sort_order_no, short_desc, label, isActive } = req.body;
    const imageFile = req.files?.find((file) => file.fieldname === "icon");
    const icon = imageFile ? "public/coreServices/" + imageFile.filename : "";

    const createObj = {
      sort_order_no,
      short_desc,
      label,
      isActive,
    };

    if (icon) {
      createObj.icon = icon;
    }

    const saveData = new coreServiceSchema(createObj);
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

export const updateCoreService = async (req, res) => {
  try {
    const { coreServices_id, sort_order_no, short_desc, label, isActive } = req.body;
    const findData = await coreServiceSchema.findById(coreServices_id);
    if (!findData) {
      return res
        .status(404)
        .send({ message: "Data not found!", isSuccess: false });
    }

    const imageFile = req.files?.find((file) => file.fieldname === "icon");
    const icon = imageFile ? "public/coreServices/" + imageFile.filename : "";

    const updateObj = {
      sort_order_no,
      short_desc,
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

    const updated = await coreServiceSchema.findByIdAndUpdate(
      coreServices_id,
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

export const deleteCoreService = async (req, res) => {
  try {
    const { coreServices_id } = req.body;
    const findData = await coreServiceSchema.findById(coreServices_id);
    if (!findData) {
      return res
        .status(404)
        .send({ message: "Data not found!", isSuccess: false });
    }

    if (findData.icon) {
      await deleteImage(findData.icon);
    }

    await coreServiceSchema.findByIdAndDelete(coreServices_id);

    return res.status(200).send({
      isSuccess: true,
      message: "Data deleted successfully.",
    });
  } catch (error) {
    return res.status(500).send({ message: error.message, isSuccess: false });
  }
};

export const getAllCoreServices = async (req, res) => {
  try {
    const getData = await coreServiceSchema.find().sort({ sort_order_no: 1 });
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
    const { coreServices_id } = req.body;
    const getData = await coreServiceSchema.findById(coreServices_id);
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

    const getData = await coreServiceSchema
      .find()
      .sort({ sort_order_no: 1 })
      .skip(skip)
      .limit(limit);
    const totalRecords = await coreServiceSchema.countDocuments();

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
    const lastSortOrderItem = await coreServiceSchema
      .findOne()
      .sort({ sort_order_no: -1 });
    return res.status(200).send({ isSuccess: true, data: lastSortOrderItem });
  } catch (error) {
    return res.status(500).send({ message: error.message, isSuccess: false });
  }
};
