import mongoose from "mongoose";
import doctordetailSchema from "../../models/admin/doctorDetails.model.js"; 
import doctorSchema from "../../models/admin/ourTeam.model.js"; 
 
export const createDoctorDetails = async (req, res) => {
  try {
    const { sort_order_no, title, content, doctor_id, isActive } = req.body;

    // Validate ObjectId
    if (!mongoose.Types.ObjectId.isValid(doctor_id)) {
      return res.status(400).send({
        message: "Invalid doctor_id format.",
        isSuccess: false,
      });
    }

    const disorderExists = await doctorSchema.findById(doctor_id);
    if (!disorderExists) {
      return res.status(400).send({
        message: "No such Disorder exists.",
        isSuccess: false,
      });
    }

    const newDisorder = new doctordetailSchema({
      sort_order_no,
      title,
      content, 
      doctor_id,
      isActive: typeof isActive === "boolean" ? isActive : true,
    });

    const saved = await newDisorder.save();

    return res.status(200).send({
      isSuccess: true,
      message: "Data created successfully.",
      data: saved,
    });
  } catch (error) {
    return res.status(500).send({ message: error.message, isSuccess: false });
  }
};


export const updateDoctorDetails = async (req, res) => {
  try {
    const { doctorDetails_id, sort_order_no, title, content, doctor_id, isActive } = req.body;

    if (!mongoose.Types.ObjectId.isValid(doctorDetails_id)) {
      return res.status(400).send({
        message: "Invalid doctorDetails_id format.",
        isSuccess: false,
      });
    }

    const existingDisorder = await doctordetailSchema.findById(doctorDetails_id);
    if (!existingDisorder) {
      return res.status(404).send({
        message: "Disorder Section not found.",
        isSuccess: false,
      });
    }

    if (doctor_id && !mongoose.Types.ObjectId.isValid(doctor_id)) {
      return res.status(400).send({
        message: "Invalid doctor_id format.",
        isSuccess: false,
      });
    }

    const updateObj = {
      sort_order_no,
      title,
      content,
      isActive,
    };

    if (doctor_id) {
      updateObj.doctor_id = doctor_id;
    }

    const updatedDisorder = await doctordetailSchema.findByIdAndUpdate(
      doctorDetails_id,
      updateObj,
      { new: true }
    );

    return res.status(200).send({
      isSuccess: true,
      message: "Disorder updated successfully.",
      data: updatedDisorder,
    });

  } catch (error) {
    return res.status(500).send({
      message: error.message,
      isSuccess: false,
    });
  }
};

export const deleteDoctorDetails = async (req, res) => {
  try {
    const { doctorDetails_id } = req.body;
    if (!mongoose.Types.ObjectId.isValid(doctorDetails_id)) {
      return res.status(400).send({
        message: "Invalid doctorDetails_id format.",
        isSuccess: false,
      });
    }

    const deleted = await doctordetailSchema.findByIdAndDelete(doctorDetails_id);
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

export const getAllDoctorDetails = async (req, res) => {
  try {
    const data = await doctordetailSchema
      .find()
      .populate("doctor_id", "name")
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
    const { doctorDetails_id } = req.body;
    if (!mongoose.Types.ObjectId.isValid(doctorDetails_id)) {
      return res.status(400).send({
        message: "Invalid doctorDetails_id format.",
        isSuccess: false,
      });
    }

    const data = await doctordetailSchema
      .findById(doctorDetails_id)
      .populate("doctor_id", "name");
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

    const [data, totalRecords] = await Promise.all([
      doctordetailSchema
        .find()
        .sort({ sort_order_no: 1 })
        .skip(skip)
        .limit(limit)
        .populate("doctor_id", "name"),
      doctordetailSchema.countDocuments(),
    ]);

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
    const lastItem = await doctordetailSchema
      .findOne()
      .sort({ sort_order_no: -1 });
    return res.status(200).send({ isSuccess: true, data: lastItem });
  } catch (error) {
    return res.status(500).send({ message: error.message, isSuccess: false });
  }
};
