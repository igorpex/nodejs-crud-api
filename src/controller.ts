import { users } from "./users.js";
import { validateUuid } from './utils.js';

export interface CustomError {
  code: number,
  message: string
}

class Controller {
  // getting all users
  async getUsers() {
    // return all users
    return new Promise((resolve, _) => resolve(users));
  }

  // getting a single user
  async getUser(id: string) {
    return new Promise((resolve, reject) => {
      // check uuid is valid or return error
      if (!validateUuid(id)) {
        const error: CustomError = { code: 400, message: `userId ${id} is invalid (not uuid)` }
        reject(error);
      };

      // get the user
      let user = users.find((user) => user.id === id);
      if (user) {
        // return user
        resolve(user);
      } else {
        // return an error
        const error: CustomError = { code: 404, message: `User with id ${id} doesn't exist` };
        reject(error);
      }
    });
  }
}
export { Controller };
