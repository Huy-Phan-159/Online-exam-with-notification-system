export enum ERRORS_DICTIONARY {
  // Users
  USER_EXISTED = 'User already existed',
  USER_NOT_FOUND = 'User not found',

  // CLASS VALIDATOR
  VALIDATION_ERROR = 'ValidationError',
  //
  AUTHORIZE_ERROR = "You're not authorize",
  TOKEN_ERROR = 'Token invalid',

  //QUESTION
  CREATE_QUESTION_FAIL = 'Create question fail',
  QUESTION_NOT_FOUND = 'Question not found',

  //author
  NOT_RIGHTS = 'Not rights',
  // CLASS ENTITY
  NOT_FOUND_ANY_CLASS = 'Not found any class',
  UNIQUE_CONSTRAINT = 'Unique constraint',
  NOT_RECORD_WAS_DELETED = 'NOT record was deleted',

  // EXAM
  EXAM_NOT_FOUND = 'Exam not found',
  EXAM_NAME_EXIST = 'Exam name already exists'
}
