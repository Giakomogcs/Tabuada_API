import { Router } from "express";
import usersRoutes from "./users.routes";
import answersRoutes from "./answers.routes";
import geminiRoutes from "./gemini.routes";

const routes = Router();
routes.use("/api/users", usersRoutes);
routes.use("/api/answers", answersRoutes);
routes.use("/api/gemini", geminiRoutes);

export default routes;
