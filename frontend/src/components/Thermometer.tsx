import React from "react";

type ThermometerProps = {
  temperature: number;
  temperatureMin: number;
  temperatureMax: number;
};

const Thermometer: React.FC<ThermometerProps> = ({temperature, temperatureMin, temperatureMax}) => {
  let pgColor = "#4caf50";
  const progress: number = ((temperature - temperatureMin) / (temperatureMax - temperatureMin)) * 100;

  if (temperature < 10) {
    pgColor = "#2196f3";
  } else if (temperature > 10 && temperature < temperatureMax / 2) {
    pgColor = "#ffc107";
  } else if (temperature > temperatureMax / 2) {
    pgColor = "#f44336";
  }

  return (
    <div className="progressBar">
      <div className="progress" style={{height: `${progress}%`, backgroundColor: pgColor}}></div>
    {/*<div className="temperature-mark min" style={{ bottom: '0%' }}>{temperatureMin}°</div>*/}
     {/*<div className="temperature-mark max" style={{ top: '0%' }}>{temperatureMax}°</div>*/}
    </div>
  );
};

export default Thermometer;
