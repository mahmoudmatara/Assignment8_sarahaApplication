import { loginService, signUpService } from "./authentication.service.js";
import { successResponse } from "./../../common/utils/success.response.js";

export const signUpController = async (req, res, next) => {
  try {
    const data = await signUpService(req.body);
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
export const loginController = async (req, res, next) => {
  try {
    const data = await loginService(req.body);
    return successResponse({
      res,
      message: "User logged in successfully",
      data: data,
      status: 200,
    });
  } catch (error) {
    next(error);
  }
};
