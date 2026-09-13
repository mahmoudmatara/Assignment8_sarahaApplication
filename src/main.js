import "dotenv/config";
import express from "express";
import { PORT } from "./config.js";
import { connectDB } from "./DB/connection.js";
import errorMiddleware from "./middlewares/error.middleware.js";
import appRouter from "./modules/index.js";

const app = express();
app.use(express.json());

await connectDB(app, PORT);

app.use(appRouter);

app.all("/", (req, res) => {
  return res.status(200).json({ message: "Welcome to BE API 🎉" });
});

app.all("{/*dummy}", (req, res) => {
  return res.status(404).json({ message: "Invalid application routing" });
});

app.use(errorMiddleware);
