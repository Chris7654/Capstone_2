import React, { useState, useEffect, useRef } from "react";
import * as tf from "@tensorflow/tfjs";
import "@tensorflow/tfjs-backend-webgl"; // set backend to webgl
import Loader from "./components/loader";
import ButtonHandler from "./components/btn-handler";
import { detectImage, detectVideo } from "./utils/detect";
import "./style/App.css";

const App = () => {
  const [loading, setLoading] = useState({ loading: true, progress: 0 }); // loading state
  const [model, setModel] = useState({
    net: null,
    inputShape: [1,640,640,3],
  }); // init model & input shape

  // references
  const imageRef = useRef(null);
  const cameraRef = useRef(null);
  const videoRef = useRef(null);
  const canvasRef = useRef(null);

  // model configs
  const modelName = "yolov5n";
  const classThreshold = 1;

  useEffect(() => {
    tf.ready().then(async () => {
      const yolov5 = await tf.loadGraphModel(
        'https://tfmodelcapstone.s3.us-east-2.amazonaws.com/model.json',
        {
          onProgress: (fractions) => {
            setLoading({ loading: true, progress: fractions }); // set loading fractions
          },
        }
      ); // load model

      // warming up model
      // console.log(yolov5)
      const dummyInput = tf.ones([1,640,640,3]);
      const warmupResult = await yolov5.executeAsync(dummyInput);
      tf.dispose(warmupResult); // cleanup memory
      tf.dispose(dummyInput); // cleanup memory

      setLoading({ loading: false, progress: 1 });
      setModel({
        net: yolov5,
        inputShape: yolov5.inputs[0].shape,
      }); // set model & input shape
    });
  }, []);

  return (
    <div className="App">
      {loading.loading && <Loader>Loading model... {(loading.progress * 100).toFixed(2)}%</Loader>}
      <div className="header">
        <h1>Sign Wizard 🧙</h1>
      </div>

      <div className="content">
        <img
          src="#"
          ref={imageRef}
          onLoad={() => detectImage(imageRef.current, model, classThreshold, canvasRef.current)}
        />
        <video
          autoPlay
          muted
          ref={cameraRef}
          onPlay={() => detectVideo(cameraRef.current, model, classThreshold, canvasRef.current)}
        />
        <video
          autoPlay
          muted
          ref={videoRef}
          onPlay={() => detectVideo(videoRef.current, model, classThreshold, canvasRef.current)}
        />
        <canvas width={model.inputShape[1]} height={model.inputShape[2]} ref={canvasRef} />
      </div>

      <ButtonHandler imageRef={imageRef} cameraRef={cameraRef} videoRef={videoRef} />
    </div>
  );
};

export default App;
