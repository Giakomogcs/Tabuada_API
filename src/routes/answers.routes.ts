import { Router } from "express";
import { AnswersController } from "../controllers/AnswersController";

const answersController = new AnswersController();
const answersRoutes = Router();

answersRoutes.post("/", answersController.create);
answersRoutes.put("/:id", answersController.update);
answersRoutes.delete("/:id", answersController.delete);
answersRoutes.get("/", answersController.index);
answersRoutes.get("/:id", answersController.show);

export default answersRoutes;
