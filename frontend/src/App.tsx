import React, {useState, useEffect} from "react";
import {SensorDto} from "./services/Types";
import SensorCard from "./components/SensorCard";
import "./styles/App.css";

function App() {
  const BACKEND_PORT = 4000;
  const backendWsUrl: string = `ws://localhost:${BACKEND_PORT}`;
  let [sensors, setSensors] = useState<SensorDto[]>([]);

  const tempMin = -4;
  const tempMax = 44;

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
          temperatureMin={tempMin}
          temperatureMax={tempMax}
          key={index}
          />
        ))}
      </div>
    </div>
  );
}

export default App;
