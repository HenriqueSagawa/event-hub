import type {
  Request,
  Response,
  NextFunction,
  ErrorRequestHandler,
} from "express";
import { ApiError } from "../errors/api-error";
import { env } from "../config/env";
import { ZodError } from "zod";

export const errorMiddleware: ErrorRequestHandler = (
  error: Error,
  req: Request,
  res: Response,
  next: NextFunction,
): void => {
  let statusCode = error instanceof ApiError ? error.statusCode : 500;
  let message =
    error instanceof ApiError ? error.message : "Erro Interno do Servidor";

  if (error instanceof ZodError) {
    statusCode = 400;
    message = "Dados inválidos";
    res.status(statusCode).json({
      status: "error",
      statusCode,
      message,
      errors: error.issues,
    });
    return;
  }

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
