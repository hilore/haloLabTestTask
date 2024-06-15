import Sensor from "./Sensor";
import {createClient, RedisClientType} from "redis";

class RedisClient {
  private static instance: RedisClient;
  private client: RedisClientType;

  private constructor() {
    this.client = createClient();
  }

  public static getInstance(): RedisClient {
    if (!RedisClient.instance) {
      RedisClient.instance = new RedisClient();
    }

    return RedisClient.instance;
  }

  public async getState(name: string): Promise<Sensor|null> {
    const data = await this.client.hGetAll(name);
    if (Object.keys(data).length === 0) {
      return null;
    }

    const position = JSON.parse(data.position);
    const wSpeed = JSON.parse(data.waterSpeed);
    const tSpeed = JSON.parse(data.thrustersSpeed);
    const temp = parseFloat(data.temperature);
    const isLost = data.lost === "true";
    const sensor = new Sensor(name, position, wSpeed, tSpeed, temp, isLost);

    return sensor;
  }

  public async saveState(sensor: Sensor): Promise<number> {
    const result = await this.client.hSet(sensor.name, {
      position: JSON.stringify(sensor.position),
      waterSpeed: JSON.stringify(sensor.waterSpeed),
      thrustersSpeed: JSON.stringify(sensor.thrustersSpeed),
      temperature: JSON.stringify(sensor.temperature)
    });

    return result;
  }
}

export default RedisClient;
