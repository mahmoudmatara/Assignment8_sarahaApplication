import { successResponse } from "../../common/utils/success.response.js";
import { UserModel } from "../../DB/model/user.model.js";
import {
  deletedAccountService,
  deletedUserService,
  getProfileService,
  logOutService,
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
    // التأكد من وجود ملفات مُعالجة
    if (!req.files || req.files.length === 0) {
      throw new BadRequestException("Please upload at least one image");
    }

    const userId = req.user._id || req.user.id;
    const user = await UserModel.findById(userId);

    if (!user) {
      throw new BadRequestException("User not found");
    }

    // إذا كنت تريد أخذ أول صورة من الثلاثة وتعيينها كصورة بروفايل:
    user.image = req.files[0].finalPath;
    await user.save();

    return successResponse({
      res,
      message: "Profile picture uploaded successfully.",
      data: { user },
    });
  } catch (error) {
    next(error);
  }
};
