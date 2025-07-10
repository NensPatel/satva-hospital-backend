import adminSchema from "../../models/admin/admin.model.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import ejs from "ejs";
import path from "path";
import { fileURLToPath } from "url";
import { sendMail } from "../../helpers/mail.js";

// __dirname equivalent in ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const register = async (req, res) => {
  try {
    const { fullname, email, password } = req.body;
    const findEmail = await adminSchema.findOne({ email });
    if (findEmail) {
      return res
        .status(409)
        .send({ message: "Email is already existing!", isSuccess: false });
    } else {
      const Password = await bcrypt.hash(password, 10);
      const newAdmin = new adminSchema({
        fullname,
        email,
        password: Password,
        stringPassword: password,
      });
      await newAdmin.save();
      return res.status(200).send({
        message: "Admin registration successfully.",
        isSuccess: true,
      });
    }
  } catch (error) {
    return res.status(500).send({
      message: error.message,
      isSuccess: false,
    });
  }
};

export const login = async (req, res) => {
  const { email, password } = req.body;
  try {
    const findEmail = await adminSchema.findOne({ email });
    if (!findEmail) {
      return res
        .status(404)
        .json({ message: "Email not found!", isSuccess: false });
    }
    const isMatch = await bcrypt.compare(password, findEmail.password);
    if (isMatch) {
      const authToken = jwt.sign(
        { _id: findEmail._id, email },
        process.env.ADMIN_TOKEN_KEY,
        { expiresIn: process.env.TOKEN_EXPIRE_TIME }
      );
      return res.status(200).json({
        isSuccess: true,
        message: "Login successfully.",
        authToken,
        admin: findEmail,
      });
    } else {
      return res
        .status(409)
        .json({ message: "Invalid password!", isSuccess: false });
    }
  } catch (error) {
    return res.status(500).json({ message: error.message, isSuccess: false });
  }
};

export const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    const findEmail = await adminSchema.findOne({ email });

    if (!findEmail) {
      return res
        .status(404)
        .send({ message: "Email not found!", isSuccess: false });
    }

    const otpCode = Math.floor(100000 + Math.random() * 900000);

    const mailBody = await ejs.renderFile(
      path.join(__dirname, "../../views/forgot-password.ejs"),
      {
        otpCode,
        email: findEmail.email,
        fullname: findEmail.fullname,
      }
    );

    await sendMail(email, "Admin Reset Password.", mailBody);

    const otpValidTime = Number(process.env.OTP_VALID_TIME);
    if (isNaN(otpValidTime)) {
      throw new Error("OTP_VALID_TIME is not a valid number.");
    }

    const otpExpireIn = Date.now() + otpValidTime;

    await adminSchema.findByIdAndUpdate(findEmail._id, {
      otpCode,
      otpExpireIn,
    });

    return res.status(200).send({
      message: "Otp is sent in your email.",
      isSuccess: true,
    });
  } catch (error) {
    return res.status(500).send({ message: error.message, isSuccess: false });
  }
};


export const verifyOtp = async (req, res) => {
  try {
    const { email, otpCode } = req.body;
    const customer = await adminSchema.findOne({ email });
    if (customer) {
      if (otpCode == customer.otpCode) {
        const checkOTPExpire = Date.now() > customer.otpExpireIn;
        if (checkOTPExpire) {
          return res
            .status(409)
            .send({ message: "OTP is expired!!", isSuccess: false });
        } else {
          return res
            .status(200)
            .send({ message: "OTP verify successfully.", isSuccess: true });
        }
      } else {
        return res
          .status(409)
          .send({ message: "Invalid OTP", isSuccess: false });
      }
    } else {
      return res
        .status(404)
        .send({ message: "Email not found!", isSuccess: false });
    }
  } catch (error) {
    return res.status(500).send({ message: error.message, isSuccess: false });
  }
};

export const resetPassword = async (req, res) => {
  try {
    const { email, password } = req.body;
    const findEmail = await adminSchema.findOne({ email });
    if (!findEmail) {
      return res
        .status(403)
        .send({ message: "Email not found!", isSuccess: false });
    }
    const newpassword = await bcrypt.hash(password, 10);
    await adminSchema.findByIdAndUpdate(findEmail._id, {
      password: newpassword,
    });
    return res
      .status(200)
      .send({ message: "Reset password successfully.", isSuccess: true });
  } catch (error) {
    return res.status(500).send({ message: error.message, isSuccess: false });
  }
};

export const getProfile = async (req, res) => {
  try {
    const adminId = req.admin._id;
    const profile = await adminSchema.findById(adminId);
    if (!profile) {
      return res
        .status(404)
        .send({ message: "User not found!", isSuccess: false });
    }
    return res.status(200).send({
      data: profile,
      isSuccess: true,
      message: "Get admin data successfully.",
    });
  } catch (error) {
    return res.status(500).send({ message: error.message, isSuccess: false });
  }
};

export const changePassword = async (req, res) => {
  try {
    const adminId = req.admin._id;
    let { oldPassword, newPassword } = req.body;
    const findCustomer = await adminSchema.findOne({ _id: adminId });
    if (!findCustomer) {
      return res
        .status(404)
        .send({ message: "Admin not found!", isSuccess: false });
    }
    const checkPassword = await bcrypt.compare(
      oldPassword,
      findCustomer.password
    );
    if (oldPassword === newPassword) {
      return res.status(409).send({
        message: "Old password and new password must not be the same.",
        isSuccess: false,
      });
    }
    if (checkPassword) {
      newPassword = await bcrypt.hash(newPassword, 10);
      await adminSchema.findByIdAndUpdate(
        findCustomer._id,
        { password: newPassword },
        { new: true }
      );
      return res.status(200).send({
        message: "Your password changed successfully.",
        isSuccess: true,
      });
    } else {
      return res
        .status(409)
        .send({ message: "Your old password is wrong!", isSuccess: false });
    }
  } catch (error) {
    return res.status(500).send({ message: error.message, isSuccess: false });
  }
};
