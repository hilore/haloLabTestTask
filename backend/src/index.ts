import dotenv from "dotenv";
import express from "express";
import WebSocket from "ws";
import SensorManager from "./services/SensorManager";

dotenv.config();

const port: number = Number(process.env.PORT) || 4000;
const tickInterval: number = Number(process.env.TICK_INTERVAL) || 1000;

const app = express();
app.use(express.json());

const server = app.listen(port, () => {
  console.log(`\nServer is listening on port ${port}`);
});
const wss = new WebSocket.Server({server});
const sensorManager = new SensorManager();

wss.on("connection", (ws: WebSocket.WebSocket) => {
  console.log("Client connected:");
  ws.on("message", (msg: Buffer) => {
    console.log(`Received message: ${msg.toString()}`);
  });
});

const initSensors = async () => {
  await sensorManager.initSensors();
};

const updateAndBroadcastSensorsData = async () => {
  await sensorManager.updateSensors();

  const sensorsData = JSON.stringify(sensorManager.sensors);
  wss.clients.forEach((client: WebSocket.WebSocket) => {
    if (client.readyState === WebSocket.OPEN) {
      client.send(sensorsData);
    }
  });
};

initSensors();
setInterval(updateAndBroadcastSensorsData, tickInterval);
