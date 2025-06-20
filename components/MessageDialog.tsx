"use client";
import React, { useState, useEffect } from "react";
import { SocketMessage } from "@/hooks/useSocket";
import { MessageCircle, X, History, Minimize2, Maximize2 } from "lucide-react";

interface MessageDialogProps {
  currentMessage: SocketMessage | null;
  messages: SocketMessage[];
  isVisible: boolean;
  onClose: () => void;
}

const MessageDialog: React.FC<MessageDialogProps> = ({
  currentMessage,
  messages,
  isVisible,
  onClose,
}) => {
  const [showHistory, setShowHistory] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);

  // Auto-show dialog when there's a current message
  useEffect(() => {
    if (currentMessage) {
      setIsMinimized(false);
    }
  }, [currentMessage]);

  if (!isVisible && !currentMessage) return null;

  const formatTime = (timestamp: number) => {
    return new Date(timestamp).toLocaleTimeString("en-US", {
      hour12: false,
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    });
  };

  const getMessageTypeColor = (type: string) => {
    switch (type) {
      case "AVATAR_TALK":
        return "text-green-300";
      case "ERROR":
        return "text-red-300";
      case "WARNING":
        return "text-yellow-300";
      default:
        return "text-blue-300";
    }
  };

  return (
    <div
      className={`fixed bottom-4 left-1/2 transform -translate-x-1/2 z-50 transition-all duration-300 ease-in-out ${
        isMinimized ? "scale-90 opacity-80" : "scale-100 opacity-100"
      }`}
      style={{
        maxWidth: "90vw",
        width: showHistory ? "600px" : "450px",
      }}
    >
      {/* Glass morphism container */}
      <div
        className="backdrop-blur-md bg-white/10 border border-white/20 rounded-2xl shadow-2xl"
        style={{
          background: "rgba(255, 255, 255, 0.05)",
          backdropFilter: "blur(20px)",
          WebkitBackdropFilter: "blur(20px)",
          boxShadow:
            "0 8px 32px rgba(0, 0, 0, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.2)",
        }}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-white/20">
          <div className="flex items-center gap-2">
            <MessageCircle className="w-5 h-5 text-white/80" />
            <span className="text-white/90 font-medium">
              {showHistory ? "Message History" : "Avatar Messages"}
            </span>
            {messages.length > 0 && (
              <span className="bg-white/20 text-white/80 text-xs px-2 py-1 rounded-full">
                {messages.length}
              </span>
            )}
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowHistory(!showHistory)}
              className="p-1.5 hover:bg-white/20 rounded-lg transition-colors duration-200"
              title={showHistory ? "Show Current" : "Show History"}
            >
              <History className="w-4 h-4 text-white/70" />
            </button>
            <button
              onClick={() => setIsMinimized(!isMinimized)}
              className="p-1.5 hover:bg-white/20 rounded-lg transition-colors duration-200"
              title={isMinimized ? "Maximize" : "Minimize"}
            >
              {isMinimized ? (
                <Maximize2 className="w-4 h-4 text-white/70" />
              ) : (
                <Minimize2 className="w-4 h-4 text-white/70" />
              )}
            </button>
            <button
              onClick={onClose}
              className="p-1.5 hover:bg-white/20 rounded-lg transition-colors duration-200"
              title="Close"
            >
              <X className="w-4 h-4 text-white/70" />
            </button>
          </div>
        </div>

        {/* Content */}
        {!isMinimized && (
          <div className="p-4">
            {showHistory ? (
              /* History View */
              <div className="space-y-3 max-h-60 overflow-y-auto custom-scrollbar">
                {messages.length === 0 ? (
                  <div className="text-white/60 text-center py-4">
                    No messages yet
                  </div>
                ) : (
                  messages
                    .slice(-10)
                    .reverse()
                    .map((message) => (
                      <div
                        key={message.id}
                        className="bg-white/5 rounded-lg p-3 border border-white/10"
                      >
                        <div className="flex items-center justify-between mb-2">
                          <span
                            className={`text-sm font-medium ${getMessageTypeColor(
                              message.type
                            )}`}
                          >
                            {message.type}
                          </span>
                          <span className="text-white/50 text-xs">
                            {formatTime(message.timestamp)}
                          </span>
                        </div>
                        <p className="text-white/90 text-sm leading-relaxed">
                          {message.text}
                        </p>
                      </div>
                    ))
                )}
              </div>
            ) : (
              /* Current Message View */
              <div>
                {currentMessage ? (
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span
                        className={`text-sm font-medium ${getMessageTypeColor(
                          currentMessage.type
                        )}`}
                      >
                        {currentMessage.type}
                      </span>
                      <span className="text-white/50 text-xs">
                        {formatTime(currentMessage.timestamp)}
                      </span>
                    </div>
                    <p className="text-white/90 leading-relaxed">
                      {currentMessage.text}
                    </p>

                    {/* Animated speaking indicator for AVATAR_TALK */}
                    {currentMessage.type === "AVATAR_TALK" && (
                      <div className="flex items-center gap-2 mt-3 pt-3 border-t border-white/20">
                        <div className="flex gap-1">
                          <div
                            className="w-2 h-2 bg-green-400 rounded-full animate-bounce"
                            style={{ animationDelay: "0ms" }}
                          ></div>
                          <div
                            className="w-2 h-2 bg-green-400 rounded-full animate-bounce"
                            style={{ animationDelay: "150ms" }}
                          ></div>
                          <div
                            className="w-2 h-2 bg-green-400 rounded-full animate-bounce"
                            style={{ animationDelay: "300ms" }}
                          ></div>
                        </div>
                        <span className="text-green-300 text-sm">
                          Avatar is speaking...
                        </span>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="text-white/60 text-center py-4">
                    Waiting for messages...
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Connection indicator */}
      <div className="flex justify-center mt-2">
        <div className="flex items-center gap-2 bg-white/5 backdrop-blur-sm rounded-full px-3 py-1 border border-white/10">
          <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
          <span className="text-white/70 text-xs">Socket Connected</span>
        </div>
      </div>

      <style jsx>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }

        .custom-scrollbar::-webkit-scrollbar-track {
          background: rgba(255, 255, 255, 0.1);
          border-radius: 3px;
        }

        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(255, 255, 255, 0.3);
          border-radius: 3px;
        }

        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(255, 255, 255, 0.5);
        }
      `}</style>
    </div>
  );
};

export default MessageDialog;
