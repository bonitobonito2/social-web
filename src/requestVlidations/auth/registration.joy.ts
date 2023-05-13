import Joi from "joi";

import { Request, Response, NextFunction } from "express";

export const registration = Joi.object({
  email: Joi.string().required().email(),
  password: Joi.string().required().min(4),
});

export function validateRegistration(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const { error } = registration.validate(req.body);

  if (error) {
    return res.status(400).json({ message: error.message });
  }

  next();
}
