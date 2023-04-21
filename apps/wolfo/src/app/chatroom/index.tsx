import { useRouter } from "expo-router";
import React from "react";
import { Button, Text, View } from "react-native";

import { createChatroom } from "../../utils/api/chat";

const NewChatroom = () => {
  const router = useRouter();

  const handleCreateChatroom = async () => {
    const chatroomObject = {
      id: 0,
      messages: [],
      readers: [],
      writers: [],
      createdAt: new Date(),
      updatedAt: new Date(),
      nightChat: [],
      dayChat: [],
      spirit: [],
    };

    const newChatRoom = await createChatroom(chatroomObject);
    router.push(`/chatroom/${newChatRoom.id}`);
  };

  return (
    <View>
      <Text>New Chatroom</Text>
      <Button title="Create Chat Room" onPress={handleCreateChatroom} />
    </View>
  );
};

export default NewChatroom;
