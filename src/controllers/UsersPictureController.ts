import { Request, Response } from "express";
import knex from "../database/knex";
import AppError from "../utils/AppError";
import DiskStorage from "../providers/DiskStorage";

class UsersPictureController {
  async update(request: Request, response: Response): Promise<void> {
    try {
      const user_id = request.user?.id;
      const pictureFilename = request.file?.filename;

      if (!user_id || !pictureFilename) {
        throw new AppError(
          "Usuário ou nome do arquivo do picture não encontrado",
          400
        );
      }

      const diskStorage = new DiskStorage();
      const user = await knex("users").where({ id: user_id }).first();

      if (!user) {
        throw new AppError("Usuário não encontrado", 401);
      }

      if (user.picture) {
        await diskStorage.deleteFile(user.picture);
      }

      const filename = await diskStorage.saveFile(pictureFilename);
      user.picture = filename;

      await knex("users").update(user).where({ id: user_id });

      response.json(user);
    } catch (error: any) {
      console.error(error);
      response
        .status(error.statusCode || 500)
        .json({ error: error.message || "Erro interno do servidor" });
    }
  }
}

export default UsersPictureController;
