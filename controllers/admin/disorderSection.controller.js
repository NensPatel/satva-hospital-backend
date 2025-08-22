import mongoose from "mongoose";
import disorderSectionsSchema from "../../models/admin/disorderSection.model.js";
import disordersSchema from "../../models/admin/disorder.model.js";

export const createDisorderSection = async (req, res) => {
  try {
    const { sort_order_no, title, content, disorder_id, isActive } = req.body;

    if (!mongoose.Types.ObjectId.isValid(disorder_id)) {
      return res.status(400).send({
        message: "Invalid disorder_id format.",
        isSuccess: false,
      });
    }

    const disorderExists = await disordersSchema.findById(disorder_id);
    if (!disorderExists) {
      return res.status(400).send({
        message: "No such Disorder exists.",
        isSuccess: false,
      });
    }

    const newSection = new disorderSectionsSchema({
      sort_order_no,
      title,
      content,
      disorder_id,
      isActive: typeof isActive === "boolean" ? isActive : true,
    });

    const savedSection = await newSection.save();

    await disordersSchema.findByIdAndUpdate(disorder_id, {
      $push: { disordersDetails: savedSection._id },
    });

    return res.status(200).send({
      isSuccess: true,
      message: "Data created successfully.",
      data: savedSection,
    });
  } catch (error) {
    return res.status(500).send({ message: error.message, isSuccess: false });
  }
};

