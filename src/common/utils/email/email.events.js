import { EventEmitter } from "node:events";
import { sendEmail } from "./index.js";
import { generateOTPTemplate } from "./template.js";

export const eventEmitter = new EventEmitter();

eventEmitter.on("sendEmail", async ({ recipients, subject, data }) => {
  try {
    await sendEmail({
      ...recipients,
      subject,
      html: generateOTPTemplate({
        title: data.title,
        otpCode: data.code,
        message: data.message,
        subject,
      }),
    });
  } catch (error) {
    console.log({ error });
  }
});
