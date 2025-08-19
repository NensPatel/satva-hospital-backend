import mongoose from "mongoose";
import disordersSchema from "../../models/admin/disorder.model.js";
import specialitiesSchema from "../../models/admin/spciality.model.js";
import disorderSectionSchema from "../../models/admin/disorderSection.model.js";
import slugify from "slugify";

export const createDisorder = async (req, res) => {
  try {
    const { sort_order_no, name, slug, speciality_id, isActive } = req.body;

    if (!mongoose.Types.ObjectId.isValid(speciality_id)) {
      return res.status(400).send({ message: "Invalid speciality_id format.", isSuccess: false });
    }

    const specialityExists = await specialitiesSchema.findById(speciality_id);
    if (!specialityExists) {
      return res.status(400).send({ message: "Speciality not found.", isSuccess: false });
    }

    const cleanedSlug = slugify(slug || name, { lower: true, strict: true });
    const existingSlug = await disordersSchema.findOne({ slug: cleanedSlug });
    if (existingSlug) {
      return res.status(400).send({ message: "Slug already exists.", isSuccess: false });
    }

    const newDisorder = new disordersSchema({
      sort_order_no,
      name,
      slug: cleanedSlug,
      speciality_id,
      isActive: typeof isActive === "boolean" ? isActive : true,
      disordersDetails: []
    });

    await newDisorder.save();

    await specialitiesSchema.findByIdAndUpdate(
      speciality_id,
      { $push: { disorders: newDisorder._id } }
    );

    const linkedSections = await disorderSectionSchema.find({
      disorder_id: newDisorder._id
    });

    newDisorder.disordersDetails = linkedSections.map(d => d._id);
    await newDisorder.save();

    const populated = await disordersSchema
      .findById(newDisorder._id)
      .populate("disordersDetails")
      .populate("speciality_id", "title");

    return res.status(200).send({
      isSuccess: true,
      message: "Disorder created successfully.",
      data: populated
    });
  } catch (error) {
    return res.status(500).send({ message: error.message, isSuccess: false });
  }
};

export const updateDisorder = async (req, res) => {
  try {
    const { disorder_id, sort_order_no, name, slug, speciality_id, isActive } =
      req.body;

    if (!mongoose.Types.ObjectId.isValid(disorder_id)) {
      return res
        .status(400)
        .send({ message: "Invalid disorder_id format.", isSuccess: false });
    }

    const existing = await disordersSchema.findById(disorder_id);
    if (!existing) {
      return res
        .status(404)
        .send({ message: "Disorder not found.", isSuccess: false });
    }

    if (speciality_id && !mongoose.Types.ObjectId.isValid(speciality_id)) {
      return res
        .status(400)
        .send({ message: "Invalid speciality_id format.", isSuccess: false });
    }

    const cleanedSlug = slugify(slug || name, { lower: true, strict: true });
    const duplicate = await disordersSchema.findOne({
      slug: cleanedSlug,
      _id: { $ne: disorder_id },
    });
    if (duplicate) {
      return res
        .status(400)
        .send({ message: "Slug already in use.", isSuccess: false });
    }

    const updateObj = {
      sort_order_no,
      name,
      slug: cleanedSlug,
      isActive,
    };
    if (speciality_id) updateObj.speciality_id = speciality_id;

    // Update disorder
    const updated = await disordersSchema.findByIdAndUpdate(
      disorder_id,
      updateObj,
      { new: true }
    );

    // Find disorder sections linked to this disorder
    const linkedSections = await disorderSectionSchema.find({
      disorder_id: updated._id,
    });

    updated.disordersDetails = linkedSections.map((d) => d._id);
    await updated.save();

    // Populate before sending back
    const populated = await disordersSchema
      .findById(updated._id)
      .populate("disordersDetails")
      .populate("speciality_id", "title");

    return res.status(200).send({
      isSuccess: true,
      message: "Disorder updated successfully.",
      data: populated,
    });
  } catch (error) {
    return res.status(500).send({ message: error.message, isSuccess: false });
  }
};

