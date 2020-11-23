import React, { useEffect, useRef, useState } from "react";
import * as tf from "@tensorflow/tfjs";
import { getPitchHz } from "../utilities/utilities";
import { GlobalContext } from "../contexts/appContext";
import { Card, Container, Alert } from "react-bootstrap";

const ProcessAudio = () => {
  const { model } = GlobalContext();
  const NUM_INPUT_SAMPLES = 1024;
  const MODEL_SAMPLE_RATE = 16000;
  const CONF_THRESHOLD = 0.9;

  const [error, setError] = useState("");
  const [pitch, setPitch] = useState(0);

  const audioContext = useRef(null);
  const handleSuccess = (stream) => {
    audioContext.current = new AudioContext({
      latencyHint: "playback",
      sampleRate: MODEL_SAMPLE_RATE,
    });

    const source = audioContext.current.createMediaStreamSource(stream);
    const processor = audioContext.current.createScriptProcessor(
      NUM_INPUT_SAMPLES,
      1,
      1
    );
    // Converts audio to mono.
    processor.channelInterpretation = "speakers";
    processor.channelCount = 1;

    // Runs processor on audio source.
    source.connect(processor);

    processor.connect(audioContext.current.destination);

    processor.onaudioprocess = async (e) => {
      const inputData = e.inputBuffer.getChannelData(0);
      const input = tf.reshape(tf.tensor(inputData), [NUM_INPUT_SAMPLES]);
      const output = model.execute({ input_audio_samples: input });
      const uncertainties = output[0].dataSync();
      const pitches = output[1].dataSync();
      for (let i = 0; i < pitches.length; ++i) {
        let confidence = 1.0 - uncertainties[i];
        if (confidence < CONF_THRESHOLD) {
          continue;
        }
        setPitch(getPitchHz(pitches[i]));
      }
    };
  };

  const handleError = (err) => {
    setError(err);
  };

  useEffect(() => {
    navigator.mediaDevices
      .getUserMedia({ audio: true, video: false })
      .then(handleSuccess)
      .catch(handleError);

    return () => {
      audioContext.current && audioContext.current.close();
      console.log("Component unmounted");
    };
    // eslint-disable-next-line
  }, []);
  return (
    <Container>
      {error && <Alert variant="danger">{error}</Alert>}
      <Card>
        <Card.Header>
          {pitch !== 0 &&
            (pitch >= 70.0 && pitch <= 165.0 ? (
              <span style={{ justifyContent: "space-between" }}>
                <i className="fas fa-male"></i>
                <p style={{ float: "right" }}>male: {pitch}</p>
              </span>
            ) : pitch > 165.0 && pitch <= 350 ? (
              <span style={{ justifyContent: "space-between" }}>
                <i className="fas fa-female"></i>
                <p style={{ float: "right" }}>female: {pitch}</p>
              </span>
            ) : (
              <span style={{ justifyContent: "space-between" }}>
                <i className="fas fa-question-circle"></i>
                <p style={{ float: "right" }}>Noise?: {pitch}</p>
              </span>
            ))}
        </Card.Header>
      </Card>
    </Container>
  );
};

export default ProcessAudio;
