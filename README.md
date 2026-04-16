# Paddy AI Tasks PWA

A futuristic, mobile-first progressive web app with voice-first task capture.

## Features
- Wake-word flow (`Hey Paddy`) for hands-free voice activation.
- Live transcription in a floating glassmorphism panel.
- Manual task input with basic natural-language parsing (title/date/priority/category).
- Task list with edit, delete, completion state, and status filtering.
- Installable PWA with offline service worker shell caching.

## Quick Start
```bash
npm install
npm run dev
```

## Voice UX
1. Enable **Wake Mode**.
2. Say **"Hey Paddy"**.
3. Speak your task command.
4. Task is parsed and added, with optional speech feedback.

## Architecture
- `src/components`: UI components (`TaskInput`, `VoiceRecorder`, `TaskList`)
- `src/services`: voice recognition, NLP parser, storage/task services, TTS
- `public/sw.js`: service worker for offline support
- `public/manifest.webmanifest`: installable metadata
