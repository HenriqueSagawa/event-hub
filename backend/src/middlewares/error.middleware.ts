import type {
  Request,
  Response,
  NextFunction,
  ErrorRequestHandler,
} from "express";
import { ApiError } from "../errors/api-error.js";
import { env } from "../config/env.js";

export const errorMiddleware: ErrorRequestHandler = (
  error: Error,
  req: Request,
  res: Response,
  next: NextFunction,
): void => {
  const statusCode = error instanceof ApiError ? error.statusCode : 500;
  const message =
    error instanceof ApiError ? error.message : "Erro Interno do Servidor";

  if (statusCode === 500) {
    console.error(`[Erro Crítico] ${error.stack || error.message}`);
  }

  res.status(statusCode).json({
    status: "error",
    statusCode,
    message,
    ...(env.NODE_ENV === "development" && { stack: error.stack }),
  });
};
