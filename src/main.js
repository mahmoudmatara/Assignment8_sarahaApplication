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
import morgan from "morgan";
const app = express();

var corsOptions = {
  origin: function (origin, callback) {
    // السماح للطلبات التي ليس لها origin (مثل Postman أو سيرفر داخلي)
    if (!origin) return callback(null, true);

    if (ORIGIN.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true, // مهم جداً لو بتتعامل مع Cookies / Tokens
};

app.set("trust proxy", true);
const limiter = generateLimiter({});

app.use(
  helmet(),
  cors(corsOptions),
  morgan("combined"),
  limiter,
  express.json()
);
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
