import menusSchema from "../../models/admin/menu.model.js";

// Create Menu
export const createMenu = async (req, res) => {
  try {
    const {
      position,
      menuName,
      menuUrl,
      metaTitle,
      metaKeywords,
      metaDescription,
      showInHeader,
      showInFooter,
      isActive,
      parentId,
    } = req.body;

    const checkExists = await menusSchema.findOne({ menuUrl });
    if (checkExists) {
      return res.status(200).send({
        message: "Menu URL already exists!",
        isSuccess: false,
      });
    }

    const createObj = {
      position,
      menuName,
      menuUrl,
      metaTitle,
      metaKeywords,
      metaDescription,
      showInHeader,
      showInFooter,
      isActive,
      parentId,
    };

    const newMenu = await menusSchema.create(createObj);

    return res.status(200).send({
      isSuccess: true,
      message: "Menu created successfully.",
      data: newMenu,
    });
  } catch (error) {
    return res.status(500).send({
      message: error.message,
      isSuccess: false,
    });
  }
};

// Update Menu
export const updateMenu = async (req, res) => {
  try {
    const menu_id = req.body.menu_id;
    const {
      position,
      menuName,
      menuUrl,
      metaTitle,
      metaKeywords,
      metaDescription,
      showInHeader,
      showInFooter,
      isActive,
      parentId,
    } = req.body;

    const findData = await menusSchema.findById(menu_id);
    if (!findData) {
      return res.status(404).send({
        message: "Menu not found!",
        isSuccess: false,
      });
    }

    const updateObj = {
      position,
      menuName,
      menuUrl,
      metaTitle,
      metaKeywords,
      metaDescription,
      showInHeader,
      showInFooter,
      isActive,
      parentId,
    };

    await menusSchema.findByIdAndUpdate(menu_id, updateObj, { new: true });

    return res.status(200).send({
      isSuccess: true,
      message: "Menu updated successfully.",
    });
  } catch (error) {
    return res.status(500).send({
      message: error.message,
      isSuccess: false,
    });
  }
};

// Delete Menu
export const deleteMenu = async (req, res) => {
  try {
    const menu_id = req.query.menu_id;
    const deleted = await menusSchema.findByIdAndDelete(menu_id);
    if (!deleted) {
      return res
        .status(404)
        .send({ message: "Menu not found!", isSuccess: false });
    }
    return res.status(200).send({
      isSuccess: true,
      message: "Menu deleted successfully.",
    });
  } catch (error) {
    return res.status(500).send({
      message: error.message,
      isSuccess: false,
    });
  }
};

