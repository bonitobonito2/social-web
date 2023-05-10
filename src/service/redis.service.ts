import { redisInstance } from "./../redis/redis";

export class redisClass extends redisInstance {
  private readonly client = this.start();

  constructor() {
    super();
  }

  public async removeSocketIdByUserId(userId: string) {
    try {
      await this.client.del(userId);
    } catch (err) {
      throw err;
    }
  }

  async setSocketClient(id: string, socketId: string): Promise<string> {
    try {
      const data = await this.client.set(id, socketId);
      return data;
    } catch (err) {
      throw err;
    }
  }

  async getClientId(id: string): Promise<string> {
    try {
      const clientId = await this.client.get(id);
      return clientId;
    } catch (err) {
      throw err;
    }
  }

  async getAllUsers() {
    const keys = await this.client.keys("*");
    const values = await Promise.all(
      keys.map(async (key) => await this.client.get(key))
    );
    console.log(values);
    console.log(keys);
  }

  async getClientBySocketId(socketId: string) {
    try {
      const keys = await this.client.keys("*");
      const values = await Promise.all(
        keys.map(async (key) => await this.client.get(key))
      );
      console.log(keys, "keys/// \n", values, "values \n", socketId);
      const correctIndex = values.findIndex((value) => value == socketId);
      console.log(correctIndex);
      console.log(values[correctIndex], "resultttt");
      return keys[correctIndex];
    } catch (err) {
      throw err;
    }
  }
  async removeClientId(socketId: string) {
    try {
      const keys = await this.client.keys("*");
      const values = await Promise.all(
        keys.map(async (key) => await this.client.get(key))
      );
      const correctIndex = values.findIndex((value) => value === socketId);
      // console.log(keys, values);
      console.log(correctIndex);

      if (correctIndex !== -1) await this.client.del(keys[correctIndex]);
      await this.getAllUsers();
      return "deleted";
    } catch (err) {
      throw err;
    }
  }
}

export const redisService = new redisClass();
