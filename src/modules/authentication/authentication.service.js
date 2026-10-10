import {
  ConflictException,
  NotFoundException,
  TooManyRequestException,
} from "../../common/exceptions/index.js";
import { create, findById, findOne } from "./../../common/repository/index.js";
import { UserModel } from "./../../DB/model/user.model.js";
import {
  compare,
  createLoginCredentials,
  encryption,
  hash,
  userBaseRevokeTokenKey,
} from "../../common/security/index.js";
import { SALT_ROUNDS } from "../../config.js";
import {
  eventEmitter,
  userEmailKey,
  userEmailTrailsKey,
  userLoginOtpFailsKey,
  userLoginTrailsKey,
} from "./../../common/utils/email/index.js";
import { createOtp } from "../../common/utils/otp.js";
import {
  deleteCache,
  getCache,
  setCache,
  TTLCache,
  incrByCache,
  expireCache,
  keysCache,
  invalidateProfileCache,
} from "./../../common/services/index.js";

const sendEmailOtp = async ({
  email,
  subject,
  expiresIn = 60,
  maxTrials = 3,
  blockInSecond = 300,
}) => {
  const existOtpTtl = await TTLCache({
    key: userEmailKey({ email, subject: subject }),
  });
  if (existOtpTtl > 0) {
    throw ConflictException(
      `sorry we cannot create new otp while existing one still valid,please try agin ${existOtpTtl}s`
    );
  }

  const existOtpTrailsTtl = await TTLCache({
    key: userEmailTrailsKey({ email, subject }),
  });
  const oldTrials =
    (await getCache({ key: userEmailTrailsKey({ email, subject }) })) ?? 0;
  if (oldTrials >= maxTrials) {
    throw TooManyRequestException(
      `Max otp trails has been reached ${existOtpTrailsTtl}s`
    );
  }

  const code = createOtp();
  await setCache({
    key: userEmailKey({ email, subject: subject }),
    value: await hash(code.toString()),
    ttl: expiresIn,
  });

  const currentTrails = await incrByCache({
    key: userEmailTrailsKey({ email, subject }),
  });

  if (currentTrails == maxTrials) {
    await expireCache({
      key: userEmailTrailsKey({ email, subject }),
      ttl: blockInSecond,
    });
  }

  eventEmitter.emit("sendEmail", {
    recipients: { to: email },
    subject: subject,
    data: {
      code,
      title: "Verify Your Email Account",
      message: "Please use the code below to complete your registration:",
    },
  });
};

export const signUpService = async (body) => {
  const { userName, email, password, phone, DOB, gender } = body;

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
      DOB,
      gender,
      password: await hash(password, SALT_ROUNDS),
      phone: await encryption(phone),
    },
  });

  await sendEmailOtp({ email, subject: "Confirm_Email" });
  const userResponse = createAccount.toObject();
  delete userResponse.password;
  delete userResponse.phone;
  delete userResponse.__v;
  return userResponse;
};

export const confirmEmailService = async (body) => {
  const { email, otp } = body;

  const account = await findOne({
    model: UserModel,
    filter: { email, confirmEmail: { $exists: false } },
  });
  if (!account) throw NotFoundException("Invalid account");

  const getHashOtp = await getCache({
    key: userEmailKey({ email, subject: "Confirm_Email" }),
  });

  if (!getHashOtp || !(await compare(otp, getHashOtp)))
    throw ConflictException("Invalid otp");

  account.confirmEmail = new Date();
  await account.save();
  await deleteCache({
    key: await keysCache({
      prefix: userEmailKey({ email, subject: "Confirm_Email" }),
    }),
  });
  return;
};

export const resendConfirmEmailService = async (body) => {
  const { email } = body;

  const account = await findOne({
    model: UserModel,
    filter: { email, confirmEmail: { $exists: false } },
  });
  if (!account) throw NotFoundException("Invalid account");
  await sendEmailOtp({ email, subject: "Confirm_Email" });
  return;
};

export const forgotPasswordCodeService = async (body) => {
  const { email } = body;

  const account = await findOne({
    model: UserModel,
    filter: { email, confirmEmail: { $exists: true } },
  });
  if (!account) throw NotFoundException("Invalid account");
  await sendEmailOtp({ email, subject: "Forgot_password" });
  return;
};

export const verifyForgotPasswordCodeService = async (body) => {
  const { email, otp } = body;

  const account = await findOne({
    model: UserModel,
    filter: { email, confirmEmail: { $exists: true } },
  });
  if (!account) throw NotFoundException("Invalid account");

  const getHashOtp = await getCache({
    key: userEmailKey({ email, subject: "Forgot_password" }),
  });

  if (!getHashOtp || !(await compare(otp, getHashOtp)))
    throw ConflictException("Invalid otp");

  return account;
};

