export class ApiError extends Error {
  public readonly statusCode: number;

  constructor(statusCode: number, message: string) {
    super(message);
    this.statusCode = statusCode;
    this.name = this.constructor.name;
    Object.setPrototypeOf(this, new.target.prototype);
  }
}

export class BadRequestBodyError extends ApiError {
  constructor(message: string = "Requisição Inválida") {
    super(400, message);
    this.name = 'BadRequestBodyError';
  }
}

export class UnauthorizedError extends ApiError {
  constructor(message: string = "Não Autorizado") {
    super(401, message);
    this.name = 'UnauthorizedError';
  }
}

export class ForbiddenError extends ApiError {
  constructor(message: string = "Acesso Proibido") {
    super(403, message);
    this.name = 'ForbiddenError';
  }
}

export class NotFoundError extends ApiError {
  constructor(message: string = "Recurso Não Encontrado") {
    super(404, message);
    this.name = 'NotFoundError';
  }
}

export class InternalServerError extends ApiError {
  constructor(message: string = "Erro Interno do Servidor") {
    super(500, message);
    this.name = 'InternalServerError';
  }
}
