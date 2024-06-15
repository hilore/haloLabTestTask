import Coords from "./types/Coords";

interface ISensor {
  update(): void;
  isInSafeZone(): boolean;
  adjustThrustersSpeed(x?: number, y?: number, z?: number): void;
  calucateCurrentSpeed(): Coords;
};

export default ISensor;
