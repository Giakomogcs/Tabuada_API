import { Router } from "express";
import usersRoutes from "./users.routes";
import sessionsRoutes from "./answers.routes";

const routes = Router();
routes.use("/api/users", usersRoutes);
routes.use("/api/answers", sessionsRoutes);

export default routes;
