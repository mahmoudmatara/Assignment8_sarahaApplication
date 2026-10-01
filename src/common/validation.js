import { z } from "zod";
import { GenderEnum } from "./enum/user.enum.js";

export const matchField = ({ original, copy, data, context }) => {
  if (data[original] !== data[copy]) {
    context.addIssue({
      code: "custom",
      path: ["confirmPassword"],
      message: `Fail to match between ${original} and ${copy}`,
    });
  }
};

export const validationGeneralFields = {
  email: z.email({
    error: "Invalid email format",
  }),

  password: z
    .string()
    .regex(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?_&])[A-Za-z\d@$!%*?_&]{8,16}$/,
      "Password must contain uppercase, lowercase, number and special character"
    ),

  userName: z
    .string()
    .regex(
      /^[A-Z][a-z]{1,24}\s[A-Z][a-z]{1,24}$/,
      "userName must contain at least 2 parts"
    ),

  phone: z
    .string()
    .regex(/^\+201(0|1|2|5)\d{8}$/, "Invalid Egyptian phone number"),

  age: z.number().min(18).max(60),

  gender: z.enum(GenderEnum),
  otp: z.string().regex(/^\d{6}$/, "OTP must be exactly 6 digits"),

  matchField,
};
