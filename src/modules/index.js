import { Router } from "express";
import authenticationRouter from "./authentication/router.js";
import messageRouter from "./message/router.js";
import userRouter from "./user/router.js";

const appRouter = Router();

appRouter.use("/auth", authenticationRouter);
appRouter.use("/users", userRouter);
appRouter.use("/message", messageRouter);

export default appRouter;
