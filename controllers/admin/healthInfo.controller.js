import healthSchema from "../../models/admin/healthInfo.model.js";
import { deleteImage } from "../../helpers/common.js";
import slugify from "slugify";

export const createHealthInfo = async (req, res) => {
  try {
    const { sort_order_no, title, content, author, publishedAt, isActive } = req.body;
    let { slug } = req.body;
    slug = slugify(slug || title, { lower: true, strict: true });

    const existing = await healthSchema.findOne({ slug });
    if (existing) {
      return res.status(400).send({
        message: "Slug already exists. Please use a unique slug.",
        isSuccess: false,
      });
    }

    const imageFile = req.files?.find((file) => file.fieldname === "blog_img");
    const blog_img = imageFile ? "healthInfo/" + imageFile.filename : "";

    const createObj = {
      sort_order_no,
      slug,
      title,
      content,
      author,
      publishedAt,
      isActive,
    };
    if (blog_img) {
      createObj.blog_img = blog_img;
    }

    const saveData = new healthSchema(createObj);
    await saveData.save();

    return res.status(200).send({
      isSuccess: true,
      message: "Data created successfully.",
      data: saveData,
    });
  } catch (error) {
    return res.status(500).send({ message: error.message, isSuccess: false });
  }
};


export const updateHealthInfo = async (req, res) => {
  try {
    const { info_id, sort_order_no, title, content, author, publishedAt, isActive } = req.body;
    let { slug } = req.body;

    if (!info_id) {
      return res.status(400).send({ message: "info_id is required.", isSuccess: false });
    }

    const existingData = await healthSchema.findById(info_id);
    if (!existingData) {
      return res.status(404).send({ message: "Data not found!", isSuccess: false });
    }

    slug = slugify(slug || title, { lower: true, strict: true });

    if (slug !== existingData.slug) {
      const existingSlug = await healthSchema.findOne({ slug });
      if (existingSlug) {
        return res.status(400).send({
          message: "Slug already exists. Please use a unique slug.",
          isSuccess: false,
        });
      }
    }

    const imageFile = req.files?.find((file) => file.fieldname === "blog_img");
    const blog_img = imageFile ? "healthInfo/" + imageFile.filename : "";

    const updateObj = {
      sort_order_no,
      slug,
      title,
      content,
      author,
      publishedAt,
      isActive,
    };

    if (imageFile && existingData.blog_img) {
      await deleteImage(existingData.blog_img);
    }
    if (imageFile) {
      updateObj.blog_img = "healthInfo/" + imageFile.filename;
    }


    const updated = await healthSchema.findByIdAndUpdate(info_id, updateObj, { new: true });

    return res.status(200).send({
      isSuccess: true,
      message: "Data updated successfully.",
      data: updated,
    });

  } catch (error) {
    return res.status(500).send({ message: error.message, isSuccess: false });
  }
};
export const deleteHealthInfo = async (req, res) => {
  try {
    const info_id = req.query.info_id;
    const findData = await healthSchema .findById(info_id);
    if (!findData) {
      return res
        .status(404)
        .send({ message: "Data not found!", isSuccess: false });
    }

    if (findData.blog_img) {
      await deleteImage(findData.blog_img);
    }

    await healthSchema .findByIdAndDelete(info_id);

    return res.status(200).send({
      isSuccess: true,
      message: "Data deleted successfully.",
    });
  } catch (error) {
    return res.status(500).send({ message: error.message, isSuccess: false });
  }
};

export const getAllHealthInfo = async (req, res) => {
  try {
    const getData = await healthSchema .find().sort({ sort_order_no: 1 });
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
    const { info_id } = req.body;
    const getData = await healthSchema .findById(info_id);
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

    const getData = await healthSchema 
      .find()
      .sort({ sort_order_no: 1 })
      .skip(skip)
      .limit(limit);
    const totalRecords = await healthSchema .countDocuments();

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
    const lastSortOrderItem = await healthSchema 
      .findOne()
      .sort({ sort_order_no: -1 });
    return res.status(200).send({ isSuccess: true, data: lastSortOrderItem });
  } catch (error) {
    return res.status(500).send({ message: error.message, isSuccess: false });
  }
};

export const updateHealthInfoIsActive = async (req, res) => {
  try {
    const info_id = req.params.id;
    const healthInfo = await healthSchema.findById(info_id);
    if (!healthInfo) {
      return res.status(404).send({ message: "healthInfo not found", isSuccess: false });
    }
    healthInfo.isActive = !healthInfo.isActive;
    await healthInfo.save();
    return res.status(200).send({
      isSuccess: true,
      message: "Status updated successfully.",
      isActive: healthInfo.isActive,
    });
  } catch (error) {
    return res.status(500).send({ message: error.message, isSuccess: false });
  }
};

export const getDataBySlug = async (req, res) => {
  try {
    const { slug } = req.body;
    const data = await healthSchema.findOne({ slug });
    return res.status(200).send({
      isSuccess: true,
      message: "Get data successfully.",
      data,
    });
  } catch (error) {
    return res.status(500).send({ message: error.message, isSuccess: false });
  }
};