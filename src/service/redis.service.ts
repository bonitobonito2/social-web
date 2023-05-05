import redisClient from "../redis/redis";
export class redisClass {
  private readonly client = redisClient();
  constructor() {}

  async setSocketClient(email: string, socketId: string): Promise<string> {
    try {
      //   await this.client.flushAll();
      const data = await this.client.set(email, socketId);
      return data;
    } catch (err) {
      throw err;
    }
  }

  async getClientId(email: string): Promise<string> {
    try {
      const clientId = await this.client.get(email);
      return clientId;
    } catch (err) {
      throw err;
    }
  }

  async getAllUsers() {
    const keys = await this.client.keys("*");
    console.log(keys);
  }

  async removeClientId(socketId: string) {
    try {
      const keys = await this.client.keys("*");
      console.log(keys);
      const values = await Promise.all(
        keys.map(async (key) => await this.client.get(key))
      );
      const correctIndex = values.findIndex((value) => value === socketId);
      console.log(values);
      console.log(keys);
      await this.client.del(keys[correctIndex]);

      return "deleted";
    } catch (err) {
      throw err;
    }
  }
}

export const redisService = new redisClass();
