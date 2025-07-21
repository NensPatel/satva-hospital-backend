import cashlessSchema from "../../models/admin/cashless.model.js";
import { deleteImage } from "../../helpers/common.js";

export const createCashlessFacility = async (req, res) => {
  try {
    const { sort_order_no, name, link, isActive } = req.body;
    const imageFile = req.files?.find((file) => file.fieldname === "logo");
    const logo = imageFile ? "public/cashlessFacility/" + imageFile.filename : "";

    const createObj = {
      sort_order_no,
      name,
      link,
      isActive,
    };

    if (logo) {
      createObj.logo = logo;
    }

    const saveData = new cashlessSchema(createObj);
    await saveData.save();

    return res.status(200).send({
      isSuccess: true,
      message: "Data created successfully.",
      data: saveData,
    });
  } catch (error) {
    return res.status(500).send({
      message: error.message,
      isSuccess: false,
    });
  }
};

export const updateCashlessFacility = async (req, res) => {
  try {
    const { cashless_id, sort_order_no, name, link, isActive } = req.body;
    const findData = await cashlessSchema.findById(cashless_id);
    if (!findData) {
      return res
        .status(404)
        .send({ message: "Data not found!", isSuccess: false });
    }

    const imageFile = req.files?.find((file) => file.fieldname === "logo");
    const logo = imageFile ? "public/cashlessFacility/" + imageFile.filename : "";

    const updateObj = {
      sort_order_no,
      name,
      link,
      isActive,
    };

    if (logo) {
      if (findData.logo) {
        let logoPath = findData.logo;
        if (!logoPath.startsWith("public/")) {
          logoPath = "public/" + logoPath;
        }
        await deleteImage(logoPath);
      }
      updateObj.logo = logo;
    }

    const updated = await cashlessSchema.findByIdAndUpdate(
      cashless_id,
      updateObj,
      { new: true }
    );

    return res.status(200).send({
      isSuccess: true,
      message: "Data updated successfully.",
      data: updated,
    });
  } catch (error) {
    return res.status(500).send({ message: error.message, isSuccess: false });
  }
};

export const deleteCashlessFacility = async (req, res) => {
  try {
   const cashless_id = req.query.cashless_id;
    const findData = await cashlessSchema.findById(cashless_id);
    if (!findData) {
      return res
        .status(404)
        .send({ message: "Data not found!", isSuccess: false });
    }

    if (findData.logo) {
      await deleteImage(findData.logo);
    }

    await cashlessSchema.findByIdAndDelete(cashless_id);

    return res.status(200).send({
      isSuccess: true,
      message: "Data deleted successfully.",
    });
  } catch (error) {
    return res.status(500).send({ message: error.message, isSuccess: false });
  }
};

export const getAllCashlessFacility = async (req, res) => {
  try {
    const getData = await cashlessSchema.find().sort({ sort_order_no: 1 });
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
    const { cashless_id } = req.body;
    const getData = await cashlessSchema.findById(cashless_id);
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

    const getData = await cashlessSchema
      .find()
      .sort({ sort_order_no: 1 })
      .skip(skip)
      .limit(limit);
    const totalRecords = await cashlessSchema.countDocuments();

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
    const lastSortOrderItem = await cashlessSchema
      .findOne()
      .sort({ sort_order_no: -1 });
    return res.status(200).send({ isSuccess: true, data: lastSortOrderItem });
  } catch (error) {
    return res.status(500).send({ message: error.message, isSuccess: false });
  }
};
export const updateCashlessFacilitiesIsActive = async (req, res) => {
  try {
    const cashless_id = req.params.id;
    const cashless = await cashlessSchema.findById(cashless_id);
    if (!cashless) {
      return res.status(404).send({ message: "Cashless facility not found", isSuccess: false });
    }
    cashless.isActive = !cashless.isActive;
    await cashless.save();
    return res.status(200).send({
      isSuccess: true,
      message: "Status updated successfully.",
      isActive: cashless.isActive,
    });
  } catch (error) {
    return res.status(500).send({ message: error.message, isSuccess: false });
  }
};
