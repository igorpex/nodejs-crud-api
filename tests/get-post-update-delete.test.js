import request from 'supertest';
import { server } from "../dist/app.js";

const testUser = {
  username: "Vasya",
  age: 12,
  hobbies: ['paragliding'],
};


it('Get empty list of users', (done) => {
  request(server)
    .get('/api/users')
    .expect('Content-Type', /json/)
    .expect(200)
    .expect([]).end(done);
});


describe('GET EMPTY - CREATE - UPDATE DELETE - GET EMPTY', () => {

  it('get all users (empty list)', async () => {
    const usersResponse = await request(server)
      .get('/api/users')
      .set('Accept', 'application/json')
      .expect(200)
      .expect('Content-Type', /json/)
      .expect([]);
    expect(usersResponse.status).toBe(200);
    expect(Array.isArray(usersResponse.body)).toBe(true);
  });


  it('create new user -> get user by ID -> update-user -> delete user - get empty users list', async () => {

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

    // get prevously created user:
    const userResponse = await request(server)
      .get(`/api/users/${userId}`)
      .set('Accept', 'application/json')
      .expect(200)
      .expect('Content-Type', /json/);

    expect(userResponse.body).toBeInstanceOf(Object);
    expect(userResponse.body.id).toEqual(userId);

    // update existing user
    await request(server)
      .put(`/api/users/${userId}`)
      .set('Accept', 'application/json')
      .send({ hobbies: ['sleepeng'] })
      .expect(200)
      .expect('Content-Type', /json/);


    // get prevously updated user with new hobby:
    const updatedUserResponse = await request(server)
      .get(`/api/users/${userId}`)
      .set('Accept', 'application/json')
      .expect(200)
      .expect('Content-Type', /json/);

    expect(updatedUserResponse.body).toBeInstanceOf(Object);
    expect(updatedUserResponse.body.hobbies).toEqual(['sleepeng']);

    // clean up
    await request(server)
      .delete(`/api/users/${userId}`)
      .then((res) =>
        expect([200, 204]
          .includes(res.status))
          .toBe(true));


    const usersResponse = await request(server)
      .get('/api/users')
      .set('Accept', 'application/json')
      .expect(200)
      .expect('Content-Type', /json/);
    expect(usersResponse.status).toBe(200);
    expect(usersResponse.body).toEqual([]);
  });

  server.close();
});

