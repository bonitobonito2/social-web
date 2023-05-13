import { User } from "../entities/user.entity";
import { userInterface } from "../interfaces/user.interface";
import { myDataSource } from "../database/db.config";
import { datetime } from "../helper/helper";

export class AuthService {
  public userRepo = myDataSource.getRepository(User);

  public async getUser(email: string): Promise<User> {
    try {
      return await this.userRepo.findOneBy({ email: email });
    } catch (err) {
      throw new Error(err);
    }
  }

  public async getUserById(id: number): Promise<User> {
    try {
      return await this.userRepo.findOneByOrFail({ id: id });
    } catch (err) {
      throw "user doesnot exsists";
    }
  }

  public async createUser(userInfo: userInterface): Promise<boolean> {
    try {
      const data = await this.userRepo.insert({
        email: userInfo.email,
        password: userInfo.password,
        createdAt: datetime(),
      });

      if (data) return true;
      return false;
    } catch (err) {
      throw new Error(err);
    }
  }

  public async changePassword(
    email: string,
    password: string
  ): Promise<Boolean> {
    try {
      const user = await this.getUser(email);
      user.password = password;

      if (await this.userRepo.save(user)) return true;
      return false;
    } catch (err) {
      throw new Error(err);
    }
  }

  public async verifeEmail(email: string): Promise<Boolean> {
    try {
      const user = await this.getUser(email);
      user.verifed = true;
      await this.userRepo.save(user);
      return true;
    } catch (err) {
      throw err;
    }
  }
}
