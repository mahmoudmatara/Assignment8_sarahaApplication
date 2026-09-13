import { Router } from "express";
import {
  loginController,
  signUpController,
} from "./authentication.controller.js";

const router = Router();

router.post("/signup", signUpController);
router.post("/login", loginController);

export default router;
