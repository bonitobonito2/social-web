import { RequestHandler } from "express";
import jwt from "jsonwebtoken";

export const validateToken: RequestHandler = (req, res, next) => {
  const token = req.header("Authorization")?.replace("Bearer ", "");
  // console.log(token, "tokennnnnnn");
  if (!token) {
    throw new Error("u need token on protected routes");
  }
  try {
    const decoded = jwt.verify(token, "topSecret21");
    req["decoded"] = decoded;
    next();
  } catch (Err) {
    return res.status(404).send(Err);
  }
};

export const validateTokenFunction = (token: string) => {
  if (!token) {
    throw new Error("u need token on protected routes");
  }
  try {
    return jwt.verify(token, "topSecret21");
  } catch (Err) {
    throw "token is not verifed";
  }
};
