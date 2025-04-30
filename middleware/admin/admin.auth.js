import adminSchema from "../../models/admin/admin.model.js";
import jwt from "jsonwebtoken";

const sendResponse = (res, statusCode, message, isSucess, data = null) => {
  return res.status(statusCode).send({ message, isSucess, data });
};

exports.verifyTokenAdmin = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return sendResponse(res, 401, "Token is expired", false);
    }
    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, process.env.ADMIN_TOKEN_KEY);

    const admin = await adminSchema
      .findById(decoded._id)
      .select("_id fullname email");
    if (!admin) {
      return sendResponse(res, 401, "Invalid token or admin not found", false);
    }

    req.admin = admin;
    next();
  } catch (error) {
    console.error("Auth Middleware Error:", error);
    if (error.name === "TokenExpiredError") {
      return sendResponse(
        res,
        401,
        "Session expired. Please login again.",
        false
      );
    } else if (error.name === "JsonWebTokenError") {
      return sendResponse(res, 401, "Invalid token. Access denied.", false);
    }

    return sendResponse(
      res,
      500,
      "Something went wrong, please try again!",
      false
    );
  }
};
