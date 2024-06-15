import ISensor from "./ISensor";
import Random from "./Random";
import Coords from "./types/Coords";

class Sensor implements ISensor {
  public readonly name: string;
  private _position!: Coords;
  private _waterSpeed!: Coords;
  private _thrustersSpeed!: Coords;
  private _temperature!: number;
  private _isLost: boolean;

  public constructor(
    name: string,
    position: Coords,
    waterSpeed: Coords,
    thrustersSpeed: Coords,
    temperature: number,
    isLost: boolean=false
  ) {
    this.name = name;
    this._position = position;
    this._waterSpeed = waterSpeed;
    this._thrustersSpeed = thrustersSpeed;
    this._temperature = temperature;
    this._isLost = isLost;
  }

  public calculateNewPosition(): void {
    this._position.x += this._waterSpeed.x + this._thrustersSpeed.x;
    this._position.y += this._waterSpeed.y + this._thrustersSpeed.y;
    this._position.z += this._waterSpeed.z + this._thrustersSpeed.z;
  }

  public updateWaterSpeed(): void {
    this._waterSpeed.x += Random.randomNumberFromInterval(
      Number(process.env.WATER_SPEED_INC_MIN),
      Number(process.env.WATER_SPEED_INC_MAX)
    );
    this._waterSpeed.y += Random.randomNumberFromInterval(
      Number(process.env.WATER_SPEED_INC_MIN),
      Number(process.env.WATER_SPEED_INC_MAX)
    );
    this._waterSpeed.z += Random.randomNumberFromInterval(
      Number(process.env.WATER_SPEED_INC_MIN),
      Number(process.env.WATER_SPEED_INC_MAX)
    );
  }

  public updateTemperature(): void {
    this._temperature = Random.randomNumberFromInterval(
      Number(process.env.WATER_TEMPERATURE_INC_MIN),
      Number(process.env.WATER_TEMPERATURE_INC_MAX)
    );
  }

  public isInSafeZone(): boolean {
    const {x, y, z} = this._position;
    const safeAreaSize = Number(process.env.SAFE_AREA_SIZE || 50);

    return Math.abs(x) <= safeAreaSize &&
      Math.abs(y) <= safeAreaSize &&
      Math.abs(z) <= safeAreaSize;
  }

  public adjustThrustersSpeed(x?: number, y?: number, z?: number): void {
    if (x !== undefined && x !== null) {
      this._thrustersSpeed.x += x;
    }

    if (y !== undefined && y !== null) {
      this._thrustersSpeed.y += y;
    }

    if (z !== undefined && z !== null) {
      this._thrustersSpeed.z += z;
    }
  }

  public calucateCurrentSpeed(): Coords {
    const x = this._waterSpeed.x + this._thrustersSpeed.x;
    const y = this._waterSpeed.y + this._thrustersSpeed.y;
    const z = this._waterSpeed.z + this._thrustersSpeed.z;

    return {x, y, z};
  }

  public get position(): Coords {
    return this._position;
  }

  public get waterSpeed(): Coords {
    return this._waterSpeed;
  }

  public get thrustersSpeed(): Coords {
    return this._thrustersSpeed;
  }

  public get temperature(): number {
    return this._temperature;
  }

  public get isLost(): boolean {
    return this._isLost;
  }
}

export default Sensor;
