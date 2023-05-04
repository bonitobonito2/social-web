import express, { Application, NextFunction, Request, Response } from "express";
import { myDataSource } from "./database/db.config";
import dotenv from "dotenv";
import http from "http";

import authRouter from "./routes/auth.route";
import bodyParser from "body-parser";
import { validateToken } from "./middlewares/validateToken.middleware";
import { Server, Socket } from "socket.io";
import requestRouter from "./routes/friendRequest.route";
const port = process.env.PORT ? process.env.PORT : 4500;
import { startSocket } from "./socket/socket";

const app: Application = express();

myDataSource
  .initialize()
  .then(() => {
    const server = http.createServer(app);

    const io = startSocket(server);

    server.listen(port, () => {
      console.log(`Server started at http://localhost:${port}`);
    });
  })
  .catch((err) => {
    throw err;
  });
dotenv.config();

app.use(bodyParser.json());
app.use("/auth", authRouter);

app.use(validateToken);

app.use("/request", requestRouter);

app.use("*", (Request, Response) => {
  Response.json("Incorect request route");
});

app.use((err: Error, req: Request, res: Response) => {
  return res.status(503).json(err.message);
});
