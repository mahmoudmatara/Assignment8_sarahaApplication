import { Router } from "express";
import {
  authentication,
  bearerAuth,
} from "../../middleware/authentication.middleware.js";
import {
  fileValidation,
  localFileUpload,
  processMulterUpload,
} from "../../middleware/file-upload.middleware.js";
import {
  deletedMessageController,
  getAllMessageController,
  getMessageController,
  messageController,
} from "./message.controller.js";
import { validation } from "./../../middleware/validation.middleware.js";
import {
  createMessageValidation,
  deleteMessageValidation,
  getAllMessageValidation,
} from "./message.validation.js";

const messageRouter = Router({ caseSensitive: true, strict: true });

messageRouter.post(
  "/create-message",
  async (req, res, next) => {
    if (req.headers["authorization"]) {
      await bearerAuth({ req });
    }
    next();
  },
  localFileUpload({
    maxFileSize: 3,
    maxFiles: 3,
    validation: fileValidation.image,
  }).array("attachment", 3),
  validation(createMessageValidation),
  processMulterUpload({
    customPath: "messageFolder",
    validation: fileValidation.image,
  }),
  messageController
);

messageRouter.get(
  "/get-all-message",
  authentication(),
  validation(getAllMessageValidation),
  getAllMessageController
);

messageRouter.delete(
  "/delete-message/:messageId",
  authentication(),
  validation(deleteMessageValidation),
  deletedMessageController
);
messageRouter.get(
  "/get-message/:messageId",
  authentication(),
  validation(deleteMessageValidation),
  getMessageController
);

export default messageRouter;
