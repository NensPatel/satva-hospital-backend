import gallaryTSchema from "../../models/admin/gallaryTitle.model.js";
import gallaryISchema from "../../models/admin/gallaryImage.model.js";
import gallaryCategorySchema from "../../models/admin/gallaryCategory.model.js";

export const createGallaryTitle = async (req, res) => {
  try {
    const { sort_order_no, title, isActive } = req.body;
    let { slug } = req.body;
    slug = slugify(slug || title, { lower: true, strict: true });

    const existingSlug = await gallaryTSchema.findOne({ slug });
    if (existingSlug) {
      return res.status(400).json({
        message: "Slug already exists. Please use a unique slug.",
        isSuccess: false,
      });
    }

    const saveData = await gallaryTSchema.create({
      sort_order_no,
      title,
      isActive,
      slug,
      gallaryCategory: [],
    });
    await saveData.save();
    const linkedCategory = await gallaryCategorySchema.find({
      gallaryTitleId: saveData._id,
    });

    saveData.gallaryCategory = linkedCategory.map((c) => c._id);
    await saveData.save();

    const populated = await gallaryTSchema
      .findById(saveData._id)
      .populate("gallaryCategory");

    return res.status(200).send({
      isSuccess: true,
      message: "Data created successfully.",
      data: populated,
    });
  } catch (error) {
    return res.status(500).send({ message: error.message, isSuccess: false });
  }
};

export const updateGallaryTitle = async (req, res) => {
  try {
    const { gallary_id, sort_order_no, title, isActive } = req.body;
    let { slug } = req.body;

    const findData = await gallaryTSchema.findById(gallary_id);
    if (!findData) {
      return res
        .status(404)
        .send({ message: "Data not found!", isSuccess: false });
    }

    slug = slugify(slug || title, { lower: true, strict: true });

    if (slug !== findData.slug) {
      const existingSlug = await specialitySchema.findOne({ slug });
      if (existingSlug) {
        return res.status(400).json({
          message: "Slug already exists. Please use a unique slug.",
          isSuccess: false,
        });
      }
    }
    const updateObj = {
      sort_order_no,
      title,
      slug,
      isActive,
    };

    const updated = await gallaryTSchema.findByIdAndUpdate(
      gallary_id,
      updateObj,
      { new: true }
    );
    if (!updated) {
      return res
        .status(404)
        .send({ message: "Data not found!", isSuccess: false });
    }
    const linkedCategory = await gallaryCategorySchema.find({
      gallary_id: gallary_id,
    });

    updated.gallaryCategory = linkedCategory.map((c) => c._id);
    await updated.save();

    const populated = await gallaryTSchema
      .findById(gallary_id)
      .populate("gallaryCategory");

    return res.status(200).send({
      isSuccess: true,
      message: "Data updated successfully.",
      data: populated,
    });
  } catch (error) {
    return res.status(500).send({ message: error.message, isSuccess: false });
  }
};

export const deleteGallaryTitle = async (req, res) => {
  try {
    const { gallary_id } = req.query;

    const gallary = await gallaryTSchema.findById(gallary_id);
    if (!gallary) {
      return res.status(404).send({
        isSuccess: false,
        message: "Gallery Title not found",
      });
    }

    const gallaryCategory = await gallaryCategorySchema.find({ gallary_id });
    const gallaryCategoryIds = gallaryCategory.map((d) => d._id);

    const sectionResult = await gallaryISchema.deleteMany({
      gallaryCategoryId: { $in: gallaryCategoryIds },
    });

    console.log("Deleted gallary images:", sectionResult.deletedCount);

    const gallaryResult = await gallaryISchema.deleteMany({ gallary_id });

    console.log("Deleted gallary images:", gallaryResult.deletedCount);

    await gallaryTSchema.findByIdAndDelete(gallary_id);

    return res.status(200).send({
      isSuccess: true,
      message: "Gallery Title, its categories, and images deleted successfully",
    });
  } catch (error) {
    console.error("Error in deleteGalleryTitle:", error);
    return res.status(500).send({
      isSuccess: false,
      message: error.message,
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
    const { gallary_id } = req.body;
    const data = await gallaryTSchema
      .findById(gallary_id)
      .populate("gallaryCategory");
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
        const gallaryCategoryCount = await gallaryCategorySchema.countDocuments(
          {
            gallaryTitleId: item._id,
          }
        );
        return { ...item._doc, gallaryCategoryCount };
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

export const getDataBySlug = async (req, res) => {
  try {
    const { slug } = req.params;
    if (!slug) {
      return res.status(400).json({
        isSuccess: false,
        message: "Slug is required.",
      });
    }

    const gallaryTitle = await gallaryTSchema
      .findOne({ slug })
      .populate("gallaryCategory")
      .lean();

    if (!gallaryTitle) {
      return res.status(404).json({
        isSuccess: false,
        message: "Gallery Title not found.",
      });
    }

    return res.status(200).json({
      isSuccess: true,
      message: "Data fetched successfully.",
      data: gallaryTitle,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      isSuccess: false,
      message: error.message,
    });
  }
};