export const updateDisorderSection = async (req, res) => {
  try {
    const {
      disorderSection_id,
      sort_order_no,
      title,
      content,
      disorder_id,
      isActive,
    } = req.body;

    if (!mongoose.Types.ObjectId.isValid(disorderSection_id)) {
      return res.status(400).send({
        message: "Invalid disorderSection_id format.",
        isSuccess: false,
      });
    }

    const existingDisorder = await disorderSectionsSchema.findById(
      disorderSection_id
    );
    if (!existingDisorder) {
      return res.status(404).send({
        message: "Disorder Section not found.",
        isSuccess: false,
      });
    }

    if (disorder_id && !mongoose.Types.ObjectId.isValid(disorder_id)) {
      return res.status(400).send({
        message: "Invalid disorder_id format.",
        isSuccess: false,
      });
    }

    const updateObj = {
      sort_order_no,
      title,
      content,
      isActive,
    };

    if (disorder_id) {
      updateObj.disorder_id = disorder_id;
    }

    const updatedDisorder = await disorderSectionsSchema.findByIdAndUpdate(
      disorderSection_id,
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

export const deleteDisorderSection = async (req, res) => {
  try {
    const disorderSection_id = req.query.disorderSection_id;
    if (!mongoose.Types.ObjectId.isValid(disorderSection_id)) {
      return res.status(400).send({
        message: "Invalid disorderSection_id format.",
        isSuccess: false,
      });
    }

    const deleted = await disorderSectionsSchema.findByIdAndDelete(
      disorderSection_id
    );
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

export const getAllDisorderSections = async (req, res) => {
  try {
    const data = await disorderSectionsSchema
      .find()
      .populate("disorder_id", "name")
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

export const getDataBySlug = async (req, res) => {
  try {
    const { slug } = req.params;

    if (!slug) {
      return res.status(400).json({ message: "Slug parameter is required" });
    }

    const disorderData = await disordersSchema
      .findOne({ slug, isActive: true })
      .populate({
        path: "disordersDetails",
        match: { isActive: true },
        options: { sort: { sort_order_no: 1 } },
        populate: { path: "disorder_id", select: "title slug" },
      })
      .populate({
        path: "speciality_id",
        select: "name slug"
      })
      .lean();

    if (!disorderData) {
      return res.status(404).json({ message: "Disorder not found" });
    }

    if (!Array.isArray(disorderData.disordersDetails)) {
      disorderData.disordersDetails = [];
    }

    return res.status(200).json({ data: disorderData });
  } catch (error) {
    console.error("Error in getDataBySlug:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const getDataById = async (req, res) => {
  try {
    const { disorderSection_id } = req.body;
    if (!mongoose.Types.ObjectId.isValid(disorderSection_id)) {
      return res.status(400).send({
        message: "Invalid disorderSection_id format.",
        isSuccess: false,
      });
    }

    const data = await disorderSectionsSchema
      .findById(disorderSection_id)
      .populate("disorder_id", "name");
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
      disorderSectionsSchema
        .find()
        .sort({ sort_order_no: 1 })
        .skip(skip)
        .limit(limit)
        .populate("disorder_id", "name"),
      disorderSectionsSchema.countDocuments(),
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
    const lastItem = await disorderSectionsSchema
      .findOne()
      .sort({ sort_order_no: -1 });
    return res.status(200).send({ isSuccess: true, data: lastItem });
  } catch (error) {
    return res.status(500).send({ message: error.message, isSuccess: false });
  }
};

export const updateDisorderSectionIsActive = async (req, res) => {
  try {
    const disorderSection_id = req.params.id;
    const disorderSection = await disorderSectionsSchema.findById(
      disorderSection_id
    );
    if (!disorderSection) {
      return res
        .status(404)
        .send({ message: "disorder section not found", isSuccess: false });
    }
    disorderSection.isActive = !disorderSection.isActive;
    await disorderSection.save();
    return res.status(200).send({
      isSuccess: true,
      message: "Status updated successfully.",
      isActive: disorderSection.isActive,
    });
  } catch (error) {
    return res.status(500).send({ message: error.message, isSuccess: false });
  }
};

export const updateDisorderSectionPosition = async (req, res) => {
  try {
    const { id, direction } = req.body;
    const currentItem = await disorderSectionsSchema.findById(id);
    if (!currentItem) {
      return res
        .status(404)
        .send({ message: "Disorder Section not found", isSuccess: false });
    }

    let swapItem;
    if (direction === "up") {
      swapItem = await disorderSectionsSchema
        .findOne({
          sort_order_no: { $lt: currentItem.sort_order_no },
          disorder_id: currentItem.disorder_id || null,
        })
        .sort({ sort_order_no: -1 });
    } else if (direction === "down") {
      swapItem = await disorderSectionsSchema
        .findOne({
          sort_order_no: { $gt: currentItem.sort_order_no },
          disorder_id: currentItem.disorder_id || null,
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

export const disorderSectionByDisorder = async (req, res) => {
  try {
    const { disorder_id } = req.params;
    let { page = 1, limit = 10 } = req.query;

    if (!disorder_id || !mongoose.Types.ObjectId.isValid(disorder_id)) {
      return res
        .status(400)
        .json({ isSuccess: false, message: "Valid disorder_id is required" });
    }

    page = parseInt(page);
    limit = parseInt(limit);
    const skip = (page - 1) * limit;

    const sections = await disorderSectionsSchema
      .find({ disorder_id: new mongoose.Types.ObjectId(disorder_id) })
      .sort({ sort_order_no: 1 })
      .skip(skip)
      .limit(limit);

    const totalCount = await disorderSectionsSchema.countDocuments({
      disorder_id: new mongoose.Types.ObjectId(disorder_id),
    });
    const totalPages = Math.ceil(totalCount / limit);

    return res.status(200).json({
      isSuccess: true,
      message: "Sections fetched successfully",
      data: sections,
      totalPages,
      totalCount,
    });
  } catch (error) {
    console.error("Error fetching sections:", error);
    return res.status(500).json({ isSuccess: false, message: "Server error" });
  }
};

export const getLastSrNoByDisorder = async (req, res) => {
  try {
    const { disorder_id } = req.params;

    if (!disorder_id) {
      return res.status(400).json({
        isSuccess: false,
        message: "disorder_id is required",
      });
    }

    const objectId = new mongoose.Types.ObjectId(disorder_id);

    const lastDetail = await disorderSectionsSchema
      .findOne({ disorder_id: objectId })
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
