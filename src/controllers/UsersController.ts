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
    try {
      let { name, class_id, age, id_student, roomMult, hits, picture } =
        request.body;

      const currentTimestamp = new Date();

      if (!id_student) {
        throw new AppError("Id é obrigatório");
      }

      // Verificar se o usuário existe
      const checkUserExists = await knex("users")
        .where({ id: id_student })
        .first();

      if (checkUserExists) {
        throw new AppError("Usuário já existe");
      }

      const [user] = await knex("users")
        .insert({
          id: id_student,
          name,
          class_id,
          age,
          created_at: currentTimestamp,
          updated_at: currentTimestamp,
          picture,
        })
        .returning("id");

      response.status(201).json("Usuário salvo com sucesso.");
    } catch (error) {
      if (error instanceof AppError) {
        response.status(400).json({ error: error.message });
      } else {
        console.error(error);
        response.status(500).json({ error: "Internal Server Error" });
      }
    }
  }

  async createBeforeFirstAnswer(data: any): Promise<void> {
    try {
      const { name, class_id, age, id_student, roomMult, hits, picture } = data;

      const currentTimestamp = new Date();

      if (!id_student) {
        throw new AppError("Id é obrigatório");
      }

      // Verificar se o usuário existe
      const checkUserExists = await knex("users")
        .where({ id: id_student })
        .first();

      if (checkUserExists) {
        throw new AppError("Usuário já existe");
      }

      const [user] = await knex("users")
        .insert({
          id: id_student,
          name,
          class_id,
          age,
          created_at: currentTimestamp,
          updated_at: currentTimestamp,
          picture,
        })
        .returning("id");

      return;
    } catch (error) {
      console.error(error);
    }
  }

  async update(request: Request, response: Response): Promise<void> {
    //const user_id = request.user?.id;
    const { id } = request.params;

    const currentTimestamp = new Date();

    const { name, class_id, age, picture } = request.body;

    const user = await knex("users").where({ id }).first();

    if (!user) {
      throw new AppError("Não foi possível encontrar o usuário", 401);
    }

    user.name = name ?? user.name;
    user.class_id = class_id ?? user.class_id;
    user.age = age ?? user.age;
    user.picture = picture ?? user.picture;

    user.updated_at = currentTimestamp;

    await knex("users").update(user).where({ id });

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

  async show(request: Request, response: Response): Promise<void> {
    const { id } = request.params;
    let user = await knex("users").where(id).first();

    response.status(200).json(user);
  }
}

export default UsersController;
