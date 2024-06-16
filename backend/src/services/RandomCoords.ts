import Random from "./Random";
import Coords from "./types/Coords";

export default class RandomCoords {
  public static generateCoords(min: number, max: number): Coords {
    return {
      x: Random.randomNumberFromInterval(min, max),
      y: Random.randomNumberFromInterval(min, max),
      z: Random.randomNumberFromInterval(min, max),
    };
  }
};
