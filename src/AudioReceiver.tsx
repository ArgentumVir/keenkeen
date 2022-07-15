import React, { useEffect, useState, useRef } from 'react';
import './AudioReceiver.css';


function AudioReceiver() {
    const [mediaRecorder, setMediaRecorder] = useState<MediaRecorder>(),
        [playbackAudio, setPlaybackAudio] = useState<Blob[]>([]),
        [isMicrophoneActivated, setIsMicrophoneActivated] = useState<Boolean>(false),
        [isRecording, setIsRecording] = useState<Boolean>(false),
        audioElement = useRef<HTMLAudioElement>(new Audio());

    // Automatically activate microphone if permission has already been granted in the past
    useEffect(() => {
        navigator
            .permissions
            .query({ name: "microphone" as PermissionName })
            .then((permissionStatus) => (permissionStatus.state === 'granted') && ActivateMicrophone());
    }, []);

    useEffect(() => {
        if (playbackAudio.length === 0) return;

        // audioElement.current.onended = () => {
        // };

        audioElement.current.src =  URL.createObjectURL(playbackAudio[0]);
    }, [playbackAudio])

    function ActivateMicrophone()
    {
        navigator.mediaDevices
            .getUserMedia({ audio: true })
            .then(function(stream) {

                let recorder = new MediaRecorder(stream, { mimeType: "audio/webm" });

                recorder.addEventListener('dataavailable', function(e) {
                    if (e.data.size > 0)  setPlaybackAudio([playbackAudio, e.data].flat());
                  });
              
                setMediaRecorder(recorder);
                setIsMicrophoneActivated(true);
            })
            .catch(function(err) {
                console.log(err);
            });
    }

    function StartRecording()
    {
        if (mediaRecorder?.state !== 'recording')
        {
            mediaRecorder?.start();
        }

        mediaRecorder && setIsRecording(true);
    }

    function StopRecording()
    {
        if (mediaRecorder?.state === 'recording')
        {
            mediaRecorder?.stop();
        }

        mediaRecorder && setIsRecording(false);
    }

  return (
    <div>
        { !isMicrophoneActivated &&
            <button onClick={ActivateMicrophone}>
                Activate Microphone
            </button>
        }
        { isMicrophoneActivated && !isRecording &&
            <button onClick={StartRecording}>
                Record
            </button>
        }
        { isMicrophoneActivated && isRecording &&
            <button onClick={StopRecording}>
                Stop
            </button>
        }
        <audio ref={audioElement} id="playback" controls></audio>
    </div>
  );
}

export default AudioReceiver;
