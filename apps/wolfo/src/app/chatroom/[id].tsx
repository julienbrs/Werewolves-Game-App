import { Button, Text } from "@ui-kitten/components";
import { useRouter, useSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import React from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Message } from "types";
import { getHistory } from "../../utils/api/chat";

const ChatRoomView = () => {
  const router = useRouter();
  const { id } = useSearchParams(); // id du chatroom

  const [history, setHistory] = useState([] as Message[]);

  useEffect(() => {
    const getChatHistory = async () => {
      console.log("getChatHistory");
      const chatHistory = await getHistory();
      setHistory(chatHistory);
    };
    getChatHistory();
  }, []);

  return (
    <SafeAreaView>
      <Text>ChatRoom | {Number(id)}</Text>
      {history.map((message, index) => (
        <Text key={index}>{message.content}</Text>
      ))}
      <Button onPress={() => router.back()}>Go Back</Button>
    </SafeAreaView>
  );
};

export default ChatRoomView;
