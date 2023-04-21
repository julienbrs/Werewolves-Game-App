import React, { useCallback, useEffect, useState } from "react";
import { GiftedChat } from "react-native-gifted-chat";
import { io } from "socket.io-client";

export function Example() {
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    const socket = io("http://localhost:8080");

    socket.on("connect", () => {
      console.log("connected to backend WebSocket server");
    });

    socket.on("message", message => {
      console.log("received message from backend:", message);
      setMessages(previousMessages =>
        GiftedChat.append(previousMessages, [
          {
            _id: Math.random().toString(36).substring(7),
            text: message,
            createdAt: new Date(),
            user: { _id: 2 },
          },
        ])
      );
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  const onSend = useCallback((messages = []) => {
    setMessages(previousMessages => GiftedChat.append(previousMessages, messages));
  }, []);

  return (
    <GiftedChat
      messages={messages}
      onSend={messages => onSend(messages)}
      user={{
        _id: 1,
      }}
    />
  );
}

export default Example;
