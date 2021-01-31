import React from "react";
import logo from "./logo.svg";
import "./App.css";

var context = new AudioContext();

const playCanvas = () => {
  var source = context.createBufferSource();
  source.connect(context.destination);
  var c: any = document.getElementById("canvas");
  var ctx = c.getContext("2d");
  ctx.beginPath();
  ctx.moveTo(0, 0);

  const newArrayBuffer = context.createBuffer(1, 1024, 88200);
  const anotherArray = new Float32Array(newArrayBuffer.length);
  for (let n = 0; n < newArrayBuffer.length; n++) {
    anotherArray[n] = Math.sin((n / 256) * Math.PI * 4) / 4;
    ctx.lineTo(n, anotherArray[n] * 100 + 100);
  }
  ctx.stroke();
  newArrayBuffer.copyToChannel(anotherArray, 0);
  source.buffer = newArrayBuffer;
  console.log(source.buffer.getChannelData(0));
  source.start(0);
  source.loop = true;
};

function App() {
  setTimeout(() => {
    playCanvas();
  });

  return (
    <div className="App">
      <canvas id="canvas" width="1024" height="512"></canvas>
      <button onClick={() => context.resume()}>start</button>
      <button onClick={() => context.suspend()}>stop</button>
    </div>
  );
}

export default App;
