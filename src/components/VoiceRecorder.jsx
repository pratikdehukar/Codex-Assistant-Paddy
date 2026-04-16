import { useEffect, useMemo, useState } from 'react';
import { parseTaskInput } from '../services/nlpService';
import { useSpeechRecognition } from '../services/speechService';
import { speakFeedback } from '../services/ttsService';

const WAKE_WORD_REGEX = /hey\s+paddy/i;

export default function VoiceRecorder({ onAddTask }) {
  const [transcript, setTranscript] = useState('');
  const [mode, setMode] = useState('waiting');

  const {
    isListening,
    isSupported,
    start,
    stop,
    reset,
  } = useSpeechRecognition({
    autoRestart: true,
    onResult: (value) => setTranscript(value),
    onFinalResult: (value) => {
      const spoken = value.trim();
      if (!spoken) return;

      if (mode === 'task') {
        const parsed = parseTaskInput(spoken);
        onAddTask(parsed);
        speakFeedback(`Added task: ${parsed.title}`);
        setTranscript(`Saved: ${parsed.title}`);
        setMode('waiting');
        return;
      }

      const wakeMatch = spoken.match(WAKE_WORD_REGEX);
      if (!wakeMatch) {
        return;
      }

      const remainder = spoken.slice((wakeMatch.index ?? 0) + wakeMatch[0].length).trim();
      if (remainder) {
        const parsed = parseTaskInput(remainder);
        onAddTask(parsed);
        speakFeedback(`Added task: ${parsed.title}`);
        setTranscript(`Saved: ${parsed.title}`);
        setMode('waiting');
        return;
      }

      setMode('task');
      setTranscript('Listening for your task...');
      speakFeedback('I am listening. Please say your task.');
    },
    onError: () => setTranscript('Voice error. Tap mic once to re-enable listening.'),
  });

  useEffect(() => {
    if (!isSupported) return;

    const bootListener = () => {
      start();
      window.removeEventListener('pointerdown', bootListener);
    };

    window.addEventListener('pointerdown', bootListener);
    return () => window.removeEventListener('pointerdown', bootListener);
  }, [isSupported, start]);

  const statusLabel = useMemo(() => {
    if (!isSupported) return 'Voice not supported';
    if (!isListening) return 'Tap mic to enable background listening';
    if (mode === 'task') return 'Task mode: say the new task now';
    return 'Standby: say “Hey Paddy”';
  }, [isListening, isSupported, mode]);

  return (
    <div className="voice-recorder glass-panel">
      <div className="wake-indicator">
        <span className={`ai-avatar ${mode === 'task' ? 'active' : ''}`} aria-hidden="true">✦</span>
        <p>
          <strong>Hands-free mode</strong>
          <br />
          <span>{statusLabel}</span>
        </p>
      </div>

      <div className="transcription-float" aria-live="polite">
        {transcript || 'Say “Hey Paddy buy milk tomorrow” to add instantly.'}
      </div>

      <div className="waveform" aria-hidden="true">
        {[0, 1, 2, 3, 4].map((item) => (
          <span key={item} className={isListening ? 'active' : ''} />
        ))}
      </div>

      <div className="voice-actions">
        <button
          type="button"
          className={`mic-button ${isListening ? 'listening' : ''} ${mode === 'task' ? 'detected' : ''}`}
          onClick={isListening ? stop : start}
          disabled={!isSupported}
          aria-label="Voice control"
        >
          🎤
        </button>

        <button type="button" className="ghost-btn" onClick={reset} disabled={!transcript}>
          Clear
        </button>
      </div>
    </div>
  );
}
