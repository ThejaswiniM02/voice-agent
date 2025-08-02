const CACHE_NAME = 'voice-agent-v1';
const STATIC_CACHE = [
  '/',
  '/manifest.json',
  // Whisper WASM files (we'll add these)
  '/whisper/whisper.wasm',
  '/whisper/whisper.js',
  // TTS model files (we'll add these)
  '/tts/model.onnx',
  '/tts/tokenizer.json'
];

self.addEventListener('install', (event) => {
  console.log('Service Worker installing...');
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('Caching static assets...');
        return cache.addAll(STATIC_CACHE);
      })
  );
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  console.log('Service Worker activating...');
  event.waitUntil(self.clients.claim());
});

self.addEventListener('fetch', (event) => {
  // Skip API calls to Gemini - let them go to network
  if (event.request.url.includes('generativelanguage.googleapis.com')) {
    return;
  }
  
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        return response || fetch(event.request);
      })
  );
});

