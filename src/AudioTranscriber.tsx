import React, { useEffect, useState, useRef } from 'react';
import './AudioTranscriber.css';

export interface AudioTranscriberProps {
};

function AudioTranscriber(props: AudioTranscriberProps) {
    const { } = props;
    const [mediaRecorder, setMediaRecorder] = useState<MediaRecorder>();

    const canvasElementRef = useRef<HTMLCanvasElement>(null);

    // On page load activate microphone if permission has already been granted in the past
    useEffect(() => {
        navigator
            .permissions
            .query({ name: "microphone" as PermissionName })
            .then((permissionStatus) => (permissionStatus.state === 'granted') && ActivateMicrophone());
    }, []);

    function ActivateMicrophone()
    {
        navigator.mediaDevices
            .getUserMedia({ audio: true })
            .then(function(stream) {

                let recorder = new MediaRecorder(stream, { mimeType: "audio/webm" });

                setMediaRecorder(recorder);
            })
            .catch(function(err) {
                console.log(err);
            });
    }

    function initDraw(analyser: AnalyserNode) {
        return function draw() {
          requestAnimationFrame(draw);
          const canvasContext = canvasElementRef?.current?.getContext('2d');
          if (!canvasElementRef || !canvasElementRef.current || !canvasContext) { return; }
          const dataArray = new Uint8Array(analyser.frequencyBinCount);
  
          analyser.getByteTimeDomainData(dataArray);
          console.log(dataArray);
          
            canvasContext.fillStyle = "rgb(200, 200, 200)";
            canvasContext.fillRect(0, 0, canvasElementRef.current.width, canvasElementRef.current.height);
          
            canvasContext.lineWidth = 2;
            canvasContext.strokeStyle = "rgb(0, 0, 0)";
          
            canvasContext.beginPath();
          
            const sliceWidth = canvasElementRef.current.width * 1.0 / analyser.frequencyBinCount;
            let x = 0;
          
            for (let i = 0; i < analyser.frequencyBinCount; i++) {
          
              const v = dataArray[i] / 128.0;
              const y = v * canvasElementRef.current.height / 2;
          
              if (i === 0) {
                canvasContext.moveTo(x, y);
              } else {
                canvasContext.lineTo(x, y);
              }
          
              x += sliceWidth;
            }
          
            canvasContext.lineTo(canvasElementRef.current.width, canvasElementRef.current.height / 2);
            canvasContext.stroke();
          }
        }
  

    useEffect(() => {
        if (!mediaRecorder?.stream) { return; }

        const context = new AudioContext();
        const src = context.createMediaStreamSource(mediaRecorder?.stream);
        src.disconnect();
        const analyser = context.createAnalyser(); 
        analyser.fftSize = 32768;
        src.connect(analyser);
        analyser.connect(context.destination);

        const effect = context.createGain();
        effect.gain.value = -1; // Mute volumne

        src.connect(effect);
        effect.connect(context.destination);
  
        initDraw(analyser)();

    }, [mediaRecorder]);

  return (
    <div>
        <canvas width={1000} height={1000} ref={canvasElementRef}></canvas>
    </div>
  );
}

export default AudioTranscriber;
