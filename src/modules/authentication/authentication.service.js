import {
  ConflictException,
  NotFoundException,
} from "../../common/exceptions/index.js";
import { create, findOne } from "./../../common/repository/index.js";
import { UserModel } from "./../../DB/model/user.model.js";
import {
  compare,
  createLoginCredentials,
  encryption,
  hash,
} from "../../common/security/index.js";
import { SALT_ROUNDS } from "../../config.js";

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
    data: {
      userName,
      email,
      password: await hash(password, SALT_ROUNDS),
      phone: await encryption(phone),
    },
  });
  // const userResponse = createAccount.toObject();
  // delete userResponse.password;
  // delete userResponse.__v;
  return createAccount;
};

export const loginService = async (body, issuer) => {
  const { email, password } = body;

  const account = await findOne({
    model: UserModel,
    filter: { email },
  });
  if (!account) throw NotFoundException();
  const match = await compare(password, account.password);
  if (!match) throw NotFoundException();

  return await createLoginCredentials({ account, issuer });
};
