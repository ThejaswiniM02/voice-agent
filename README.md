# 🎙️ Voice Agent PWA

A hands-free voice assistant built with Next.js that lets you talk to AI and get spoken responses back. Just click, speak, and listen!

## ✨ What It Does

- 🎤 **Voice Input**: Click "Start Recording" and speak naturally
- 🤖 **AI Chat**: Powered by Google Gemini for smart conversations  
- 🔊 **Voice Output**: AI speaks back to you automatically
- ⚡ **Fast Response**: Targets sub-1200ms total response time
- 📱 **PWA Ready**: Works on desktop and mobile, installable

## 🚀 Try It Live

1. Clone this repo
2. Add your Gemini API key to `.env.local`
3. Run `npm install && npm run dev`
4. Open http://localhost:3000
5. Click "Start Recording" and say "Tell me a joke"!

## 🛠️ Tech Stack

- **Frontend**: Next.js 15, TypeScript, React
- **AI**: Google Gemini API (free tier!)
- **Voice**: Browser Speech APIs (SpeechRecognition + SpeechSynthesis)
- **Performance**: Real-time metrics tracking
- **Deployment**: Vercel-ready

## ⚙️ Setup

### Get Your Free Gemini API Key
1. Go to [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Sign in and create a new API key
3. Copy it to your `.env.local` file

### Install & Run
git clone https://github.com/YOUR_USERNAME/voice-agent.git
cd voice-agent
npm install
Create .env.local file:
echo "GEMINI_API_KEY=your_api_key_here" > .env.local
npm run dev
