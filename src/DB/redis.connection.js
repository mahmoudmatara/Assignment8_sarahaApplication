import { createClient } from "redis";
import { REDIS_URI } from "../config.js";

export const client = createClient({
  url: REDIS_URI,
});

export async function connectRedis() {
  try {
    await client.connect();
    console.log(`REDIS CONNECTION STABLISH SUCCESSFULLY`);
  } catch (error) {
    console.log(`FAIL TO STABLISH REDIS CONNECTION`);
  }
}
