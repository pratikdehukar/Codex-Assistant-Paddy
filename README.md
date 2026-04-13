# Smart Voice Todo PWA

A mobile-first progressive web app that works as a voice-enabled todo manager.

## Features
- Voice input using the Web Speech API with live transcription.
- Manual text input with simple NLP parsing for title, date/time, and priority.
- Edit, delete, complete, and filter tasks.
- Offline-ready PWA with service worker caching and manifest.
- Local persistence through `localStorage`.

## Quick Start
```bash
npm install
npm run dev
```

## Architecture
- `src/components`: UI widgets (`TaskInput`, `VoiceRecorder`, `TaskList`)
- `src/services`: speech, NLP parsing, task state, local storage, TTS
- `public/sw.js`: service worker for offline support
- `public/manifest.webmanifest`: installable PWA metadata

## Example Parsing
Input: `Call John at 5 PM urgent`

Parsed output:
- Title: `Call John`
- Due Date/Time: today at 5:00 PM
- Priority: `high`
