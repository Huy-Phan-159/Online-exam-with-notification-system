import { BadRequestException } from '@nestjs/common';
import { ERRORS_DICTIONARY } from 'src/constraints/error-dictionary.constraint';

export class UserExistsException extends BadRequestException {
  constructor() {
    super(`${ERRORS_DICTIONARY.USER_EXISTED}`);
  }
}
