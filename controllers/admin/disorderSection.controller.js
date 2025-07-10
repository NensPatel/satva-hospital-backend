import mongoose from "mongoose";
import disorderSectionsSchema from "../../models/admin/disorderSection.model.js"; 
import disordersSchema from "../../models/admin/disorder.model.js"; 
 

export const createDisorderSection = async (req, res) => {
  try {
    const { sort_order_no, title, content, disorder_id, isActive } = req.body;

    // Validate ObjectId
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

    const newDisorder = new disorderSectionsSchema({
      sort_order_no,
      title,
      content, 
      disorder_id,
      isActive: typeof isActive === "boolean" ? isActive : true,
    });

    const saved = await newDisorder.save();

    return res.status(200).send({
      isSuccess: true,
      message: "Data created successfully.",
      data: saved,
    });
  } catch (error) {
    return res.status(500).send({ message: error.message, isSuccess: false });
  }
};


export const updateDisorderSection = async (req, res) => {
  try {
    const { disorderSection_id, sort_order_no, title, content, disorder_id, isActive } = req.body;

    if (!mongoose.Types.ObjectId.isValid(disorderSection_id)) {
      return res.status(400).send({
        message: "Invalid disorderSection_id format.",
        isSuccess: false,
      });
    }

    const existingDisorder = await disorderSectionsSchema.findById(disorderSection_id);
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
    const { disorderSection_id } = req.body;
    if (!mongoose.Types.ObjectId.isValid(disorderSection_id)) {
      return res.status(400).send({
        message: "Invalid disorderSection_id format.",
        isSuccess: false,
      });
    }

    const deleted = await disorderSectionsSchema.findByIdAndDelete(disorderSection_id);
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
