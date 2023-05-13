import { RequestHandler } from "express";

import { MessagesService } from "../../service/messages.service";
export const getMessagesByChat: RequestHandler = async (req, res, next) => {
  const chatId = req.params["id"];
  console.log(req.params);

  const messagesService = new MessagesService();
  try {
    if (chatId == undefined) throw "chat id is undefined";
    const messages = await messagesService.getChatMessages(parseInt(chatId));
    return res.json(messages);
  } catch (err) {
    next(err);
  }
};
