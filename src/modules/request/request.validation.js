import z from "zod";
import { RequestStatusEnm } from "../../common/enum/Request.status.enm.js";
import { validationGeneralFields } from "../../common/validation.js";

export const createRequestValidation = z.object({
  params: z.strictObject({
    messageId: validationGeneralFields.id,
  }),
});

export const getRequestsValidation = z.object({
  query: z.strictObject({
    status: z.enum(Object.values(RequestStatusEnm)).optional(),
    page: z.coerce.number().default(1),
    limit: z.coerce.number().default(5),
  }),
});

export const respondRequestValidation = z.object({
  params: z.strictObject({
    requestId: validationGeneralFields.id,
  }),
  body: z.strictObject({
    status: z.enum([RequestStatusEnm.ACCEPTED, RequestStatusEnm.REJECTED]),
  }),
});
