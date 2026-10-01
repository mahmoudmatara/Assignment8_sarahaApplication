import { ConflictException } from "../../common/exceptions/error.exceptions.js";
import {
  createLoginCredentials,
  createRevokeToken,
  userBaseRevokeTokenKey,
} from "../../common/security/token.security.js";
import { ACCESS_TOKEN_EXPIRES_IN } from "../../config.js";
import { findByIdAndUpdate } from "./../../common/repository/db.repository.js";
import { UserModel } from "./../../DB/model/user.model.js";
import { deleteCache, keysCache } from "./../../common/services/index.js";
import { logoutEnum } from "../../common/enum/index.js";

export const getProfileService = async (account) => {
  return account;
};

export const updateProfileService = async (account, updateData) => {
  const updateUserData = await findByIdAndUpdate({
    model: UserModel,
    id: account._id,
    updateData: updateData,
  });
  return updateUserData;
};

export const rotateTokenService = async (payload, issuer) => {
  const currentTimeInSeconds = Math.floor(Date.now() / 1000);

  const accessExpiresIn = payload.iat + ACCESS_TOKEN_EXPIRES_IN;
  const timeRemaining = accessExpiresIn - currentTimeInSeconds;
  const ROTATION_THRESHOLD_IN_SECONDS = 5 * 60;

  if (timeRemaining > ROTATION_THRESHOLD_IN_SECONDS) {
    const minutesRemaining = Math.floor(timeRemaining / 60);
    throw ConflictException(
      `Sorry, we cannot create new login credentials while current access token is still valid. You can request renewal in the last 5 minutes (remaining: ${minutesRemaining} mins).`
    );
  }

  const data = await createLoginCredentials({ account: payload, issuer });
  await createRevokeToken({ payload });
  return data;
};

export const logOutService = async (
  payload,
  user,
  { action = logoutEnum.ONE_DEVICE }
) => {
  console.log({ user });
  switch (action) {
    case logoutEnum.ALL_DEVICE:
      user.changeCredentialsTime = new Date();
      await user.save();
      // console.log({
      //   k: await keysCache({
      //     prefix: userBaseRevokeTokenKey({ userId: payload.sub }),
      //   }),
      // });
      await deleteCache({
        key: await keysCache({
          prefix: userBaseRevokeTokenKey({ userId: payload.sub }),
        }),
      });
      break;

    default:
      await createRevokeToken({ payload });
      break;
  }
  return;
};
