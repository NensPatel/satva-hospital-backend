import homeBannersSchema from "../../models/admin/homePageBanner.model.js";
import { deleteImage } from "../../helpers/common.js";

// Create Banner
export const createHomeBanner = async (req, res) => {
  try {
    const {
      sort_order_no,
      homeBannerType,
      homeBannerTitle,
      homeBannerLink,
      description,
      isActive,
    } = req.body;

    const desktopFile = req.files?.desktopImageHome?.[0];
    const mobileFile = req.files?.mobileImageHome?.[0];

    // Validate file type
    if (homeBannerType === "image") {
      if (
        (desktopFile && !desktopFile.mimetype.startsWith("image/")) ||
        (mobileFile && !mobileFile.mimetype.startsWith("image/"))
      ) {
        return res.status(400).json({
          message: "Desktop and Mobile file must be an image.",
          isSuccess: false,
        });
      }
    } else if (homeBannerType === "video") {
      if (
        (desktopFile && !desktopFile.mimetype.startsWith("video/")) ||
        (mobileFile && !mobileFile.mimetype.startsWith("video/"))
      ) {
        return res.status(400).json({
          message: "Desktop and Mobile file must be a video.",
          isSuccess: false,
        });
      }
    } else {
      return res.status(400).json({
        message: "Invalid banner type. Must be 'image' or 'video'.",
        isSuccess: false,
      });
    }

    const desktopPath = desktopFile ? "homePageBanner/desktop/" + desktopFile.filename : null;
    const mobilePath = mobileFile ? "homePageBanner/mobile/" + mobileFile.filename : null;

    const newBanner = new homeBannersSchema({
      sort_order_no,
      homeBannerType,
      homeBannerTitle,
      homeBannerLink,
      description,
      isActive,
      desktopImageHome: desktopPath,
      mobileImageHome: mobilePath,
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


// Update Banner
export const updateHomeBanner = async (req, res) => {
  try {
    const {
      home_banner_id,
      sort_order_no,
      homeBannerType,
      homeBannerTitle,
      homeBannerLink,
      description,
      isActive,
    } = req.body;

    const findData = await homeBannersSchema.findById(home_banner_id);
    if (!findData) {
      return res.status(404).json({ message: "Data not found!", isSuccess: false });
    }

    const desktopFile = req.files?.desktopImageHome?.[0];
    const mobileFile = req.files?.mobileImageHome?.[0];

    // Validate file type
    if (homeBannerType === "image") {
      if (
        (desktopFile && !desktopFile.mimetype.startsWith("image/")) ||
        (mobileFile && !mobileFile.mimetype.startsWith("image/"))
      ) {
        return res.status(400).json({ message: "Uploaded files must be images.", isSuccess: false });
      }
    } else if (homeBannerType === "video") {
      if (
        (desktopFile && !desktopFile.mimetype.startsWith("video/")) ||
        (mobileFile && !mobileFile.mimetype.startsWith("video/"))
      ) {
        return res.status(400).json({ message: "Uploaded files must be videos.", isSuccess: false });
      }
    }

    const updateObj = {
      sort_order_no,
      homeBannerType,
      homeBannerTitle,
      homeBannerLink,
      description,
      isActive,
      desktopImageHome: desktopFile
        ? "homePageBanner/desktop/" + desktopFile.filename
        : findData.desktopImageHome,
      mobileImageHome: mobileFile
        ? "homePageBanner/mobile/" + mobileFile.filename
        : findData.mobileImageHome,
    };

    const updated = await homeBannersSchema.findByIdAndUpdate(home_banner_id, updateObj, {
      new: true,
    });

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


// Delete Banner
export const deleteHomeBanner = async (req, res) => {
  try {
    const home_banner_id = req.query.home_banner_id;

    const findData = await homeBannersSchema.findById(home_banner_id);
    if (!findData) {
      return res.status(404).json({ message: "Data not found!", isSuccess: false });
    }

    // Delete images from storage
    if (findData.desktopImageHome?.length) {
      for (let imgPath of findData.desktopImageHome) {
        await deleteImage(imgPath);
      }
    }
    if (findData.mobileImageHome?.length) {
      for (let imgPath of findData.mobileImageHome) {
        await deleteImage(imgPath);
      }
    }

    await homeBannersSchema.findByIdAndDelete(home_banner_id);

    return res.status(200).json({
      isSuccess: true,
      message: "Banner deleted successfully.",
    });
  } catch (error) {
    return res.status(500).json({ message: error.message, isSuccess: false });
  }
};

// Get All
export const getAllHomeBanner = async (req, res) => {
  try {
    const data = await homeBannersSchema.find().sort({ sort_order_no: 1 });
    return res.status(200).json({
      isSuccess: true,
      message: "Data listing successfully.",
      data,
    });
  } catch (error) {
    return res.status(500).json({ message: error.message, isSuccess: false });
  }
};

// Get by ID
export const getDataById = async (req, res) => {
  try {
    const { home_banner_id } = req.body;
    const data = await homeBannersSchema.findById(home_banner_id);
    return res.status(200).json({
      isSuccess: true,
      message: "Get data successfully.",
      data,
    });
  } catch (error) {
    return res.status(500).json({ message: error.message, isSuccess: false });
  }
};

// Pagination
export const getPaginationData = async (req, res) => {
  try {
    let { page = 1, limit = 10 } = req.body;
    page = parseInt(page);
    limit = parseInt(limit);
    const skip = (page - 1) * limit;

    const data = await homeBannersSchema
      .find()
      .sort({ sort_order_no: 1 })
      .skip(skip)
      .limit(limit);

    const totalRecords = await homeBannersSchema.countDocuments();

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

// Last Sr No
export const getLastSrNo = async (req, res) => {
  try {
    const lastItem = await homeBannersSchema.findOne().sort({ sort_order_no: -1 });
    return res.status(200).json({
      isSuccess: true,
      data: lastItem,
    });
  } catch (error) {
    return res.status(500).json({ message: error.message, isSuccess: false });
  }
};

// Toggle Active/Inactive
export const updateHomeBannerIsActive = async (req, res) => {
  try {
    const home_banner_id = req.params.id;
    const Homebanner = await homeBannersSchema.findById(home_banner_id);
    if (!Homebanner) {
      return res
        .status(404)
        .send({ message: "Home Banner not found", isSuccess: false });
    }
    Homebanner.isActive = !Homebanner.isActive;
    await Homebanner.save();
    return res.status(200).send({
      isSuccess: true,
      message: "Status updated successfully.",
      isActive: Homebanner.isActive,
    });
  } catch (error) {
    return res.status(500).send({ message: error.message, isSuccess: false });
  }
};