export const resetPasswordService = async (body) => {
  const { email, password } = body;
  const account = await verifyForgotPasswordCodeService(body);
  account.password = await hash(password);
  account.changeCredentialsTime = new Date();
  await account.save();

  const [revokeKeys, otpKeys] = await Promise.all([
    keysCache({ prefix: userBaseRevokeTokenKey({ userId: account._id }) }),
    keysCache({ prefix: userEmailKey({ email, subject: "Forgot_password" }) }),
  ]);

  // 4. دمج المفاتيح وحذفها من الكاش لتنظيف الذاكرة
  const keysToDelete = [
    ...(Array.isArray(revokeKeys) ? revokeKeys : []),
    ...(Array.isArray(otpKeys) ? otpKeys : []),
  ];

  if (keysToDelete.length > 0) {
    await deleteCache({ key: keysToDelete });
  }

  return { message: "Password reset successfully" };
};

export const loginService = async (body, issuer) => {
  const { email, password } = body;

  const maxTrials = 5;
  const blockInSecond = 300;

  const loginTrailsKey = userLoginTrailsKey({ email });

  const account = await findOne({
    model: UserModel,
    filter: { email },
  });

  if (!account) throw NotFoundException();

  const oldTrials =
    (await getCache({
      key: loginTrailsKey,
    })) ?? 0;

  const loginTrailsTtl = await TTLCache({
    key: loginTrailsKey,
  });

  if (oldTrials >= maxTrials) {
    throw TooManyRequestException(
      `Too many login attempts, please try again after ${loginTrailsTtl}s`
    );
  }

  const match = await compare(password, account.password);

  if (!match) {
    const currentTrails = await incrByCache({
      key: loginTrailsKey,
    });

    if (currentTrails >= maxTrials) {
      await expireCache({
        key: loginTrailsKey,
        ttl: blockInSecond,
      });
    }

    throw ConflictException("Invalid email or password");
  }

  await deleteCache({
    key: loginTrailsKey,
  });

  if (account.twoStepVerification === true) {
    await sendEmailOtp({
      email: account.email,
      subject: "Login_2Step_Verification",
    });
    return {
      requiresTwoStepVerification: true,
      message: "OTP sent. Confirm your login to receive tokens.",
    };
  }

  return await createLoginCredentials({ account, issuer });
};

export const loginConfirmationService = async (body, issuer) => {
  const { email, otp } = body;
  const maxFailedTrials = 5;

  const account = await findOne({
    model: UserModel,
    filter: { email, twoStepVerification: true },
  });
  if (!account) throw NotFoundException("Invalid account");

  const otpKey = userEmailKey({ email, subject: "Login_2Step_Verification" });
  const failsKey = userLoginOtpFailsKey({ email });

  const hashedOtp = await getCache({ key: otpKey });
  if (!hashedOtp) throw ConflictException("Invalid or expired OTP");

  if (!(await compare(otp, hashedOtp))) {
    const fails = await incrByCache({ key: failsKey });
    if (fails === 1) await expireCache({ key: failsKey, ttl: 300 });

    if (fails >= maxFailedTrials) {
      await deleteCache({ key: [otpKey, failsKey] });
      throw TooManyRequestException(
        "Too many invalid codes, please login again"
      );
    }
    throw ConflictException("Invalid or expired OTP");
  }

  await deleteCache({ key: [otpKey, failsKey] });
  return await createLoginCredentials({ account, issuer });
};

export const enableTwoStepService = async (user) => {
  const account = await findById({
    model: UserModel,
    id: user._id,
  });
  if (!account) throw NotFoundException("Account not found");

  if (account.twoStepVerification) {
    throw ConflictException("Two-step verification is already enabled");
  }

  await sendEmailOtp({
    email: account.email,
    subject: "Enable_2Step_Verification",
  });
  return {
    message: "Verification code sent to your email",
  };
};

export const confirmTwoStepService = async (user, otp) => {
  const account = await findById({
    model: UserModel,
    id: user._id,
  });
  if (!account) throw NotFoundException("Account not found");

  if (account.twoStepVerification) {
    throw ConflictException("Two-step verification is already enabled");
  }

  const otpKey = userEmailKey({
    email: account.email,
    subject: "Enable_2Step_Verification",
  });
  const hashedOtp = await getCache({ key: otpKey });
  if (!hashedOtp || !(await compare(otp, hashedOtp))) {
    throw ConflictException("Invalid or expired OTP");
  }

  account.twoStepVerification = true;
  await account.save();

  await deleteCache({ key: otpKey });
  await invalidateProfileCache({ userId: account._id });
  return { twoStepVerification: true };
};
