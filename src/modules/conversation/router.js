import { Router } from "express";
import { authentication } from "../../middleware/authentication.middleware.js";
import { validation } from "../../middleware/validation.middleware.js";
import {
  getChatMessagesController,
  getConversationsController,
  sendChatMessageController,
} from "./conversation.controller.js";
import {
  getChatMessagesValidation,
  getConversationsValidation,
  sendChatMessageValidation,
} from "./conversation.validation.js";

const conversationRouter = Router({ caseSensitive: true, strict: true });

conversationRouter.get(
  "/get-conversations",
  authentication(),
  validation(getConversationsValidation),
  getConversationsController
);

conversationRouter.post(
  "/send-message/:conversationId",
  authentication(),
  validation(sendChatMessageValidation),
  sendChatMessageController
);

conversationRouter.get(
  "/get-messages/:conversationId",
  authentication(),
  validation(getChatMessagesValidation),
  getChatMessagesController
);

export default conversationRouter;
