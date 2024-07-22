import { Router } from "express";
import usersRoutes from "./users.routes";
import sessionsRoutes from "./sessions.routes";

const routes = Router();
routes.use("/api/users", usersRoutes);
routes.use("/api/sessions", sessionsRoutes);

export default routes;
