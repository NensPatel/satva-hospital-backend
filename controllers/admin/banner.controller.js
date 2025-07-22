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

    // Validate required files based on bannerType
    if (bannerType === "image") {
      if (!desktopFile || !desktopFile.mimetype.startsWith("image/") ||
          !mobileFile || !mobileFile.mimetype.startsWith("image/")) {
        return res.status(400).json({
          message: "Desktop and mobile images are required and must be images.",
          isSuccess: false,
        });
      }
    } else if (bannerType === "video") {
      if (!desktopFile || !desktopFile.mimetype.startsWith("video/") ||
          !mobileFile || !mobileFile.mimetype.startsWith("video/")) {
        return res.status(400).json({
          message: "Desktop and mobile videos are required and must be videos.",
          isSuccess: false,
        });
      }
    } else {
      return res.status(400).json({
        message: "Invalid banner type. Must be 'image' or 'video'.",
        isSuccess: false,
      });
    }

    const desktopPath = "public/banner/desktop/" + desktopFile.filename;
    const mobilePath = "public/banner/mobile/" + mobileFile.filename;

    const newBanner = new bannersSchema({
      sort_order_no,
      menuId,
      bannerType,
      bannerTitle,
      bannerLink,
      description,
      isActive,
      desktopImage: desktopPath,
      mobileImage: mobilePath,
    });

    await newBanner.save();

    return res.status(200).json({
      isSuccess: true,
      message: "Banner created successfully.",
      data: newBanner,
    });
  } catch (error) {
    console.error("Error in createBanner:", error);
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

    const desktopFile = req.files?.desktopImage?.[0];
    const mobileFile = req.files?.mobileImage?.[0];

    // Validate uploaded files based on bannerType
    if (bannerType === "image") {
      if ((desktopFile && !desktopFile.mimetype.startsWith("image/")) ||
          (mobileFile && !mobileFile.mimetype.startsWith("image/"))) {
        return res.status(400).json({
          message: "Uploaded files must be images.",
          isSuccess: false,
        });
      }
    } else if (bannerType === "video") {
      if ((desktopFile && !desktopFile.mimetype.startsWith("video/")) ||
          (mobileFile && !mobileFile.mimetype.startsWith("video/"))) {
        return res.status(400).json({
          message: "Uploaded files must be videos.",
          isSuccess: false,
        });
      }
    } else {
      return res.status(400).json({
        message: "Invalid banner type. Must be 'image' or 'video'.",
        isSuccess: false,
      });
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

    if (desktopFile) {
      if (findData.desktopImage) await deleteImage(findData.desktopImage);
      updateObj.desktopImage = "public/banner/desktop/" + desktopFile.filename;
    }

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
    console.error("Error in updateBanner:", error);
    return res.status(500).json({ message: error.message, isSuccess: false });
  }
};


export const deleteBanner = async (req, res) => {
  try {
      const banner_id = req.query.banner_id;

    const findData = await bannersSchema.findById(banner_id);
    if (!findData) {
      return res
        .status(404)
        .json({ message: "Data not found!", isSuccess: false });
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
      .populate("menuId", "menuName")
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

export const updateBannerIsActive = async (req, res) => {
  try {
    const banner_id = req.params.id;
    const banner = await bannersSchema.findById(banner_id);
    if (!banner) {
      return res
        .status(404)
        .send({ message: "Banner not found", isSuccess: false });
    }
    banner.isActive = !banner.isActive;
    await banner.save();
    return res.status(200).send({
      isSuccess: true,
      message: "Status updated successfully.",
      isActive: banner.isActive,
    });
  } catch (error) {
    return res.status(500).send({ message: error.message, isSuccess: false });
  }
};
