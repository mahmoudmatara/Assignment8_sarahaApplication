import {
  confirmEmailService,
  confirmTwoStepService,
  enableTwoStepService,
  forgotPasswordCodeService,
  loginConfirmationService,
  loginService,
  resendConfirmEmailService,
  resetPasswordService,
  signUpService,
  verifyForgotPasswordCodeService,
} from "./authentication.service.js";
import { successResponse } from "./../../common/utils/success.response.js";

export const signUpController = async (req, res, next) => {
  try {
    const data = await signUpService(req.validate.body);
    return successResponse({
      res,
      message: "Account created successfully",
      data: data,
      status: 201,
    });
  } catch (error) {
    next(error);
  }
};

export const confirmEmailController = async (req, res, next) => {
  try {
    const data = await confirmEmailService(req.body);
    return successResponse({
      res,
      message: "Email Confirmed",
      data: data,
      status: 200,
    });
  } catch (error) {
    next(error);
  }
};

export const resendConfirmEmailController = async (req, res, next) => {
  try {
    const data = await resendConfirmEmailService(req.body);
    return successResponse({
      res,
      message: "true",
      data: data,
      status: 200,
    });
  } catch (error) {
    next(error);
  }
};
export const forgotPasswordCodeController = async (req, res, next) => {
  try {
    const data = await forgotPasswordCodeService(req.body);
    return successResponse({
      res,
      message: "true",
      data: data,
      status: 201,
    });
  } catch (error) {
    next(error);
  }
};
export const verifyForgotPasswordCodeController = async (req, res, next) => {
  try {
    const data = await verifyForgotPasswordCodeService(req.body);
    return successResponse({
      res,
      message: "true",
      data: data,
      status: 201,
    });
  } catch (error) {
    next(error);
  }
};

export const resetPasswordController = async (req, res, next) => {
  try {
    const data = await resetPasswordService(req.body);
    return successResponse({
      res,
      message: "true",
      data: data,
      status: 200,
    });
  } catch (error) {
    next(error);
  }
};

export const loginController = async (req, res, next) => {
  try {
    const data = await loginService(
      req.validate.body,
      `${req.protocol}//${req.host}`
    );
    return successResponse({
      res,
      message: data.requiresTwoStepVerification
        ? data.message
        : "User logged in successfully",
      data: data,
      status: 200,
    });
  } catch (error) {
    next(error);
  }
};

export const loginConfirmationController = async (req, res, next) => {
  try {
    const data = await loginConfirmationService(
      req.validate.body,
      `${req.protocol}//${req.host}`
    );
    return successResponse({
      res,
      message: "User logged in successfully",
      data,
      status: 200,
    });
  } catch (error) {
    next(error);
  }
};

export const enableTwoStepController = async (req, res, next) => {
  try {
    const data = await enableTwoStepService(req.user);
    return successResponse({ res, message: data.message, status: 200 });
  } catch (error) {
    next(error);
  }
};

export const confirmTwoStepController = async (req, res, next) => {
  try {
    const data = await confirmTwoStepService(req.user, req.validate.body.otp);
    return successResponse({
      res,
      message: "Two-step verification enabled successfully",
      data,
      status: 200,
    });
  } catch (error) {
    next(error);
  }
};
