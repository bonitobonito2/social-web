import { RequestHandler, response } from "express";
import { sendMeil } from "../../helper/sendMeil";
import { AuthService } from "../../service/auth.service";

import jwt from "jsonwebtoken";
import {
  getTokenForAuthentificaion,
  getTokenForValidation,
} from "../../helper/tokens";
export const registration: RequestHandler = async (request, response, next) => {
  const email = request.body["email"];
  const password = request.body["password"];
  const authService = new AuthService();

  const userExsists = await authService.getUser(email);
  const token = getTokenForValidation(email);
  if (userExsists && userExsists.verifed) {
    return response.status(404).json("user with this email already exsists");
  } else if (userExsists && !userExsists.verifed) {
    await sendMeil(email, "content", token);
    return response
      .status(401)
      .json(
        "user is already in database, but email is not verifed, we send u email verification once again."
      );
  }

  if (await authService.createUser({ email: email, password: password })) {
    await sendMeil(email, "content", token);

    return response.json(
      `${email} created, we send u verife code on email, u have 15 minutes to verife`
    );
  }
  return response.status(403).json("something went wrong");
};

export const login: RequestHandler = async (request, response, next) => {
  const email = request.body["email"];
  const password = request.body["password"];
  const authService = new AuthService();

  const userExsists = await authService.getUser(email);

  if (!userExsists) {
    return response.json("user doesnot exsists");
  }
  if (!userExsists.verifed) {
    const token = getTokenForValidation(email);

    await sendMeil(email, "xdsadsad", token);
    return response.json(
      "user is not verifed, we sent u validation on email once again"
    );
  }
  if (userExsists.password == password) {
    const token = getTokenForAuthentificaion(email);
    return response.json({ succses: true, token: token });
  } else {
    return response.status(404).json("incorrect password");
  }
};

export const changePassword: RequestHandler = async (request, response) => {
  const gmail = request.body["gmail"];
  const currentPassword = request.body["currentPassword"];
  const newPassword = request.body["newPassword"];

  const authService = new AuthService();

  const userExsts = await authService.getUser(gmail);
  if (userExsts && currentPassword == userExsts.password) {
    const passwordChanged = await authService.changePassword(
      userExsts.email,
      newPassword
    );

    return response.json({ passwordChanged });
  } else {
    return response
      .status(404)
      .json("user doesnot exsists or current password is incorrect");
  }
};

export const verifeEmail: RequestHandler = async (request, response, next) => {
  const token = request.params.verifeKey;
  const authService = new AuthService();

  try {
    const decoded = jwt.verify(token, "topSecret21");
    const email = decoded["email"];
    await authService.verifeEmail(email);
    return response.json("email verifed");
  } catch (err) {
    throw new err("something went wrong");
  }
};
