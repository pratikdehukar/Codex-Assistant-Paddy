import { useMemo, useState } from 'react';
import { parseTaskInput } from '../services/nlpService';
import { useSpeechRecognition } from '../services/speechService';
import { speakFeedback } from '../services/ttsService';

export default function VoiceRecorder({ onAddTask }) {
  const [transcript, setTranscript] = useState('');

  const {
    isListening,
    isSupported,
    start,
    stop,
    reset,
  } = useSpeechRecognition({
    onResult: (value) => setTranscript(value),
    onFinalResult: (value) => {
      const parsed = parseTaskInput(value);
      onAddTask(parsed);
      speakFeedback(`Added task: ${parsed.title}`);
      setTranscript('');
    },
    onError: () => setTranscript('Unable to recognize speech, please try again.'),
  });

  const microphoneLabel = useMemo(() => {
    if (!isSupported) return 'Voice not supported';
    return isListening ? 'Stop listening' : 'Start voice input';
  }, [isListening, isSupported]);

  return (
    <div className="voice-recorder">
      <div className="transcription" aria-live="polite">
        {transcript || 'Live transcription will appear here…'}
      </div>

      <div className="voice-actions">
        <button
          type="button"
          className={`mic-button ${isListening ? 'listening' : ''}`}
          onClick={isListening ? stop : start}
          disabled={!isSupported}
          aria-label={microphoneLabel}
        >
          🎤
        </button>

        <button type="button" onClick={reset} disabled={!transcript}>
          Clear
        </button>
      </div>
    </div>
  );
}
