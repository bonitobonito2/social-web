import { RequestHandler } from "express";
import { ChatService } from "../../service/chat.service";
import { AuthService } from "../../service/auth.service";

export const createChat: RequestHandler = async (req, res, next) => {
  try {
    const chatService = new ChatService();
    const user1Id = parseInt(req.body["user1"]);
    const user2Id = parseInt(req.body["user2"]);

    const createChat = await chatService.createChat(user1Id, user2Id);
    return res.json({ succses: true });
  } catch (err) {
    next(err);
  }
};

export const getUsers: RequestHandler = async (req, res, next) => {
  try {
    const email = req["decoded"]["email"];

    const usersService = new AuthService();

    const getAllUsers = await usersService.getAllUsers(email);

    return res.json(getAllUsers);
  } catch (err) {
    next(err);
  }
};
