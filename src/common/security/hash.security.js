import bcrypt from "bcrypt";

export const hash = async (plainText, saltRounds = 10) => {
  const salt = (await bcrypt.genSalt(saltRounds)).toString();
  // console.log({ salt });
  return await bcrypt.hash(plainText, salt);
};

export const compare = async (plainText, cipherText) => {
  return await bcrypt.compare(plainText, cipherText);
};
