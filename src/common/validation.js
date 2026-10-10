import { z } from "zod";
import { GenderEnum } from "./enum/user.enum.js";
import { calculateAge } from "./utils/age.js";

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
  email: z.string({
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

  DOB: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, "DOB must be in YYYY-MM-DD format")
    .refine((value) => {
      const date = new Date(value);
      return !isNaN(date) && date.toISOString().slice(0, 10) === value;
    }, "Invalid date of birth")
    .transform((value) => new Date(value))
    .refine((date) => {
      const age = calculateAge(date);
      return age >= 18 && age <= 60;
    }, "Age must be between 18 and 60"),

  gender: z.enum(GenderEnum),
  image: z.string(),
  coverImage: z.array(z.string()),
  otp: z.string().regex(/^\d{6}$/, "OTP must be exactly 6 digits"),
  id: z.string().regex(/^[0-9a-fA-F]{24}$/, "Invalid id"),
  matchField,
};
