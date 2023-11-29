import { HttpStatus } from './httpStatus.enum'

export class HttpException extends Error {
  constructor(
    public readonly httpStatusCode: HttpStatus,
    public readonly message: string,
    public readonly description?: string,
    public readonly body?: any
  ) {
    super(message)
  }
}

export class BadRequestException extends HttpException {
  constructor(message: string, description?: string, body?: any) {
    super(HttpStatus.BAD_REQUEST, message, description, body)
  }
}

export class NotFoundException extends HttpException {
  constructor(message: string, description?: string, body?: any) {
    super(HttpStatus.NOT_FOUND, message, description, body)
  }
}

export class InternalServerErrorException extends HttpException {
  constructor(message: string, description?: string, body?: any) {
    super(HttpStatus.INTERNAL_SERVER_ERROR, message, description, body)
  }
}