import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import React from "react";
import { SafeAreaProvider } from "react-native-safe-area-context";

import { useQuery } from "@tanstack/react-query";
import { useRouter, useSearchParams } from "expo-router";
import { useState } from "react";

import { Button, Input, Text } from "@ui-kitten/components";
import { Message } from "types";
import { getHistory, postMessage } from "../../utils/api/chat";

const queryClient = new QueryClient();

const ChatRoomView = () => {
  const [message, setMessage] = useState("");
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

  const sendMessage = async () => {
    try {
      const authorId = "b3df581f-cc3f-49dd-a986-5d0ba7750f9d"; // Remplacez par l'ID de l'auteur actuel
      const gameId = 1; // Remplacez par l'ID du jeu actuel
      console.log(
        `Sending message: ${message} from ${authorId} in game ${gameId} in chatroom ${id}`
      );
      await postMessage(id, message, authorId, gameId);
      setMessage(""); // Vider le champ de texte après l'envoi du message
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };

  if (isLoading) {
    return <Text>Loading chat history...</Text>;
  }

  if (isError) {
    return <Text>Error loading chat history</Text>;
  }

  return (
    <QueryClientProvider client={queryClient}>
      <SafeAreaProvider>
        <Text>ChatRoom | {Number(id)}</Text>
        {history &&
          history.map((msg: Message, index: number) => <Text key={index}>{msg.content}</Text>)}
        <Button onPress={() => router.back()}>Go Back</Button>
        <Input
          placeholder="Type your message..."
          value={message}
          onChangeText={text => setMessage(text)}
        />
        <Button onPress={sendMessage}>Send Message</Button>
      </SafeAreaProvider>
    </QueryClientProvider>
  );
};

export default ChatRoomView;
