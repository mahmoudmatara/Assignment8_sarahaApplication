import { z } from "zod";

export const loginValidation = z.strictObject({
  email: z.email(),
  password: z.string().min(8).max(16),
});

export const signupValidation = loginValidation
  .safeExtend({
    userName: z.string().min(3).max(25),
    phone: z.string(),
    confirmPassword: z.string().min(8).max(16),
    age: z.number().min(18).max(60),
  })
  .superRefine((data, context) => {
    if (data.password !== data.confirmPassword) {
      context.addIssue({
        code: "custom",
        path: ["confirmPassword"],
        message: "Passwords do not match",
      });
    }
    if (!data.userName.includes(" ")) {
      context.addIssue({
        code: "custom",
        path: ["userName"],
        message: "userName must contain 2 parts",
      });
    }
  });
