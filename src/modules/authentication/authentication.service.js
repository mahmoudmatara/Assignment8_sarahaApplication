import {
  ConflictException,
  NotFoundException,
} from "../../common/exceptions/index.js";
import { create, findOne } from "./../../common/repository/index.js";
import { UserModel } from "./../../DB/model/user.model.js";

export const signUpService = async (body) => {
  const { userName, email, password, phone } = body;

  const account = await findOne({
    model: UserModel,
    filter: { email },
    select: "email",
  });
  if (account) throw ConflictException();
  const createAccount = await create({
    model: UserModel,
    data: { userName, email, password, phone },
  });

  return createAccount;
};

export const loginService = async (body) => {
  const { email, password } = body;

  const account = await findOne({
    model: UserModel,
    filter: { email, password },
    select: "-password",
  });
  if (!account) throw NotFoundException();

  return account;
};
