import nodemailer from "nodemailer";
import emailSettingsSchema from "../models/admin/emailsetting.model.js";

export const sendMail = async (
  recipientEmail,
  subject,
  html,
  ccEmail,
  bccEmail,
  attachments = []
) => {
  const getEmailData = await emailSettingsSchema.findOne();

  const transporter = nodemailer.createTransport({
    host: getEmailData.host,
    port: getEmailData.port,
    secure: false,
    auth: {
      user: getEmailData.email,   
      pass: getEmailData.password, 
    },
  });

  const mailOptions = {
    from: getEmailData.email,   
    to: recipientEmail,       
    subject,
    html,
    attachments,
    ...(ccEmail && { cc: ccEmail }),
    ...(bccEmail && { bcc: bccEmail }),
  };

  return await transporter.sendMail(mailOptions);
};
