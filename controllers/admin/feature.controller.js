import featuresSchema from "../../models/admin/features.model.js";
import { deleteImage } from "../../helpers/common.js";

export const createFeature = async (req, res) => {
  try {
    const { sort_order_no, title, description, isActive } = req.body;
    const imageFile = req.files?.find((file) => file.fieldname === "icon");
    const icon = imageFile ? "features/" + imageFile.filename : "";

    const createObj = {
      sort_order_no,
      title,
      description,
      isActive,
    };

    if (icon) {
      createObj.icon = icon;
    }

    const saveData = new featuresSchema(createObj);
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

export const updateFeature = async (req, res) => {
  try {
    const { feature_id, sort_order_no, title, description, isActive } = req.body;
    const findData = await featuresSchema.findById(feature_id);
    if (!findData) {
      return res
        .status(404)
        .send({ message: "Data not found!", isSuccess: false });
    }

    const imageFile = req.files?.find((file) => file.fieldname === "icon");
    const icon = imageFile ? "features/" + imageFile.filename : "";

    const updateObj = {
      sort_order_no,
      title,
      description,
      isActive,
    };

    if (imageFile && findData.icon) {
      await deleteImage(findData.icon);
    }
    if (imageFile) {
      updateObj.icon = "features/" + imageFile.filename;
    }


    const updated = await featuresSchema.findByIdAndUpdate(
      feature_id,
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

export const deleteFeature = async (req, res) => {
  try {
    const feature_id = req.query.feature_id;
    const findData = await featuresSchema.findById(feature_id);
    if (!findData) {
      return res
        .status(404)
        .send({ message: "Data not found!", isSuccess: false });
    }

    if (findData.icon) {
      await deleteImage(findData.icon);
    }

    await featuresSchema.findByIdAndDelete(feature_id);

    return res.status(200).send({
      isSuccess: true,
      message: "Data deleted successfully.",
    });
  } catch (error) {
    return res.status(500).send({ message: error.message, isSuccess: false });
  }
};

export const getAllFeature = async (req, res) => {
  try {
    const getData = await featuresSchema.find({ isActive: true }).sort({ sort_order_no: 1 });
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
    const { feature_id } = req.body;
    const getData = await featuresSchema.findOne({ 
      _id: feature_id, 
      isActive: true 
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

    const getData = await featuresSchema
      .find()
      .sort({ sort_order_no: 1 })
      .skip(skip)
      .limit(limit);
    const totalRecords = await featuresSchema.countDocuments();

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
    const lastSortOrderItem = await featuresSchema
      .findOne()
      .sort({ sort_order_no: -1 });
    return res.status(200).send({ isSuccess: true, data: lastSortOrderItem });
  } catch (error) {
    return res.status(500).send({ message: error.message, isSuccess: false });
  }
};
export const updateFeatureIsActive = async (req, res) => {
  try {
    const feature_id = req.params.id;
    const feature = await featuresSchema.findById(feature_id);
    if (!feature) {
      return res.status(404).send({ message: "Feature not found", isSuccess: false });
    }
    feature.isActive = !feature.isActive;
    await feature.save();
    return res.status(200).send({
      isSuccess: true,
      message: "Status updated successfully.",
      isActive: feature.isActive,
    });
  } catch (error) {
    return res.status(500).send({ message: error.message, isSuccess: false });
  }
};

    