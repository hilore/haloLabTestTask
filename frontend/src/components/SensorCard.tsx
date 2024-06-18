import React from "react";
import {SensorDto} from "../services/Types";
import Sensor from "../services/Sensor";

type SensorProps = {
  sensor: SensorDto;
};

const SensorCard: React.FC<SensorProps> = ({sensor}) => {
  const interval = 2;
  const SAFE_AREA_SIZE = 1400;
  let waterTemperature: number = Number(sensor.temperature.toFixed(2));

  let timeUntilUnsafeColor = "";
  let timeUntilUnsafe = Sensor.calculateTimeUntilLeaves(sensor, SAFE_AREA_SIZE, interval);

  const handleMouseEnter = (event: any) => {
    event.currentTarget.style.backgroundColor = "#bababa";
  };

  const handleMouseLeave = (event: any) => {
    event.currentTarget.style.backgroundColor = sensor.lost ? "#d9d9d9" : "#fcfcfc";
  };

  if (timeUntilUnsafe < 5) {
    timeUntilUnsafeColor = "#d40b1b"; // red
  } else if (timeUntilUnsafe >= 5 && timeUntilUnsafe <= 10) {
    timeUntilUnsafeColor = "#e6c005"; // yellow
  } else {
    timeUntilUnsafeColor = "#13ad1b"; // green
  }

  let cardStyle = {
    border: `4px solid ${timeUntilUnsafeColor}`,
    backgroundColor: sensor.lost ? "#d9d9d9" : "#fcfcfc",
  };

  return (
    <div
      className="card"
      style={cardStyle}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <h2>{sensor.name}</h2>
      <p>Water temperature: {waterTemperature}</p>
      <p>
        Time until safe: <span style={{color: `${timeUntilUnsafeColor}`}}>{timeUntilUnsafe}</span>
      </p>
    </div>
  );
};

export default SensorCard;
