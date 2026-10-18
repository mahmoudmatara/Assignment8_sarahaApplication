import { RequestStatusEnm } from "../../common/enum/index.js";
import { NotFoundException } from "../../common/exceptions/error.exceptions.js";
import * as base from "../../common/repository/base.repository.js";
import {
  create,
  deleteOne,
  findOne,
  paginate,
} from "../../common/repository/message.repository.js";
import {
  find as findUsers,
  findById,
} from "../../common/repository/user.repository.js";
import { IdentityRequestModel, MessageModel } from "../../DB/model/index.js";

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

  const all = result.docs.map((doc) => doc.toJSON());
  const revealed = await revealSenders(
    all.filter((m) => m.receiverId.toString() === user._id.toString())
  );

  const messages = all.map((message) => {
    const isReceived = message.receiverId.toString() === user._id.toString();
    if (!isReceived) return message;
    const sender = revealed.get(message._id.toString());
    delete message.senderId;
    return sender ? { ...message, sender } : message;
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
  const doc = await findOne({
    filter: { receiverId: user._id, _id: messageId },
  });
  if (!doc) {
    throw NotFoundException("Invalid MessageId");
  }

  const message = doc.toJSON();
  const revealed = await revealSenders([message]);
  const sender = revealed.get(message._id.toString());
  delete message.senderId;

  return sender ? { ...message, sender } : message;
};

// بترجّع Map: messageId -> بيانات المرسل (للرسائل اللي الطلب عليها اتقبل بس)
const revealSenders = async (messages) => {
  if (!messages.length) return new Map();

  const accepted = await base.find({
    model: IdentityRequestModel,
    filter: {
      messageId: { $in: messages.map((m) => m._id) },
      status: RequestStatusEnm.ACCEPTED,
    },
    select: "messageId senderId",
  });
  if (!accepted.length) return new Map();

  const users = await findUsers({
    filter: { _id: { $in: accepted.map((r) => r.senderId) } },
    select: "firstName lastName image",
  });
  const usersMap = new Map(
    users.map((u) => [
      u._id.toString(),
      {
        _id: u._id,
        firstName: u.firstName,
        lastName: u.lastName,
        image: u.image,
      },
    ])
  );

  return new Map(
    accepted.map((r) => [
      r.messageId.toString(),
      usersMap.get(r.senderId.toString()),
    ])
  );
};



// import { NotFoundException } from "../../common/exceptions/error.exceptions.js";
// import {
//   create,
//   deleteOne,
//   findOne,
//   paginate,
// } from "../../common/repository/message.repository.js";
// import { findById } from "../../common/repository/user.repository.js";
// import { MessageModel } from "../../DB/model/index.js";

// export const createMessageService = async (
//   { content, receiverId } = {},
//   files = [],
//   user = undefined
// ) => {
//   const checkReceiverExist = await findById({
//     id: receiverId,
//   });

//   if (!checkReceiverExist) throw NotFoundException("Invalid Receiver Id");
//   const message = await create({
//     data: {
//       receiverId,
//       content,
//       attachments: files.map((ele) => ele.path),
//       ...(user ? { senderId: user._id } : {}),
//     },
//   });

//   return message;
// };

// export const getAllMessageService = async (
//   { type, page, limit } = {},
//   user
// ) => {
//   let filter = {};
//   if (type == "0") {
//     filter = { receiverId: user._id };
//   } else if (type == "1") {
//     filter = { senderId: user._id };
//   } else {
//     filter = {
//       $or: [{ senderId: user._id }, { receiverId: user._id }],
//     };
//   }
//   const result = await paginate({
//     model: MessageModel,
//     filter,
//     select: "+senderId",
//     options: { sort: { createdAt: -1 } },
//     page,
//     limit,
//   });

//   const messages = result.docs.map((doc) => {
//     const message = doc.toJSON();
//     const isReceived = message.receiverId.toString() === user._id.toString();
//     if (isReceived) delete message.senderId;
//     return message;
//   });
//   const { docs, ...pagination } = result;
//   return { ...pagination, numberOfMessage: messages.length, messages };
// };

// export const deletedMessageService = async ({ messageId }, user) => {
//   const data = await deleteOne({
//     filter: { receiverId: user._id, _id: messageId },
//   });
//   if (!data.deletedCount) {
//     throw NotFoundException("Invalid MessageId");
//   }

//   return data;
// };

// export const getMessageService = async ({ messageId }, user) => {
//   const data = await findOne({
//     filter: { receiverId: user._id, _id: messageId },
//     select: "-senderId",
//   });
//   if (!data) {
//     throw NotFoundException("Invalid MessageId");
//   }

//   return data;
// };
