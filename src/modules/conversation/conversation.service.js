import * as base from "../../common/repository/base.repository.js";
import { ConversationModel, ChatMessageModel } from "./../../DB/model/index.js";
import {
  ForbiddenException,
  NotFoundException,
} from "./../../common/exceptions/error.exceptions.js";

const getAllowedConversation = async (conversationId, user) => {
  const conversation = await base.findById({
    model: ConversationModel,
    id: conversationId,
  });
  if (!conversation) throw NotFoundException("Invalid ConversationId");

  const userId = user._id.toString();
  const isParticipant = [conversation.senderId, conversation.receiverId].some(
    (id) => id.toString() === userId
  );
  if (!isParticipant) throw ForbiddenException();

  return conversation;
};

export const getConversationsService = async ({ page, limit } = {}, user) => {
  const result = await base.paginate({
    model: ConversationModel,
    filter: { $or: [{ senderId: user._id }, { receiverId: user._id }] },
    select: "messageId senderId receiverId createdAt",
    populate: [{ path: "messageId", select: "content createdAt" }],
    options: { sort: { createdAt: -1 } },
    page,
    limit,
  });

  const { docs, ...pagination } = result;
  return { ...pagination, conversations: docs };
};

export const sendChatMessageService = async (
  { conversationId },
  { content },
  user
) => {
  await getAllowedConversation(conversationId, user);

  const message = await base.create({
    model: ChatMessageModel,
    data: { conversationId, senderId: user._id, content },
  });

  return {
    _id: message._id,
    conversationId: message.conversationId,
    senderId: message.senderId,
    content: message.content,
    createdAt: message.createdAt,
  };
};

export const getChatMessagesService = async (
  { conversationId },
  { page, limit } = {},
  user
) => {
  await getAllowedConversation(conversationId, user);

  const result = await base.paginate({
    model: ChatMessageModel,
    filter: { conversationId },
    select: "senderId content createdAt",
    options: { sort: { createdAt: -1 } },
    page,
    limit,
  });

  const { docs, ...pagination } = result;
  return { ...pagination, messages: docs };
};
