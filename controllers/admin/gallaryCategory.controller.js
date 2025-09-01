import mongoose from "mongoose";
import gallaryTSchema from "../../models/admin/gallaryTitle.model.js";
import gallaryISchema from "../../models/admin/gallaryImage.model.js";
import gallaryCategorySchema from "../../models/admin/gallaryCategory.model.js";
import { deleteImage } from "../../helpers/common.js";

export const createGallaryCategory = async (req, res) => {
  try {
    const { sort_order_no, categoryName,  gallaryTitleId, isActive } =
      req.body;

    if (!mongoose.Types.ObjectId.isValid(gallaryTitleId)) {
      return res
        .status(400)
        .send({ message: "Invalid gallaryTitleId format.", isSuccess: false });
    }

    const gallaryTitleExists = await gallaryTSchema.findById(gallaryTitleId);
    if (!gallaryTitleExists) {
      return res
        .status(400)
        .send({ message: "Gallary title not found.", isSuccess: false });
    }

    const newGallaryCategory = new gallaryCategorySchema({
      sort_order_no,
      categoryName,
      gallaryTitleId,
      isActive: typeof isActive === "boolean" ? isActive : true,
      gallaryImagesId: [],
    });

    await newGallaryCategory.save();

    await gallaryTSchema.findByIdAndUpdate(gallaryTitleId, {
      $push: { gallaryCategory: newGallaryCategory._id },
    });

    const totalRecords = await gallaryCategorySchema.find({
      gallaryTitleId: new mongoose.Types.ObjectId(gallaryTitleId),
    });

    newGallaryCategory.gallaryImagesId = totalRecords.map((c) => c._id);
    await newGallaryCategory.save();

    const populated = await gallaryCategorySchema
      .findById(newGallaryCategory._id)
      .populate("gallaryImagesId")
      .populate("gallaryTitleId", "categoryName");

    return res.status(200).send({
      isSuccess: true,
      message: "Gallary category created successfully.",
      data: populated,
    });
  } catch (error) {
    return res.status(500).send({ message: error.message, isSuccess: false });
  }
};

export const updateGallaryCategory = async (req, res) => {
  try {
    const {
      gallaryCategoryId,
      sort_order_no,
      categoryName,
      gallaryTitleId,
      isActive,
    } = req.body;

    if (!mongoose.Types.ObjectId.isValid(gallaryCategoryId)) {
      return res.status(400).send({
        message: "Invalid gallaryCategoryId format.",
        isSuccess: false,
      });
    }

    const existing = await gallaryCategorySchema.findById(gallaryCategoryId);
    if (!existing) {
      return res
        .status(404)
        .send({ message: "Gallary category not found.", isSuccess: false });
    }

    if (gallaryTitleId && !mongoose.Types.ObjectId.isValid(gallaryTitleId)) {
      return res
        .status(400)
        .send({ message: "Invalid gallaryTitleId format.", isSuccess: false });
    }

    const updateObj = {
      sort_order_no,
      categoryName,
      isActive,
    };
    if (gallaryTitleId) updateObj.gallaryTitleId = gallaryTitleId;

    // Update gallary category
    const updated = await gallaryCategorySchema.findByIdAndUpdate(
      gallaryCategoryId,
      updateObj,
      { new: true }
    );

    // Find gallary category sections linked to this gallary category
    const linkedSections = await gallaryISchema.find({
      gallaryCategoryId: updated._id,
    });

    updated.gallaryImagesId = linkedSections.map((d) => d._id);
    await updated.save();

    // Populate before sending back
    const populated = await gallaryCategorySchema
      .findById(updated._id)
      .populate("gallaryImagesId")
      .populate("gallaryTitleId", "categoryName");

    return res.status(200).send({
      isSuccess: true,
      message: "Gallary category updated successfully.",
      data: populated,
    });
  } catch (error) {
    return res.status(500).send({ message: error.message, isSuccess: false });
  }
};

