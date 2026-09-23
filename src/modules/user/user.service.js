import { ConflictException } from "../../common/exceptions/error.exceptions.js";
import {
  createLoginCredentials,
  decodeToken,
} from "../../common/security/token.security.js";
import { ACCESS_TOKEN_EXPIRES_IN } from "../../config.js";
import { findByIdAndUpdate } from "./../../common/repository/db.repository.js";
import { UserModel } from "./../../DB/model/user.model.js";

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

  return createLoginCredentials({ account: payload, issuer });
};
