import React from "react";
import "./App.css";
import data from "./data.json";

function generateD(data, zoom) {
  return data.prices
    .map(
      ([timestamp, price], index) =>
        `${index === 0 ? "M" : "L"} ${(timestamp / 1000 / 60 / 60 / 24 -
          16400) *
          zoom} ${price * zoom}`
    )
    .join(" ");
}

function getMaxSize(data, zoom) {
  const maxSize = {
    x: 0,
    y: 0
  };
  data.prices.forEach(([timestamp, price]) => {
    const x = (timestamp / 1000 / 60 / 60 / 24 - 16400) * zoom;
    const y = price * zoom;
    if (x > maxSize.x) {
      maxSize.x = x;
    }
    if (y > maxSize.y) {
      maxSize.y = y;
    }
  });
  return maxSize;
}

const Text = ({ timestamp, zoom, maxY }) => {
  function newDate(timestamp) {
    const date = new Date(timestamp);
    return `${date.getFullYear()}-${date.getMonth()}-${date.getDay()}`;
  }
  return (
    <text
      style={{ font: `bold ${10 * zoom}px sans-serif` }}
      x={(timestamp / 1000 / 60 / 60 / 24 - 16400) * zoom}
      y={maxY}
    >
      {newDate(timestamp)}
    </text>
  );
};

function App() {
  const [zoom, setZoom] = React.useState(1);

  const [hoverX, setHoverX] = React.useState(0);

  function handlePlusZoom() {
    setZoom(zoom + 0.1);
  }
  function handleMinusZoom() {
    setZoom(zoom - 0.1);
  }

  function handleChangeZoom({ target: { value } }) {
    setZoom(value);
  }

  function hoverDate(ev) {
    setHoverX(ev.clientX - ev.target.clientLeft);
    console.dir(ev.currentTarget);
  }

  return (
    <div className="App">
      <div style={{ position: "absolute", bottom: 0, right: 0 }}>
        <button onClick={handlePlusZoom}>+</button>
        <input
          type="range"
          min="1"
          max="10"
          value={zoom}
          onChange={handleChangeZoom}
        />
        <button onClick={handleMinusZoom}>-</button>
      </div>
      <div width="100%">
        <svg
          style={{ position: "absolute", top: 0, left: 0 }}
          onMouseMove={hoverDate}
          viewBox={`0 0 ${getMaxSize(data, zoom).x} ${
            getMaxSize(data, zoom).y
          }`}
          width={`${getMaxSize(data, zoom).x}px`}
          height={`${getMaxSize(data, zoom).y}px`}
        >
          <rect
            x={hoverX * zoom}
            y="0"
            width={1 * zoom}
            height="100%"
            stroke="black"
            fill="rgba(0,0,0,.3)"
          />
          <path
            fill="none"
            stroke="red"
            strokeWidth={zoom}
            d={generateD(data, zoom)}
          />
          {data.prices
            .filter((el, index) => index % Math.abs((15 - zoom) * 10) === 0)
            .map(([timestamp, price]) => (
              <Text
                key={timestamp}
                timestamp={timestamp}
                zoom={zoom}
                maxY={getMaxSize(data, zoom).y}
              />
            ))}
        </svg>
      </div>
    </div>
  );
}

export default App;
