import aboutImageSchema from "../../models/admin/aboutUsImage.model.js";
import aboutTabSchema from "../../models/admin/aboutUsTabs.model.js";
import mongoose from "mongoose";

export const createTabs = async (req, res) => {
  try {
    const { sort_order_no, title, content, about_img_id, isActive } = req.body;
    const titleExists = await aboutImageSchema.findById(about_img_id);
    if (!titleExists) {
      return res.status(400).send({
        isSuccess: false,
        message: "Invalid about_img_id. About Image does not exist.",
      });
    }
    const saveData = await aboutTabSchema.create({
      sort_order_no,
      title,
      content,
      about_img_id,
      isActive,
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

export const updateTabs = async (req, res) => {
  try {
    const { tabs_id, sort_order_no, title, content, about_img_id, isActive } =
      req.body;

    const titleExists = await aboutImageSchema.findById(about_img_id);
    if (!titleExists) {
      return res.status(400).send({
        isSuccess: false,
        message: "Invalid about_img_id. About Image does not exist.",
      });
    }

    const updated = await aboutTabSchema.findByIdAndUpdate(
      tabs_id,
      { sort_order_no, title, content, about_img_id, isActive },
      { new: true }
    );
    if (!updated) {
      return res
        .status(404)
        .send({ message: "Data not found!", isSuccess: false });
    }
    return res.status(200).send({
      isSuccess: true,
      message: "Data updated successfully.",
      data: updated,
    });
  } catch (error) {
    return res.status(500).send({ message: error.message, isSuccess: false });
  }
};

export const deleteTabs = async (req, res) => {
  try {
    const tabs_id = req.query.tabs_id;
    const deleted = await aboutTabSchema.findByIdAndDelete(tabs_id);
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

export const getAllTabs = async (req, res) => {
  try {
    const data = await aboutTabSchema.find().sort({ sort_order_no: 1 });
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
    const tabs_id = req.body.tabs_id;
    const data = await aboutTabSchema.findById(tabs_id);
    if (!data) {
      return res
        .status(404)
        .send({ message: "Data not found!", isSuccess: false });
    }
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

    const data = await aboutTabSchema
      .find()
      .sort({ sort_order_no: 1 })
      .skip(skip)
      .limit(limit);

    const totalRecords = await aboutTabSchema.countDocuments();
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
    const last = await aboutTabSchema.findOne().sort({ sort_order_no: -1 });
    return res.status(200).send({
      isSuccess: true,
      data: last,
    });
  } catch (error) {
    return res.status(500).send({ message: error.message, isSuccess: false });
  }
};

export const updateTabsIsActive = async (req, res) => {
  try {
    const tabs_id = req.params.id;
    const about_tab = await aboutTabSchema.findById(tabs_id);
    if (!about_tab) {
      return res
        .status(404)
        .send({ message: "about tab not found", isSuccess: false });
    }
    about_tab.isActive = !about_tab.isActive;
    await about_tab.save();
    return res.status(200).send({
      isSuccess: true,
      message: "Status updated successfully.",
      isActive: about_tab.isActive,
    });
  } catch (error) {
    return res.status(500).send({ message: error.message, isSuccess: false });
  }
};
export const getTabsByAbout = async (req, res) => {
  try {
    const { about_id } = req.params;
    let { page = 1, limit = 10 } = req.query;

    if (!about_id || !mongoose.Types.ObjectId.isValid(about_id)) {
      return res.status(400).json({ isSuccess: false, message: "Valid about_id is required" });
    }

    page = parseInt(page);
    limit = parseInt(limit);
    const skip = (page - 1) * limit;

    const sections = await aboutTabSchema.find({ about_img_id: new mongoose.Types.ObjectId(about_id) })
      .sort({ sort_order_no: 1 })
      .skip(skip)
      .limit(limit);

    const totalCount = await aboutTabSchema.countDocuments({ about_img_id: new mongoose.Types.ObjectId(about_id) });
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
