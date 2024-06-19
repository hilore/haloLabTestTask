import React, {useState, useEffect} from "react";
import {SensorDto} from "./services/Types";
import SensorCard from "./components/SensorCard";
import "./styles/App.css";

function App() {
  const backendPort = Number(process.env.REACT_APP_BACKEND_PORT);
  const backendWsUrl: string = `ws://localhost:${backendPort}`;
  let [sensors, setSensors] = useState<SensorDto[]>([]);

  const waterTemperatureMin = Number(process.env.REACT_APP_WATER_TEMPERATURE_MIN);
  const waterTemperatureMax = Number(process.env.REACT_APP_WATER_TEMPERATURE_MAX);

  useEffect(() => {
    const socket = new WebSocket(backendWsUrl);

    socket.onopen = () => {
      console.log("Connected");
    };

    socket.onmessage = (event) => {
      setSensors(JSON.parse(event.data));
    };

    socket.onclose = () => {
      console.log("Closed from the backend");
    };

    return () => {
      socket.close();
    };
  }, []);

  return (
    <div className="App">
      <div className="gridContainer">
        {sensors.map((sensor: SensorDto, index: number) => (
          <SensorCard
          sensor={sensor}
          temperatureMin={waterTemperatureMin}
          temperatureMax={waterTemperatureMax}
          key={index}
          />
        ))}
      </div>
    </div>
  );
}

export default App;
