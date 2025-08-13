import homeBannersSchema from "../../models/admin/homePageBanner.model.js";
import { deleteImage } from "../../helpers/common.js";

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

    const desktopFiles = req.files?.desktopImageHome || [];
    const mobileFiles = req.files?.mobileImageHome || [];

    if (homeBannerType === "image") {
      if (
        desktopFiles.some(f => !f.mimetype.startsWith("image/")) ||
        mobileFiles.some(f => !f.mimetype.startsWith("image/"))
      ) {
        return res.status(400).json({
          message: "All desktop and mobile files must be images.",
          isSuccess: false,
        });
      }
    } else if (homeBannerType === "video") {
      if (
        desktopFiles.some(f => !f.mimetype.startsWith("video/")) ||
        mobileFiles.some(f => !f.mimetype.startsWith("video/"))
      ) {
        return res.status(400).json({
          message: "All desktop and mobile files must be videos.",
          isSuccess: false,
        });
      }
    } else {
      return res.status(400).json({
        message: "Invalid banner type. Must be 'image' or 'video'.",
        isSuccess: false,
      });
    }

    const desktopPaths = desktopFiles.map(f => "homePageBanner/desktop/" + f.filename);
    const mobilePaths = mobileFiles.map(f => "homePageBanner/mobile/" + f.filename);

    const newBanner = new homeBannersSchema({
      sort_order_no,
      homeBannerType,
      homeBannerTitle,
      homeBannerLink,
      description,
      isActive,
      desktopImageHome: desktopPaths,
      mobileImageHome: mobilePaths,
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
      removeDesktopImages = [], // optional: list of images to delete
      removeMobileImages = []
    } = req.body;

    const findData = await homeBannersSchema.findById(home_banner_id);
    if (!findData) {
      return res.status(404).json({ message: "Data not found!", isSuccess: false });
    }

    const desktopFiles = req.files?.desktopImageHome || [];
    const mobileFiles = req.files?.mobileImageHome || [];

    // File type validation
    if (homeBannerType === "image") {
      if (desktopFiles.some(f => !f.mimetype.startsWith("image/")) ||
          mobileFiles.some(f => !f.mimetype.startsWith("image/"))) {
        return res.status(400).json({ message: "Uploaded files must be images.", isSuccess: false });
      }
    } else if (homeBannerType === "video") {
      if (desktopFiles.some(f => !f.mimetype.startsWith("video/")) ||
          mobileFiles.some(f => !f.mimetype.startsWith("video/"))) {
        return res.status(400).json({ message: "Uploaded files must be videos.", isSuccess: false });
      }
    } else {
      return res.status(400).json({ message: "Invalid banner type. Must be 'image' or 'video'.", isSuccess: false });
    }

    // Handle image removals
    let updatedDesktopImages = findData.desktopImageHome.filter(img => !removeDesktopImages.includes(img));
    let updatedMobileImages = findData.mobileImageHome.filter(img => !removeMobileImages.includes(img));

    // Delete removed images from storage
    for (let imgPath of removeDesktopImages) {
      await deleteImage(imgPath);
    }
    for (let imgPath of removeMobileImages) {
      await deleteImage(imgPath);
    }

    // Add new images
    updatedDesktopImages = [
      ...updatedDesktopImages,
      ...desktopFiles.map(f => "homePageBanner/desktop/" + f.filename)
    ];
    updatedMobileImages = [
      ...updatedMobileImages,
      ...mobileFiles.map(f => "homePageBanner/mobile/" + f.filename)
    ];

    const updateObj = {
      sort_order_no,
      homeBannerType,
      homeBannerTitle,
      homeBannerLink,
      description,
      isActive,
      desktopImageHome: updatedDesktopImages,
      mobileImageHome: updatedMobileImages
    };

    const updated = await homeBannersSchema.findByIdAndUpdate(
      home_banner_id,
      updateObj,
      { new: true }
    );

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



export const deleteHomeBanner = async (req, res) => {
  try {
    const home_banner_id = req.query.home_banner_id;

    const findData = await homeBannersSchema.findById(home_banner_id);
    if (!findData) {
      return res.status(404).json({ message: "Data not found!", isSuccess: false });
    }

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

export const getPaginationData = async (req, res) => {
  try {
    let { page = 1, limit = 10 } = req.body;
    page = parseInt(page);
    limit = parseInt(limit);
    const skip = (page - 1) * limit;

    const data = await homeBannersSchema
      .find()
      .populate()
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
