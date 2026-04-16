import { useMemo, useState } from 'react';
import { parseTaskInput } from '../services/nlpService';
import { useSpeechRecognition } from '../services/speechService';
import { speakFeedback } from '../services/ttsService';

const WAKE_WORD = 'hey paddy';

export default function VoiceRecorder({ onAddTask }) {
  const [transcript, setTranscript] = useState('');
  const [wakeArmed, setWakeArmed] = useState(false);
  const [wakeDetected, setWakeDetected] = useState(false);

  const {
    isListening,
    isSupported,
    start,
    stop,
    reset,
  } = useSpeechRecognition({
    onResult: (value) => setTranscript(value),
    onInterimResult: (value) => {
      if (wakeArmed && !wakeDetected && value.toLowerCase().includes(WAKE_WORD)) {
        setWakeDetected(true);
        setTranscript('Wake word detected. Listening for your task…');
      }
    },
    onFinalResult: (value) => {
      const normalized = value.toLowerCase().trim();

      if (wakeArmed && !wakeDetected) {
        if (normalized.includes(WAKE_WORD)) {
          setWakeDetected(true);
          setTranscript('Wake word detected. Tell me your task now.');
        }
        return;
      }

      const commandText = wakeArmed
        ? value.replace(/hey\s+paddy/gi, '').trim()
        : value.trim();

      if (!commandText) {
        return;
      }

      const parsed = parseTaskInput(commandText);
      onAddTask(parsed);
      speakFeedback(`Added task: ${parsed.title}`);
      setTranscript('Task captured successfully.');
      if (wakeArmed) {
        setWakeDetected(false);
      }
    },
    onError: () => {
      setTranscript('Unable to recognize speech, please try again.');
      setWakeDetected(false);
    },
  });

  const microphoneLabel = useMemo(() => {
    if (!isSupported) return 'Voice not supported';
    if (wakeArmed) return isListening ? 'Disable wake mode' : 'Enable wake mode';
    return isListening ? 'Stop listening' : 'Start voice input';
  }, [isListening, isSupported, wakeArmed]);

  const handleMicPress = () => {
    if (isListening) {
      stop();
      if (!wakeArmed) {
        setWakeDetected(false);
      }
      return;
    }

    start();
  };

  const toggleWakeMode = () => {
    setWakeArmed((current) => {
      const next = !current;
      setWakeDetected(false);
      setTranscript(next ? 'Wake mode armed. Say “Hey Paddy” to start.' : 'Wake mode off.');
      return next;
    });
  };

  return (
    <div className="voice-recorder glass-panel">
      <div className={`wake-indicator ${wakeDetected ? 'detected' : ''}`}>
        <span className="ai-avatar" aria-hidden="true">✦</span>
        <p>
          <strong>Wake word:</strong> “Hey Paddy”
          <br />
          <span>{wakeArmed ? 'Armed and waiting' : 'Press Wake Mode to arm'}</span>
        </p>
      </div>

      <div className="transcription-float" aria-live="polite">
        {transcript || 'Live transcription appears here once listening starts…'}
      </div>

      <div className="waveform" aria-hidden="true">
        {[0, 1, 2, 3, 4].map((item) => (
          <span key={item} className={isListening ? 'active' : ''} />
        ))}
      </div>

      <div className="voice-actions">
        <button
          type="button"
          className={`mic-button ${isListening ? 'listening' : ''} ${wakeDetected ? 'detected' : ''}`}
          onClick={handleMicPress}
          disabled={!isSupported}
          aria-label={microphoneLabel}
        >
          🎤
        </button>

        <button type="button" className="ghost-btn" onClick={toggleWakeMode}>
          {wakeArmed ? 'Wake Mode On' : 'Wake Mode Off'}
        </button>

        <button type="button" className="ghost-btn" onClick={reset} disabled={!transcript}>
          Clear
        </button>
      </div>
    </div>
  );
}
