import express, { Application, NextFunction, Request, Response } from "express";
import { myDataSource } from "./database/db.config";
import dotenv from "dotenv";
import authRouter from "./routes/auth.route";
import bodyParser from "body-parser";
import { validateToken } from "./middlewares/validateToken.middleware";
import requestRouter from "./routes/friendRequest.route";
const port = process.env.PORT ? process.env.PORT : 4500;

myDataSource
  .initialize()
  .then(() => {
    app.listen(port);
  })
  .catch((err) => {
    throw err;
  });
dotenv.config();

const app: Application = express();
app.on("connection", () => {
  console.log("connected");
});

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