// Get All Menu (without pagination)
export const getAllMenu = async (req, res) => {
  try {
    const parents = await menusSchema
      .find({ parentId: null, isActive: true, showInHeader: true })
      .sort({ position: 1 })
      .lean();

    const parentsWithSubmenus = await Promise.all(
      parents.map(async (parent) => {
        const subMenus = await menusSchema
          .find({ parentId: parent._id, isActive: true, showInHeader: true })
          .sort({ position: 1 })
          .lean();

        return {
          ...parent,
          subMenu: subMenus,
          subMenuCount: subMenus.length,
        };
      })
    );

    return res.status(200).send({
      isSuccess: true,
      message: "Data listing successfully.",
      data: parentsWithSubmenus,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).send({
      message: error.message,
      isSuccess: false,
    });
  }
};

// Get Menu by ID
export const getDataById = async (req, res) => {
  try {
    const menu_id = req.body.menu_id;
    const menu = await menusSchema.findById(menu_id);
    return res.status(200).send({
      isSuccess: true,
      message: "Menu fetched successfully.",
      data: menu,
    });
  } catch (error) {
    return res.status(500).send({
      message: error.message,
      isSuccess: false,
    });
  }
};

// Get paginated submenus by parentId
export const getPaginationMenus = async (req, res) => {
  try {
    let { page = 1, limit = 10, parentId } = req.body;
    page = parseInt(page);
    limit = parseInt(limit);
    const skip = (page - 1) * limit;

    if (typeof parentId === "undefined") {
      return res.status(400).send({
        isSuccess: false,
        message: "parentId is required",
      });
    }

    const submenus = await menusSchema
      .find({ parentId })
      .sort({ position: 1 })
      .skip(skip)
      .limit(limit);

    const totalRecords = await menusSchema.countDocuments({ parentId });

    return res.status(200).send({
      isSuccess: true,
      currentPageNo: page,
      totalPages: Math.ceil(totalRecords / limit),
      totalRecords,
      message: "Submenu list fetched successfully.",
      data: submenus,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).send({ message: error.message, isSuccess: false });
  }
};

// Get Parent Menus with Pagination & subMenuCount
export const getPaginationParentData = async (req, res) => {
  try {
    let { page = 1, limit = 10 } = req.body;
    page = parseInt(page);
    limit = parseInt(limit);
    const skip = (page - 1) * limit;

    const parentMenus = await menusSchema
      .find({ parentId: null })
      .sort({ position: 1 })
      .skip(skip)
      .limit(limit);

    const totalRecords = await menusSchema.countDocuments({ parentId: null });

    const data = await Promise.all(
      parentMenus.map(async (menu) => {
        const subMenuCount = await menusSchema.countDocuments({
          parentId: menu._id,
        });
        return { ...menu._doc, subMenuCount };
      })
    );

    return res.status(200).send({
      isSuccess: true,
      currentPageNo: page,
      totalPages: Math.ceil(totalRecords / limit),
      totalRecords,
      message: "Menu list fetched successfully.",
      data,
    });
  } catch (error) {
    return res.status(500).send({ message: error.message, isSuccess: false });
  }
};

// Update isActive toggle
export const updateMenuIsActive = async (req, res) => {
  try {
    const menu_id = req.params.id;
    const menu = await menusSchema.findById(menu_id);
    if (!menu) {
      return res
        .status(404)
        .send({ message: "Menu not found", isSuccess: false });
    }
    menu.isActive = !menu.isActive;
    await menu.save();
    return res.status(200).send({
      isSuccess: true,
      message: "Status updated successfully.",
      isActive: menu.isActive,
    });
  } catch (error) {
    return res.status(500).send({ message: error.message, isSuccess: false });
  }
};

export const updateSubMenuIsActive = async (req, res) => {
  try {
    const menu_id = req.params.id;
    const menu = await menusSchema.findById(menu_id);
    if (!menu) {
      return res
        .status(404)
        .send({ message: "Menu not found", isSuccess: false });
    }
    menu.isActive = !menu.isActive;
    await menu.save();
    return res.status(200).send({
      isSuccess: true,
      message: "Status updated successfully.",
      isActive: menu.isActive,
    });
  } catch (error) {
    return res.status(500).send({ message: error.message, isSuccess: false });
  }
};

// Update Menu Position
export const updateMenuPosition = async (req, res) => {
  try {
    const { id, direction } = req.body;
    const currentItem = await menusSchema.findById(id);
    if (!currentItem) {
      return res
        .status(404)
        .send({ message: "Menu not found", isSuccess: false });
    }

    let swapItem;
    if (direction === "up") {
      swapItem = await menusSchema
        .findOne({
          position: { $lt: currentItem.position },
          parentId: currentItem.parentId || null,
        })
        .sort({ position: -1 });
    } else if (direction === "down") {
      swapItem = await menusSchema
        .findOne({
          position: { $gt: currentItem.position },
          parentId: currentItem.parentId || null,
        })
        .sort({ position: 1 });
    } else {
      return res
        .status(400)
        .send({ message: "Invalid direction", isSuccess: false });
    }

    if (!swapItem) {
      return res.status(200).send({
        isSuccess: false,
        message: "Cannot move further",
      });
    }

    const temp = currentItem.position;
    currentItem.position = swapItem.position;
    swapItem.position = temp;

    await currentItem.save();
    await swapItem.save();

    return res.status(200).send({
      isSuccess: true,
      message: "Position updated successfully.",
    });
  } catch (error) {
    return res.status(500).send({ message: error.message, isSuccess: false });
  }
};

// Get all menus without pagination
export const getMenuWithoutPagination = async (req, res) => {
  try {
    const menus = await menusSchema
      .find()
      .select("_id parentId menuName position");
    return res.status(200).send({
      isSuccess: true,
      data: menus,
    });
  } catch (error) {
    return res.status(500).send({
      isSuccess: false,
      message: error.message,
    });
  }
};

export const getLastSrNo = async (req, res) => {
  try {
    const lastSortOrderItem = await menusSchema
      .findOne()
      .sort({ position: -1 });
    return res.status(200).send({ isSuccess: true, data: lastSortOrderItem });
  } catch (error) {
    return res.status(500).send({ message: error.message, isSuccess: false });
  }
};

export const getMenusByParentId = async (req, res) => {
  try {
    const { parentId } = req.body;

    if (!parentId) {
      return res.status(400).send({
        isSuccess: false,
        message: "parentId is required",
      });
    }

    const subMenus = await menusSchema.find({ parentId }).sort({ position: 1 });

    return res.status(200).send({
      isSuccess: true,
      message: "Submenus fetched successfully.",
      data: subMenus,
    });
  } catch (error) {
    return res.status(500).send({
      isSuccess: false,
      message: error.message,
    });
  }
};
