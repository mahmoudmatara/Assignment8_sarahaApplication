import { Router } from "express";
import { tokenTypeEnum } from "../../common/enum/security.token.js";
import { RoleEnum } from "../../common/enum/user.enum.js";
import {
  authentication,
  authorization,
} from "../../middleware/authentication.middleware.js";
import {
  getProfileController,
  rotateTokenController,
  updateProfileController,
} from "./user.controller.js";

const userRouter = Router();

userRouter.get("/profile", authentication(), getProfileController);
userRouter.patch(
  "/profile",
  authentication(),
  authorization([RoleEnum.USER]),
  updateProfileController
);
userRouter.post(
  "/rotate_token",
  authentication(tokenTypeEnum.ROTATETOKEN),
  rotateTokenController
);

export default userRouter;
