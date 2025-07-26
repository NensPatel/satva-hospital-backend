import WebsiteSetting from "../../models/admin/websiteSetting.model.js";
import { deleteImage, parseSocialMediaField } from "../../helpers/common.js";

export const createOrUpdateWebsiteSetting = async (req, res) => {
  try {
    const {
      hospitalName,
      slogan,
      description,
      email1,
      email2,
      contact1,
      contact2,
      address,
      socialMedia,
      mapLink,
    } = req.body;

    const parsedSocialMedia = parseSocialMediaField(socialMedia, res);
    if (parsedSocialMedia === null) return;

    const headerFile = req.files?.headerLogo?.[0];
    const footerFile = req.files?.footerLogo?.[0];

    let setting = await WebsiteSetting.findOne();

    if (!setting) {
      // Create new
      setting = new WebsiteSetting({
        hospitalName,
        slogan,
        description,
        email1,
        email2,
        socialMedia: parsedSocialMedia,
        contact1,
        contact2,
        address,
        mapLink,
        logoHeader: headerFile
          ? "websiteSetting/header/" + headerFile.filename
          : null,
        logoFooter: footerFile
          ? "websiteSetting/footer/" + footerFile.filename
          : null,
      });
      await setting.save();
      return res.status(200).json({
        isSuccess: true,
        message: "Settings created successfully",
        data: setting,
      });
    } else {
      if (headerFile && setting.logoHeader) {
        await deleteImage(setting.logoHeader);
      }
      if (headerFile) {
        setting.logoHeader = "websiteSetting/header/" + headerFile.filename;
      }

      if (footerFile && setting.logoFooter) {
        await deleteImage(setting.logoFooter);
      }
      if (footerFile) {
        setting.logoFooter = "websiteSetting/footer/" + footerFile.filename;
      }

      setting.hospitalName = hospitalName;
      setting.slogan = slogan;
      setting.description = description;
      setting.email1 = email1;
      setting.email2 = email2;
      setting.contact1 = contact1;
      setting.contact2 = contact2;
      setting.socialMedia = parsedSocialMedia;
      setting.address = address;
      setting.mapLink = mapLink;

      await setting.save();
      return res.status(200).json({
        isSuccess: true,
        message: "Settings updated successfully",
        data: setting,
      });
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({ isSuccess: false, message: error.message });
  }
};

export const getWebsiteSetting = async (req, res) => {
  try {
    const data = await WebsiteSetting.findOne();
    return res.status(200).json({
      isSuccess: true,
      message: "Settings fetched successfully",
      data,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ isSuccess: false, message: error.message });
  }
};
