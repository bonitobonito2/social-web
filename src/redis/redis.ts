import { createClient } from "redis";

export class redisInstance {
  redisClient = createClient();

  start() {
    this.redisClient.connect();

    this.redisClient.on("connect", () => {
      console.log("Redis client connected");
    });

    this.redisClient.on("error", (err) => {
      console.error("Redis error:", err);
    });
    return this.redisClient;
  }
}
