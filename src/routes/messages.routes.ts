import express from "express";
import {
  changePassword,
  login,
  registration,
  verifeEmail,
} from "../controller/auth/auth.controller";

import { getMessagesByChat } from "../controller/auth/messages.controller";

const messagesRouter = express.Router();

messagesRouter.get("/getMessages/:id", getMessagesByChat);

export default messagesRouter;
