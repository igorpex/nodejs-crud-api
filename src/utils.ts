import { IncomingMessage } from 'http';
import { validate, version } from "uuid";
import { CustomError } from './controller.js';

function getReqData(req: IncomingMessage) {
  return new Promise((resolve, reject) => {
    try {
      let body = "";
      // listen to data sent by client
      req.on("data", (chunk: Buffer) => {
        // append the string version to the body
        body += chunk.toString();
      });
      // listen till the end
      req.on("end", () => {
        // send back the data
        resolve(body);
      });
    } catch (error) {
      reject(error);
    }
  });
}

function validateUuid(uuid: string): boolean {
  return validate(uuid) && version(uuid) === 4;
};

function instanceOfCustomError(object: any): object is CustomError {
  // return 'code' in object;
  return true;
}

export { getReqData, validateUuid, instanceOfCustomError }
