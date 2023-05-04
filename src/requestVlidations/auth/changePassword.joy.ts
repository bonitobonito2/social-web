import Joi from "joi";

import { Request, Response, NextFunction } from "express";

export const login = Joi.object({
  email: Joi.string().required(),
  currentPassword: Joi.string().required().min(4),
  newPassword: Joi.string().required().min(4),
});

export function changePasswordValidate(
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
