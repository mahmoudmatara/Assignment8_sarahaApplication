import mongoose from "mongoose";

const conversationSchema = new mongoose.Schema(
  {
    messageId: {
      type: mongoose.Types.ObjectId,
      ref: "message",
      required: true,
      unique: true, // محادثة واحدة لكل رسالة
    },
    senderId: { type: mongoose.Types.ObjectId, ref: "user", required: true },
    receiverId: { type: mongoose.Types.ObjectId, ref: "user", required: true },
  },
  { timestamps: true }
);

export const ConversationModel = mongoose.model(
  "conversation",
  conversationSchema
);
