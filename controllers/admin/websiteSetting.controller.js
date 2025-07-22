import WebsiteSetting from "../../models/admin/websiteSetting.model.js";
import { deleteImage } from "../../helpers/common.js";

export const createOrUpdateWebsiteSetting = async (req, res) => {
  try {
    const {
      companyName,
      cin,
      email,
      contact1,
      contact2,
      address1,
      address2,
      mapLink,
    } = req.body;

    const headerFile = req.files?.headerLogo?.[0];
    const footerFile = req.files?.footerLogo?.[0];

    let setting = await WebsiteSetting.findOne();

    if (!setting) {
      // Create new
      setting = new WebsiteSetting({
        companyName,
        cin,
        email,
        contactNo: [contact1, contact2],
        officeAddress: address1,
        factoryAddress: address2,
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
      // Update existing
      if (headerFile) {
        if (setting.logoHeader)
          await deleteImage("public/" + setting.logoHeader);
        setting.logoHeader = "websiteSetting/header/" + headerFile.filename;
      }
      if (footerFile) {
        if (setting.logoFooter)
          await deleteImage("public/" + setting.logoFooter);
        setting.logoFooter = "websiteSetting/footer/" + footerFile.filename;
      }

      setting.companyName = companyName;
      setting.cin = cin;
      setting.email = email;
      setting.contactNo = [contact1, contact2];
      setting.officeAddress = address1;
      setting.factoryAddress = address2;
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
