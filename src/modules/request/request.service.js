import { findOne } from "./../../common/repository/message.repository.js";
import {
  BadRequestException,
  ConflictException,
  NotFoundException,
} from "./../../common/exceptions/error.exceptions.js";
import * as base from "../../common/repository/base.repository.js";
import {
  ConversationModel,
  IdentityRequestModel,
} from "../../DB/model/index.js";
import { RequestStatusEnm } from "../../common/enum/index.js";

export const createRequestService = async ({ messageId }, user) => {
  const message = await findOne({
    filter: { _id: messageId, receiverId: user._id },
  });
  if (!message) throw NotFoundException("Invalid MessageId");

  if (!message.senderId) {
    throw BadRequestException(
      "Sender is not a registered user, identity can't be requested"
    );
  }

  const exist = await base.findOne({
    model: IdentityRequestModel,
    filter: { messageId },
  });
  if (exist) throw ConflictException("Request already exists for this message");

  const request = await base.create({
    model: IdentityRequestModel,
    data: {
      messageId,
      requestId: user._id,
      senderId: message.senderId,
    },
  });

  return {
    _id: request._id,
    messageId: request.messageId,
    status: request.status,
    createdAt: request.createdAt,
  };
};

export const getRequestsService = async (
  { status, page, limit } = {},
  user
) => {
  const result = await base.paginate({
    model: IdentityRequestModel,
    filter: { senderId: user._id, ...(status ? { status } : {}) },
    select: "messageId status createdAt",
    populate: [{ path: "messageId", select: "content attachments createdAt" }],
    options: { sort: { createdAt: -1 } },
    page,
    limit,
  });

  const { docs, ...pagination } = result;
  return { ...pagination, requests: docs };
};

export const responseRequestService = async (
  { requestId },
  { status },
  user
) => {
  const request = await base.findOne({
    model: IdentityRequestModel,
    filter: { _id: requestId, senderId: user._id },
  });

  if (!request) throw NotFoundException("Invalid RequestId");

  if (request.status !== RequestStatusEnm.PENDING) {
    throw ConflictException("Request already answered");
  }

  const updated = await IdentityRequestModel.findByIdAndUpdate(
    {
      _id: requestId,
      senderId: user._id,
      status: RequestStatusEnm.PENDING,
    },
    { status },
    { new: true }
  );
  if (!updated) throw ConflictException("Request already answered");

  let conversation;
  if (updated.status === RequestStatusEnm.ACCEPTED) {
    conversation = await ConversationModel.findOneAndUpdate(
      { messageId: updated.messageId },
      {
        $setOnInsert: {
          senderId: updated.senderId,
          receiverId: updated.requestId,
        },
      },
      { upsert: true, new: true }
    );
  }

  return {
    _id: updated._id,
    messageId: updated.messageId,
    status: updated.status,
    ...(conversation ? { conversationId: conversation._id } : {}),
  };
};
