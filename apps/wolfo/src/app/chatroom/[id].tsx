import { Button, Text } from "@ui-kitten/components";
import { useRouter, useSearchParams } from "expo-router";
import React from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useQuery } from "react-query";
import { Message } from "types";
import { getHistory } from "../../utils/api/chat";

const ChatRoomView = () => {
  const router = useRouter();
  const { id } = useSearchParams(); // id du chatroom
  /*   
  Mock of chat history to test the view
  {
      id: 1,
      chatRoomId: 1,
      content: "Hello",
      authorId: "John",
      gameId: 1,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      id: 2,
      chatRoomId: 1,
      content: "HI it's Andrea",
      authorId: "Andrea",
      gameId: 1,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      id: 3,
      chatRoomId: 1,
      content: "How are you ?",
      authorId: "John",
      gameId: 1,
      createdAt: new Date(),
      updatedAt: new Date(),
    }, */

  const {
    data: history,
    isLoading,
    isError,
  } = useQuery<Message[], Error>({
    queryKey: ["chatroom", id],
    queryFn: () => getHistory(typeof id === "string" ? id : ""),
    enabled: typeof id === "string",
  });

  if (isLoading) {
    return <Text>Loading chat history...</Text>;
  }

  if (isError) {
    return <Text>Error loading chat history</Text>;
  }

  return (
    <SafeAreaView>
      <Text>ChatRoom | {Number(id)}</Text>
      {history &&
        history.map((message: Message, index: number) => (
          <Text key={index}>{message.content}</Text>
        ))}
      <Button onPress={() => router.back()}>Go Back</Button>
    </SafeAreaView>
  );
};

export default ChatRoomView;