export const deleteGallaryCategory = async (req, res) => {
  try {
    const { category_id } = req.query;

    const category = await gallaryCategorySchema.findById(category_id);
    if (!category) {
      return res.status(404).send({
        isSuccess: false,
        message: "Gallery Category not found",
      });
    }
    const images = await gallaryISchema.find({
      galleryCategoryId: category_id,
    });

    for (const img of images) {
      if (img.gallary_image) {
        await deleteImage(img.gallary_image);
      }
    }
    await gallaryISchema.deleteMany({ galleryCategoryId: category_id });

    await gallaryCategorySchema.findByIdAndDelete(category_id);

    return res.status(200).send({
      isSuccess: true,
      message:
        "Gallery Category and its images deleted successfully (DB + Files)",
    });
  } catch (error) {
    console.error("Error in deleteGallaryCategory:", error);
    return res.status(500).send({
      isSuccess: false,
      message: error.message,
    });
  }
};

export const getAllCategories = async (req, res) => {
  try {
    const data = await gallaryCategorySchema
      .find()
      .populate("gallaryTitleId", "categoryName")
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
    const { gallaryCategoryId } = req.body;
    if (!mongoose.Types.ObjectId.isValid(gallaryCategoryId)) {
      return res.status(400).send({
        message: "Invalid gallaryCategoryId format.",
        isSuccess: false,
      });
    }

    const data = await gallaryCategorySchema
      .findById(gallaryCategoryId)
      .populate("gallaryTitleId", "categoryName");
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
    let { page = 1, limit = 10 } = req.body; // (you can switch to req.query later if needed)
    page = parseInt(page);
    limit = parseInt(limit);
    const skip = (page - 1) * limit;

    // Fetch paginated categories
    const categories = await gallaryCategorySchema
      .find()
      .sort({ sort_order_no: 1 })
      .skip(skip)
      .limit(limit)
      .populate("gallaryTitleId", "title");

    // Count total categories
    const totalRecords = await gallaryCategorySchema.countDocuments();

    // For each category, get image count
    const dataWithCounts = await Promise.all(
      categories.map(async (cat) => {
        const gallaryImageCount = await gallaryISchema.countDocuments({
          gallaryCategoryId: cat._id,
        });
        return {
          ...cat.toObject(),
          gallaryImageCount,
        };
      })
    );

    return res.status(200).send({
      isSuccess: true,
      currentPageNo: page,
      totalPages: Math.ceil(totalRecords / limit),
      totalRecords,
      message: "Data listing successfully.",
      data: dataWithCounts,
    });
  } catch (error) {
    return res.status(500).send({ message: error.message, isSuccess: false });
  }
};

export const getLastSrNo = async (req, res) => {
  try {
    const lastItem = await gallaryCategorySchema
      .findOne()
      .sort({ sort_order_no: -1 });
    return res.status(200).send({ isSuccess: true, data: lastItem });
  } catch (error) {
    return res.status(500).send({ message: error.message, isSuccess: false });
  }
};

export const listCategoriesByTitle = async (req, res) => {
  try {
    const { gallaryTitleId } = req.params;
    let { page = 1, limit = 10 } = req.query;

    page = parseInt(page);
    limit = parseInt(limit);

    if (isNaN(page) || page < 1) page = 1;
    if (isNaN(limit) || limit < 1) limit = 10;

    const skip = (page - 1) * limit;

    const gallaryCategories = await gallaryCategorySchema
      .find({ gallaryTitleId: new mongoose.Types.ObjectId(gallaryTitleId) })
      .sort({ sort_order_no: 1 })
      .skip(skip)
      .limit(limit)
      .populate("gallaryTitleId", "categoryName");

    const totalRecords = await gallaryCategorySchema.countDocuments({
      gallaryTitleId: new mongoose.Types.ObjectId(gallaryTitleId),
    });

    const data = await Promise.all(
      gallaryCategories.map(async (gallaryCategory) => {
        const gallaryImageCount = await gallaryISchema.countDocuments({
          galleryCategoryId: gallaryCategory._id,
        });
        return { ...gallaryCategory.toObject(), gallaryImageCount };
      })
    );

    res.status(200).send({
      isSuccess: true,
      data,
      currentPage: page,
      totalPages: Math.ceil(totalRecords / limit),
      totalRecords,
      message: "Data fetched successfully.",
    });
  } catch (error) {
    res.status(500).send({ message: error.message, isSuccess: false });
  }
};

