import { Request, Response } from "express";
import AppError from "../utils/AppError";
import knex from "../database/knex/index";
import { hash, compare } from "bcrypt";

interface User {
  id: number;
}

declare global {
  namespace Express {
    interface Request {
      user?: User;
    }
  }
}

class UsersController {
  async create(request: Request, response: Response): Promise<void> {
    let { name, email, password, birthday } = request.body;

    const currentTimestamp = new Date();

    if (!name) {
      throw new AppError("Nome é obrigatório");
    }

    if (!email) {
      throw new AppError("E-mail é obrigatório");
    }

    email = email.toLowerCase();
    const checkUserExists = await knex("users").where({ email }).first();

    if (checkUserExists) {
      throw new AppError("Esse e-mail já está em uso");
    }

    const hashedPassword = await hash(password, 8);

    const [user] = await knex("users")
      .insert({
        name,
        email,
        password: hashedPassword,
        birthday,
        created_at: currentTimestamp,
        updated_at: currentTimestamp,
      })
      .returning("id");

    response.status(201).json({ user });
  }

  async update(request: Request, response: Response): Promise<void> {
    const user_id = request.user?.id;
    //const { id } = request.params;

    const currentTimestamp = new Date();

    const { name, email, password, old_password, birthday, picture } =
      request.body;

    const user = await knex("users").where({ id: user_id }).first();

    if (!user) {
      throw new AppError("Não foi possível encontrar o usuário", 401);
    }

    user.name = name ?? user.name;
    user.birthday = birthday ?? user.birthday;
    user.picture = picture ?? user.picture;

    user.updated_at = currentTimestamp;

    if (password && !old_password) {
      throw new AppError(
        "Você precisa informar a senha antiga para alterar a senha."
      );
    }

    if (password && old_password) {
      const checkOlddPassword = await compare(old_password, user.password);

      if (!checkOlddPassword) {
        throw new AppError("A senha antiga não confere");
      }

      user.password = await hash(password, 8);
    }

    await knex("users").update(user).where({ id: user_id });

    response.status(200).json(user);
  }

  async delete(request: Request, response: Response): Promise<void> {
    const { id } = request.params;

    const user = await knex("users").where({ id }).first();

    if (!user) {
      throw new AppError("Não foi possível encontrar o user", 401);
    }

    await knex("users").where({ id }).delete();

    response.json("Usuário deletado!");
  }

  async index(request: Request, response: Response): Promise<void> {
    let user = await knex("users");

    response.status(200).json(user);
  }
}

export default UsersController;
