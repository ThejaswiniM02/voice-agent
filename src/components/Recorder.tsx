import { useRef, useState } from 'react';

import WhisperWorker from '@/workers/whisper-worker';
import TTSWorker from '@/workers/tts.worker';

const whisperWorker = new WhisperWorker();
const ttsWorker = new TTSWorker();

type RecorderProps = {
  onRecordingComplete: (blob: Blob) => void;
};

const Recorder = ({ onRecordingComplete }: RecorderProps) => {
  const [recording, setRecording] = useState(false);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunks = useRef<Blob[]>([]);

  const startRecording = async () => {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    const mediaRecorder = new MediaRecorder(stream);
    mediaRecorderRef.current = mediaRecorder;

    audioChunks.current = []; // Reset in case of previous recordings

    mediaRecorder.ondataavailable = (event) => {
      audioChunks.current.push(event.data);
    };

    mediaRecorder.onstop = () => {
      const audioBlob = new Blob(audioChunks.current, { type: 'audio/webm' });
      audioChunks.current = [];
      onRecordingComplete(audioBlob); // ✅ Send the blob to parent
    };

    mediaRecorder.start();
    setRecording(true);
  };

  const stopRecording = () => {
    mediaRecorderRef.current?.stop();
    setRecording(false);
  };

  return (
    <div className="p-4">
      {recording ? (
        <button onClick={stopRecording}>Stop</button>
      ) : (
        <button onClick={startRecording}>Start</button>
      )}
    </div>
  );
};

export default Recorder;

