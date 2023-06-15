import express from "express";
import {
  changePassword,
  login,
  registration,
  verifeEmail,
} from "../controller/auth/auth.controller";
import { createChat, getUsers } from "../controller/auth/chat.controller";

const chatRoutes = express.Router();

chatRoutes.post("/createChat", createChat);

chatRoutes.get("/getUsers", getUsers);

export default chatRoutes;
