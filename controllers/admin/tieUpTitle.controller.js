import tieUpTSchema from "../../models/admin/tieUpTitle.model.js";
import tieUpISchema from "../../models/admin/tieUpImage.model.js";
import { deleteImage } from "../../helpers/common.js";

export const createTieUpTitle = async (req, res) => {
  try {
    const { sort_order_no, title, isActive } = req.body;
    const saveData = await tieUpTSchema.create({
      sort_order_no,
      title,
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

export const updateTieUpTitle = async (req, res) => {
  try {
    const { tieUp_id, sort_order_no, title, isActive } = req.body;
    const updated = await tieUpTSchema.findByIdAndUpdate(
      tieUp_id,
      { sort_order_no, title, isActive },
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

export const deleteTieUpTitle = async (req, res) => {
  try {
    const tieUp_id = req.query.tieUp_id;

    const title = await tieUpTSchema.findById(tieUp_id);
    if (!title) {
      return res
        .status(404)
        .send({ message: "Data not found!", isSuccess: false });
    }

    const relatedImages = await tieUpISchema.find({ tieUpTitle_id: tieUp_id });

    for (const img of relatedImages) {
      if (img.tieUp_image) {
        await deleteImage(img.tieUp_image);
      }
    }

    await tieUpISchema.deleteMany({ tieUpTitle_id: tieUp_id });
    await tieUpTSchema.findByIdAndDelete(tieUp_id);

    return res.status(200).send({
      isSuccess: true,
      message: "TieUp title and all related images deleted successfully.",
    });
  } catch (error) {
    return res.status(500).send({ message: error.message, isSuccess: false });
  }
};

export const getAllTieUpTitle = async (req, res) => {
  try {
    const data = await tieUpTSchema.find({ isActive: true }).sort({ sort_order_no: 1 });
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
    const tieUp_id = req.body.tieUp_id;
    const data = await tieUpTSchema.findOne({ _id: tieUp_id, isActive: true });
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

    const tieUp = await tieUpTSchema
      .find()
      .sort({ sort_order_no: 1 })
      .skip(skip)
      .limit(limit);

    const totalRecords = await tieUpTSchema.countDocuments();

    const data = await Promise.all(
      tieUp.map(async (item) => {
        const tieUpImgCount = await tieUpISchema.countDocuments({
          tieUpTitle_id: item._id,
        });
        return { ...item._doc, tieUpImgCount };
      })
    );

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
    const last = await tieUpTSchema.findOne().sort({ sort_order_no: -1 });
    return res.status(200).send({
      isSuccess: true,
      data: last,
    });
  } catch (error) {
    return res.status(500).send({ message: error.message, isSuccess: false });
  }
};

export const updateTieUpIsActive = async (req, res) => {
  try {
    const tieUp_id = req.params.id;
    const tieUpTitle = await tieUpTSchema.findById(tieUp_id);
    if (!tieUpTitle) {
      return res
        .status(404)
        .send({ message: "tieUpTitle not found", isSuccess: false });
    }
    tieUpTitle.isActive = !tieUpTitle.isActive;
    await tieUpTitle.save();
    return res.status(200).send({
      isSuccess: true,
      message: "Status updated successfully.",
      isActive: tieUpTitle.isActive,
    });
  } catch (error) {
    return res.status(500).send({ message: error.message, isSuccess: false });
  }
};
