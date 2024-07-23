import { Request, Response } from "express";
import AppError from "../utils/AppError";
import knex from "../database/knex/index";

class AnswersController {
  async create(data: {
    id_student: string;
    hits: any;
    roomMult: any;
  }): Promise<void> {
    const { id_student, roomMult, hits } = data;

    // Verificar se o usuário existe
    const checkUserExists = await knex("users")
      .where({ id: id_student })
      .first();

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

  async update(request: Request, response: Response): Promise<void> {
    const { id } = request.params;
    const { id_student, hits } = request.body;
    const currentTimestamp = new Date();

    const answer = await knex("answers").where({ id }).first();

    if (!answer) {
      throw new AppError("Não foi possível encontrar a resposta", 401);
    }

    if (!hits) {
      throw new AppError("É obrigatório fornecer as respostas", 401);
    }

    answer.hits = hits;

    await knex("tags").update(answer).where({ id });

    response.status(200).json(answer);
  }

  async delete(request: Request, response: Response): Promise<void> {
    const { id } = request.params;

    const answer = await knex("answers").where({ id }).first();

    if (!answer) {
      throw new AppError("Não foi possível encontrar a resposta", 401);
    }

    await knex("answers").where({ id }).delete();

    response.json("Produto deletado!");
  }

  async index(request: Request, response: Response): Promise<void> {
    let answer = await knex("answers");

    response.status(200).json(answer);
  }

  async show(request: Request, response: Response): Promise<void> {
    const { id } = request.params;
    let answers = await knex("answers").where({ id });

    response.status(200).json(answers);
  }
}

export { AnswersController };
