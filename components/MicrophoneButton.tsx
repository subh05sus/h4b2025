"use client";
import React from 'react';
import { Mic, MicOff, Volume2 } from 'lucide-react';

interface MicrophoneButtonProps {
  isListening: boolean;
  isSpeaking?: boolean;
  confidence?: number;
  isSupported: boolean;
  onClick: () => void;
  transcript: string;
}

const MicrophoneButton: React.FC<MicrophoneButtonProps> = ({
  isListening,
  isSpeaking = false,
  confidence = 0,
  isSupported,
  onClick,
  transcript,
}) => {
  if (!isSupported) {
    return (
      <div className="fixed bottom-6 right-6 z-50 flex flex-col items-center">
        <div className="bg-muted/80 backdrop-blur-sm text-muted-foreground p-4 rounded-full shadow-lg border border-border/50">
          <MicOff size={24} />
        </div>
        <div className="text-xs text-muted-foreground text-center mt-2 bg-card/80 backdrop-blur-sm px-3 py-1 rounded-full border border-border/30">
          Speech not supported
        </div>
      </div>
    );
  }

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end max-w-sm">      {/* Transcript Display */}
      {transcript && (
        <div className="mb-4 max-w-xs bg-card/95 backdrop-blur-md text-card-foreground p-4 rounded-xl shadow-xl border border-border/50 animate-slide-in">
          <div className="flex items-center gap-2 text-xs text-muted-foreground mb-2">
            <Volume2 size={14} />
            <span>You're saying:</span>
            {/* Voice activity indicator */}
            {isSpeaking && (
              <div className="flex gap-0.5 ml-auto">
                <div className="w-1 h-3 bg-primary rounded-full voice-wave"></div>
                <div className="w-1 h-3 bg-primary rounded-full voice-wave"></div>
                <div className="w-1 h-3 bg-primary rounded-full voice-wave"></div>
              </div>
            )}
          </div>
          <div className="text-sm leading-relaxed font-medium">{transcript}</div>
          <div className="mt-3 flex items-center gap-2">
            <div className="flex-1 h-1 bg-muted rounded-full overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-primary to-primary/60 rounded-full transition-all duration-300" 
                style={{ width: `${Math.min(transcript.length * 2, 100)}%` }}
              ></div>
            </div>
            {confidence > 0 && (
              <span className="text-xs text-muted-foreground">
                {Math.round(confidence * 100)}%
              </span>
            )}
          </div>
        </div>
      )}
        {/* Microphone Button */}
      <div className="relative">
        <button
          onClick={onClick}
          className={`
            group relative p-4 rounded-full shadow-xl transition-all duration-300 transform hover:scale-105 active:scale-95
            border backdrop-blur-sm overflow-hidden
            ${isListening 
              ? 'bg-destructive/90 hover:bg-destructive border-destructive/50 text-destructive-foreground mic-pulse' 
              : 'bg-primary/90 hover:bg-primary border-primary/50 text-primary-foreground hover:shadow-primary/25'
            }
          `}
          title={isListening ? "Stop listening" : "Start listening"}
        >
          {/* Animated background for listening state */}
          {isListening && (
            <div className="absolute inset-0 bg-gradient-to-r from-destructive/20 via-destructive/30 to-destructive/20 animate-pulse"></div>
          )}
          
          {/* Pulsing rings when listening */}
          {isListening && (
            <>
              <div className="absolute inset-0 rounded-full bg-destructive/30 animate-ping"></div>
              <div className="absolute inset-0 rounded-full bg-destructive/20 animate-ping animation-delay-100"></div>
              <div className="absolute inset-0 rounded-full bg-destructive/10 animate-ping animation-delay-200"></div>
            </>
          )}
          
          {/* Hover effect ring */}
          <div className="absolute inset-0 rounded-full bg-current opacity-0 group-hover:opacity-10 transition-opacity duration-300"></div>
          
          <div className="relative z-10 transition-all duration-200 group-hover:scale-110">
            {isListening ? (
              <div className="relative">
                <Mic size={24} />
                {/* Small recording indicator */}
                <div className="absolute -top-1 -right-1 w-2 h-2 bg-red-400 rounded-full animate-pulse"></div>
              </div>
            ) : (
              <Mic size={24} />
            )}
          </div>
        </button>
        
        {/* Status indicator dot */}
        <div className={`
          absolute -top-1 -right-1 w-3 h-3 rounded-full border-2 border-background transition-all duration-300
          ${isListening ? 'bg-destructive animate-pulse shadow-lg shadow-destructive/50' : 'bg-muted-foreground'}
        `}></div>
      </div>
        {/* Status Text */}
      <div className="text-xs text-muted-foreground text-center mt-3 bg-card/80 backdrop-blur-sm px-3 py-1.5 rounded-full border border-border/30 transition-all duration-200">
        {isListening ? (
          <span className="flex items-center gap-1.5 justify-center">
            <div className="flex gap-0.5">
              <div className="w-1 h-1 bg-destructive rounded-full animate-bounce"></div>
              <div className="w-1 h-1 bg-destructive rounded-full animate-bounce animation-delay-100"></div>
              <div className="w-1 h-1 bg-destructive rounded-full animate-bounce animation-delay-200"></div>
            </div>
            Listening...
          </span>
        ) : (
          <span className="flex items-center gap-1.5 justify-center">
            <Mic size={12} className="opacity-60" />
            Click to speak
          </span>
        )}
      </div>
    </div>
  );
};

export default MicrophoneButton;
