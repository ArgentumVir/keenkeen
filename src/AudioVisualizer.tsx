import { access } from 'fs';
import React, { useEffect, useState, useRef } from 'react';
import { setConstantValue } from 'typescript';
import { isContext } from 'vm';
import './AudioVisualizer.css';

export interface AudioVisualizerProps {
    audio: Blob[],
    audioElementRef: React.MutableRefObject<HTMLAudioElement>
};

function AudioVisualizer(props: AudioVisualizerProps) {
    const { audio, audioElementRef } = props;
    const canvasElement = useRef<HTMLCanvasElement>(null);

    const [source, setSource] = useState<MediaElementAudioSourceNode>();

    function initDraw(analyser: AnalyserNode) {
      return function draw() {
        requestAnimationFrame(draw);
        const canvasContext = canvasElement?.current?.getContext('2d');
        if (!canvasElement || !canvasElement.current || !canvasContext) { return; }
        const dataArray = new Uint8Array(analyser.frequencyBinCount);

        // analyser.getByteTimeDomainData(dataArray);
        analyser.getByteFrequencyData(dataArray);
        
          canvasContext.fillStyle = "rgb(200, 200, 200)";
          canvasContext.fillRect(0, 0, canvasElement.current.width, canvasElement.current.height);
        
          canvasContext.lineWidth = 2;
          canvasContext.strokeStyle = "rgb(0, 0, 0)";
        
          canvasContext.beginPath();
        
          const sliceWidth = canvasElement.current.width * 1.0 / analyser.frequencyBinCount;
          let x = 0;
        
          for (let i = 0; i < analyser.frequencyBinCount; i++) {
        
            const v = dataArray[i] / 128.0;
            const y = v * canvasElement.current.height / 2;
        
            if (i === 0) {
              canvasContext.moveTo(x, y);
            } else {
              canvasContext.lineTo(x, y);
            }
        
            x += sliceWidth;
          }
        
          canvasContext.lineTo(canvasElement.current.width, canvasElement.current.height / 2);
          canvasContext.stroke();
        }
      }

    useEffect(() => {
      const context = new AudioContext();
      const src = context.createMediaElementSource(audioElementRef.current);
      const analyser = context.createAnalyser(); 
      analyser.fftSize = 2048;
      src.connect(analyser);
      analyser.connect(context.destination);
      setSource(src);

      initDraw(analyser)();
    }, []);

  return (
    <div>
      <canvas ref={canvasElement}></canvas>
    </div>
  );
}

export default AudioVisualizer;
