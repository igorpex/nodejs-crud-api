import * as http from "http";
import 'dotenv/config';
import { users } from "./users.js"

const PORT: number = Number(process.env.PORT) || 5500;

const server = http.createServer(async (req, res) => {
  //set the request route
  if (req.url === "/api" && req.method === "GET") {
    //response headers
    res.writeHead(200, { "Content-Type": "application/json" });
    //set the response
    res.write(JSON.stringify({ message: "Hi there, This is a Hello from API" }));
    //end the response
    res.end();
  }

  else if (req.url === "/api/users" && req.method === "GET") {
    res.writeHead(200, { "Content-Type": "application/json" });
    res.write(JSON.stringify(users));
    res.end();
  }

  // If no route present
  else {
    res.writeHead(404, { "Content-Type": "application/json" });
    res.end(JSON.stringify({ message: "Route not found" }));
  }
});

server.listen(PORT, () => console.log(`Server listening on ${PORT}`));
