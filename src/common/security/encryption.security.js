import crypto from "node:crypto";
import { ENCRYPTION_KEY } from "../../config.js";

export const encryption = async (plainText) => {
  const iv = crypto.randomBytes(16);
  // console.log({ iv });
  const cipher = crypto.createCipheriv("aes-256-cbc", ENCRYPTION_KEY, iv);
  let encryptData = cipher.update(plainText, "utf-8", "hex");
  encryptData += cipher.final("hex");
  const combinedEncryption = `${iv.toString("hex")}::${encryptData}`;
  // console.log(combinedEncryption);
  return combinedEncryption;
};

export const decryption = async (cipherText) => {
  const [iv, encryptedData] = cipherText.split("::");
  // console.log({ iv, encryptedData });
  const iv_vector = Buffer.from(iv, "hex");
  // console.log({ iv_vector });
  const decryptedData = crypto.createDecipheriv(
    "aes-256-cbc",
    ENCRYPTION_KEY,
    iv_vector
  );
  let decryptedPlainText = decryptedData.update(encryptedData, "hex", "utf-8");
  decryptedPlainText += decryptedData.final("utf-8");
  // console.log({ decryptedPlainText });
  return decryptedPlainText;
};
