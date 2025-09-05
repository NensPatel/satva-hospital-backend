import appointmentSchema from "../../models/admin/appointment.model.js";
import emailSettingsSchema from "../../models/admin/emailsetting.model.js";
import { sendMail } from "../../helpers/mail.js";

export const createAppointment = async (req, res) => {
  try {
    const { doctor, fullName, email, phone, date, time, message } = req.body;

    if (!doctor || !fullName || !email || !phone || !date || !time) {
      return res.status(400).send({
        isSuccess: false,
        message: "Doctor, Full Name, Email, Phone, Date, and Time are required.",
      });
    }

    const saveData = new appointmentSchema({
      doctor,
      fullName,
      email,
      phone,
      date,
      time,
      message,
    });

    await saveData.save();

    const populatedData = await appointmentSchema
      .findById(saveData._id)
      .populate("doctor", "name designation");

    const getEmailData = await emailSettingsSchema.findOne();
    if (getEmailData && getEmailData.appointmentTemplate) {
      let appointmentTemplate = getEmailData.appointmentTemplate;

      // Replace placeholders
      appointmentTemplate = appointmentTemplate.replace(/\[DOCTOR\]/g,
        populatedData.doctor?.name || "N/A"
      );
      appointmentTemplate = appointmentTemplate.replace(/\[FULLNAME\]/g, fullName);
      appointmentTemplate = appointmentTemplate.replace(/\[EMAIL\]/g, email);
      appointmentTemplate = appointmentTemplate.replace(/\[PHONE\]/g, phone);
      appointmentTemplate = appointmentTemplate.replace(/\[DATE\]/g,
        new Date(date).toLocaleDateString("en-GB")
      );
      appointmentTemplate = appointmentTemplate.replace(/\[TIME\]/g, time);
      appointmentTemplate = appointmentTemplate.replace(/\[MESSAGE\]/g,
        message || "N/A"
      );

      // Send mail
      await sendMail(
        getEmailData.fromEmailAppointment,
        getEmailData.appointmentSubject || "New Appointment Booking",
        appointmentTemplate,
        getEmailData.ccEmailAppointment,
        getEmailData.bccEmailAppointment
      );
    }

    return res.status(200).send({
      isSuccess: true,
      message: `Thank you ${fullName}! Your appointment has been booked successfully.`,
      data: populatedData,
    });
  } catch (error) {
    return res.status(500).send({
      message: error.message,
      isSuccess: false,
    });
  }
};

export const getAllAppointment = async (req, res) => {
  try {
    const getData = await appointmentSchema
      .find({ isActive: true } )
      .populate("doctor", "name designation")
      .sort({ createdAt: -1 });

    return res.status(200).send({
      isSuccess: true,
      message: "Appointments fetched successfully.",
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
    const appointment_id = req.body.appointment_id;
    const getData = await appointmentSchema.findById(appointment_id)
      .populate("doctor", "name designation");

    if (!getData) {
      return res.status(404).send({
        isSuccess: false,
        message: "Appointment not found",
      });
    }

    return res.status(200).send({
      isSuccess: true,
      message: "Appointment fetched successfully.",
      data: getData,
    });
  } catch (error) {
    return res.status(500).send({
      message: error.message,
      isSuccess: false,
    });
  }
};

export const deleteAppointment = async (req, res) => {
  try {
    const appointment_id = req.query.appointment_id;
    await appointmentSchema
         .findByIdAndDelete(appointment_id)
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

export const getPaginationData = async (req, res) => {
  try {
    let { page = 1, limit = 10 } = req.body;
    page = parseInt(page);
    limit = parseInt(limit);
    if (isNaN(page) || page < 1) page = 1;
    if (isNaN(limit) || limit < 1) limit = 10;
    const skip = (page - 1) * limit;

    const getData = await appointmentSchema
      .find()
      .populate("doctor", "name designation")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const totalRecords = await appointmentSchema.countDocuments();

    return res.status(200).send({
      isSuccess: true,
      currentPageNo: page,
      totalPages: Math.ceil(totalRecords / limit),
      totalRecords,
      message: "Appointments fetched successfully.",
      data: getData,
    });
  } catch (error) {
    return res.status(500).send({
      message: error.message,
      isSuccess: false,
    });
  }
};
