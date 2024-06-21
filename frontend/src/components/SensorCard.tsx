import React, {useState} from "react";
import {SensorDto} from "../services/Types";
import Sensor from "../services/Sensor";
import SensorModal from "./SensorModal";
import Thermometer from "./Thermometer";

type SensorProps = {
  sensor: SensorDto;
  temperatureMin: number;
  temperatureMax: number;
};

const SensorCard: React.FC<SensorProps> = ({sensor, temperatureMin, temperatureMax}) => {
  const tickInterval = Number(process.env.REACT_APP_TICK_INTERVAL);
  const safeAreaSize = Number(process.env.REACT_APP_SAFE_AREA_SIZE);
  let waterTemperature: number = Number(sensor.temperature.toFixed(2));

  const [isModalActive, setModalActive] = useState<boolean>(false);

  let timeUntilUnsafeColor = "";
  let timeUntilUnsafe = Sensor.calculateTimeUntilLeaves(sensor, safeAreaSize, tickInterval / 1000);

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
    <div>
      <div
      className="card"
      style={cardStyle}
      onClick={() => setModalActive(true)}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      >
        <h2>{sensor.name}</h2>
        {!sensor.lost
          ? <div>
              <p>Water temperature: {waterTemperature}</p>
              <p>
                Time until leave safe area: <span style={{color: `${timeUntilUnsafeColor}`}}>{timeUntilUnsafe}</span>
              </p>
              <Thermometer temperature={waterTemperature} temperatureMin={temperatureMin} temperatureMax={temperatureMax}/>
            </div>
          : <p>lost</p>
        }
      </div>
      {isModalActive &&
      <SensorModal
        active={isModalActive}
        setActive={setModalActive}
        sensor={sensor}
        timeUntilUnsafe={timeUntilUnsafe}
        timeColor={timeUntilUnsafeColor}
      />}
    </div>
  );
};

export default SensorCard;
