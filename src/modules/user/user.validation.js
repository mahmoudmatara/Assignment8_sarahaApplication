import { z } from "zod";
import { validationGeneralFields } from "../../common/validation.js";

export const updateProfileValidation = z.object({
  body: z
    .strictObject({
      userName: validationGeneralFields.userName,
      phone: validationGeneralFields.phone,
      DOB: validationGeneralFields.DOB,
      gender: validationGeneralFields.gender,
      image: validationGeneralFields.image,
      coverImage: validationGeneralFields.coverImage,
      oldPassword: z.string(),
      password: validationGeneralFields.password,
      confirmPassword: validationGeneralFields.password,
    })
    .partial()
    .refine(
      (data) => Object.keys(data).length > 0,
      "At least one field is required"
    )
    .superRefine((data, context) => {
      // لو بعت أي حقل من التلاتة، لازم يبعتهم كلهم
      if (!(data.password || data.oldPassword || data.confirmPassword)) return;

      for (const field of ["oldPassword", "password", "confirmPassword"]) {
        if (!data[field]) {
          context.addIssue({
            code: "custom",
            path: [field],
            message: `${field} is required to change password`,
          });
        }
      }

      if (data.password && data.confirmPassword) {
        validationGeneralFields.matchField({
          original: "password",
          copy: "confirmPassword",
          data,
          context,
        });
      }
    }),
});

export const deletedUserValidation = z.object({
  params: z.strictObject({
    userId: validationGeneralFields.id,
  }),
});
export const deletedAccountValidation = z.object({
  body: z.strictObject({
    password: validationGeneralFields.password,
  }),
});
