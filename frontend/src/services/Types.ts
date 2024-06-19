type Coords = {
  x: number;
  y: number;
  z: number;
};

type SensorDto = {
  readonly name: string;
  readonly position: Coords;
  readonly waterSpeed: Coords;
  readonly thrustersSpeed: Coords;
  readonly currentSpeed: Coords;
  readonly temperature: number;
  readonly lost: boolean;
};

export type {
  Coords,
  SensorDto
};
