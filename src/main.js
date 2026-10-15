import "dotenv/config";
import express from "express";
import { ORIGIN, PORT } from "./config.js";
import { connectDB } from "./DB/connection.js";
import errorMiddleware from "./middleware/error.middleware.js";
import appRouter from "./modules/index.js";
import cors from "cors";
import helmet from "helmet";
import { UnauthorizedException } from "./common/exceptions/error.exceptions.js";
import { generateLimiter } from "./common/utils/limiter.js";

const app = express();

var corsOptions = {
  origin: function (origin, callback) {
    if (!ORIGIN.includes(origin)) {
      callback(UnauthorizedException("Unauthorized Origin!"), ORIGIN);
    }
    callback(null, ORIGIN);
  },
};

app.set("trust proxy", true);
const limiter = generateLimiter({});

app.use(helmet(), cors(), limiter, express.json());
app.use("/uploads", express.static("uploads"));

app.use(appRouter);
await connectDB(app, PORT);

app.all("/", (req, res) => {
  return res.status(200).json({ message: "Welcome to BE API 🎉" });
});

app.all("{/*dummy}", (req, res) => {
  return res.status(404).json({ message: "Invalid application routing" });
});

app.use(errorMiddleware);
