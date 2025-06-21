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
        return "text-emerald-400";
      case "ERROR":
        return "text-red-400";
      case "WARNING":
        return "text-amber-400";
      default:
        return "text-blue-400";
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
      {" "}
      {/* Dark Glass morphism container */}
      <div
        className="backdrop-blur-xl bg-zinc-900/50 border border-gray-700/30 rounded-2xl shadow-2xl"
        style={{
          background: "rgba(15, 15, 15, 0.5)",
          backdropFilter: "blur(24px)",
          WebkitBackdropFilter: "blur(24px)",
          boxShadow:
            "0 25px 50px -12px rgba(0, 0, 0, 0.8), 0 0 0 1px rgba(255, 255, 255, 0.05), inset 0 1px 0 rgba(255, 255, 255, 0.1)",
        }}
      >
        {" "}
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-700/40">
          <div className="flex items-center gap-2">
            <MessageCircle className="w-5 h-5 text-gray-200" />
            <span className="text-gray-100 font-medium">
              {showHistory ? "Message History" : "Avatar Messages"}
            </span>
            {messages.length > 0 && (
              <span className="bg-gray-800/60 text-gray-200 text-xs px-2 py-1 rounded-full border border-gray-600/30">
                {messages.length}
              </span>
            )}
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowHistory(!showHistory)}
              className="p-1.5 hover:bg-gray-800/50 rounded-lg transition-all duration-200 hover:scale-105"
              title={showHistory ? "Show Current" : "Show History"}
            >
              <History className="w-4 h-4 text-gray-300 hover:text-gray-100" />
            </button>
            <button
              onClick={() => setIsMinimized(!isMinimized)}
              className="p-1.5 hover:bg-gray-800/50 rounded-lg transition-all duration-200 hover:scale-105"
              title={isMinimized ? "Maximize" : "Minimize"}
            >
              {isMinimized ? (
                <Maximize2 className="w-4 h-4 text-gray-300 hover:text-gray-100" />
              ) : (
                <Minimize2 className="w-4 h-4 text-gray-300 hover:text-gray-100" />
              )}
            </button>
            <button
              onClick={onClose}
              className="p-1.5 hover:bg-red-900/30 rounded-lg transition-all duration-200 hover:scale-105"
              title="Close"
            >
              <X className="w-4 h-4 text-gray-300 hover:text-red-300" />
            </button>
          </div>
        </div>
        {/* Content */}
        {!isMinimized && (
          <div className="p-4">
            {showHistory ? (
              /* History View */ <div className="space-y-3 max-h-60 overflow-y-auto custom-scrollbar">
                {messages.length === 0 ? (
                  <div className="text-gray-400 text-center py-4">
                    No messages yet
                  </div>
                ) : (
                  messages
                    .slice(-10)
                    .reverse()
                    .map((message) => (
                      <div
                        key={message.id}
                        className="bg-gray-900/30 rounded-lg p-3 border border-gray-700/30 hover:bg-gray-800/40 transition-colors duration-200"
                      >
                        <div className="flex items-center justify-between mb-2">
                          <span
                            className={`text-sm font-medium ${getMessageTypeColor(
                              message.type
                            )}`}
                          >
                            {message.type}
                          </span>
                          <span className="text-gray-500 text-xs">
                            {formatTime(message.timestamp)}
                          </span>
                        </div>
                        <p className="text-gray-200 text-sm leading-relaxed">
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
                      </span>{" "}
                      <span className="text-gray-500 text-xs">
                        {formatTime(currentMessage.timestamp)}
                      </span>
                    </div>
                    <p className="text-gray-200 leading-relaxed">
                      {currentMessage.text}
                    </p>

                    {/* Animated speaking indicator for AVATAR_TALK */}
                    {currentMessage.type === "AVATAR_TALK" && (
                      <div className="flex items-center gap-2 mt-3 pt-3 border-t border-gray-700/40">
                        <div className="flex gap-1">
                          <div
                            className="w-2 h-2 bg-emerald-400 rounded-full animate-bounce shadow-lg shadow-emerald-400/50"
                            style={{ animationDelay: "0ms" }}
                          ></div>
                          <div
                            className="w-2 h-2 bg-emerald-400 rounded-full animate-bounce shadow-lg shadow-emerald-400/50"
                            style={{ animationDelay: "150ms" }}
                          ></div>
                          <div
                            className="w-2 h-2 bg-emerald-400 rounded-full animate-bounce shadow-lg shadow-emerald-400/50"
                            style={{ animationDelay: "300ms" }}
                          ></div>
                        </div>
                        <span className="text-emerald-300 text-sm">
                          Avatar is speaking...
                        </span>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="text-gray-400 text-center py-4">
                    Waiting for messages...
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </div>{" "}
      {/* Connection indicator */}
      <div className="flex justify-center mt-2">
        <div className="flex items-center gap-2 bg-gray-900/40 backdrop-blur-sm rounded-full px-3 py-1 border border-gray-700/30">
          <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse shadow-lg shadow-emerald-400/50"></div>
          <span className="text-gray-300 text-xs">Socket Connected</span>
        </div>
      </div>{" "}
      <style jsx>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }

        .custom-scrollbar::-webkit-scrollbar-track {
          background: rgba(55, 65, 81, 0.3);
          border-radius: 3px;
        }

        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(107, 114, 128, 0.6);
          border-radius: 3px;
        }

        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(156, 163, 175, 0.8);
        }
      `}</style>
    </div>
  );
};

export default MessageDialog;
