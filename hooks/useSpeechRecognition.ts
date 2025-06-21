import { useState, useEffect, useRef, useCallback } from 'react';

interface SpeechRecognitionHook {
  transcript: string;
  isListening: boolean;
  isSupported: boolean;
  isSpeaking: boolean;
  confidence: number;
  startListening: () => void;
  stopListening: () => void;
  resetTranscript: () => void;
}

declare global {
  interface Window {
    SpeechRecognition: any;
    webkitSpeechRecognition: any;
  }
}

export const useSpeechRecognition = (
  onResult?: (transcript: string) => void,
  continuous: boolean = true
): SpeechRecognitionHook => {  const [transcript, setTranscript] = useState<string>('');
  const [isListening, setIsListening] = useState<boolean>(false);
  const [isSupported, setIsSupported] = useState<boolean>(false);
  const [isSpeaking, setIsSpeaking] = useState<boolean>(false);
  const [confidence, setConfidence] = useState<number>(0);
  const recognitionRef = useRef<any>(null);

  useEffect(() => {
    // Check if speech recognition is supported
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    
    if (SpeechRecognition) {
      setIsSupported(true);
      recognitionRef.current = new SpeechRecognition();
      
      // Configure recognition
      recognitionRef.current.continuous = continuous;
      recognitionRef.current.interimResults = true;
      recognitionRef.current.lang = 'en-US';
      
      // Event handlers
      recognitionRef.current.onstart = () => {
        setIsListening(true);
        console.log('Speech recognition started');
      };
      
      recognitionRef.current.onend = () => {
        setIsListening(false);
        console.log('Speech recognition ended');
        
        // Auto-restart if continuous mode is enabled
        if (continuous && recognitionRef.current) {
          setTimeout(() => {
            if (recognitionRef.current && !isListening) {
              try {
                recognitionRef.current.start();
              } catch (error) {
                console.log('Recognition restart failed:', error);
              }
            }
          }, 100);
        }
      };
        recognitionRef.current.onresult = (event: any) => {
        let finalTranscript = '';
        let interimTranscript = '';
        let maxConfidence = 0;
        
        for (let i = event.resultIndex; i < event.results.length; i++) {
          const result = event.results[i];
          if (result.isFinal) {
            finalTranscript += result[0].transcript;
            maxConfidence = Math.max(maxConfidence, result[0].confidence || 0);
          } else {
            interimTranscript += result[0].transcript;
            setIsSpeaking(true);
          }
        }
        
        const fullTranscript = finalTranscript || interimTranscript;
        setTranscript(fullTranscript);
        setConfidence(maxConfidence);
        
        // Reset speaking state after a delay if no interim results
        if (!interimTranscript && !finalTranscript) {
          setTimeout(() => setIsSpeaking(false), 500);
        }
        
        // Call onResult callback when we have a final result
        if (finalTranscript && onResult) {
          setIsSpeaking(false);
          onResult(finalTranscript.trim());
        }
      };
      
      recognitionRef.current.onerror = (event: any) => {
        console.error('Speech recognition error:', event.error);
        setIsListening(false);
        
        // Handle specific errors
        if (event.error === 'not-allowed') {
          alert('Microphone access denied. Please allow microphone access and refresh the page.');
        }
      };
    } else {
      setIsSupported(false);
      console.warn('Speech recognition not supported in this browser');
    }
    
    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
    };
  }, [continuous, onResult]);

  const startListening = useCallback(() => {
    if (recognitionRef.current && !isListening) {
      try {
        recognitionRef.current.start();
      } catch (error) {
        console.error('Failed to start speech recognition:', error);
      }
    }
  }, [isListening]);

  const stopListening = useCallback(() => {
    if (recognitionRef.current && isListening) {
      recognitionRef.current.stop();
    }
  }, [isListening]);

  const resetTranscript = useCallback(() => {
    setTranscript('');
  }, []);
  return {
    transcript,
    isListening,
    isSupported,
    isSpeaking,
    confidence,
    startListening,
    stopListening,
    resetTranscript,
  };
};