export const updateCategoryIsActive = async (req, res) => {
  try {
    const gallaryCategoryId = req.params.id;
    const gallaryCategory = await gallaryCategorySchema.findById(
      gallaryCategoryId
    );
    if (!gallaryCategory) {
      return res
        .status(404)
        .send({ message: "gallaryCategory not found", isSuccess: false });
    }
    gallaryCategory.isActive = !gallaryCategory.isActive;
    await gallaryCategory.save();
    return res.status(200).send({
      isSuccess: true,
      message: "Status updated successfully.",
      isActive: gallaryCategory.isActive,
    });
  } catch (error) {
    return res.status(500).send({ message: error.message, isSuccess: false });
  }
};

export const updateCategoryPosition = async (req, res) => {
  try {
    const { id, direction } = req.body;
    const currentItem = await gallaryCategorySchema.findById(id);
    if (!currentItem) {
      return res
        .status(404)
        .send({ message: "Disorder not found", isSuccess: false });
    }

    let swapItem;
    if (direction === "up") {
      swapItem = await gallaryCategorySchema
        .findOne({
          sort_order_no: { $lt: currentItem.sort_order_no },
          gallaryTitleId: currentItem.gallaryTitleId || null,
        })
        .sort({ sort_order_no: -1 });
    } else if (direction === "down") {
      swapItem = await gallaryCategorySchema
        .findOne({
          sort_order_no: { $gt: currentItem.sort_order_no },
          gallaryTitleId: currentItem.gallaryTitleId || null,
        })
        .sort({ sort_order_no: 1 });
    } else {
      return res
        .status(400)
        .send({ message: "Invalid direction", isSuccess: false });
    }

    if (!swapItem) {
      return res.status(200).send({
        isSuccess: false,
        message: "Cannot move further",
      });
    }

    const temp = currentItem.sort_order_no;
    currentItem.sort_order_no = swapItem.sort_order_no;
    swapItem.sort_order_no = temp;

    await currentItem.save();
    await swapItem.save();

    return res.status(200).send({
      isSuccess: true,
      message: "Position updated successfully.",
    });
  } catch (error) {
    return res.status(500).send({ message: error.message, isSuccess: false });
  }
};

export const getLastSrNoByGallaryTitle = async (req, res) => {
  try {
    const { gallaryTitleId } = req.params;

    if (!gallaryTitleId) {
      return res.status(400).json({
        isSuccess: false,
        message: "gallaryTitleId is required",
      });
    }

    if (!mongoose.Types.ObjectId.isValid(gallaryTitleId)) {
      return res.status(400).json({
        isSuccess: false,
        message: "Invalid gallaryTitleId format",
      });
    }

    const objectId = new mongoose.Types.ObjectId(gallaryTitleId);

    const lastDetail = await gallaryCategorySchema
      .findOne({ gallaryTitleId: objectId })
      .sort({ sort_order_no: -1 });

    const lastNo = lastDetail ? lastDetail.sort_order_no : 0;

    res.status(200).json({
      isSuccess: true,
      message: "Last sort order number fetched successfully",
      data: { sort_order_no: lastNo },
    });
  } catch (error) {
    console.error("Error in getLastSrNoByGallaryTitle:", error);
    res.status(500).json({
      isSuccess: false,
      message: "Something went wrong while fetching last sort order number",
    });
  }
};
