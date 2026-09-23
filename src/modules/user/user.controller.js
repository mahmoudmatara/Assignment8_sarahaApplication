import { successResponse } from "../../common/utils/success.response.js";
import {
  getProfileService,
  rotateTokenService,
  updateProfileService,
} from "./user.service.js";

export const getProfileController = async (req, res, next) => {
  try {
    const data = await getProfileService(req.user);
    return successResponse({ res, data });
  } catch (error) {
    next(error);
  }
};

export const updateProfileController = async (req, res, next) => {
  try {
    const data = await updateProfileService(req.user, req.body);
    return successResponse({ res, data });
  } catch (error) {
    next(error);
  }
};

export const rotateTokenController = async (req, res, next) => {
  try {
    const data = await rotateTokenService(
      req.payload,
      `${req.protocol}://${req.get("host")}`
    );
    return successResponse({ res, data });
  } catch (error) {
    next(error);
  }
};
