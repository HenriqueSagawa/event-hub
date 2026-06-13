export class ApiError extends Error {
  public readonly statusCode: number;

  constructor(statusCode: number, message: string) {
    super(message);
    this.statusCode = statusCode;
    Object.setPrototypeOf(this, ApiError.prototype);
  }
}

export class BadRequestBodyError extends ApiError {
  constructor(message: string = "Requisição Inválida") {
    super(400, message);
  }
}

export class UnauthorizedError extends ApiError {
  constructor(message: string = "Não Autorizado") {
    super(401, message);
  }
}

export class ForbiddenError extends ApiError {
  constructor(message: string = "Acesso Proibido") {
    super(403, message);
  }
}

export class NotFoundError extends ApiError {
  constructor(message: string = "Recurso Não Encontrado") {
    super(404, message);
  }
}

export class InternalServerError extends ApiError {
  constructor(message: string = "Erro Interno do Servidor") {
    super(500, message);
  }
}
