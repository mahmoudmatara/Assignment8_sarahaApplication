import z from "zod";
import { validationGeneralFields } from "../../common/validation.js";

export const createMessageValidation = z
  .object({
    body: z.strictObject({
      content: z.string().min(2).max(500000).optional(),
      receiverId: validationGeneralFields.id,
    }),
    files: z.array(validationGeneralFields.file).max(3).optional(),
  })
  .superRefine((data, context) => {
    if (!data.body.content && !data.files?.length) {
      context.addIssue({
        code: "custom",
        path: ["content"],
        message: "Missing message content ",
      });
    }
  });

export const getAllMessageValidation = z.object({
  query: z.strictObject({
    type: z.enum(["0", "1", "2"]).default("0"),
    page: z.coerce.number().default(1),
    limit: z.coerce.number().default(5),
  }),
});

export const deleteMessageValidation = z.object({
  params: z.strictObject({
    messageId: validationGeneralFields.id,
  }),
});
