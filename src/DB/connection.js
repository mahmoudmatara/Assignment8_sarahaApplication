import mongoose from "mongoose";
import { DB_URI } from "../config.js";
import { UserModel } from "./model/user.model.js";

export const connectDB = async (app, port) => {
  try {
    await mongoose.connect(DB_URI);
    console.log("Database connected successfully!");
    // await UserModel.syncIndexes();
    app.listen(port, () => {
      console.log(`Example app listening on port ${port}!`);
    });
  } catch (error) {
    console.error("Error connecting to Database:", error.message);
    process.exit(1);
  }
};
