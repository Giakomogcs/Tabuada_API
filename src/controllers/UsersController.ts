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

    try {
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

      await createFirstAnswer({
        id_student,
        roomMult,
        hits,
      });

      response.status(201).json("Usuário e respostas salvas com sucesso.");
    } catch (error) {
      console.error(error);
      response.status(500).json({ error: "Internal Server Error" });
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

async function createFirstAnswer(data: {
  id_student: string;
  hits: any;
  roomMult: any;
}): Promise<void> {
  const { id_student, roomMult, hits } = data;

  // Verificar se o usuário existe
  const checkUserExists = await knex("users").where({ id: id_student }).first();

  if (!checkUserExists) {
    throw new AppError("Usuário não existe");
  }

  if (!roomMult) {
    throw new AppError("Sala de multiplicação é obrigatório");
  }

  if (!hits) {
    throw new AppError("Perguntas e respostas são obrigatórias");
  }

  const hitsJson = typeof hits === "string" ? hits : JSON.stringify(hits);

  // Inserir a resposta
  const [idAnswer] = await knex("answers")
    .insert({
      user_id: id_student,
      hits: hitsJson,
      roomMult,
      created_at: new Date(),
      updated_at: new Date(),
    })
    .returning("id");

  // Não é necessário enviar a resposta aqui, pois não estamos lidando com o `response` no contexto do `AnswersController`
  return { idAnswer } as any;
}

export default UsersController;
