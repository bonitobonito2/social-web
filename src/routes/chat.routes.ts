import express from "express";
import {
  changePassword,
  login,
  registration,
  verifeEmail,
} from "../controller/auth/auth.controller";

const chatRoutes = express.Router();

chatRoutes.post("/createChat", registration);

export default chatRoutes;
