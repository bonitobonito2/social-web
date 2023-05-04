import Joi from "joi";

import { Request, Response, NextFunction } from "express";

export const login = Joi.object({
  email: Joi.string().required(),
  password: Joi.string().required().min(4),
});

export function loginValidation(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const { error } = login.validate(req.body);

  if (error) {
    return res.status(400).json({ message: error.message });
  }

  next();
}
