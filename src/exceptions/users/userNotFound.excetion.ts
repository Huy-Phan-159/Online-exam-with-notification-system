import { NotFoundException } from '@nestjs/common';
import { ERRORS_DICTIONARY } from 'src/constraints/error-dictionary.constraint';

export class UserNotFoundException extends NotFoundException {
  constructor() {
    super(`${ERRORS_DICTIONARY.USER_NOT_FOUND}`);
  }
}
