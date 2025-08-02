"use client";
import { useState, useRef } from 'react';

export default function VoiceAgent() {
  const [message, setMessage] = useState('');
  const [response, setResponse] = useState('');
  const [loading, setLoading] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [debugInfo, setDebugInfo] = useState<string[]>([]);
  
  // Performance metrics state
  const [performanceMetrics, setPerformanceMetrics] = useState({
    speechToText: 0,
    apiCall: 0,
    textToSpeech: 0,
    totalTime: 0
  });
  
  const recognitionRef = useRef<any>(null);
  const startTimeRef = useRef<number>(0);
  const sttEndTimeRef = useRef<number>(0);
  const apiEndTimeRef = useRef<number>(0);

  const addDebug = (msg: string) => {
    console.log(msg);
    setDebugInfo(prev => [...prev.slice(-4), `${new Date().toLocaleTimeString()}: ${msg}`]);
  };

  const handleLLMRequest = async (text: string) => {
    const apiStartTime = Date.now();
    setLoading(true);
    addDebug('Auto-sending to Gemini API...');
    
    try {
      const apiResponse = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ message: text.trim() }),
      });
      
      const data = await apiResponse.json();
      apiEndTimeRef.current = Date.now();
      
      if (apiResponse.ok) {
        setResponse(data.message);
        addDebug('Gemini response received');
        
        // Update performance metrics
        const apiCallTime = apiEndTimeRef.current - apiStartTime;
        const sttTime = sttEndTimeRef.current - startTimeRef.current;
        
        setPerformanceMetrics(prev => ({
          ...prev,
          speechToText: sttTime,
          apiCall: apiCallTime
        }));
        
        // Auto text-to-speech with timing
        const ttsStartTime = Date.now();
        const utterance = new SpeechSynthesisUtterance(data.message);
        
        utterance.onstart = () => {
          const ttsTime = Date.now() - ttsStartTime;
          const totalTime = Date.now() - startTimeRef.current;
          
          setPerformanceMetrics(prev => ({
            ...prev,
            textToSpeech: ttsTime,
            totalTime: totalTime
          }));
          
          addDebug(`Performance: STT=${sttTime}ms, API=${apiCallTime}ms, TTS=${ttsTime}ms, Total=${totalTime}ms`);
        };
        
        speechSynthesis.speak(utterance);
        addDebug('Speaking AI response');
      } else {
        addDebug(`API error: ${data.error}`);
        alert(`Error: ${data.error}`);
      }
    } catch (error) {
      addDebug(`API call failed: ${error}`);
      alert('Failed to send message');
    } finally {
      setLoading(false);
    }
  };

  const startRecording = () => {
    // Check if browser supports speech recognition
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    
    if (!SpeechRecognition) {
      addDebug('Speech recognition not supported in this browser');
      alert('Speech recognition not supported in this browser. Please use Chrome or Edge.');
      return;
    }

    // Reset performance timing
    startTimeRef.current = Date.now();
    setPerformanceMetrics({ speechToText: 0, apiCall: 0, textToSpeech: 0, totalTime: 0 });
    
    addDebug('Starting speech recognition...');
    
    recognitionRef.current = new SpeechRecognition();
    recognitionRef.current.continuous = false;
    recognitionRef.current.interimResults = false;
    recognitionRef.current.lang = 'en-US';

    recognitionRef.current.onstart = () => {
      setIsRecording(true);
      addDebug('Speech recognition started');
    };

    recognitionRef.current.onresult = (event: any) => {
      sttEndTimeRef.current = Date.now();
      const transcript = event.results[0][0].transcript;
      setMessage(transcript);
      addDebug(`Transcribed: ${transcript}`);
      setIsRecording(false);
      
      // 🚀 AUTO-SUBMIT: Automatically send to AI after transcription
      setTimeout(() => {
        handleLLMRequest(transcript);
      }, 500); // Small delay to show the transcribed text
    };

    recognitionRef.current.onerror = (event: any) => {
      addDebug(`Speech recognition error: ${event.error}`);
      setIsRecording(false);
    };

    recognitionRef.current.onend = () => {
      setIsRecording(false);
      addDebug('Speech recognition ended');
    };

    recognitionRef.current.start();
  };

  const stopRecording = () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
      setIsRecording(false);
      addDebug('Speech recognition stopped');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim()) return;
    
    // Reset timing for manual input
    startTimeRef.current = Date.now();
    sttEndTimeRef.current = Date.now(); // No STT for manual input
    setPerformanceMetrics({ speechToText: 0, apiCall: 0, textToSpeech: 0, totalTime: 0 });
    
    await handleLLMRequest(message);
  };

  return (
    <div style={{ padding: '20px', maxWidth: '800px', margin: '0 auto' }}>
      <h1>Voice Agent PWA</h1>
      
      <div style={{ marginBottom: '20px', padding: '10px', backgroundColor: '#f0f0f0', borderRadius: '8px' }}>
        <h3>Status:</h3>
        <p>Speech Recognition: {typeof window !== 'undefined' && ((window as any).SpeechRecognition || (window as any).webkitSpeechRecognition) ? '✅ Available' : '❌ Not supported'}</p>
        <p>Recording: {isRecording ? '🔴 Active - Speak now!' : '⚪ Stopped'}</p>
        <p>AI Status: {loading ? '🤖 Processing...' : '✅ Ready'}</p>
        
        {/* Performance Metrics Display */}
        <div style={{ marginTop: '15px', padding: '10px', backgroundColor: '#e8f4fd', borderRadius: '6px' }}>
          <h4 style={{ margin: '0 0 10px 0', color: '#0c5aa6' }}>⚡ Performance Metrics:</h4>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))', gap: '10px', fontSize: '14px' }}>
            <div><strong>STT:</strong> {performanceMetrics.speechToText}ms</div>
            <div><strong>API:</strong> {performanceMetrics.apiCall}ms</div>
            <div><strong>TTS:</strong> {performanceMetrics.textToSpeech}ms</div>
            <div style={{ color: performanceMetrics.totalTime > 1200 ? '#dc3545' : '#28a745' }}>
              <strong>Total:</strong> {performanceMetrics.totalTime}ms
            </div>
          </div>
          {performanceMetrics.totalTime > 0 && (
            <p style={{ margin: '8px 0 0 0', fontSize: '12px', color: '#666' }}>
              Target: &lt;1200ms {performanceMetrics.totalTime <= 1200 ? '✅' : '❌'}
            </p>
          )}
        </div>
        
        <h4>Debug Log:</h4>
        <div style={{ 
          height: '100px', 
          overflow: 'auto', 
          fontSize: '12px', 
          fontFamily: 'monospace',
          backgroundColor: 'white',
          padding: '8px',
          border: '1px solid #ddd',
          borderRadius: '4px'
        }}>
          {debugInfo.map((info, index) => (
            <div key={index}>{info}</div>
          ))}
        </div>
      </div>
      
      {/* Voice Recording */}
      <div style={{ marginBottom: '20px', textAlign: 'center' }}>
        <button
          onClick={isRecording ? stopRecording : startRecording}
          disabled={loading}
          style={{
            padding: '20px 40px',
            fontSize: '20px',
            backgroundColor: isRecording ? '#dc3545' : loading ? '#6c757d' : '#28a745',
            color: 'white',
            border: 'none',
            borderRadius: '12px',
            cursor: loading ? 'not-allowed' : 'pointer',
            fontWeight: 'bold',
            minWidth: '200px'
          }}
        >
          {loading ? '🤖 Processing...' : isRecording ? '🛑 Stop Recording' : '🎤 Start Recording'}
        </button>
        
        <p style={{ marginTop: '10px', fontSize: '14px', color: '#666' }}>
          {isRecording 
            ? 'Listening... Speak clearly!' 
            : 'Click the button above and speak your question'}
        </p>
      </div>
      
      {/* Text Input Fallback */}
      <form onSubmit={handleSubmit} style={{ marginBottom: '20px' }}>
        <div style={{ display: 'flex', gap: '10px' }}>
          <input
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Or type your message here..."
            disabled={loading}
            style={{ 
              flex: 1,
              padding: '12px', 
              fontSize: '16px',
              border: '2px solid #ddd',
              borderRadius: '6px'
            }}
          />
          <button 
            type="submit" 
            disabled={loading || !message.trim()}
            style={{
              padding: '12px 20px',
              fontSize: '16px',
              backgroundColor: loading || !message.trim() ? '#6c757d' : '#007bff',
              color: 'white',
              border: 'none',
              borderRadius: '6px',
              cursor: loading || !message.trim() ? 'not-allowed' : 'pointer',
              minWidth: '80px'
            }}
          >
            {loading ? '...' : 'Send'}
          </button>
        </div>
      </form>
      
      {/* AI Response */}
      {response && (
        <div style={{ 
          marginTop: '20px', 
          padding: '20px', 
          backgroundColor: '#f8f9fa',
          borderRadius: '8px',
          border: '1px solid #e9ecef'
        }}>
          <h3 style={{ marginTop: 0, color: '#495057' }}>🤖 AI Response:</h3>
          <p style={{ 
            fontSize: '16px', 
            lineHeight: '1.5',
            margin: 0,
            whiteSpace: 'pre-wrap'
          }}>
            {response}
          </p>
        </div>
      )}
      
      {/* Instructions */}
      <div style={{
        marginTop: '30px',
        padding: '15px',
        backgroundColor: '#e7f3ff',
        borderRadius: '8px',
        fontSize: '14px',
        color: '#0c5aa6'
      }}>
        <h4 style={{ marginTop: 0 }}>How to use:</h4>
        <ol style={{ marginBottom: 0, paddingLeft: '20px' }}>
          <li>Click "Start Recording" and speak your question</li>
          <li>The AI will automatically respond and speak the answer</li>
          <li>Or type your message in the text box and click "Send"</li>
          <li>Works best in Chrome or Edge browsers</li>
          <li>Performance metrics show response times (target: &lt;1200ms)</li>
        </ol>
      </div>
    </div>
  );
}

