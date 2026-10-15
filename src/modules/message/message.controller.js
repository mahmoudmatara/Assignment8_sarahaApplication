import { successResponse } from "../../common/utils/success.response.js";
import {
  createMessageService,
  deletedMessageService,
  getAllMessageService,
  getMessageService,
} from "./message.service.js";

export const messageController = async (req, res, next) => {
  try {
    const data = await createMessageService(req.body, req.files, req.user);
    return successResponse({ res, status: 201, data });
  } catch (error) {
    next(error);
  }
};

export const getAllMessageController = async (req, res, next) => {
  try {
    const data = await getAllMessageService(req.validate.query, req.user);
    return successResponse({ res, data });
  } catch (error) {
    next(error);
  }
};

export const deletedMessageController = async (req, res, next) => {
  try {
    const data = await deletedMessageService(req.validate.params, req.user);
    return successResponse({ res, data });
  } catch (error) {
    next(error);
  }
};

export const getMessageController = async (req, res, next) => {
  try {
    const data = await getMessageService(req.validate.params, req.user);
    return successResponse({ res, data });
  } catch (error) {
    next(error);
  }
};
