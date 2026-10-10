import {
  ConflictException,
  ForbiddenException,
} from "../../common/exceptions/error.exceptions.js";
import {
  createLoginCredentials,
  createRevokeToken,
  userBaseRevokeTokenKey,
} from "../../common/security/token.security.js";
import { ACCESS_TOKEN_EXPIRES_IN, SALT_ROUNDS } from "../../config.js";
import {
  findById,
  findByIdAndDelete,
  findByIdAndUpdate,
} from "./../../common/repository/db.repository.js";
import { UserModel } from "./../../DB/model/user.model.js";
import {
  deleteCache,
  getProfile,
  invalidateProfileCache,
  keysCache,
} from "./../../common/services/index.js";
import { logoutEnum } from "../../common/enum/index.js";
import { compare, decryption, hash } from "../../common/security/index.js";
import { encryption } from "./../../common/security/index.js";
import { NotFoundException } from "./../../common/exceptions/index.js";

export const getProfileService = async (account) => {
  const profile = { ...account };
  if (profile.phone) {
    profile.phone = await decryption(profile.phone);
  }
  return profile;
};

export const updateProfileService = async (account, updateData) => {
  const { userName, oldPassword, password, confirmPassword, ...data } =
    updateData;

  if (userName) {
    const [firstName, lastName] = userName.split(/\s/);
    data.firstName = firstName;
    data.lastName = lastName;
  }
  if (data.phone) data.phone = await encryption(data.phone);
  console.log("account id:", account._id);
  if (password) {
    const user = await findById({
      model: UserModel,
      id: account._id,
      select: "password",
    });
    if (!(await compare(oldPassword, user.password))) {
      throw ConflictException("Invalid old password");
    }
    if (await compare(password, user.password)) {
      throw ConflictException(
        "New password must be different from the old one"
      );
    }
    data.password = await hash(password, SALT_ROUNDS);
    // يلغي كل التوكنات القديمة
    data.changeCredentialsTime = new Date();
  }
  await findByIdAndUpdate({
    model: UserModel,
    id: account._id,
    updateData: data,
  });
  await invalidateProfileCache({ userId: account._id });
  return await getProfileService(await getProfile({ userId: account._id }));
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
  // console.log({ user });
  switch (action) {
    case logoutEnum.ALL_DEVICE:
      await findByIdAndUpdate({
        model: UserModel,
        id: user._id,
        updateData: { changeCredentialsTime: new Date() },
      });
      await invalidateProfileCache({ userId: user._id });

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

const cleanDeletedUser = async ({ userId }) => {
  await invalidateProfileCache({ userId });
  const revokeKeys = await keysCache({
    prefix: userBaseRevokeTokenKey({ userId }),
  });
  if (revokeKeys?.length) await deleteCache({ key: revokeKeys });
};

export const deletedAccountService = async (account, { password }) => {
  const user = await findById({
    model: UserModel,
    id: account._id,
    select: "password",
  });
  if (!user) {
    await invalidateProfileCache({ userId: account._id });
    throw NotFoundException("User not Found");
  }
  if (!(await compare(password, user.password))) {
    throw ConflictException("Invalid password");
  }
  await findByIdAndDelete({
    model: UserModel,
    id: account._id,
  });

  await cleanDeletedUser({ userId: account._id });
  return;
};

export const deletedUserService = async (admin, { userId }) => {
  if (userId == admin._id.toString()) {
    throw ForbiddenException(
      "Use DELETE /users/profile to delete your own account"
    );
  }
  const user = await findByIdAndDelete({
    model: UserModel,
    id: userId,
  });
  if (!user) throw NotFoundException("User not Found");
  await cleanDeletedUser({ userId });
  return;
};
