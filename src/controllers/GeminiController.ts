import { Request, Response } from "express";
import AppError from "../utils/AppError";
import { analyzeHitsWithGemini } from "../service/geminiAnalyzerGoal";
import knex from "../database/knex/index";

interface User {
  id: number;
}

interface Hit {
  question: string;
  answer: number[];
  correct: number;
  hit: boolean[];
  time: string;
}

interface Student {
  roomMult: string;
  id_student: string;
  class_id: string;
  age: string;
  hits: Hit[];
}

declare global {
  namespace Express {
    interface Request {
      user?: User;
    }
  }
}

class GeminiController {
  async analyzeHits(request: Request, response: Response): Promise<void> {
    try {
      const StudentData: Student = request.body;
      const user_id = StudentData.id_student;
      const user = await knex("users").where({ id: user_id }).first();

      if (!StudentData || !user_id || !user) {
        throw new AppError("Missing student data or user id.");
      }

      const analyzedGoal = await analyzeHitsWithGemini({ StudentData });

      response.status(201).json(analyzedGoal);
    } catch (error) {
      if (error instanceof AppError) {
        response.status(400).json({ error: error.message });
      } else {
        console.error(error);
        response.status(500).json({ error: "Internal server error" });
      }
    }
  }
}

export default GeminiController;
