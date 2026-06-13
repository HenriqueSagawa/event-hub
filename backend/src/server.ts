import app from "./app";
import { env } from "./config/env";

const server = app.listen(env.PORT, () => {
    console.log(`Servidor rodando na porta ${env.PORT} - Ambiente: ${env.NODE_ENV}`);
})

const gracefulShutdown = (signal: string) => {
    console.log(`\nRecebido sinal ${signal}. Iniciando desligamento gracioso...`);
    server.close(() => {
        console.log("Servidor fechado. Encerrando processo...");
        process.exit(0);
    });
}

process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
process.on('SIGINT', () => gracefulShutdown('SIGINT'));