import patientRSchema from "../../models/admin/patientReview.model.js";

export const createPatientReview = async (req, res) => {
  try {
    const { sort_order_no, patient_name, content, isActive } = req.body;

    const createObj = {
      sort_order_no,
      patient_name,
      content,
      isActive,
    };

    const saveData = new patientRSchema(createObj);
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

export const updatePatientReview = async (req, res) => {
  try {
    const { review_id, sort_order_no, patient_name, content, isActive } = req.body;
    const findData = await patientRSchema.findById(review_id);
    if (!findData) {
      return res
        .status(404)
        .send({ message: "Data not found!", isSuccess: false });
    }

    const updateObj = {
      sort_order_no,
      patient_name,
      content,
      isActive,
    };

    const updated = await patientRSchema.findByIdAndUpdate(
      review_id,
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

export const deletePatientReview = async (req, res) => {
  try {
    const { review_id } = req.body;
    const findData = await patientRSchema.findById(review_id);
    if (!findData) {
      return res
        .status(404)
        .send({ message: "Data not found!", isSuccess: false });
    }

    await patientRSchema.findByIdAndDelete(review_id);

    return res.status(200).send({
      isSuccess: true,
      message: "Data deleted successfully.",
    });
  } catch (error) {
    return res.status(500).send({ message: error.message, isSuccess: false });
  }
};

export const getAllPatientReview = async (req, res) => {
  try {
    const getData = await patientRSchema.find().sort({ sort_order_no: 1 });
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
    const { review_id } = req.body;
    const getData = await patientRSchema.findById(review_id);
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

    const getData = await patientRSchema
      .find()
      .sort({ sort_order_no: 1 })
      .skip(skip)
      .limit(limit);
    const totalRecords = await patientRSchema.countDocuments();

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
    const lastSortOrderItem = await patientRSchema
      .findOne()
      .sort({ sort_order_no: -1 });
    return res.status(200).send({ isSuccess: true, data: lastSortOrderItem });
  } catch (error) {
    return res.status(500).send({ message: error.message, isSuccess: false });
  }
};
