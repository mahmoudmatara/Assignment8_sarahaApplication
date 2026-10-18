import {
  createRequestService,
  getRequestsService,
  responseRequestService,
} from "./request.service.js";
import { successResponse } from "./../../common/utils/success.response.js";

export const createRequestController = async (req, res, next) => {
  try {
    const data = await createRequestService(req.validate.params, req.user);
    return successResponse({
      res,
      status: 201,
      data,
    });
  } catch (error) {
    next(error);
  }
};

export const getRequestsController = async (req, res, next) => {
  try {
    const data = await getRequestsService(req.validate.query, req.user);
    return successResponse({
      res,
      data,
    });
  } catch (error) {
    next(error);
  }
};

export const responseRequestController = async (req, res, next) => {
  try {
    const { params, body } = req.validate;
    const data = await responseRequestService(params, body, req.user);
    return successResponse({
      res,
      data,
    });
  } catch (error) {
    next(error);
  }
};
