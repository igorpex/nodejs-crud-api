export interface User {
  username: string;
  age: number;
  hobbies: string[];
};

export interface UserWithId extends User {
  id: string;
};

export const users: UserWithId[] = [];


// export const users: UserWithId[] = [{
//   username: "Vasya",
//   age: 12,
//   hobbies: ['paragliding'],
//   id: '985fb843-5f8a-41d4-a715-fe23e6db6a0d'
// }];
