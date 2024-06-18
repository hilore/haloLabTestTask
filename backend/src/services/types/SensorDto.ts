import Coords from "./Coords";

type SensorDto = {
  readonly name: string;
  readonly position: Coords;
  readonly waterSpeed: Coords;
  readonly thrustersSpeed: Coords;
  readonly currentSpeed: Coords;
  readonly temperature: number;
  readonly lost: boolean;
};

export default SensorDto;
