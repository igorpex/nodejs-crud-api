import * as http from "http";
import 'dotenv/config';
import { Controller } from "./controller.js";
import { IncomingMessage, ServerResponse } from "http";
import { getReqData, instanceOfCustomError } from './utils.js';




const PORT: number = Number(process.env.PORT) || 5500;

const server = http.createServer(async (req: IncomingMessage, res: ServerResponse) => {
  let url = req.url as string;

  // GET api/users
  if (url === "/api/users" && req.method === "GET") {
    // get users
    const users = await new Controller().getUsers();
    // set the status code, and content-type
    res.writeHead(200, { "Content-Type": "application/json" });
    // send the data
    res.end(JSON.stringify(users));
  }

  // GET api/users/${userId}
  else if (url.match(/\/api\/users\/.+/) && req.method === "GET") {
    try {
      // get id from url
      const matches = url.match(/\/api\/users\/(.+)/);
      const id = matches![1];
      // get user
      const user = await new Controller().getUser(id);
      // set the status code, and content-type
      res.writeHead(200, { "Content-Type": "application/json" });
      // send the user data
      res.end(JSON.stringify(user));

    } catch (error) {
      if (instanceOfCustomError(error)) {
        res.writeHead(error.code, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ message: error.message }));
      }
    }
  }

  // POST api/users
  else if (req.url === "/api/users" && req.method === "POST") {
    try {
      // get the data sent along
      let user = await getReqData(req);
      // create the user
      if (typeof user === "string") {
        let newUser = await new Controller().createUser(JSON.parse(user));
        // set the status code and content-type
        res.writeHead(201, { "Content-Type": "application/json" });
        //send the user
        res.end(JSON.stringify(newUser));
      }
    } catch (error) {
      if (instanceOfCustomError(error)) {
        res.writeHead(error.code, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ message: error.message }));
      }
    }
  }


  // PUT api/users/{userId}

  else if (url.match(/\/api\/users\/.+/) && req.method === "PUT") {
    try {
      // get id from url
      const matches = url.match(/\/api\/users\/(.+)/);
      const id = matches![1];

      // get the data sent along
      let user = await getReqData(req);
      // update user
      if (typeof user === "string") {
        let updatedUser = await new Controller().updateUser(id, JSON.parse(user));
        res.writeHead(200, { "Content-Type": "application/json" });
        res.end(JSON.stringify(updatedUser));
      }

    } catch (error) {
      if (instanceOfCustomError(error)) {
        res.writeHead(error.code, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ message: error.message }));
      }
    }
  }

  // DELETE api/users/${userId}
  else if (url.match(/\/api\/users\/.+/) && req.method === "DELETE") {
    try {
      // get id from url
      const matches = url.match(/\/api\/users\/(.+)/);
      const id = matches![1];
      // get user
      const deletedUser = await new Controller().deleteUser(id);
      // set the status code, and content-type
      res.writeHead(204, { "Content-Type": "application/json" });
      // send response
      res.end();

    } catch (error) {
      if (instanceOfCustomError(error)) {
        res.writeHead(error.code, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ message: error.message }));
      }
    }
  }

  // If no route present
  else {
    res.writeHead(404, { "Content-Type": "application/json" });
    res.end(JSON.stringify({ message: "Route not found" }));
  }
});

server.listen(PORT, () => console.log(`Server listening on ${PORT}, check at http://localhost:${PORT}/api/users or http://127.0.0.1:${PORT}/api/users`));

export { server };
