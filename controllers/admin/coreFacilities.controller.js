import coreFacilitiesSchema from "../../models/admin/coreFacilities.model.js";

export const createCoreFacilities = async (req, res) => {
  try {
    const { sort_order_no, title, isActive } = req.body;

    const createObj = {
      sort_order_no,
      title,
      isActive,
    };

    const newCoreFacilities = await coreFacilitiesSchema.create(createObj);

    return res.status(200).send({
      isSuccess: true,
      message: "Core Facilities created successfully.",
      data: newCoreFacilities,
    });
  } catch (error) {
    return res.status(500).send({
      message: error.message,
      isSuccess: false,
    });
  }
};

export const updateCoreFacilities = async (req, res) => {
  try {
    const { core_facilities_id, sort_order_no, title, isActive } = req.body;

    const findData = await coreFacilitiesSchema.findById(core_facilities_id);
    if (!findData) {
      return res.status(404).send({
        message: "Core Facilities not found!",
        isSuccess: false,
      });
    }

    const updateObj = {
      sort_order_no,
      title,
      isActive,
    };

    await coreFacilitiesSchema.findByIdAndUpdate(
      core_facilities_id,
      updateObj,
      {
        new: true,
      }
    );

    return res.status(200).send({
      isSuccess: true,
      message: "Core Facilities updated successfully.",
    });
  } catch (error) {
    return res.status(500).send({
      message: error.message,
      isSuccess: false,
    });
  }
};

export const deleteCoreFacilities = async (req, res) => {
  try {
    const core_facilities_id = req.query.core_facilities_id;
    const findData = await coreFacilitiesSchema.findById(core_facilities_id);
    if (!findData) {
      return res.status(404).send({
        message: "Core Facilities not found!",
        isSuccess: false,
      });
    }
    await coreFacilitiesSchema.findByIdAndDelete(core_facilities_id);

    return res.status(200).send({
      isSuccess: true,
      message: "Core Facilities deleted successfully.",
    });
  } catch (error) {
    return res.status(500).send({
      message: error.message,
      isSuccess: false,
    });
  }
};

export const getAllCoreFacilities = async (req, res) => {
  try {
    const getData = await coreFacilitiesSchema
      .find()
      .sort({ sort_order_no: 1 });
    return res.status(200).send({
      isSuccess: true,
      message: "Data listing successfully.",
      data: getData,
    });
  } catch (error) {
    return res.status(500).send({
      message: error.message,
      isSuccess: false,
    });
  }
};

export const getDataById = async (req, res) => {
  try {
    const { core_facilities_id } = req.body;
    const getData = await coreFacilitiesSchema.findById(core_facilities_id);
    return res.status(200).send({
      isSuccess: true,
      message: "Get data successfully.",
      data: getData,
    });
  } catch (error) {
    return res.status(500).send({
      message: error.message,
      isSuccess: false,
    });
  }
};

export const getPaginationData = async (req, res) => {
  try {
    let { page = 1, limit = 10 } = req.body;
    page = parseInt(page);
    limit = parseInt(limit);
    const skip = (page - 1) * limit;

    const coreFacilities = await coreFacilitiesSchema
      .find()
      .sort({ sort_order_no: 1 })
      .skip(skip)
      .limit(limit);
    const totalRecords = await coreFacilitiesSchema.countDocuments();

   
    return res.status(200).send({
      isSuccess: true,
      currentPageNo: page,
      totalPages: Math.ceil(totalRecords / limit),
      totalRecords,
      message: "Core Facilities listing successfully.",
      data: coreFacilities,
    });
  } catch (error) {
    return res.status(500).send({
      message: error.message,
      isSuccess: false,
    });
  }
};

export const getLastSrNo = async (req, res) => {
  try {
    const lastSortOrderItem = await coreFacilitiesSchema
      .findOne()
      .sort({ sort_order_no: -1 });
    return res.status(200).send({ isSuccess: true, data: lastSortOrderItem });
  } catch (error) {
    return res.status(500).send({ message: error.message, isSuccess: false });
  }
};

export const updateCoreFacilitiesIsActive = async (req, res) => {
  try {
    const coreFacilities_id = req.params.id;
    const coreFacilities = await coreFacilitiesSchema.findById(
      coreFacilities_id
    );
    if (!coreFacilities) {
      return res
        .status(404)
        .send({ message: "core facilities not found", isSuccess: false });
    }
    coreFacilities.isActive = !coreFacilities.isActive;
    await coreFacilities.save();
    return res.status(200).send({
      isSuccess: true,
      message: "Status updated successfully.",
      isActive: coreFacilities.isActive,
    });
  } catch (error) {
    return res.status(500).send({ message: error.message, isSuccess: false });
  }
};
