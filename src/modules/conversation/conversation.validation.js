import z from "zod";
import { validationGeneralFields } from "../../common/validation.js";

export const getConversationsValidation = z.object({
  query: z.strictObject({
    page: z.coerce.number().default(1),
    limit: z.coerce.number().default(10),
  }),
});

export const sendChatMessageValidation = z.object({
  params: z.strictObject({
    conversationId: validationGeneralFields.id,
  }),
  body: z.strictObject({
    content: z.string().trim().min(1).max(5000),
  }),
});

export const getChatMessagesValidation = z.object({
  params: z.strictObject({
    conversationId: validationGeneralFields.id,
  }),
  query: z.strictObject({
    page: z.coerce.number().default(1),
    limit: z.coerce.number().default(20),
  }),
});
