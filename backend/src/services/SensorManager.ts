import Sensor from "./Sensor";
import Random from "./Random";
import RedisClient from "./RedisClient";
import RandomCoords from "./RandomCoords";

class SensorManager {
  private _sensors: Sensor[];
  private redis!: RedisClient;
  public readonly names: string[];

  public constructor() {
    this._sensors = [];
    this.names = ["alpha", "beta", "gamma", "delta"];
  }

  public async initSensors(): Promise<void> {
    this.redis = await RedisClient.getInstance();

    if (this._sensors.length === 0) {
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
        this._sensors.push(sensor);
      }
    }
  }

  public async updateSensors(): Promise<void> {
    for (const s of this._sensors) {
      if (!s.isLost) {
        s.calculateNewPosition();
        if (s.isInSafeZone()) {
          s.updateWaterSpeed();
          s.updateTemperature();
          await this.redis.saveState(s);
        } else {
          s.isLost = true;
          await this.redis.saveState(s);
        }
      }
    }
  }

  public async adjustThrustersSpeed(
    name: string,
    x?: number,
    y?: number,
    z?: number
  ): Promise<void> {
    const sensor = this._sensors.find((s) => s.name === name);

    if (!sensor) {
      throw new Error(`Sensor ${name} not found`);
    }

    sensor.adjustThrustersSpeed(x, y, z);
    await this.redis.saveState(sensor);
  }

  public get sensors(): object[] {
    const data: object[] = [];

    this._sensors.forEach((s) => {
      data.push({
        name: s.name,
        position: s.position,
        waterSpeed: s.waterSpeed,
        thrustersSpeed: s.thrustersSpeed,
        temperature: s.temperature,
        lost: s.isLost,
      });
    });

    return data;
  }
}

export default SensorManager;
