import { NotFoundException } from "../../common/exceptions/error.exceptions.js";
import {
  create,
  deleteOne,
  findOne,
  paginate,
} from "../../common/repository/message.repository.js";
import { findById } from "../../common/repository/user.repository.js";
import { MessageModel } from "../../DB/model/index.js";

export const createMessageService = async (
  { content, receiverId } = {},
  files = [],
  user = undefined
) => {
  const checkReceiverExist = await findById({
    id: receiverId,
  });

  if (!checkReceiverExist) throw NotFoundException("Invalid Receiver Id");
  const message = await create({
    data: {
      receiverId,
      content,
      attachments: files.map((ele) => ele.path),
      ...(user ? { senderId: user._id } : {}),
    },
  });

  return message;
};

export const getAllMessageService = async (
  { type, page, limit } = {},
  user
) => {
  let filter = {};
  if (type == "0") {
    filter = { receiverId: user._id };
  } else if (type == "1") {
    filter = { senderId: user._id };
  } else {
    filter = {
      $or: [{ senderId: user._id }, { receiverId: user._id }],
    };
  }
  const result = await paginate({
    model: MessageModel,
    filter,
    select: "+senderId",
    options: { sort: { createdAt: -1 } },
    page,
    limit,
  });

  const messages = result.docs.map((doc) => {
    const message = doc.toJSON();
    const isReceived = message.receiverId.toString() === user._id.toString();
    if (isReceived) delete message.senderId;
    return message;
  });
  const { docs, ...pagination } = result;
  return { ...pagination, numberOfMessage: messages.length, messages };
};

export const deletedMessageService = async ({ messageId }, user) => {
  const data = await deleteOne({
    filter: { receiverId: user._id, _id: messageId },
  });
  if (!data.deletedCount) {
    throw NotFoundException("Invalid MessageId");
  }

  return data;
};

export const getMessageService = async ({ messageId }, user) => {
  const data = await findOne({
    filter: { receiverId: user._id, _id: messageId },
    select: "-senderId",
  });
  if (!data) {
    throw NotFoundException("Invalid MessageId");
  }

  return data;
};
