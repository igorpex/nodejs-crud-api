import request from 'supertest';
import { server } from "../dist/app.js";

const testUser = {
  username: "Vasya",
  age: 12,
  hobbies: ['paragliding'],
};


describe('CREATE - TRY WRONG UUID - TRY WRONG USER', () => {

  it('get all users (empty list)', async () => {
    const usersResponse = await request(server)
      .get('/api/users')
      .set('Accept', 'application/json')
      .expect(200)
      .expect('Content-Type', /json/);
    expect(usersResponse.status).toBe(200);
    expect(usersResponse.body).toEqual([]);
  });

  it('create new user', async () => {

    // create the user
    const userId = await request(server)
      .post('/api/users')
      .set('Accept', 'application/json')
      .send(testUser)
      .expect(201)
      .expect('Content-Type', /json/)
      .then((res) => {
        expect(typeof res.body.id).toBe('string');
        return res.body.id
      });
  });

  it('get wrong uiid:', async () => {

    // get userId is invalid (not uuid):
    const userId = '123';
    const userResponse = await request(server)
      .get(`/api/users/${userId}`)
      .set('Accept', 'application/json')
      .expect(400)
      .expect('Content-Type', /json/);
  });

  it('get non-existing user :', async () => {
    const userId = '985fb843-5f8a-41d4-a715-fe23e6db6a0d'
    // get user with non-existing uuid:
    const userResponse = await request(server)
      .get(`/api/users/${userId}`)
      .set('Accept', 'application/json')
      .expect(404)
      .expect('Content-Type', /json/);
  });

  server.close();
});

describe('TRY CREATE WRONG USER', () => {

  it('create wrong user', async () => {

    const wrongUser = {
      username: "Vasya",
      age: "77",
      hobbies: ['paragliding'],
    };

    // create the user
    const userId = await request(server)
      .post('/api/users')
      .set('Accept', 'application/json')
      .send(wrongUser)
      .expect(400)
      .expect('Content-Type', /json/)
      .then((res) => {
        return res.body
      });
  });

  server.close();
});

describe('TRY UPDATE USER WITH WRONG ID', () => {

  it('update user with wrong ID', async () => {
    const userId = '985fb843-5f8a-41d4-a715-fe23e6db6a0d'
    await request(server)
      .put(`/api/users/${userId}`)
      .set('Accept', 'application/json')
      .send({ hobbies: ['dreaming'] })
      .expect(404)
      .expect('Content-Type', /json/);
  });

  server.close();
});

it('GET non-existing resource', async () => {
  await request(server)
    .get(`/some-non/existing/resource`)
    .set('Accept', 'application/json')
    .expect(404)
    .expect('Content-Type', /json/);

  server.close();
});

