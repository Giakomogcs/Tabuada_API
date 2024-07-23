import { Router } from "express";
import UsersController from "../controllers/UsersController";
import UsersPictureController from "../controllers/UsersPictureController";
import ensureAuthenticated from "../middleware/ensureAuthenticated";
import multer from "multer";

import uploadConfig from "../configs/uploads";

const usersRoutes = Router();
const upload = multer(uploadConfig.MULTER);

const usersController = new UsersController();
const usersPictureController = new UsersPictureController();

usersRoutes.post("/", usersController.create);
usersRoutes.put("/:id", usersController.update);
usersRoutes.delete("/:id", usersController.delete);
usersRoutes.get("/", usersController.index);
usersRoutes.get("/:id", usersController.show);

usersRoutes.patch(
  "/picture",

  upload.single("picture"),
  usersPictureController.update
);

export default usersRoutes;
