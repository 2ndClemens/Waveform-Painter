import React from "react";
import logo from "./logo.svg";
import "./App.css";

//this is the webaudio loooooppppppp
//enter url in the next line
var url = "sine.wav";

/* --- set up web audio --- */
//create the context
var context = new AudioContext();
//...and the source
var source = context.createBufferSource();
//connect it to the destination so you can hear it.
source.connect(context.destination);

/* --- load buffer ---  */
var request = new XMLHttpRequest();
//open the request
request.open("GET", url, true);
//webaudio paramaters
request.responseType = "arraybuffer";
//Once the request has completed... do this
request.onload = function () {
  context.decodeAudioData(
    request.response,
    function (response) {
      /* --- play the sound AFTER the buffer loaded --- */
      //set the buffer to the response we just received.
      var c: any = document.getElementById("canvas");
      var ctx = c.getContext("2d");
      ctx.beginPath();
      ctx.moveTo(0, 0);

      const newArrayBuffer = context.createBuffer(1, 256, response.sampleRate);
      const anotherArray = new Float32Array(newArrayBuffer.length);
      for (let n = 0; n < newArrayBuffer.length; n++) {
        anotherArray[n] = Math.sin((n / 256) * Math.PI * 8) / 4;
        ctx.lineTo(n,  anotherArray[n]*100 + 100);
      }
      ctx.stroke();
      newArrayBuffer.copyToChannel(anotherArray, 0);
      /* newArrayBuffer.copyToChannel(
        response.getChannelData(0).slice(0.1024),
        0
      ); */
      source.buffer = newArrayBuffer;
      console.log(source.buffer.getChannelData(0));
      //start(0) should play asap.
      source.start(0);
      source.loop = true;
    },
    function () {
      console.error("The request failed.");
    }
  );
};
//Now that the request has been defined, actually make the request. (send it)
request.send();

function App() {
  return (
    <div className="App">
      <canvas id="canvas" width="512" height="512"></canvas>
      <button onClick={() => context.resume()}>start</button>
      <button onClick={() => context.suspend()}>stop</button>
    </div>
  );
}

export default App;
