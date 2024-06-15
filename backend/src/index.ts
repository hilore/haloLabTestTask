import dotenv from "dotenv";
import {createClient} from "redis";
import express from "express";

dotenv.config();

const redisClient = createClient();
redisClient.on("error", (err) => {
  console.error("Redis Client Error:", err);
});

const port: number = Number(process.env.PORT) || 4000;
const app = express();

app.use(express.json());

const startApp = async () => {
  await redisClient.connect();

  app.listen(port, () => {
    console.log(`\nServer is listening on port ${port}`);
  });
};

startApp();
