import React, { useState, useRef, useEffect }  from 'react';
import logo from './logo.svg';
import './App.css';
import AudioRecorder from './AudioRecorder';
import AudioVisualizer from './AudioVisualizer';

function App() {
  const [recordedAudio, setRecordedAudio] = useState<Blob[]>([]);

  const audioElement = useRef<HTMLAudioElement>(new Audio());

  return (
    <div className="App">
      <AudioRecorder
        recordedAudio={recordedAudio}
        setRecordedAudio={setRecordedAudio}
        audioElementRef={audioElement}
      />
      <AudioVisualizer
        audioElementRef={audioElement}
      />
      
      <audio ref={audioElement} id="playback" controls></audio>
    </div>
  );
}

export default App;
