import { RequestHandler } from "express";
import { RequestService } from "../../service/request.service";
import { AuthService } from "../../service/auth.service";
export const sendFriendRequest: RequestHandler = async (req, res, next) => {
  const email = req["decoded"]["email"];
  try {
    const friendEmail = req.body.email;
    if (friendEmail == undefined) throw "ups";

    const authService = new AuthService();
    const requestService = new RequestService();

    const user = await authService.getUser(email);
    const friend = await authService.getUser(friendEmail);
    if (!user || !friend) throw "user doesnot exsists";
    await requestService.sendRequest(user, friend);

    return res.json("request sent");
  } catch (err) {
    console.log(err);
    next(err);
  }
};

export const handleInvatation: RequestHandler = async (req, res, next) => {
  const email = req["decoded"]["email"];
  console.log(email);
  try {
    const status = req.body.status;
    const senderEmail = req.body.email;
    const authService = new AuthService();
    const requestService = new RequestService();
    const sender = await authService.getUser(senderEmail);
    const reciver = await authService.getUser(email);

    if (sender && reciver) {
      res.json(await requestService.handleInvatation(sender, reciver, status));
    }
  } catch (err) {
    next(err);
  }
};
