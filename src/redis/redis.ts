import Redis from "ioredis";
export class RedisInstance {
  // Create a Redis client instance with the host and port in the connection string
  private redisClient = new Redis({ host: "redis", port: 6379 });

  start() {
    this.redisClient.on("connect", () => {
      console.log("Redis client connected");
    });

    this.redisClient.on("error", (err) => {
      console.error("Redis error:", err);
    });

    return this.redisClient;
  }
}
