import React, {useState, useEffect} from "react";
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
  const [tx, setTx] = useState(0);
  const [ty, setTy] = useState(0);
  const [tz, setTz] = useState(0);

  useEffect(() => {
    if (sensor.thrustersSpeed.x > 0) {
      setTx(Math.ceil(sensor.thrustersSpeed.x));
    } else {
      setTx(Math.floor(sensor.thrustersSpeed.x));
    }

    if (sensor.thrustersSpeed.y > 0) {
      setTy(Math.ceil(sensor.thrustersSpeed.y));
    } else {
      setTy(Math.floor(sensor.thrustersSpeed.y));
    }

    if (sensor.thrustersSpeed.z > 0) {
      setTz(Math.ceil(sensor.thrustersSpeed.z));
    } else {
      setTz(Math.floor(sensor.thrustersSpeed.z));
    }
  }, [sensor.thrustersSpeed.x, sensor.thrustersSpeed.y, sensor.thrustersSpeed.z]);

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
