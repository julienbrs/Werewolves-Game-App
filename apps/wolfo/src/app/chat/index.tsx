import React, { useCallback, useEffect, useState } from "react";
import { Text, View } from "react-native";
import { GiftedChat } from "react-native-gifted-chat";
import io from "socket.io-client";

const port = 3000;
const IP = "192.168.41.139";
const socketEndpoint = `http://${IP}:${port}`;

let user_id = Math.floor(Math.random() * 10000000);

export function Example() {
  const [messages, setMessages] = useState([]);
  const [hasConnection, setConnection] = useState(true); // Initialiser à true
  const socket = io(socketEndpoint);

  useEffect(() => {
    setMessages([]);
  }, []);

  useEffect(() => {
    socket.on("connect", () => {
      setConnection(true);
      socket.emit("ask-for-id");
    });

    socket.on("disconnect", () => {
      setConnection(false);
    });
  });

  const onSend = useCallback(
    (messagesBDD = []) => {
      setMessages(previousMessages => GiftedChat.append(previousMessages, messagesBDD));
      let newMessage = {
        id: messagesBDD[0]._id,
        content: messagesBDD[0].text,
        authorId: user_id,
        chatRoomId: 1,
        gameId: 1,
      };
      socket.emit("messagePosted", newMessage);
    },
    [socket]
  );

  return !hasConnection ? (
    <View>
      <Text>Connection not established</Text>
    </View>
  ) : (
    <GiftedChat
      messages={messages}
      onSend={messages => onSend(messages)}
      user={{
        _id: user_id,
      }}
    />
  );
}
export default Example;
