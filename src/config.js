import { resolve } from "node:path";
import { config } from "dotenv";

export const NODE_ENV = process.env.NODE_ENV;
config({ path: resolve(`.env.${NODE_ENV}`) });

export const PORT = parseInt(process.env.PORT);

export const DB_URI = process.env.MONGODB_URI;
export const SALT_ROUNDS = parseInt(process.env.SALT_ROUNDS);
export const ENCRYPTION_KEY = process.env.ENCRYPTION_KEY;

export const ACCESS_USER_TOKEN_SIGNATURE = process.env.ACCESS_USER_TOKEN_SIGNATURE;
export const ACCESS_ADMIN_TOKEN_SIGNATURE = process.env.ACCESS_ADMIN_TOKEN_SIGNATURE;
export const REFRESH_USER_TOKEN_SIGNATURE = process.env.REFRESH_USER_TOKEN_SIGNATURE;
export const REFRESH_ADMIN_TOKEN_SIGNATURE = process.env.REFRESH_ADMIN_TOKEN_SIGNATURE;


export const ACCESS_TOKEN_EXPIRES_IN = parseInt(
  process.env.ACCESS_TOKEN_EXPIRES_IN
);
export const REFRESH_TOKEN_EXPIRES_IN = parseInt(
  process.env.REFRESH_TOKEN_EXPIRES_IN
);
