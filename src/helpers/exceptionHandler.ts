import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
} from "@nestjs/common";
import { TypeORMError } from "typeorm";

@Catch(TypeORMError)
export class TypeOrmExceptionFilter implements ExceptionFilter {
  catch(exception: TypeORMError, host: ArgumentsHost): any {
    const code: number = (exception as any).code;
    const message: string = `code: ${code} - ${(exception as any).detail || (exception as any).message}`;

    throw new HttpException(message, HttpStatus.BAD_REQUEST);
  }
}
