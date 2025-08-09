import * as authentication from './error.authentication';
import * as file from './error.file';
import * as user from './error.user';

// TODO: add description to exception
export const Errors = {
  ...authentication,
  ...user,
  ...file,
};
