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
