import { z } from "zod";
import {
  matchField,
  validationGeneralFields,
} from "./../../common/validation.js";

export const loginSchema = z.strictObject({
  email: validationGeneralFields.email,
  password: validationGeneralFields.password,
});

export const loginValidation = z.object({
  body: loginSchema,
  query: z.strictObject({
    lang: z.enum(["ar", "en"]).optional(),
  }),
});

export const signupValidation = z.object({
  body: loginSchema
    .safeExtend({
      userName: validationGeneralFields.userName,
      phone: validationGeneralFields.phone,
      confirmPassword: validationGeneralFields.password,
      age: validationGeneralFields.age,
      // gender: z.union([
      //   z.literal(GenderEnum.MALE),
      //   z.literal(GenderEnum.FEMALE),
      // ]),
      gender: validationGeneralFields.gender,
    })
    .superRefine((data, context) => {
      validationGeneralFields.matchField({
        original: "password",
        copy: "confirmPassword",
        data,
        context,
      });
    }),
});
