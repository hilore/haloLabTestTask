import Sensor from "./Sensor";
import Random from "./Random";
import RedisClient from "./RedisClient";
import RandomCoords from "./RandomCoords";

class SensorManager {
  private sensors: Sensor[];
  private tickInterval: number;
  private tickTimeout: NodeJS.Timeout | number;
  private redis: RedisClient;
  public readonly names: string[];

  public constructor() {
    this.sensors = [];
    this.tickInterval = parseInt(process.env.TICK_INTERVAL || "1000");
    this.redis = RedisClient.getInstance();
    this.names = ["alpha", "beta", "gamma", "delta"];
    this.tickTimeout = 0;
  }

  public async initSensors(): Promise<void> {
    if (this.sensors.length === 0) {
      for (const name of this.names) {
        let sensor: Sensor;
        const cachedSensor = await this.redis.getState(name);

        if (cachedSensor) {
          sensor = cachedSensor;
        } else {
          const position = RandomCoords.generateCoords(
            Number(process.env.SENSOR_POSITION_MIN),
            Number(process.env.SENSOR_POSITION_MAX)
          );
          const waterSpeed = RandomCoords.generateCoords(
            Number(process.env.WATER_SPEED_MIN),
            Number(process.env.WATER_SPEED_MAX)
          );
          const thrustersSpeed = {
            x: -waterSpeed.x,
            y: -waterSpeed.y,
            z: -waterSpeed.z,
          };
          const temperature = Random.randomNumberFromInterval(
            Number(process.env.WATER_TEMPERATURE_MIN),
            Number(process.env.WATER_TEMPERATURE_MAX)
          );

          sensor = new Sensor(name, position, waterSpeed, thrustersSpeed, temperature);
          await this.redis.saveState(sensor);
        }
        this.sensors.push(sensor);
      }
    }
  }

  public startUpdatingSensors(): void {
    this.tickTimeout = setInterval(async () => {
      await this.updateSensors();
    }, this.tickInterval);
  }

  public stopUpdateSensors(): void {
    clearInterval(this.tickTimeout);
  }

  public async updateSensors(): Promise<void> {
    for (const s of this.sensors) {
      if (!s.isLost) {
        s.calculateNewPosition();
        if (s.isInSafeZone()) {
          s.updateWaterSpeed();
          s.updateTemperature();
          await this.redis.saveState(s);
        }
      }
    }
  }
}

export default SensorManager;
