
import jobPositionSchema from "../../models/admin/jobPosition.model.js";
import { deleteImage } from "../../helpers/common.js";

export const createJobPosition = async (req, res) => {
  try {
    const { sort_order_no, title, isActive } = req.body;
    const imageFile = req.files?.find((file) => file.fieldname === "icon");
    const icon = imageFile ? "jobPosition/" + imageFile.filename : "";

    const createObj = {
      sort_order_no,
      title,
      isActive
    };

    if (icon) {
      createObj.icon = icon;
    }

    const saveData = new jobPositionSchema(createObj);
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

export const updateJobPosition = async (req, res) => {
  try {
    const { jobPosition_id, sort_order_no, title, isActive } = req.body;
    const findData = await jobPositionSchema.findById(jobPosition_id);
    if (!findData) {
      return res
        .status(404)
        .send({ message: "Data not found!", isSuccess: false });
    }

    const imageFile = req.files?.find((file) => file.fieldname === "icon");
    const icon = imageFile ? "jobPosition/" + imageFile.filename : "";

    const updateObj = {
      sort_order_no,
      title,
      isActive
    };

    if (imageFile && findData.icon) {
      await deleteImage(findData.icon);
    }
    if (imageFile) {
      updateObj.icon = "jobPosition/" + imageFile.filename;
    }


    const updated = await jobPositionSchema.findByIdAndUpdate(
      jobPosition_id,
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

export const deleteJobPosition = async (req, res) => {
  try {
    const jobPosition_id = req.query.jobPosition_id;
    const findData = await jobPositionSchema.findById(jobPosition_id);
    if (!findData) {
      return res
        .status(404)
        .send({ message: "Data not found!", isSuccess: false });
    }

    if (findData.icon) {
      await deleteImage(findData.icon);
    }

    await jobPositionSchema.findByIdAndDelete(jobPosition_id);

    return res.status(200).send({
      isSuccess: true,
      message: "Data deleted successfully.",
    });
  } catch (error) {
    return res.status(500).send({ message: error.message, isSuccess: false });
  }
};

export const getAllJobPositions = async (req, res) => {
  try {
    const getData = await jobPositionSchema
    .find({ isActive: true })
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

export const getDataById = async (req, res) => {
  try {
    const { jobPosition_id } = req.body;
   const getData = await jobPositionSchema.findOne({
      _id: jobPosition_id,
      isActive: true,
    });
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

    const getData = await jobPositionSchema
      .find()
      .sort({ sort_order_no: 1 })
      .skip(skip)
      .limit(limit);
    const totalRecords = await jobPositionSchema.countDocuments();

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
    const lastSortOrderItem = await jobPositionSchema
      .findOne()
      .sort({ sort_order_no: -1 });
    return res.status(200).send({ isSuccess: true, data: lastSortOrderItem });
  } catch (error) {
    return res.status(500).send({ message: error.message, isSuccess: false });
  }
};

export const updateJobPositionIsActive = async (req, res) => {
  try {
    const jobPosition_id = req.params.id;
    const jobPosition = await jobPositionSchema.findById(jobPosition_id);
    if (!jobPosition) {
      return res.status(404).send({ message: "Job Position not found", isSuccess: false });
    }
    jobPosition.isActive = !jobPosition.isActive;
    await jobPosition.save();
    return res.status(200).send({
      isSuccess: true,
      message: "Status updated successfully.",
      isActive: jobPosition.isActive,
    });
  } catch (error) {
    return res.status(500).send({ message: error.message, isSuccess: false });
  }
};