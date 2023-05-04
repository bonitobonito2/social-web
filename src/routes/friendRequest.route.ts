import express from "express";
import {
  changePassword,
  login,
  registration,
  verifeEmail,
} from "../controller/auth/auth.controller";
import {
  handleInvatation,
  sendFriendRequest,
} from "../controller/auth/sendRequest.controller";

const requestRouter = express.Router();

requestRouter.post("/send-friend-request", sendFriendRequest);

requestRouter.post("/handleInvatation", handleInvatation);

export default requestRouter;
