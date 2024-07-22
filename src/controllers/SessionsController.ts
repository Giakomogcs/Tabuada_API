import { Request, Response } from "express";
import AppError from "../utils/AppError";
import knex from "../database/knex/index";
import { compare } from "bcrypt";

import authConfig from "../configs/auth";
import { sign } from "jsonwebtoken";

class SessionsController {
  async create(request: Request, response: Response): Promise<void> {
    const { email, password } = request.body;

    if (!email) {
      throw new AppError("E-mail é obrigatório");
    }

    const user = await knex("users").where({ email }).first();

    if (!user) {
      throw new AppError("E-mail e/ou senha incorreta", 401);
    }

    const passwordMatched = await compare(password, user.password);

    if (!passwordMatched) {
      throw new AppError("E-mail e/ou senha incorreta", 401);
    }

    const { secret, expiresIn } = authConfig.jwt;
    const token = sign({}, secret, {
      subject: String(user.id),
      expiresIn,
    });

    response.json({ user, token });
  }
}

export default SessionsController;
