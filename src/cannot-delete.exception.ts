import { HttpException, HttpStatus } from '@nestjs/common';
import { createHttpExceptionBody } from '@nestjs/common/utils/http-exception-body.util';

export class CannotDeleteException extends HttpException {

  constructor(entity: string) {
    super(createHttpExceptionBody(
      `cannot delete ${entity}. Other objects depend on it. `, 'DELETE_FOREIGN_KEY_VIOLATION', HttpStatus.BAD_REQUEST
      ), HttpStatus.BAD_REQUEST
    );
  }

}
