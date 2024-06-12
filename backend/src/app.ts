import dotenv from "dotenv";
import {createClient} from "redis";
import express, {Request, Response} from "express";

dotenv.config();

const redisClient = createClient();
redisClient.on("error", (err) => {
  console.error("Redis Client Error:", err);
});

const port = process.env.PORT || 4000;
const app = express();

app.use(express.json());

app.get("/", (req: Request, res: Response) => {
  res.status(200).json({message: "Hello World 4"});
});

const startApp = async () => {
  await redisClient.connect();

  app.listen(port, () => {
    console.log(`\nServer is listening on port ${port}`);
  });
};

startApp();
