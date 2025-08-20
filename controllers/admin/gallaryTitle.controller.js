import gallaryTSchema from "../../models/admin/gallaryTitle.model.js";
import gallaryISchema from "../../models/admin/gallaryImage.model.js";
import { deleteImage } from "../../helpers/common.js";

export const createGallaryTitle = async (req, res) => {
  try {
    const { sort_order_no, title, isActive } = req.body;
    const saveData = await gallaryTSchema.create({
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

export const updateGallaryTitle = async (req, res) => {
  try {
    const { gallary_id, sort_order_no, title, isActive } = req.body;
    const updated = await gallaryTSchema.findByIdAndUpdate(
      gallary_id,
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

export const deleteGallaryTitle = async (req, res) => {
  try {
    const gallary_id = req.query.gallary_id;

    const findData = await gallaryTSchema.findById(gallary_id);
    if (!findData) {
      return res
        .status(404)
        .send({ message: "Gallery title not found!", isSuccess: false });
    }

    const images = await gallaryISchema.find({ galleryTitleId: gallary_id });

    for (const img of images) {
      if (img.gallary_image) {
        await deleteImage(img.gallary_image);
      }
    }

    await gallaryISchema.deleteMany({ galleryTitleId: gallary_id });

    await gallaryTSchema.findByIdAndDelete(gallary_id);

    return res.status(200).send({
      isSuccess: true,
      message: "Gallery title and its images deleted successfully.",
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
    const data = await gallaryTSchema.find().sort({ sort_order_no: 1 });
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
    const gallary_id = req.body.gallary_id;
    const data = await gallaryTSchema.findById(gallary_id);
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

    const gallary = await gallaryTSchema
      .find()
      .sort({ sort_order_no: 1 })
      .skip(skip)
      .limit(limit);

    const totalRecords = await gallaryTSchema.countDocuments();

    const data = await Promise.all(
      gallary.map(async (item) => {
        const gallaryImgCount = await gallaryISchema.countDocuments({
          galleryTitleId: item._id,
        });
        return { ...item._doc, gallaryImgCount };
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
    const last = await gallaryTSchema.findOne().sort({ sort_order_no: -1 });
    return res.status(200).send({
      isSuccess: true,
      data: last,
    });
  } catch (error) {
    return res.status(500).send({ message: error.message, isSuccess: false });
  }
};

export const updateGalleryIsActive = async (req, res) => {
  try {
    const gallary_id = req.params.id;
    const gallaryTitle = await gallaryTSchema.findById(gallary_id);
    if (!gallaryTitle) {
      return res
        .status(404)
        .send({ message: "gallaryTitle not found", isSuccess: false });
    }
    gallaryTitle.isActive = !gallaryTitle.isActive;
    await gallaryTitle.save();
    return res.status(200).send({
      isSuccess: true,
      message: "Status updated successfully.",
      isActive: gallaryTitle.isActive,
    });
  } catch (error) {
    return res.status(500).send({ message: error.message, isSuccess: false });
  }
};
