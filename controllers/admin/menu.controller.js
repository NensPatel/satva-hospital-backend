import menusSchema from "../../models/admin/menu.model.js";

export const createMenu = async (req, res) => {
  try {
    const {
      sort_order_no,
      menuType,
      menuName,
      menuURL,
      metaTitle,
      metakeyword,
      metaDescription,
      parentId,
      isActive,
    } = req.body;
    const checkExists = await menusSchema.findOne({ menuURL });
    if (checkExists) {
      return res.status(200).send({
        message: "Menu name already exists!",
        isSuccess: false,
      });
    }
    const createObj = {
      sort_order_no,
      menuType,
      menuName,
      menuURL,
      metaTitle,
      metakeyword,
      metaDescription,
      parentId,
      isActive,
    };
    const saveData = await menusSchema(createObj);
    await saveData
      .save()
      .then(async (data) => {
        return res.status(200).send({
          isSuccess: true,
          message: "Data created successfully.",
          data: data,
        });
      })
      .catch((error) => {
        return res.status(500).send({
          message: error.message,
          isSuccess: false,
        });
      });
  } catch (error) {
    return res.status(500).send({
      message: error.message,
      isSuccess: false,
    });
  }
};

export const updateMenu = async (req, res) => {
  try {
    const {
      menu_id,
      sort_order_no,
      menuType,
      menuName,
      menuURL,
      metaTitle,
      metakeyword,
      metaDescription,
      parentId,
      isActive,
    } = req.body;
    const findData = await menusSchema.findById(menu_id);
    if (!findData) {
      return res.status(200).send({
        message: "Data not found!",
        isSuccess: false,
      });
    }
    const updateObj = {
      sort_order_no,
      menuType,
      menuName,
      menuURL,
      metaTitle,
      metakeyword,
      metaDescription,
      parentId,
      isActive
    };
    await menusSchema
      .findByIdAndUpdate(menu_id, updateObj, { new: true })
      .then(async (data) => {
        return res.status(200).send({
          isSuccess: true,
          message: "Data updated successfully.",
        });
      })
      .catch((error) => {
        return res.status(500).send({
          message: error.message,
          isSuccess: false,
        });
      });
  } catch (error) {
    return res.status(500).send({
      message: error.message,
      isSuccess: false,
    });
  }
};

export const deleteMenu = async (req, res) => {
  try {
    const menu_id = req.body.menu_id;
    await menusSchema
      .findByIdAndDelete(menu_id)
      .then(async (data) => {
        if (!data) {
          return res
            .status(404)
            .send({ message: "Data not found!", isSuccess: false });
        }
        return res.status(200).send({
          isSuccess: true,
          message: "Data deleted successfully.",
        });
      })
      .catch((error) => {
        return res.status(500).send({
          message: error.message,
          isSuccess: false,
        });
      });
  } catch (error) {
    return res.status(500).send({
      message: error.message,
      isSuccess: false,
    });
  }
};

export const getAllMenu = async (req, res) => {
  try {
    const getData = await menusSchema
      .find({ menuType: { $ne: "SubMenu" } })
      .populate("parentId")
      .sort({
        sort_order_no: 1,
      });
    return res.status(200).send({
      isSuccess: true,
      message: "Data listing successfully.",
      data: getData,
    });
  } catch (error) {
    return res.status(500).send({
      message: error.message,
      isSuccess: false,
    });
  }
};

export const getDataById = async (req, res) => {
  try {
    const menu_id = req.body.menu_id;
    const getData = await menusSchema.findById(menu_id);
    return res.status(200).send({
      isSuccess: true,
      message: "Get data successfully.",
      data: getData,
    });
  } catch (error) {
    return res.status(500).send({
      message: error.message,
      isSuccess: false,
    });
  }
};

export const getPaginationData = async (req, res) => {
  try {
    let { page = 1, limit = 10 } = req.body;
    page = parseInt(page);
    limit = parseInt(limit);
    const skip = (page - 1) * limit;

    const getData = await menusSchema
      .find()
      .sort({ sort_order_no: 1 })
      .skip(skip)
      .limit(limit);
    const totalRecords = await menusSchema.countDocuments();

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

export const getPaginationParentData = async (req, res) => {
  try {
    let { page = 1, limit = 10 } = req.body;
    page = parseInt(page);
    limit = parseInt(limit);
    if (isNaN(page) || page < 1) page = 1;
    if (isNaN(limit) || limit < 1) limit = 10;
    const skip = (page - 1) * limit;
    const getData = await menusSchema
      .find({ parentId: null })
      .sort({ sort_order_no: 1 })
      .skip(skip)
      .limit(limit);
    const totalRecords = await menusSchema.countDocuments({ parentId: null });
    const data = await Promise.all(
      getData.map(async (menu) => {
        const subMenuCount = await menusSchema.countDocuments({
          parentId: menu._id,
        });
        menu.subMenuCount = subMenuCount;
        return menu;
      })
    );
    return res.status(200).send({
        
      isSuccess: true,
      currentPageNo: page,
      totalPages: Math.ceil(totalRecords / limit),
      totalRecords,
      message: "Data listing successfully.",
      data: data,
    });
  } catch (error) {
    return res.status(500).send({
      message: error.message,
      isSuccess: false,
    });
  }
};

export const getLastSrNo = async (req, res) => {
  try {
    const parentId = req.body.parentId;
    const lastSortOrderItem = await menusSchema
      .findOne({ parentId })
      .sort({ sort_order_no: -1 });
    return res.status(200).send({
      isSuccess: true,
      data: lastSortOrderItem,
    });
  } catch (error) {
    return res.status(500).send({
      message: error.message,
      isSuccess: false,
    });
  }
};

export const getLastParentSrNo = async (req, res) => {
  try {
    const lastSortOrderItem = await menusSchema
      .findOne({ parentId: null })
      .sort({ sort_order_no: -1 });
    return res.status(200).send({
      isSuccess: true,
      data: lastSortOrderItem,
    });
  } catch (error) {
    return res.status(500).send({
      message: error.message,
      isSuccess: false,
    });
  }
};
