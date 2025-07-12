import gallaryTSchema from "../../models/admin/gallaryTitle.model.js";

export const createGallaryTitle = async (req, res) => {
  try {
    const { sort_order_no, title, isActive } = req.body;
    const createObj = {
      sort_order_no,
      title,
      isActive
    };
    const saveData = await gallaryTSchema(createObj);
    await saveData
      .save()
      .then(async (data) => {
        return res.status(200).send({
          isSuccess: true,
          message: "Data created successfully.",
          data: data,
        });
      })
      .catch((error) => {
        return res.status(500).send({
          message: error.message,
          isSuccess: false,
        });
      });
  } catch (error) {
    return res.status(500).send({
      message: error.message,
      isSuccess: false,
    });
  }
};

export const updateGallaryTitle = async (req, res) => {
  try {
    const { gallary_id, sort_order_no, title, isActive } = req.body;

    const findData = await gallaryTSchema.findById(gallary_id);
    if (!findData) {
      return res.status(200).send({
        message: "Data not found!",
        isSuccess: false,
      });
    }
    const updateObj = {
      sort_order_no,
      title,
      isActive,
    };

    await gallaryTSchema
      .findByIdAndUpdate(gallary_id, updateObj, { new: true })
      .then(async (data) => {
        return res.status(200).send({
          isSuccess: true,
          message: "Data updated successfully.",
        });
      })
      .catch((error) => {
        return res.status(500).send({
          message: error.message,
          isSuccess: false,
        });
      });
  } catch (error) {
    return res.status(500).send({
      message: error.message,
      isSuccess: false,
    });
  }
};

export const deleteGallaryTitle = async (req, res) => {
  try {
    const gallary_id = req.body.gallary_id;
    await gallaryTSchema
      .findByIdAndDelete(gallary_id)
      .then(async (data) => {
        if (!data) {
          return res
            .status(404)
            .send({ message: "Data not found!", isSuccess: false });
        }
        return res.status(200).send({
          isSuccess: true,
          message: "Data deleted successfully.",
        });
      })
      .catch((error) => {
        return res.status(500).send({
          message: error.message,
          isSuccess: false,
        });
      });
  } catch (error) {
    return res.status(500).send({
      message: error.message,
      isSuccess: false,
    });
  }
};

export const getAllGallaryTitle = async (req, res) => {
  try {
    const getData = await gallaryTSchema.find().sort({
      sort_order_no: 1,
    });
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
    const gallary_id = req.body.gallary_id;
    const getData = await gallaryTSchema.findById(gallary_id);
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
    if (isNaN(page) || page < 1) page = 1;
    if (isNaN(limit) || limit < 1) limit = 10;
    const skip = (page - 1) * limit;
    const getData = await gallaryTSchema
      .find()
      .sort({ sort_order_no: 1 })
      .skip(skip)
      .limit(limit);
    const totalRecords = await gallaryTSchema.countDocuments();
    return res.status(200).send({
      isSuccess: true,
      currentPageNo: page,
      totalPages: Math.ceil(totalRecords / limit),
      totalRecords,
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
export const getLastSrNo = async (req, res) => {
  try {
    const lastSortOrderItem = await gallaryTSchema
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
