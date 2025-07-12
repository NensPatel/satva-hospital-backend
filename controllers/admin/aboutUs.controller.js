import aboutSchema from "../../models/admin/aboutUs.model.js"; 
import { deleteImage } from "../../helpers/common.js";
 
export const createAbout = async (req, res) => {
  try {
    const { sort_order_no, title, content, isActive } = req.body;

    const imageFile = req.files?.find((file) => file.fieldname === "about_img");
    const about_img = imageFile ? "public/aboutUs/" + imageFile.filename : "";
   
    const createObj = new aboutSchema({
      sort_order_no,
      title,
      content, 
      isActive
    });

     if (about_img) {
      createObj.about_img = about_img;
    }

    const saveData = new aboutSchema(createObj);
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


export const updateAbout = async (req, res) => {
  try {
    const { about_id, sort_order_no, title, content, isActive } = req.body;

   const findData = await aboutSchema.findById(about_id);
    if (!findData) {
      return res
        .status(404)
        .send({ message: "Data not found!", isSuccess: false });
    }

    const imageFile = req.files?.find((file) => file.fieldname === "about_img");
    const about_img = imageFile ? "public/aboutUs/" + imageFile.filename : "";

    const updateObj = {
     sort_order_no,
      title,
      content, 
      isActive
    };

    if (about_img) {
      if (findData.about_img) {
        let about_imgPath = findData.about_img;
        if (!about_imgPath.startsWith("public/")) {
          about_imgPath = "public/" + about_imgPath;
        }
        await deleteImage(about_imgPath);
      }
      updateObj.about_img = about_img;
    }

    const updated = await aboutSchema.findByIdAndUpdate(
      about_id,
      updateObj,
      { new: true }
    );

    return res.status(200).send({
      isSuccess: true,
      message: "Data updated successfully.",
      data: updated,
    });

  } catch (error) {
    return res.status(500).send({
      message: error.message,
      isSuccess: false,
    });
  }
};

export const deleteAbout = async (req, res) => {
  try {
    const { about_id } = req.body;
    const findData = await aboutSchema.findById(about_id);
    if (!findData) {
      return res
        .status(404)
        .send({ message: "Data not found!", isSuccess: false });
    }

    if (findData.logo) {
      await deleteImage(findData.logo);
    }

    await aboutSchema.findByIdAndDelete(about_id);

    return res.status(200).send({
      isSuccess: true,
      message: "Data deleted successfully.",
    });
  } catch (error) {
    return res.status(500).send({ message: error.message, isSuccess: false });
  }
};

export const getAllAbout = async (req, res) => {
  try {
    const getData = await aboutSchema.find().sort({ sort_order_no: 1 });
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
    const getData = await aboutSchema.findById(about_id);
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

    const getData = await aboutSchema
      .find()
      .sort({ sort_order_no: 1 })
      .skip(skip)
      .limit(limit);
    const totalRecords = await aboutSchema.countDocuments();

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
    const lastSortOrderItem = await aboutSchema
      .findOne()
      .sort({ sort_order_no: -1 });
    return res.status(200).send({ isSuccess: true, data: lastSortOrderItem });
  } catch (error) {
    return res.status(500).send({ message: error.message, isSuccess: false });
  }
};
