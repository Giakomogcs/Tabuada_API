import { Request, Response, NextFunction, RequestHandler } from "express";
import { verify } from "jsonwebtoken";
import AppError from "../utils/AppError";
import authConfig from "../configs/auth";

interface TokenPayload {
  sub: string;
  iat: number;
  exp: number;
}

const ensureAuthenticated: RequestHandler = (request, response, next) => {
  const authHeader = request.headers.authorization;

  if (!authHeader) {
    throw new AppError("JWT token não informado", 401);
  }

  const [, token] = authHeader.split(" ");

  try {
    const { sub: user_id } = verify(
      token,
      authConfig.jwt.secret
    ) as TokenPayload;
    request.user = {
      id: Number(user_id),
    };

    return next();
  } catch {
    throw new AppError("JWT token inválido", 401);
  }
};

export default ensureAuthenticated;
