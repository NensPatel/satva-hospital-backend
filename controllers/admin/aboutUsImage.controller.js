import aboutImageSchema from "../../models/admin/aboutUsImage.model.js";
import aboutTabSchema from "../../models/admin/aboutUsTabs.model.js";
import { deleteImage } from "../../helpers/common.js";

export const createAboutImage = async (req, res) => {
  try {
    const { sort_order_no, isActive } = req.body;

    const imageFile = req.files?.find((f) => f.fieldname === "about_img");
    const about_img = imageFile ? "aboutUs/" + imageFile.filename : "";

    const createObj = new aboutImageSchema({
      about_img,
      sort_order_no,
      isActive,
    });

    const saved = await createObj.save();

    return res.status(200).send({
      isSuccess: true,
      message: "About Us created successfully.",
      data: saved,
    });
  } catch (error) {
    return res.status(500).send({ message: error.message, isSuccess: false });
  }
};

export const updateAboutImage = async (req, res) => {
  try {
    const { about_id, sort_order_no, isActive } = req.body;

    const findData = await aboutImageSchema.findById(about_id);
    if (!findData) {
      return res
        .status(404)
        .send({ message: "Data not found!", isSuccess: false });
    }

    const imageFile = req.files?.find((f) => f.fieldname === "about_img");
    const about_img = imageFile ? "aboutUs/" + imageFile.filename : "";

    if (about_img && findData.about_img) {
      await deleteImage(findData.about_img);
    }

    const updateObj = {
      sort_order_no,
      isActive,
    };
    if (about_img) updateObj.about_img = about_img;

    const updated = await aboutImageSchema.findByIdAndUpdate(
      about_id,
      updateObj,
      {
        new: true,
      }
    );

    return res.status(200).send({
      isSuccess: true,
      message: "About Us updated successfully.",
      data: updated,
    });
  } catch (error) {
    return res.status(500).send({ message: error.message, isSuccess: false });
  }
};

export const deleteAboutImage = async (req, res) => {
  try {
    const about_id = req.query.about_id;
    const findData = await aboutImageSchema.findById(about_id);
    if (!findData) {
      return res
        .status(404)
        .send({ message: "Data not found!", isSuccess: false });
    }

    if (findData.about_img) {
      await deleteImage(findData.about_img);
    }

    await aboutImageSchema.findByIdAndDelete(about_id);

    return res.status(200).send({
      isSuccess: true,
      message: "Data deleted successfully.",
    });
  } catch (error) {
    return res.status(500).send({ message: error.message, isSuccess: false });
  }
};

export const getAllAboutImage = async (req, res) => {
  try {
    const getData = await aboutImageSchema.find().sort({ sort_order_no: 1 });
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
    const { about_id } = req.body;
    const getData = await aboutImageSchema.findById(about_id);
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

    const aboutImage = await aboutImageSchema
      .find()
      .sort({ sort_order_no: 1 })
      .skip(skip)
      .limit(limit);
    const totalRecords = await aboutImageSchema.countDocuments();

    const data = await Promise.all(
      aboutImage.map(async (item) => {
        const aboutTabCount = await aboutTabSchema.countDocuments({
          about_img_id: item._id,
        });
        return { ...item._doc, aboutTabCount };
      })
    );
    console.log(data);

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
    const lastSortOrderItem = await aboutImageSchema
      .findOne()
      .sort({ sort_order_no: -1 });
    return res.status(200).send({ isSuccess: true, data: lastSortOrderItem });
  } catch (error) {
    return res.status(500).send({ message: error.message, isSuccess: false });
  }
};
export const updateAboutIsActive = async (req, res) => {
  try {
    const about_id = req.params.id;
    const aboutImage = await aboutImageSchema.findById(about_id);
    if (!aboutImage) {
      return res
        .status(404)
        .send({ message: "about us not found", isSuccess: false });
    }
    aboutImage.isActive = !aboutImage.isActive;
    await aboutImage.save();
    return res.status(200).send({
      isSuccess: true,
      message: "Status updated successfully.",
      isActive: aboutImage.isActive,
    });
  } catch (error) {
    return res.status(500).send({ message: error.message, isSuccess: false });
  }
};
