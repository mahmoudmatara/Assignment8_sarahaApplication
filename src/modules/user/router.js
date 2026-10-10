import { Router } from "express";
import { tokenTypeEnum } from "../../common/enum/security.token.js";
import { RoleEnum } from "../../common/enum/user.enum.js";
import {
  authentication,
  authorization,
} from "../../middleware/authentication.middleware.js";
import {
  deletedAccountController,
  deletedUserController,
  getProfileController,
  logOutController,
  profileImageController,
  rotateTokenController,
  updateProfileController,
} from "./user.controller.js";
import {
  deletedAccountValidation,
  deletedUserValidation,
  updateProfileValidation,
} from "./user.validation.js";
import { validation } from "./../../middleware/validation.middleware.js";
import {
  fileValidation,
  localFileUpload,
  processMulterUpload,
} from "../../middleware/file-upload.middleware.js";

const userRouter = Router();

userRouter.get("/profile", authentication(), getProfileController);

userRouter.patch(
  "/profile",
  authentication(),
  authorization([RoleEnum.USER]),
  validation(updateProfileValidation),
  updateProfileController
);

userRouter.post(
  "/rotate_token",
  authentication(tokenTypeEnum.ROTATETOKEN),
  rotateTokenController
);
userRouter.post("/logout", authentication(), logOutController);

userRouter.delete(
  "/profile",
  authentication(),
  validation(deletedAccountValidation),
  deletedAccountController
);

userRouter.delete(
  "/:userId",
  authentication(),
  authorization([RoleEnum.ADMIN]),
  validation(deletedUserValidation),
  deletedUserController
);

userRouter.patch(
  "/profile-image",
  authentication(),
  localFileUpload({
    maxFileSize: 3,
    validation: fileValidation.image,
  }).array("attachment", 3),
  processMulterUpload({
    customPath: "users/profile",
    validation: fileValidation.image,
  }),
  profileImageController
);

export default userRouter;
