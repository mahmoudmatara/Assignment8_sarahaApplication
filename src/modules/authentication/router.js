import { Router } from "express";
import { validation } from "../../middleware/validation.middleware.js";
import {
  loginController,
  signUpController,
} from "./authentication.controller.js";
import * as validators from "./authentication.validation.js";

const authenticationRouter = Router();

authenticationRouter.post(
  "/signup",
  validation(validators.signupValidation),
  signUpController
);
authenticationRouter.post(
  "/login",
  validation(validators.loginValidation),
  loginController
);

export default authenticationRouter;
