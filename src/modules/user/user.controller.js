import { BadRequestException } from "../../common/exceptions/error.exceptions.js";
import { successResponse } from "../../common/utils/success.response.js";
import { UserModel } from "../../DB/model/user.model.js";
import {
  deletedAccountService,
  deletedUserService,
  getProfileService,
  logOutService,
  rotateTokenService,
  searchUsersService,
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
    const data = await updateProfileService(req.user, req.validate.body);
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

export const logOutController = async (req, res, next) => {
  try {
    const data = await logOutService(req.payload, req.user, req.body);
    return successResponse({ res, data });
  } catch (error) {
    next(error);
  }
};

export const deletedAccountController = async (req, res, next) => {
  try {
    await deletedAccountService(req.user, req.validate.body);
    return successResponse({ res, message: "Account deleted successfully" });
  } catch (error) {
    next(error);
  }
};

export const deletedUserController = async (req, res, next) => {
  try {
    await deletedUserService(req.user, req.validate.params);
    return successResponse({ res, message: "User deleted successfully" });
  } catch (error) {
    next(error);
  }
};

export const profileImageController = async (req, res, next) => {
  try {
    if (!req.file)
      throw BadRequestException("Please upload at least one image");

    const userId = req.user._id || req.user.id;
    const user = await UserModel.findById(userId);

    if (!user) {
      throw BadRequestException("User not found");
    }

    user.image = req.file.finalPath;
    await user.save();
    return successResponse({
      res,
      message: "Profile picture uploaded successfully.",
      data: { image: user.image },
    });
  } catch (error) {
    next(error);
  }
};

export const testUploadController = async (req, res, next) => {
  try {
    return successResponse({
      res,
      message: "Received",
      data: {
        content: req.body?.content ?? null,
        images: (req.files || []).map((f) => f.finalPath),
      },
    });
  } catch (error) {
    next(error);
  }
};

export const searchUsersController = async (req, res, next) => {
  try {
    const data = await searchUsersService(req.validate.query, req.user);
    return successResponse({ res, data });
  } catch (error) {
    next(error);
  }
};
