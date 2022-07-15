import React, { useEffect, useState } from 'react';
import logo from './logo.svg';
import './AudioReceiver.css';


function AudioReceiver() {
    const [mediaStream, setMediaStream] = useState<MediaStream>(),
        [mediaRecorder, setMediaRecorder] = useState<MediaRecorder>(),
        [userAudio, setUserAudio] = useState<HTMLAudioElement>(new Audio()),
        [playbackAudio, setPlaybackAudio] = useState<Blob>(),
        [isMicrophoneActivated, setIsMicrophoneActivated] = useState<Boolean>(false),
        [isRecording, setIsRecording] = useState<Boolean>(false),
        [isPlaybacking, setisPlaybacking] = useState<Boolean>(false);

    useEffect(() => ActivateMicrophone());

    function ActivateMicrophone()
    {
        navigator.mediaDevices.getUserMedia({ audio: true })
            .then(function(stream) {

                setMediaStream(stream);
                setMediaRecorder(new MediaRecorder(stream));
                setIsMicrophoneActivated(true);
            })
            .catch(function(err) {
                console.log(err);
            });
    }

    function StartRecording()
    {


        if (mediaRecorder && mediaRecorder.state !== 'recording')
        {
            setIsRecording(true);
            console.log("Start");

            mediaRecorder.ondataavailable = (blobEvent) => {
                console.log('DATA AVAILABLE');
                setPlaybackAudio(blobEvent.data);
            };
            mediaRecorder.onstart = () => {
                console.log('Started callback');
            };
            mediaRecorder.onstop = () => {
                console.log('stopped callback');
            };
            mediaRecorder.onpause = () => {
                console.log('paused callback');
            };
            mediaRecorder.onerror = (err) => {
                console.log('error callback');
                console.log(err);
            };
            mediaRecorder.onresume = () => {
                console.log('Resume callback');
            }
            mediaRecorder.start();
            // setMediaRecorder(mediaRecorder);
        }
    }

    function StopRecording()
    {
        if (mediaRecorder?.state === 'recording')
        {
            setIsRecording(false);
            console.log("Stop");
            mediaRecorder?.stop();
        }

        if (mediaRecorder?.state === 'inactive')
        {
            setIsRecording(false);
            console.log("Stop (INACTIVE)");
        }
    }

    function PlaybackAudio()
    {
        setisPlaybacking(true);

        if (playbackAudio) {
            console.log('Inner playback')
            userAudio.srcObject = playbackAudio;
            userAudio.onended = () => {
                console.log('Ended event call back')
                setisPlaybacking(false);
            };

            userAudio.play()
                .then(() => {
                })
                .catch((err) => {
                    setisPlaybacking(false);
                    console.log(err);
                });
        }
    }

    function StopPlayback()
    {
        setisPlaybacking(false);
        userAudio?.pause();
    }

    function GetState()
    {
        console.log(mediaRecorder?.state);
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
        { isMicrophoneActivated && !isRecording && !isPlaybacking &&
            <button onClick={PlaybackAudio}>
                PlayBack
            </button>
        }
        { isMicrophoneActivated && !isRecording && isPlaybacking &&
            <button onClick={StopPlayback}>
                Stop Playback
            </button>
        }
        <button onClick={GetState}>Get State</button>
    </div>
  );
}

export default AudioReceiver;
