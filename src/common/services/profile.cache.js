import { deleteCache, getCache, setCache } from "./cache.service.js";
import { findById } from "../repository/db.repository.js";
import { UserModel } from "./../../DB/model/index.js";
import { NotFoundException } from "./../exceptions/index.js";

const PROFILE_TTL = 60 * 60;

export const profileKey = ({ userId }) => {
  return `User::${userId.toString()}::Profile`;
};

export const getProfile = async ({ userId }) => {
  const key = profileKey({ userId });
  const cachedProfile = await getCache({ key });
  console.log({ key, cachedProfile });
  if (cachedProfile) return cachedProfile;
  const user = await findById({
    model: UserModel,
    id: userId,
    select: "-password",
  });
  console.log({ user });
  if (!user) throw NotFoundException("User not found");

  const profile = user.toObject();
  await setCache({ key, value: profile, ttl: PROFILE_TTL });

  return profile;
};

export const invalidateProfileCache = async ({ userId }) => {
  return await deleteCache({ key: profileKey({ userId }) });
};
