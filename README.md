# voice-agent
🗣️ voice_agent — Local Voice Assistant That Works Offline

-> A browser-based voice assistant powered by local speech-to-text, OpenAI, and text-to-speech. Built using Next.js, TypeScript, Whisper WASM, and Coqui TTS.

---

🚀 What This Project Does

This is an intelligent voice assistant that runs in your browser, even without an internet connection (except for the OpenAI part). Here's how it works:

1. You talk to it using your mic.
2. It transcribes your voice locally using Whisper WASM.
3. Once you stop speaking, it sends the text to **OpenAI's ChatGPT** to figure out a reply.
4. Then, it converts the response back to audio (TTS) using a local voice model (no need to fetch from Google or Amazon).
5. You hear the voice reply — like magic, but nerdy magic.

---

🧠 Why It's Cool

- 📴 Works offline (everything except OpenAI is local)
- 🧠 Smart replies powered by OpenAI's LLM
- 🗣️ Fast local speech-to-text using `whisper.cpp`
- 🔊 Real-time voice replies using local TTS
- 🛠️ Built with TypeScript + Next.js (PWA)

📦 Features Breakdown

| Feature       | How it works                                                   |
|---------------|----------------------------------------------------------------|
| 🎤 Voice Input  | Uses browser mic and records short chunks                   |
| 🧾 Transcription | Uses `whisper.cpp` compiled to WebAssembly in a Web Worker |
| 💬 AI Reply     | Sends transcript to OpenAI's Chat Completion API            |
| 🔊 Voice Output | Uses Coqui TTS model locally (also in Web Worker)           |
| 📶 Offline Ready| Uses service worker to precache WASM and TTS models         |
| ⏱️ Performance  | Logs latency for STT, API, TTS, and audio playback          |

