import nodemailer from "nodemailer";
import { BadRequestException } from "../../exceptions/error.exceptions.js";
import { APP_EMAIL, APP_NAME, APP_PASSWORD } from "./../../../config.js";

export const userEmailKey = ({ email, subject }) => {
  return `User::${email}::${subject}::otp`;
};

export const userEmailTrailsKey = ({ email, subject }) => {
  return `User::${email}::${subject}::Trails`;
};

export const userLoginTrailsKey = ({ email }) => {
  return `User::${email}::Login::Trails`;
};

export const userLoginOtpFailsKey = ({ email }) => {
  return `User::${email}::Login_2Step_Verification::Fails`;
};

// Create a transporter using SMTP
const transporter = nodemailer.createTransport({
  service: "gmail",

  auth: {
    user: APP_EMAIL,
    pass: APP_PASSWORD,
  },
});

export const sendEmail = async ({
  to, // list of recipients
  cc,
  bcc,
  subject, // subject line
  text, // plain text body
  html,
  attachments = [], // HTML body
}) => {
  try {
    if (!to?.length && !cc?.length && !bcc?.length) {
      throw BadRequestException("Missing email recipients");
    }
    if (!html?.length && !text?.length && attachments?.length) {
      throw BadRequestException("Missing email content");
    }
    const info = await transporter.sendMail({
      from: `"${APP_NAME}" <${APP_EMAIL}>`, // sender address
      to, // list of recipients
      cc,
      bcc,
      subject, // subject line
      text, // plain text body
      html,
      attachments, // HTML body
    });

    console.log("Message sent: %s", info.messageId);
    // Preview URL is only available when using an Ethereal test account
    console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
  } catch (err) {
    console.error("Error while sending mail:", err);
  }
};
