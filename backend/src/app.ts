import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import { errorMiddleware } from "./middlewares/error.middleware.js";
import { NotFoundError } from "./errors/api-error.js";
import { router } from "./routes/index.js";

const app = express();

// Middlewares globais de Segurança e Utilidades
app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(morgan("dev"));

app.use("/api", router);

app.use((req, res, next) => {
  next(new NotFoundError("Endpoint Não Encontrado"));
});

app.use(errorMiddleware);

export default app;