export const deleteDisorder = async (req, res) => {
  try {
    const disorder_id = req.query.disorder_id;
    if (!mongoose.Types.ObjectId.isValid(disorder_id)) {
      return res.status(400).send({
        message: "Invalid disorder_id format.",
        isSuccess: false,
      });
    }

    const deleted = await disordersSchema.findByIdAndDelete(disorder_id);
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

export const getAllDisorders = async (req, res) => {
  try {
    const data = await disordersSchema
      .find()
      .populate("speciality_id", "title")
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
    const { disorder_id } = req.body;
    if (!mongoose.Types.ObjectId.isValid(disorder_id)) {
      return res.status(400).send({
        message: "Invalid disorder_id format.",
        isSuccess: false,
      });
    }

    const data = await disordersSchema
      .findById(disorder_id)
      .populate("speciality_id", "title");
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
      disordersSchema
        .find()
        .sort({ sort_order_no: 1 })
        .skip(skip)
        .limit(limit)
        .populate("speciality_id", "title"),
      disordersSchema.countDocuments(),
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
    const lastItem = await disordersSchema
      .findOne()
      .sort({ sort_order_no: -1 });
    return res.status(200).send({ isSuccess: true, data: lastItem });
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

    const disorder = await disordersSchema
      .findOne({ slug })
      .populate("disordersDetails")
      .lean();

    if (!disorder) {
      return res.status(404).json({
        isSuccess: false,
        message: "Disorder not found.",
      });
    }

    return res.status(200).json({
      isSuccess: true,
      message: "Data fetched successfully.",
      data: disorder,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      isSuccess: false,
      message: error.message,
    });
  }
};

export const listDisordersBySpeciality = async (req, res) => {
  try {
    const { speciality_id } = req.params;
    let { page = 1, limit = 10 } = req.query;

    page = parseInt(page);
    limit = parseInt(limit);

    if (isNaN(page) || page < 1) page = 1;
    if (isNaN(limit) || limit < 1) limit = 10;

    const skip = (page - 1) * limit;

    // Find disorders by speciality
    const disorders = await disordersSchema
      .find({ speciality_id: new mongoose.Types.ObjectId(speciality_id) })
      .populate() // populate the details
      .sort({ sort_order_no: 1 })
      .skip(skip)
      .limit(limit);

    const totalRecords = await disordersSchema.countDocuments({
      speciality_id: new mongoose.Types.ObjectId(speciality_id),
    });

    // Add disorderDetailsCount for each disorder
    const data = await Promise.all(
      disorders.map(async (disorder) => {
        const disorderDetailsCount = await disorderSectionSchema.countDocuments(
          { disorder_id: disorder._id }
        );
        return { ...disorder._doc, disorderDetailsCount };
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

export const updateDisorderIsActive = async (req, res) => {
  try {
    const disorder_id = req.params.id;
    const disorder = await disordersSchema.findById(disorder_id);
    if (!disorder) {
      return res
        .status(404)
        .send({ message: "disorder not found", isSuccess: false });
    }
    disorder.isActive = !disorder.isActive;
    await disorder.save();
    return res.status(200).send({
      isSuccess: true,
      message: "Status updated successfully.",
      isActive: disorder.isActive,
    });
  } catch (error) {
    return res.status(500).send({ message: error.message, isSuccess: false });
  }
};

export const updateDisorderPosition = async (req, res) => {
  try {
    const { id, direction } = req.body;
    const currentItem = await disordersSchema.findById(id);
    if (!currentItem) {
      return res
        .status(404)
        .send({ message: "Disorder not found", isSuccess: false });
    }

    let swapItem;
    if (direction === "up") {
      swapItem = await disordersSchema
        .findOne({
          sort_order_no: { $lt: currentItem.sort_order_no },
          speciality_id: currentItem.speciality_id || null,
        })
        .sort({ sort_order_no: -1 });
    } else if (direction === "down") {
      swapItem = await disordersSchema
        .findOne({
          sort_order_no: { $gt: currentItem.sort_order_no },
          speciality_id: currentItem.speciality_id || null,
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

export const getLastSrNoBySpeciality = async (req, res) => {
  try {
    const { speciality_id } = req.params;

    if (!speciality_id) {
      return res.status(400).json({
        isSuccess: false,
        message: "speciality_id is required",
      });
    }

    const objectId = new mongoose.Types.ObjectId(speciality_id);

    const lastDetail = await disordersSchema
      .findOne({ speciality_id: objectId })
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
