import { Router } from "express";
import authenticationRouter from "./authentication/router.js";
import userRouter from "./user/router.js";

const appRouter = Router();

appRouter.use("/users", authenticationRouter);
appRouter.use("/users", userRouter);

export default appRouter;
