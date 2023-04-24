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
  const [messageInput, setMessageInput] = useState<string>("");
  const router = useRouter();
  const { id, gameId, userId } = useSearchParams(); // id du chatroom

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
      const gameId = 1;
      const userId = "512daa49-a394-4afc-99b3-1e6a0e7daf88";
      const id = "8";
      console.log(
        `Sending message: ${messageInput} from ${userId} in game ${gameId} in chatroom ${id}`
      );
      await postMessage(id, messageInput, userId, gameId);
      setMessageInput(""); // Vider le champ de texte après l'envoi du message
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
          value={messageInput}
          onChangeText={text => setMessageInput(text)}
        />
        <Button onPress={sendMessage}>Send Message</Button>
      </SafeAreaProvider>
    </QueryClientProvider>
  );
};

export default ChatRoomView;
