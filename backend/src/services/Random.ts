export default class Random {
  public static randomNumberFromInterval(min: number, max: number): number {
    return Math.random() * (max - min) + min;
  }
}
