import express, { Application } from "express";
import morgan from "morgan";
import { apiRoute } from "./routes";
import { redisConnect } from "./utils/redis";
import cors from "cors";
export default class App {
  private app: Application;

  constructor() {
    this.app = express();
    this.initialMiddleware();
    this.initialRoute();
    this.initialRedis();
  }

  public startServer() {
    this.app.listen(process.env.PORT, () => {
      console.log(`Server is running at PORT`, process.env.PORT);
    });
  }
  private initialMiddleware() {
    this.app.use(express.json());
    this.app.use(express.urlencoded({ extended: false }));
    this.app.use(morgan("dev"));
    this.app.use(cors());
  }
  private initialRoute() {
    this.app.use(apiRoute);
  }
  private initialRedis() {
    redisConnect();
  }
}
