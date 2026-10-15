import { createClient } from "redis";
import { REDIS_URI } from "../config.js";

export const client = createClient({
  url: REDIS_URI,
});

client.on("error", (error) => {
  console.error("Redis Client Error:", error);
});

export async function connectRedis() {
  try {
    if (!client.isOpen) {
      await client.connect();
    }
    console.log("REDIS CONNECTION ESTABLISHED SUCCESSFULLY");
  } catch (error) {
    console.error("FAILED TO CONNECT TO REDIS:", error);
    throw error;
  }
}
