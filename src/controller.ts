import { User, users } from "./users.js";
import { validateUuid } from './utils.js';
import { v4 as uuid } from 'uuid';
import { getReqData, instanceOfCustomError } from './utils.js';
import { getUnpackedSettings } from 'http2';

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

  async updateUser(id: string, userData: User) {
    return new Promise((resolve, reject) => {
      // check uuid is valid or return error
      if (!validateUuid(id)) {
        const error: CustomError = { code: 400, message: `userId ${id} is invalid (not uuid)` }
        reject(error);
      };

      // find user
      const existingUser = users.find((user) => user.id === id);

      //check user exist
      if (!existingUser) {
        // return an error
        const error: CustomError = { code: 404, message: `User with id ${id} doesn't exist` };
        reject(error);
      }

      //update requred fields all required fields
      if (userData.username && typeof userData.username === 'string') {
        existingUser!.username = userData.username;
      };

      if (userData.age && typeof userData.age === 'number') {
        existingUser!.age = userData.age;
      };

      if (userData.hobbies && Array.isArray(userData.hobbies)) {
        existingUser!.hobbies = userData.hobbies;
      };

      // return updated user
      resolve(existingUser);
    });
  }

  // deleting user
  async deleteUser(id: string) {
    return new Promise((resolve, reject) => {
      // check uuid is valid or return error
      if (!validateUuid(id)) {
        const error: CustomError = { code: 400, message: `userId ${id} is invalid (not uuid)` }
        reject(error);
      };

      // get the user
      let existingUserId = users.findIndex((user) => user.id === id!);
      if (existingUserId > -1) {
        //delete user
        users.splice(existingUserId, 1);
        resolve("User Deleted");
      } else {
        // return an error
        const error: CustomError = { code: 404, message: `User with id ${id} doesn't exist` };
        reject(error);
      }
    });
  }

}
export { Controller };
