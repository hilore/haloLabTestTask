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
    const waterSpeedMin = Number(process.env.WATER_SPEED_MIN);
    const waterSpeedMax = Number(process.env.WATER_SPEED_MAX);
    const waterSpeedIncMin = Number(process.env.WATER_SPEED_INC_MIN);
    const waterSpeedIncMax = Number(process.env.WATER_SPEED_INC_MAX);

    this._waterSpeed.x += Random.randomNumberFromInterval(
      waterSpeedIncMin, waterSpeedIncMax
    );
    
    //if (this._waterSpeed.x < waterSpeedMin) {
    //  this._waterSpeed.x = waterSpeedMin;
    //} else if (this._waterSpeed.x > waterSpeedMax) {
    //  this._waterSpeed.x = waterSpeedMax;
    //}

    this._waterSpeed.y += Random.randomNumberFromInterval(
      waterSpeedIncMin, waterSpeedIncMax
    );

    //if (this._waterSpeed.y < waterSpeedMin) {
    //  this._waterSpeed.y = waterSpeedMin;
    //} else if (this._waterSpeed.y > waterSpeedMax) {
    //  this._waterSpeed.y = waterSpeedMax;
    //}

    this._waterSpeed.z += Random.randomNumberFromInterval(
      waterSpeedIncMin, waterSpeedIncMax
    );

    //if (this._waterSpeed.z < waterSpeedMin) {
    //  this._waterSpeed.z = waterSpeedMin;
    //} else if (this._waterSpeed.z > waterSpeedMax) {
    //  this._waterSpeed.z = waterSpeedMax;
    //}
  }

  public updateTemperature(): void {
    const waterTempMin = Number(process.env.WATER_TEMPERATURE_MIN);
    const waterTempMax = Number(process.env.WATER_TEMPERATURE_MAX);

    this._temperature += Random.randomNumberFromInterval(
      Number(process.env.WATER_TEMPERATURE_INC_MIN),
      Number(process.env.WATER_TEMPERATURE_INC_MAX)
    );

    //if (this._temperature < waterTempMin) {
    //  this._temperature = waterTempMin;
    //} else if (this._temperature > waterTempMax) {
    //  this._temperature = waterTempMax;
    //}
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

  public set isLost(value: boolean) {
    this._isLost = value;
  }
}

export default Sensor;
