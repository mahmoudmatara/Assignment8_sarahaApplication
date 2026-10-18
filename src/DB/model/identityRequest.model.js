import mongoose from "mongoose";
import { RequestStatusEnm } from "./../../common/enum/index.js";

const identityRequestSchema = new mongoose.Schema(
  {
    messageId: {
      type: mongoose.Types.ObjectId,
      ref: "message",
      required: true,
      unique: true,
    },
    requestId: {
      type: mongoose.Types.ObjectId,
      ref: "user",
      required: true,
    },
    senderId: {
      type: mongoose.Types.ObjectId,
      ref: "user",
      required: true,
    },
    status: {
      type: String,
      enum: Object.values(RequestStatusEnm),
      default: RequestStatusEnm.PENDING,
    },
  },
  { timestamps: true }
);

export const IdentityRequestModel = mongoose.model(
  "identityRequest",
  identityRequestSchema
);
