import bannersSchema from "../../models/admin/banner.model.js";
import { deleteImage } from "../../helpers/common.js";

export const createBanner = async (req, res) => {
  try {
    const {
      sort_order_no,
      menuId,
      bannerType,
      bannerTitle,
      bannerLink,
      description,
      isActive,
    } = req.body;

    const desktopFile = req.files?.desktopImage?.[0];
    const mobileFile = req.files?.mobileImage?.[0];

    if (!desktopFile || !mobileFile) {
      return res.status(400).json({
        message: "Both desktop and mobile images are required.",
        isSuccess: false,
      });
    }

    const desktopImage = "public/banner/desktop/" + desktopFile.filename;
    const mobileImage = "public/banner/mobile/" + mobileFile.filename;

    const newBanner = new bannersSchema({
      sort_order_no,
      menuId,
      bannerType,
      bannerTitle,
      bannerLink,
      description,
      isActive,
      desktopImage,
      mobileImage,
    });

    await newBanner.save();

    return res.status(200).json({
      isSuccess: true,
      message: "Banner created successfully.",
      data: newBanner,
    });
  } catch (error) {
    return res.status(500).json({ message: error.message, isSuccess: false });
  }
};

export const updateBanner = async (req, res) => {
  try {
    const {
      banner_id,
      sort_order_no,
      menuId,
      bannerType,
      bannerTitle,
      bannerLink,
      description,
      isActive,
    } = req.body;

    const findData = await bannersSchema.findById(banner_id);
    if (!findData) {
      return res.status(404).json({ message: "Data not found!", isSuccess: false });
    }

    const updateObj = {
      sort_order_no,
      menuId,
      bannerType,
      bannerTitle,
      bannerLink,
      description,
      isActive,
    };

    const desktopFile = req.files?.desktopImage?.[0];
    if (desktopFile) {
      if (findData.desktopImage) await deleteImage(findData.desktopImage);
      updateObj.desktopImage = "public/banner/desktop/" + desktopFile.filename;
    }

    const mobileFile = req.files?.mobileImage?.[0];
    if (mobileFile) {
      if (findData.mobileImage) await deleteImage(findData.mobileImage);
      updateObj.mobileImage = "public/banner/mobile/" + mobileFile.filename;
    }

    const updated = await bannersSchema.findByIdAndUpdate(banner_id, updateObj, { new: true });

    return res.status(200).json({
      isSuccess: true,
      message: "Banner updated successfully.",
      data: updated,
    });
  } catch (error) {
    return res.status(500).json({ message: error.message, isSuccess: false });
  }
};


export const deleteBanner = async (req, res) => {
  try {
    const { banner_id } = req.body;

    const findData = await bannersSchema.findById(banner_id);
    if (!findData) {
      return res.status(404).json({ message: "Data not found!", isSuccess: false });
    }

    if (findData.desktopImage) await deleteImage(findData.desktopImage);
    if (findData.mobileImage) await deleteImage(findData.mobileImage);

    await bannersSchema.findByIdAndDelete(banner_id);

    return res.status(200).json({
      isSuccess: true,
      message: "Banner deleted successfully.",
    });
  } catch (error) {
    return res.status(500).json({ message: error.message, isSuccess: false });
  }
};

export const getAllBanners = async (req, res) => {
  try {
    const data = await bannersSchema.find().sort({ sort_order_no: 1 });
    return res.status(200).json({
      isSuccess: true,
      message: "Data listing successfully.",
      data,
    });
  } catch (error) {
    return res.status(500).json({ message: error.message, isSuccess: false });
  }
};

export const getDataById = async (req, res) => {
  try {
    const { banner_id } = req.body;
    const data = await bannersSchema.findById(banner_id);
    return res.status(200).json({
      isSuccess: true,
      message: "Get data successfully.",
      data,
    });
  } catch (error) {
    return res.status(500).json({ message: error.message, isSuccess: false });
  }
};

export const getPaginationData = async (req, res) => {
  try {
    let { page = 1, limit = 10 } = req.body;
    page = parseInt(page);
    limit = parseInt(limit);
    const skip = (page - 1) * limit;

    const data = await bannersSchema
      .find()
      .sort({ sort_order_no: 1 })
      .skip(skip)
      .limit(limit);
    const totalRecords = await bannersSchema.countDocuments();

    return res.status(200).json({
      isSuccess: true,
      currentPageNo: page,
      totalPages: Math.ceil(totalRecords / limit),
      totalRecords,
      message: "Data listing successfully.",
      data,
    });
  } catch (error) {
    return res.status(500).json({ message: error.message, isSuccess: false });
  }
};

export const getLastSrNo = async (req, res) => {
  try {
    const lastItem = await bannersSchema.findOne().sort({ sort_order_no: -1 });
    return res.status(200).json({
      isSuccess: true,
      data: lastItem,
    });
  } catch (error) {
    return res.status(500).json({ message: error.message, isSuccess: false });
  }
};
