import dotenv from "dotenv";
import express, {Request, Response, NextFunction} from "express";
import WebSocket from "ws";
import SensorManager from "./services/SensorManager";
import requestMwd from "./middlewares/requestMiddleware";

dotenv.config();

const port: number = Number(process.env.PORT) || 4000;
const tickInterval: number = Number(process.env.TICK_INTERVAL) || 1000;

const app = express();
const server = app.listen(port, () => {
  console.log(`\nServer is listening on port ${port}`);
});
const wss = new WebSocket.Server({server});
const sensorManager = new SensorManager();

app.use(express.json());
app.use((req: Request, res: Response, next: NextFunction) => {
  res.header("Access-Control-Allow-Origin", process.env.FRONTEND_URL);
  res.header("Access-Control-Allow-Methods", "GET, POST");
  res.header("Access-Control-Allow-Headers", "Content-Type, Token");
  next();
});
app.options("*", (req: Request, res: Response) => {
  res.header("Access-Control-Allow-Origin", process.env.FRONTEND_URL);
  res.header("Access-Control-Allow-Methods", "GET, POST");
  res.header("Access-Control-Allow-Headers", "Content-Type, Token");
  res.sendStatus(200);
});

// TODO: move this logic somewhere else
app.post(
  "/sensor/:name/thruster",
  requestMwd,
  async (req: Request, res: Response) => {
    try {
      const name = req.params.name;
      const {x, y, z} = req.body;
      const sensorData = sensorManager.sensors.find((s) => s.name === name);
      await sensorManager.adjustThrustersSpeed(name, x, y, z);

      return res.status(200).json({
        success: true,
        sensor: {...sensorData}
      });
    } catch (err: unknown) {
      if (err instanceof Error) {
        const [statusCode, errMsg] = err.message.split(":");
        return res.status(parseInt(statusCode)).json({
          success: false,
          message: errMsg
        });
      }
    }
  }
);

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
  const sensorsData = JSON.stringify(sensorManager.sensors);
  wss.clients.forEach((client: WebSocket.WebSocket) => {
    if (client.readyState === WebSocket.OPEN) {
      client.send(sensorsData);
    }
  });

  await sensorManager.updateSensors();
};

initSensors();
setInterval(updateAndBroadcastSensorsData, tickInterval);
