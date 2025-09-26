import React, { useEffect, useRef, useState } from "react";
import * as faceapi from "face-api.js";
import "./Faceexpression.css";
import axios from "axios";
import ChatHeader from "../../components/ChatHeader.jsx";
import { useUser } from "../../context/UserContext"; 
export default function FaceExpressionDetector({title}) {
  const videoRef = useRef(null);
  const detectionInterval = useRef(null);
  const { user, isDesktop } = useUser();

  const [tracking, setTracking] = useState(false);
  const [expressionCounts, setExpressionCounts] = useState({});
  const [totalDetections, setTotalDetections] = useState(0);
  const [results, setResults] = useState(null);

  const startVideo = () => {
    navigator.mediaDevices
      .getUserMedia({ video: true })
      .then((stream) => {
        videoRef.current.srcObject = stream;
      })
      .catch((err) => console.error("Error accessing webcam:", err));
  };

  // Load models
  useEffect(() => {
    const loadModels = async () => {
      await faceapi.nets.tinyFaceDetector.loadFromUri("/models");
      await faceapi.nets.faceExpressionNet.loadFromUri("/models");
      await faceapi.nets.faceLandmark68Net.loadFromUri("/models");
      startVideo();
    };
    loadModels();
  }, []);

  // Continuous tracking
  const startDetection = () => {
    if (tracking) return;
    setTracking(true);
    setExpressionCounts({});
    setTotalDetections(0);
    setResults(null);

    detectionInterval.current = setInterval(async () => {
      if (!videoRef.current) return;

      const detections = await faceapi
        .detectAllFaces(videoRef.current, new faceapi.TinyFaceDetectorOptions())
        .withFaceLandmarks()
        .withFaceExpressions();

      if (!detections || detections.length === 0) return;

      // Pick the strongest expression
      let mostProbableExpression = 0;
      let _expression = "";
      for (const expression of Object.keys(detections[0].expressions)) {
        if (detections[0].expressions[expression] > mostProbableExpression) {
          mostProbableExpression = detections[0].expressions[expression];
          _expression = expression;
        }
      }

      // Count expression occurrence
      setExpressionCounts((prev) => ({
        ...prev,
        [_expression]: (prev[_expression] || 0) + 1,
      }));
      setTotalDetections((prev) => prev + 1);
    }, 100); // detect every 1 sec
  };

  const stopDetection = () => {
    if (detectionInterval.current) {
      clearInterval(detectionInterval.current);
    }
    setTracking(false);

    // Calculate percentages
    const summary = {};
    for (const [exp, count] of Object.entries(expressionCounts)) {
      summary[exp] = ((count / totalDetections) * 100).toFixed(2);
    }
    setResults(summary);

    // 🔥 Send results to API
    axios
      .post("http://localhost:3000/api/results", { results: summary })
      .then((res) => {
        console.log("Results saved:", res.data);
      })
      .catch((err) => {
        console.error("Error saving results:", err);
      });
  };

  return (
    <div className="facemoddy-container">
        {isDesktop && <ChatHeader title={title} />}
      <div className="facemoddy">

        <video className="facemoddyVideo" ref={videoRef} autoPlay muted />
        <div className="button-group">
          {!tracking ? (
            <button className="facemoddy-btn" onClick={startDetection}>
              Start
            </button>
          ) : (
            <button className="facemoddy-btn" onClick={stopDetection}>
              Stop
            </button>
          )}
        </div>
      </div>
 {results && (
        <div className="results">
          <div className="result-items">
             <h3>Expression Summary</h3>
          <ul>
            {Object.entries(results).map(([exp, percent]) => (
              <li key={exp}>
                {exp}: {percent}%
              </li>
            ))}
          </ul>
          </div>
         
        </div>
      )}
     
    </div>
  );
}
