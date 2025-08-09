import * as authentication from './error.authentication';
import * as file from './error.file';
import * as pokemon from './error.pokemon';
import * as user from './error.user';

export const Errors = {
  ...authentication,
  ...user,
  ...file,
  ...pokemon,
};
