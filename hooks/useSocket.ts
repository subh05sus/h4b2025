import { useEffect, useRef, useState, useCallback } from "react";
import { io, Socket } from "socket.io-client";

export interface SocketMessage {
  id: string;
  type: string;
  text: string;
  timestamp: number;
}

export interface UseSocketReturn {
  socket: Socket | null;
  isConnected: boolean;
  messages: SocketMessage[];
  currentMessage: SocketMessage | null;
  clearMessages: () => void;
  sendSpeechData: (text: string) => void;
}

export const useSocket = (
  serverUrl: string = "ws://localhost:3001"
): UseSocketReturn => {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [messages, setMessages] = useState<SocketMessage[]>([]);
  const [currentMessage, setCurrentMessage] = useState<SocketMessage | null>(
    null
  );
  const reconnectTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const clearMessages = useCallback(() => {
    setMessages([]);
    setCurrentMessage(null);
  }, []);

  const sendSpeechData = useCallback(
    (text: string) => {
      if (socket && isConnected) {
        console.log("Sending speech data:", text);
        socket.emit("DATA_IN", {
          type: "DATA_IN",
          text: text,
          timestamp: Date.now(),
        });
      } else {
        console.warn("Cannot send speech data: socket not connected");
      }
    },
    [socket, isConnected]
  );

  useEffect(() => {
    const socketInstance = io(serverUrl, {
      autoConnect: true,
      reconnection: true,
      reconnectionAttempts: Infinity,
      reconnectionDelay: 1000,
    });

    const handleConnect = () => {
      console.log("Socket connected");
      setIsConnected(true);
      if (reconnectTimeoutRef.current) {
        clearTimeout(reconnectTimeoutRef.current);
        reconnectTimeoutRef.current = null;
      }
    };

    const handleDisconnect = () => {
      console.log("Socket disconnected");
      setIsConnected(false);
    };

    const handleMessage = (data: any) => {
      console.log("Received message:", data);

      const message: SocketMessage = {
        id: Math.random().toString(36).substr(2, 9),
        type: data.type || "UNKNOWN",
        text: data.text || "",
        timestamp: Date.now(),
      };

      setMessages((prev) => [...prev, message]);

      // Handle AVATAR_TALK messages
      if (data.type === "AVATAR_TALK" || data.type === "response") {
        setCurrentMessage(message);
        // Auto-clear current message after 10 second
        setTimeout(() => {
          setCurrentMessage((prev) =>
            prev && prev.id === message.id ? null : prev
          );
        }, 10000);
      }
    };

    const handleConnectError = (error: Error) => {
      console.error("Socket connection error:", error);
      setIsConnected(false);
    };

    socketInstance.on("connect", handleConnect);
    socketInstance.on("disconnect", handleDisconnect);
    socketInstance.on("message", handleMessage);
    socketInstance.on("AVATAR_TALK", handleMessage);
    socketInstance.on("connect_error", handleConnectError);

    setSocket(socketInstance);

    return () => {
      if (reconnectTimeoutRef.current) {
        clearTimeout(reconnectTimeoutRef.current);
      }
      socketInstance.off("connect", handleConnect);
      socketInstance.off("disconnect", handleDisconnect);
      socketInstance.off("message", handleMessage);
      socketInstance.off("AVATAR_TALK", handleMessage);
      socketInstance.off("connect_error", handleConnectError);
      socketInstance.disconnect();
    };
  }, [serverUrl]);
  return {
    socket,
    isConnected,
    messages,
    currentMessage,
    clearMessages,
    sendSpeechData,
  };
};

export const useSocket3002 = (
  serverUrl: string = "ws://localhost:3002"
): UseSocketReturn => {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [messages, setMessages] = useState<SocketMessage[]>([]);
  const [currentMessage, setCurrentMessage] = useState<SocketMessage | null>(
    null
  );
  const reconnectTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const clearMessages = useCallback(() => {
    setMessages([]);
    setCurrentMessage(null);
  }, []);

  const sendSpeechData = useCallback(
    (text: string) => {
      if (socket && isConnected) {
        console.log("Sending speech data:", text);
        socket.emit("DATA_IN", {
          type: "DATA_IN",
          text: text,
          timestamp: Date.now(),
        });
      } else {
        console.warn("Cannot send speech data: socket not connected");
      }
    },
    [socket, isConnected]
  );

  useEffect(() => {
    const socketInstance = io(serverUrl, {
      autoConnect: true,
      reconnection: true,
      reconnectionAttempts: Infinity,
      reconnectionDelay: 1000,
    });

    const handleConnect = () => {
      console.log("Socket connected to 3002");
      setIsConnected(true);
      if (reconnectTimeoutRef.current) {
        clearTimeout(reconnectTimeoutRef.current);
        reconnectTimeoutRef.current = null;
      }
    };

    const handleDisconnect = () => {
      console.log("Socket disconnected from 3002");
      setIsConnected(false);
    };

    const handleMessage = (data: any) => {
      console.log("Received message from 3002:", data);

      const message: SocketMessage = {
        id: Math.random().toString(36).substr(2, 9),
        type: data.type || "UNKNOWN",
        text: data.text || "",
        timestamp: Date.now(),
      };

      setMessages((prev) => [...prev, message]);

      if (data.type === "AVATAR_TALK" || data.type === "response") {
        setCurrentMessage(message);
        setTimeout(() => {
          setCurrentMessage((prev) =>
            prev && prev.id === message.id ? null : prev
          );
        }, 10000);
      }
    };

    const handleConnectError = (error: Error) => {
      console.error("Socket connection error on 3002:", error);
      setIsConnected(false);
    };

    socketInstance.on("connect", handleConnect);
    socketInstance.on("disconnect", handleDisconnect);
    socketInstance.on("message", handleMessage);
    socketInstance.on("AVATAR_TALK", handleMessage);
    socketInstance.on("connect_error", handleConnectError);

    setSocket(socketInstance);

    return () => {
      if (reconnectTimeoutRef.current) {
        clearTimeout(reconnectTimeoutRef.current);
      }
      socketInstance.off("connect", handleConnect);
      socketInstance.off("disconnect", handleDisconnect);
      socketInstance.off("message", handleMessage);
      socketInstance.off("AVATAR_TALK", handleMessage);
      socketInstance.off("connect_error", handleConnectError);
      socketInstance.disconnect();
    };
  }, [serverUrl]);

  return {
    socket,
    isConnected,
    messages,
    currentMessage,
    clearMessages,
    sendSpeechData,
  };
};
