import {SensorDto} from "./Types";

class Sensor {
  public static calculateTimeUntilLeaves(
    sensor: SensorDto,
    areaSize: number,
    tickIntervalMs: number
  ): number {
    function compute(pos: number, speed: number, limit: number): number {
      if (speed === 0) {
        return 0;
      }

      const times = [];
      const distanceToPositiveBorder = (limit - pos) / speed;
      const distanceToNegativeBorder = (-limit - pos) / speed;

      if (distanceToPositiveBorder > 0) {
        times.push(distanceToPositiveBorder);
      }

      if (distanceToNegativeBorder > 0) {
        times.push(distanceToNegativeBorder);
      }

      return times.length > 0 ? Math.min(...times) : 0;
    }

    const tx = compute(sensor.position.x, sensor.currentSpeed.x, areaSize);
    const ty = compute(sensor.position.y, sensor.currentSpeed.y, areaSize);
    const tz = compute(sensor.position.z, sensor.currentSpeed.z, areaSize);

    return Math.ceil(Math.min(tx, ty, tz)) * tickIntervalMs;
  }
}

export default Sensor;
