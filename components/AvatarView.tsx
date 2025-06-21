"use client";
import { useState, useRef, useEffect, useMemo } from "react";
import { Canvas } from "@react-three/fiber";
import Experience from "../components/Experience";
import { Fullscreen, X } from "lucide-react";
import { useSocket } from "@/hooks/useSocket";
import { useSpeechRecognition } from "@/hooks/useSpeechRecognition";
import MessageDialog from "@/components/MessageDialog";
import MicrophoneButton from "@/components/MicrophoneButton";

function AvatarView() {
  const [text, setText] = useState("");
  const [speak, setSpeak] = useState(false);
  const [isFullScreen, setIsFullScreen] = useState(false);
  const [showMessageDialog, setShowMessageDialog] = useState(true);
  const containerRef = useRef<HTMLDivElement>(null); // Socket integration
  const {
    socket,
    isConnected,
    messages,
    currentMessage,
    isAvatarSpeaking,
    clearMessages,
    sendSpeechData,
    addSpeechMessage,
    setAvatarSpeaking,
  } = useSocket();
  // Speech recognition integration
  const {
    transcript,
    isListening,
    isSpeaking,
    confidence,
    isSupported: isSpeechSupported,
    startListening,
    stopListening,
    resetTranscript,
  } = useSpeechRecognition(
    (finalTranscript) => {
      // Send speech data to server when speech is completed
      if (finalTranscript.trim()) {
        console.log("Sending speech to server:", finalTranscript);
        // Add speech message to dialog
        sendSpeechData(finalTranscript.trim());
        addSpeechMessage(finalTranscript.trim());
        // Send to socket server
        resetTranscript();
      }
    },
    true, // continuous listening
    speak // pause when avatar is speaking
  );

  const toggleMicrophone = () => {
    if (isListening) {
      stopListening();
    } else {
      startListening();
    }
  };
  const height = useMemo(() => {
    if (typeof window === "undefined") return "100%";
    return isFullScreen ? "100vh" : "100vh";
  }, [isFullScreen]);
  const toggleFullScreen = () => {
    if (!document.fullscreenElement) {
      containerRef.current
        ?.requestFullscreen?.()
        .then(() => setIsFullScreen(true))
        .catch(() => setIsFullScreen(false));
    } else {
      document.exitFullscreen?.().then(() => setIsFullScreen(false));
    }
  };
  useEffect(() => {
    const handleFullScreenChange = () => {
      setIsFullScreen(!!document.fullscreenElement);
    };

    document.addEventListener("fullscreenchange", handleFullScreenChange);
    return () =>
      document.removeEventListener("fullscreenchange", handleFullScreenChange);
  }, []);

  // Handle AVATAR_TALK messages for speech
  useEffect(() => {
    if (currentMessage && currentMessage.type === "AVATAR_TALK") {
      setText(currentMessage.text);
      setSpeak(true);
      setShowMessageDialog(true);
    }
  }, [currentMessage]);
  return (
    <div
      style={{
        height: "100vh",
        width: "100vw",
        backgroundColor: "#111111",
        overflow: "hidden",
        position: "relative",
      }}
    >
      {" "}
      <div
        ref={containerRef}
        style={{
          position: isFullScreen ? "fixed" : "relative",
          top: isFullScreen ? "0" : "auto",
          left: isFullScreen ? "0" : "auto",
          width: isFullScreen ? "100vw" : "100%",
          height: isFullScreen ? "100vh" : height,
          transition: "all 0.3s ease",
          backgroundColor: "#111111",
          borderRadius: isFullScreen ? "0" : "15px",
          overflow: "hidden",
          boxShadow: isFullScreen ? "none" : "0 8px 32px rgba(0, 0, 0, 0.3)",
          zIndex: isFullScreen ? 9999 : 1,
        }}
      >
        <button
          onClick={toggleFullScreen}
          style={{
            position: "absolute",
            top: "10px",
            left: "10px",
            backgroundColor: "rgba(255, 255, 255, 0.2)",
            color: "white",
            border: "none",
            cursor: "pointer",
            zIndex: 10,
            borderRadius: "50%",
            width: "35px",
            height: "35px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            transition: "background-color 0.3s ease",
          }}
          onMouseEnter={(e) =>
            ((e.target as HTMLButtonElement).style.backgroundColor =
              "rgba(255, 255, 255, 0.4)")
          }
          onMouseLeave={(e) =>
            ((e.target as HTMLButtonElement).style.backgroundColor =
              "rgba(255, 255, 255, 0.2)")
          }
          title={isFullScreen ? "Exit Fullscreen" : "Enter Fullscreen"}
        >
          {isFullScreen ? <X size={25} /> : <Fullscreen size={25} />}
        </button>{" "}
        <Canvas
          shadows
          camera={{ position: [0, 0, 10], fov: 20 }}
          style={{
            height: "100%",
            width: "100%",
            transition: "all 0.3s ease",
          }}
        >
          <Experience
            speakingText={text}
            speak={speak}
            setSpeak={setSpeak}
            setAvatarSpeaking={setAvatarSpeaking}
          />
        </Canvas>{" "}
      </div>{" "}
      {/* Message Dialog */}
      <MessageDialog
        currentMessage={currentMessage}
        messages={messages}
        isVisible={showMessageDialog}
        onClose={() => setShowMessageDialog(false)}
      />{" "}
      {/* Microphone Button */}
      <MicrophoneButton
        isListening={isListening}
        isSpeaking={isSpeaking}
        confidence={confidence}
        isSupported={isSpeechSupported}
        onClick={toggleMicrophone}
        transcript={transcript}
      />
    </div>
  );
}

export default AvatarView;
