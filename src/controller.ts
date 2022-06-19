import { User, users } from "./users.js";
import { validateUuid } from './utils.js';
import { v4 as uuid } from 'uuid';

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

  // creating a user
  async createUser(user: User) {
    return new Promise((resolve, reject) => {
      //check everything is good
      const bodyHaveAllRequiredFields = user.username && user.age && user.hobbies;
      const bodyHasCorrectTypes = typeof user.username === 'string' && typeof user.age === 'number' && Array.isArray(user.hobbies);

      if (bodyHaveAllRequiredFields && bodyHasCorrectTypes) {
        // create a user, with random id and data sent
        let newUser = {
          id: uuid(),
          ...user,
        };
        users.push(newUser);

        // return the new created user
        resolve(newUser);
      } else {
        // return an error
        const error: CustomError = { code: 400, message: `request body does not contain required fields. name should be string, age should be number, hobbies should be array` };
        reject(error);
      }

    });
  }
}
export { Controller };
