import mongoose from "mongoose";

const chatMessageSchema = new mongoose.Schema(
  {
    conversationId: {
      type: mongoose.Types.ObjectId,
      ref: "conversation",
      required: true,
    },
    senderId: { type: mongoose.Types.ObjectId, ref: "user", required: true },
    content: { type: String, required: true, trim: true, maxLength: 5000 },
  },
  { timestamps: true }
);

chatMessageSchema.index({ conversationId: 1, createdAt: -1 });

export const ChatMessageModel = mongoose.model(
  "chatMessage",
  chatMessageSchema
);
