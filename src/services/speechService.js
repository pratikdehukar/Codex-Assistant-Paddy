import { useCallback, useEffect, useRef, useState } from 'react';

export function useSpeechRecognition({
  autoRestart = false,
  onResult,
  onInterimResult,
  onFinalResult,
  onError,
}) {
  const recognitionRef = useRef(null);
  const [isListening, setIsListening] = useState(false);
  const shouldContinueRef = useRef(false);

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
      shouldContinueRef.current = false;
    };

    recognition.onend = () => {
      setIsListening(false);
      if (autoRestart && shouldContinueRef.current) {
        recognition.start();
        setIsListening(true);
      }
    };

    recognitionRef.current = recognition;

    return () => {
      shouldContinueRef.current = false;
      recognition.stop();
    };
  }, [SpeechRecognition, autoRestart, onError, onFinalResult, onInterimResult, onResult]);

  const start = useCallback(() => {
    if (!recognitionRef.current) return;
    shouldContinueRef.current = true;
    recognitionRef.current.start();
    setIsListening(true);
  }, []);

  const stop = useCallback(() => {
    shouldContinueRef.current = false;
    recognitionRef.current?.stop();
  }, []);

  const reset = useCallback(() => onResult(''), [onResult]);

  return {
    isSupported,
    isListening,
    start,
    stop,
    reset,
  };
}
