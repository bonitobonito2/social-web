import { createClient } from "redis";

export default function redisClient() {
  const redisClient = createClient();

  redisClient.connect();

  redisClient.on("connect", () => {
    console.log("Redis client connected");
  });

  redisClient.on("error", (err) => {
    console.error("Redis error:", err);
  });

  return redisClient;
}
