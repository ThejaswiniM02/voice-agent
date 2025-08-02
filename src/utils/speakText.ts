// utils/speakText.ts

export async function speakText(text: string) {
  const utterance = new SpeechSynthesisUtterance(text);
  return new Promise<void>((resolve, reject) => {
    utterance.onend = () => resolve();
    utterance.onerror = (e) => reject(e.error);
    speechSynthesis.speak(utterance);
  });
}
