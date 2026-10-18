import { Router } from "express";
import {
  createRequestController,
  getRequestsController,
  responseRequestController,
} from "./request.controller.js";
import { authentication } from "../../middleware/authentication.middleware.js";
import { validation } from "./../../middleware/validation.middleware.js";
import {
  createRequestValidation,
  getRequestsValidation,
  respondRequestValidation,
} from "./request.validation.js";
const requestRouter = Router({ caseSensitive: true, strict: true });

requestRouter.post(
  "/create-request/:messageId",
  authentication(),
  validation(createRequestValidation),
  createRequestController
);

requestRouter.get(
  "/get-requests",
  authentication(),
  validation(getRequestsValidation),
  getRequestsController
);

requestRouter.patch(
  "/respond/:requestId",
  authentication(),
  validation(respondRequestValidation),
  responseRequestController
);

export default requestRouter;
