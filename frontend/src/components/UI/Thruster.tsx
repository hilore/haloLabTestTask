import React, {useState} from "react";

type ThrusterProps = {
  sensorName: string;
  coord: number;
  coordName: string;
  setCoord: any;
  waterSpeed: number;
};

const Thruster: React.FC<ThrusterProps> = ({sensorName, coord, coordName, setCoord, waterSpeed}) => {
  let [errMsg, setErrMsg] = useState("");

  const increment = () => {
    setCoord(coord += 1);
    adjustThrusterSpeed();
  };
  const decrement = () => {
    setCoord(coord -= 1);
    adjustThrusterSpeed();
  };

  const adjustThrusterSpeed = async () => {
    const res = await fetch(`http://localhost:4000/sensor/${sensorName}/thruster`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({[coordName]: coord})
    });
    const data = await res.json();
    if (!data.success) {
      setErrMsg(data.message);
    } else {
      setErrMsg("");
    }
  };

  const errMsgColor = errMsg.length > 0 ? "red" : "black";

  const handleInputChange = (event: any) => {
    setCoord(Number(event.target.value));
    adjustThrusterSpeed();
  };

  return (
    <div className="thruster">
      <label>Thruster {coordName.toUpperCase()}</label>
      <input
        type="number"
        value={coord}
        placeholder="type a number..."
        onChange={handleInputChange}
      />
      <button className="minus" onClick={decrement}>-</button>
      <button className="plus" onClick={increment}>+</button>
      <span>(Water Speed for {coordName.toUpperCase()} axis: {waterSpeed})</span>
      <span className="errMsg" style={{color: `${errMsgColor}`}}>{errMsg}</span><hr />
      <br />
    </div>
  );
};

export default Thruster;
