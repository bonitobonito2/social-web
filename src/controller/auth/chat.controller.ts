import { RequestHandler } from "express";
import { ChatService } from "../../service/chat.service";

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
