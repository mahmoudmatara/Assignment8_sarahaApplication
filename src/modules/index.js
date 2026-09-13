import { Router } from "express";
import router from "./authentication/router.js";

const appRouter = Router();

appRouter.use("/users", router);

export default appRouter;
