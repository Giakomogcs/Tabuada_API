import express, { Request, Response, NextFunction } from "express";
import "express-async-errors";
import dotenv from "dotenv";
import AppError from "./utils/AppError";
import postgresConnection from "./database/postgres";
import routes from "./routes";

import uploadConfig from "./configs/uploads";

dotenv.config();
postgresConnection();

const app = express();
app.use(express.json());

app.use("/files", express.static(uploadConfig.UPLOADS_FOLDER));
app.use(routes);

app.use(
  (error: Error, request: Request, response: Response, next: NextFunction) => {
    if (error instanceof AppError) {
      return response.status(error.statusCode).json({
        status: "error",
        message: error.message,
      });
    }

    console.error(error);

    return response.status(500).json({
      status: "error",
      message: "Internal server error",
    });
  }
);

const PORT = 3333;

app.listen(PORT, () => console.log(`Server is running on Port ${PORT}`));
