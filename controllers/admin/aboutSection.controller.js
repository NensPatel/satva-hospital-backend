import aboutSectionSchema from "../../models/admin/aboutSection.model.js";
import { deleteImage } from "../../helpers/common.js";

export const createAboutSection = async (req, res) => {
  try {
    const { sort_order_no, title, content, isActive } = req.body;

    if (!req.files || !Array.isArray(req.files)) {
      return res.status(400).send({
        isSuccess: false,
        message: "No files uploaded",
      });
    }

    const imageFile = req.files.find((f) => f.fieldname === "about_img");
    if (!imageFile) {
      return res.status(400).send({
        isSuccess: false,
        message: "about_img file is required",
      });
    }

    const about_img = "aboutSection/" + imageFile.filename;

    const createObj = {
      sort_order_no,
      title,
      content,
      about_img,
      isActive,
    };

    const newAboutSection = await aboutSectionSchema.create(createObj);

    return res.status(200).send({
      isSuccess: true,
      message: "About Section created successfully.",
      data: newAboutSection,
    });
  } catch (error) {
    return res.status(500).send({
      message: error.message,
      isSuccess: false,
    });
  }
};

export const updateAboutSection = async (req, res) => {
  try {
    const { about_id, sort_order_no, title, content, isActive } = req.body;

    const findData = await aboutSectionSchema.findById(about_id);
    if (!findData) {
      return res.status(404).send({
        message: "About Section not found!",
        isSuccess: false,
      });
    }

    const imageFile = req.files?.find((f) => f.fieldname === "about_img");
    const about_img = imageFile ? "aboutSection/" + imageFile.filename : "";

    if (about_img && findData.about_img) {
      await deleteImage(findData.about_img);
    }

    const updateObj = {
      sort_order_no,
      title,
      content,
      isActive,
    };

    if (about_img) updateObj.about_img = about_img;

    await aboutSectionSchema.findByIdAndUpdate(about_id, updateObj, {
      new: true,
    });

    return res.status(200).send({
      isSuccess: true,
      message: "About Section updated successfully.",
    });
  } catch (error) {
    return res.status(500).send({
      message: error.message,
      isSuccess: false,
    });
  }
};

export const deleteAboutSection = async (req, res) => {
  try {
    const about_id = req.query.about_id;
    const findData = await aboutSectionSchema.findById(about_id);
    if (!findData) {
      return res.status(404).send({
        message: "About Section not found!",
        isSuccess: false,
      });
    }

    if (findData.about_img) {
      await deleteImage(findData.about_img);
    }

    await aboutSectionSchema.findByIdAndDelete(about_id);

    return res.status(200).send({
      isSuccess: true,
      message: "About Section deleted successfully.",
    });
  } catch (error) {
    return res.status(500).send({
      message: error.message,
      isSuccess: false,
    });
  }
};

export const getAllAboutSection = async (req, res) => {
  try {
    const getData = await aboutSectionSchema.find().sort({ sort_order_no: 1 });
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
    const { about_id } = req.body;
    const getData = await aboutSectionSchema.findById(about_id);
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

    const aboutSection = await aboutSectionSchema
      .find()
      .sort({ sort_order_no: 1 })
      .skip(skip)
      .limit(limit);
    const totalRecords = await aboutSectionSchema.countDocuments();

    // const data = await Promise.all(
    //   aboutSection.map(async (item) => {
    //     const aboutTabCount = await aboutTabSchema.countDocuments({
    //       about_section_id: item._id,
    //     });
    //     return { ...item._doc, aboutTabCount };
    //   })
    // );
    return res.status(200).send({
      isSuccess: true,
      currentPageNo: page,
      totalPages: Math.ceil(totalRecords / limit),
      totalRecords,
      message: "About Section listing successfully.",
      data: aboutSection,
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
    const lastSortOrderItem = await aboutSectionSchema
      .findOne()
      .sort({ sort_order_no: -1 });
    return res.status(200).send({ isSuccess: true, data: lastSortOrderItem });
  } catch (error) {
    return res.status(500).send({
      message: error.message,
      isSuccess: false,
    });
  }
};

export const updateAboutIsActive = async (req, res) => {
  try {
    const about_id = req.params.id;
    const aboutSection = await aboutSectionSchema.findById(about_id);
    if (!aboutSection) {
      return res
        .status(404)
        .send({ message: "about section not found", isSuccess: false });
    }
    aboutSection.isActive = !aboutSection.isActive;
    await aboutSection.save();
    return res.status(200).send({
      isSuccess: true,
      message: "Status updated successfully.",
      isActive: aboutSection.isActive,
    });
  } catch (error) {
    return res.status(500).send({ message: error.message, isSuccess: false });
  }
};

