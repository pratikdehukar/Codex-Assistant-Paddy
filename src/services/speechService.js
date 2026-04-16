import { useEffect, useRef, useState } from 'react';

export function useSpeechRecognition({ onResult, onInterimResult, onFinalResult, onError }) {
  const recognitionRef = useRef(null);
  const [isListening, setIsListening] = useState(false);

  const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
  const isSupported = Boolean(SpeechRecognition);

  useEffect(() => {
    if (!SpeechRecognition) return;

    const recognition = new SpeechRecognition();
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = 'en-US';

    recognition.onresult = (event) => {
      let interim = '';
      let final = '';

      for (let i = event.resultIndex; i < event.results.length; i += 1) {
        const text = event.results[i][0].transcript;
        if (event.results[i].isFinal) {
          final += text;
        } else {
          interim += text;
        }
      }

      const combined = `${final} ${interim}`.trim();
      onResult(combined);

      if (interim.trim()) {
        onInterimResult?.(interim.trim());
      }

      if (final.trim()) {
        onFinalResult(final.trim());
      }
    };

    recognition.onerror = () => {
      onError?.();
      setIsListening(false);
    };

    recognition.onend = () => setIsListening(false);
    recognitionRef.current = recognition;

    return () => recognition.stop();
  }, [SpeechRecognition, onError, onFinalResult, onInterimResult, onResult]);

  const start = () => {
    if (!recognitionRef.current) return;
    recognitionRef.current.start();
    setIsListening(true);
  };

  const stop = () => recognitionRef.current?.stop();

  const reset = () => onResult('');

  return {
    isSupported,
    isListening,
    start,
    stop,
    reset,
  };
}
