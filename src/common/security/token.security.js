import jwt from "jsonwebtoken";
import { UserModel } from "../../DB/model/user.model.js";
import {
  BadRequestException,
  NotFoundException,
} from "../exceptions/error.exceptions.js";
import { decryption } from "./encryption.security.js";
import { tokenTypeEnum } from "./../enum/security.token.js";
import { findById } from "../repository/db.repository.js";
import { RoleEnum } from "../enum/index.js";
import {
  ACCESS_ADMIN_TOKEN_SIGNATURE,
  ACCESS_TOKEN_EXPIRES_IN,
  ACCESS_USER_TOKEN_SIGNATURE,
  REFRESH_ADMIN_TOKEN_SIGNATURE,
  REFRESH_TOKEN_EXPIRES_IN,
  REFRESH_USER_TOKEN_SIGNATURE,
} from "../../config.js";

export const createToken = ({
  payload = {},
  secret = ACCESS_USER_TOKEN_SIGNATURE,
  options = {},
} = {}) => {
  return jwt.sign(payload, secret, options);
};

export const verifyToken = async ({
  token = "",
  secret = ACCESS_USER_TOKEN_SIGNATURE,
} = {}) => {
  return jwt.verify(token, secret);
};

const getTokenSignatures = async ({ roleType = RoleEnum.USER } = {}) => {
  let signatures;
  switch (roleType) {
    case RoleEnum.ADMIN:
      signatures = {
        accessSignatures: ACCESS_ADMIN_TOKEN_SIGNATURE,
        refreshSignatures: REFRESH_ADMIN_TOKEN_SIGNATURE,
      };
      break;

    default:
      signatures = {
        accessSignatures: ACCESS_USER_TOKEN_SIGNATURE,
        refreshSignatures: REFRESH_USER_TOKEN_SIGNATURE,
      };
      break;
  }
  return signatures;
};

const getSignature = async ({
  tokenType = tokenTypeEnum.ACCESSTOKEN,
  role = RoleEnum.USER,
} = {}) => {
  const signatures = await getTokenSignatures({ roleType: role });
  return tokenType == tokenTypeEnum.ACCESSTOKEN
    ? signatures.accessSignatures
    : signatures.refreshSignatures;
};

export const decodeToken = async ({
  authorization = "",
  tokenType = tokenTypeEnum.ACCESSTOKEN,
} = {}) => {
  const decoded = jwt.decode(authorization);
  if (!decoded?.aud?.length) throw BadRequestException("missing token payload");
  console.log({ decoded });
  const payload = await verifyToken({
    token: authorization,
    secret: await getSignature({ tokenType, role: decoded.aud[0] }),
  });

  if (!payload?.sub) throw BadRequestException("missing token payload");

  const profileData = await findById({
    model: UserModel,
    id: payload.sub,
    select: "-password",
  });

  if (!profileData) throw NotFoundException();

  profileData.phone = await decryption(profileData.phone);
  return { profileData, payload };
};

export const createLoginCredentials = async ({
  account,
  issuer,
  options = {},
} = {}) => {
  const { accessSignatures, refreshSignatures } = await getTokenSignatures({
    roleType: account.role,
  });
  const userId = account._id || account.sub || account.id || account;
  const access_token = createToken({
    payload: { sub: userId },
    options: {
      issuer,
      ...options,
      audience: [account.role],
      expiresIn: ACCESS_TOKEN_EXPIRES_IN,
    },
    secret: accessSignatures,
  });

  const refresh_token = createToken({
    payload: { sub: userId },
    options: {
      issuer,
      ...options,
      audience: [account.role],
      expiresIn: REFRESH_TOKEN_EXPIRES_IN,
    },
    secret: refreshSignatures,
  });
  console.log({ accessSignatures, refreshSignatures });
  return { access_token, refresh_token };
};
