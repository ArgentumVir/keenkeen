import React, { useEffect, useState, useRef } from 'react';
import './AudioReceiver.css';

export interface AudioReceiverProps {
    recordedAudio: Blob[],
    setRecordedAudio: Function,
    audioElementRef: React.MutableRefObject<HTMLAudioElement>
};

function AudioReceiver(props: AudioReceiverProps) {
    const { recordedAudio, setRecordedAudio, audioElementRef } = props;

    const [mediaRecorder, setMediaRecorder] = useState<MediaRecorder>(),
        [isMicrophoneActivated, setIsMicrophoneActivated] = useState<Boolean>(false),
        [isRecording, setIsRecording] = useState<Boolean>(false);

    // On page load activate microphone if permission has already been granted in the past
    useEffect(() => {
        navigator
            .permissions
            .query({ name: "microphone" as PermissionName })
            .then((permissionStatus) => (permissionStatus.state === 'granted') && ActivateMicrophone());
    }, []);

    // Keep audio element
    useEffect(() => {
        if (recordedAudio.length === 0) return;

        audioElementRef.current.src =  URL.createObjectURL(recordedAudio[0]);
    }, [recordedAudio]);

    function ActivateMicrophone()
    {
        navigator.mediaDevices
            .getUserMedia({ audio: true })
            .then(function(stream) {

                let recorder = new MediaRecorder(stream, { mimeType: "audio/webm" });

                recorder.addEventListener('dataavailable', function(e) {
                    if (e.data.size > 0)  setRecordedAudio([recordedAudio, e.data].flat());
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
    </div>
  );
}

export default AudioReceiver;
