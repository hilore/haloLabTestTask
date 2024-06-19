import React, {useState} from "react";
import {SensorDto} from "../services/Types";
import Thruster from "./UI/Thruster";

type SensorModalProps = {
  active: boolean;
  setActive: any;
  sensor: SensorDto;
  timeUntilUnsafe: number;
  timeColor: string;
};

const SensorModal: React.FC<SensorModalProps> = ({active, setActive, sensor, timeUntilUnsafe, timeColor}) => {
  const [tx, setTx] = useState(-Math.ceil(sensor.waterSpeed.x));
  const [ty, setTy] = useState(-Math.ceil(sensor.waterSpeed.y));
  const [tz, setTz] = useState(-Math.ceil(sensor.waterSpeed.z));

  return (
    <div className="cardModal">
      <div className="cardModalContent" style={{border: `4px solid ${timeColor}`}}>
        <h1>{sensor.name}</h1>
        {sensor.lost
          ? <p>sensor lost</p>
          : <div>
              <p>Time until leave safe area: <span style={{color: `${timeColor}`}}>{timeUntilUnsafe}</span></p>
              <Thruster
                sensorName={sensor.name}
                coord={tx}
                coordName={"x"}
                setCoord={setTx}
                waterSpeed={Math.ceil(sensor.waterSpeed.x)}
              />
              <Thruster
                sensorName={sensor.name}
                coord={ty}
                coordName={"y"}
                setCoord={setTy}
                waterSpeed={Math.ceil(sensor.waterSpeed.y)}
              />
              <Thruster
                sensorName={sensor.name}
                coord={tz}
                coordName={"z"}
                setCoord={setTz}
                waterSpeed={Math.ceil(sensor.waterSpeed.z)}
              />
            </div>
        }
        <button className="closeBtn" onClick={() => setActive(false)}>Close</button>
      </div>
    </div>
  );
};

export default SensorModal;
