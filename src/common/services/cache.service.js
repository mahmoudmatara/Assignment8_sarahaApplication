import { client } from "../../DB/redis.connection.js";

export const setCache = async ({ key, value, ttl = undefined } = {}) => {
  if (typeof value == "object") {
    value = JSON.stringify(value);
  }
  return await client.set(key, value, { EX: ttl });
};

export const getCache = async ({ key }) => {
  let value = await client.get(key);
  try {
    return (value = JSON.parse(value));
  } catch (error) {
    return value;
  }
};

export const existCache = async ({ key }) => {
  return await client.exists(key);
};

export const deleteCache = async ({ key } = {}) => {
  if (!key) return 0;

  if (Array.isArray(key)) {
    if (key.length === 0) return 0;
    return await client.del(key);
  }
  return await client.del(key);
};

export const keysCache = async ({ prefix } = {}) => {
  return await client.keys(`${prefix}*`);
};

export const TTLCache = async ({ key } = {}) => {
  if (!key) return -2;
  return await client.ttl(key);
};

export const expireCache = async ({ key, ttl } = {}) => {
  return await client.expire(key, ttl);
};

export const incrByCache = async ({ key, value = 1 } = {}) => {
  return await client.incrBy(key, value);
};


