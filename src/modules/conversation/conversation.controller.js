import { successResponse } from "../../common/utils/success.response.js";
import {
  getChatMessagesService,
  getConversationsService,
  sendChatMessageService,
} from "./conversation.service.js";

export const getConversationsController = async (req, res, next) => {
  try {
    const data = await getConversationsService(req.validate.query, req.user);
    return successResponse({ res, data });
  } catch (error) {
    next(error);
  }
};

export const sendChatMessageController = async (req, res, next) => {
  try {
    const { params, body } = req.validate;
    const data = await sendChatMessageService(params, body, req.user);
    return successResponse({ res, status: 201, data });
  } catch (error) {
    next(error);
  }
};

export const getChatMessagesController = async (req, res, next) => {
  try {
    const { params, query } = req.validate;
    const data = await getChatMessagesService(params, query, req.user);
    return successResponse({ res, data });
  } catch (error) {
    next(error);
  }
};
