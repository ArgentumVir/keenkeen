import { access } from 'fs';
import React, { useEffect, useState, useRef } from 'react';
import { setConstantValue } from 'typescript';
import { isContext } from 'vm';
import './AudioVisualizer.css';

export interface AudioVisualizerProps {
    audioElementRef: React.MutableRefObject<HTMLAudioElement>
};

function AudioVisualizer(props: AudioVisualizerProps) {
    const { audioElementRef } = props;
    const canvasElementRef = useRef<HTMLCanvasElement>(null);

    const [source, setSource] = useState<MediaElementAudioSourceNode>();

    function initDraw(analyser: AnalyserNode) {
      return function draw() {
        requestAnimationFrame(draw);
        const canvasContext = canvasElementRef?.current?.getContext('2d');
        if (!canvasElementRef || !canvasElementRef.current || !canvasContext) { return; }
        const dataArray = new Uint8Array(analyser.frequencyBinCount);

        analyser.getByteTimeDomainData(dataArray);
        
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
      <canvas width={1000} height={1000} ref={canvasElementRef}></canvas>
    </div>
  );
}

export default AudioVisualizer;
