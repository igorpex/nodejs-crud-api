import * as http from "http";
import 'dotenv/config';
import { Controller } from "./controller.js";
import { IncomingMessage, ServerResponse } from "http";
import { validateUuid } from './utils.js';
import { CustomError } from './controller.js';

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
      // send the data
      res.end(JSON.stringify(user));

    } catch (error: any) {
      res.writeHead(error.code, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ message: error.message }));
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
