import { Request, Response } from "express";
import AppError from "../utils/AppError";
import knex from "../database/knex/index";
import GeminiController from "./GeminiController";
import UsersController from "./UsersController";
import { analyzeHitsWithGemini } from "../service/geminiAnalyzerGoal";

class AnswersController {
  async create(request: Request, response: Response): Promise<void> {
    try {
      const { name, class_id, age, id_student, roomMult, hits, picture } =
        request.body;
      const geminiController = new GeminiController();
      const usersController = new UsersController();

      // Verificar se o usuário existe
      const checkUserExists = await knex("users")
        .where({ id: id_student })
        .first();

      const StudentData = {
        name,
        class_id,
        age,
        id_student,
        roomMult,
        hits,
        picture,
      };

      if (!checkUserExists) {
        await usersController.createBeforeFirstAnswer(StudentData);
      }

      if (!roomMult) {
        throw new AppError("Sala de multiplicação é obrigatório");
      }

      if (!hits) {
        throw new AppError("Perguntas e respostas são obrigatórias");
      }

      const hitsJson = typeof hits === "string" ? hits : JSON.stringify(hits);
      const customRequest: any = {
        id_student,
        hits: hitsJson,
        roomMult: roomMult,
      };
      //const analyzedGoal = await geminiController.resultIA(customRequest);
      const analyzedGoal = await analyzeHitsWithGemini({ customRequest });

      // Criar a resposta para enviar ao cliente
      const responsePayload = {
        id_student,
        roomMult,
        resultIA: analyzedGoal.resultIA,
        sumary: analyzedGoal.sumary,
      };

      // Salvar no banco de dados e enviar a resposta simultaneamente
      await Promise.all([
        knex("answers").insert({
          user_id: id_student,
          resultIA: analyzedGoal,
          roomMult,
          hits: hitsJson,
          created_at: new Date(),
          updated_at: new Date(),
        }),
        response.status(201).json(analyzedGoal), // Enviar a resposta ao cliente
      ]);
    } catch (error) {
      if (error instanceof AppError) {
        response.status(400).json({ error: error.message });
      } else {
        console.error(error);
        response.status(500).json({ error: "Erro ao salvar respostas." });
      }
    }
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
