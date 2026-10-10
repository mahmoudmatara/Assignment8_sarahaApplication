import { Router } from "express";
import { validation } from "../../middleware/validation.middleware.js";
import {
  confirmEmailController,
  confirmTwoStepController,
  enableTwoStepController,
  forgotPasswordCodeController,
  loginConfirmationController,
  loginController,
  resendConfirmEmailController,
  resetPasswordController,
  signUpController,
  verifyForgotPasswordCodeController,
} from "./authentication.controller.js";
import * as validators from "./authentication.validation.js";
import { authentication } from "../../middleware/authentication.middleware.js";

const authenticationRouter = Router();

authenticationRouter.post(
  "/signup",
  validation(validators.signupValidation),
  signUpController
);

authenticationRouter.patch(
  "/confirm-email",
  validation(validators.confirmEmailValidation),
  confirmEmailController
);

authenticationRouter.patch(
  "/resend-Confirm-email",
  validation(validators.resendConfirmEmailValidation),
  resendConfirmEmailController
);

authenticationRouter.post(
  "/forgot-password-code",
  validation(validators.resendConfirmEmailValidation),
  forgotPasswordCodeController
);

authenticationRouter.post(
  "/verify-forgot-code",
  validation(validators.confirmEmailValidation),
  verifyForgotPasswordCodeController
);
authenticationRouter.patch(
  "/reset-password",
  validation(validators.resetPasswordValidation),
  resetPasswordController
);

authenticationRouter.post(
  "/login",
  validation(validators.loginValidation),
  loginController
);

authenticationRouter.post(
  "/login-confirmation",
  validation(validators.confirmEmailValidation),
  loginConfirmationController
);
authenticationRouter.post(
  "/enable-2step-verification",
  authentication(),
  enableTwoStepController
);
authenticationRouter.patch(
  "/confirm-2step-verification",
  authentication(),
  validation(validators.confirmTwoStepsValidation),
  confirmTwoStepController
);

export default authenticationRouter;
