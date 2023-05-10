import express from "express";
import {
  changePassword,
  login,
  registration,
  verifeEmail,
} from "../controller/auth/auth.controller";
import { createChat } from "../controller/auth/chat.controller";

const chatRoutes = express.Router();

chatRoutes.post("/createChat", createChat);

export default chatRoutes;
