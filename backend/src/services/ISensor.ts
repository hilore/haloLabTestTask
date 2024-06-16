import Coords from "./types/Coords";

interface ISensor {
  isInSafeZone(): boolean;
  adjustThrustersSpeed(x?: number, y?: number, z?: number): void;
  calucateCurrentSpeed(): Coords;
  updateWaterSpeed(): void;
  updateTemperature(): void;
  calculateNewPosition(): void;
};

export default ISensor;
