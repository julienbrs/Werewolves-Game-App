import { useRouter } from "expo-router";
import React from "react";
import { Button, Text, View } from "react-native";

import { Input } from "@ui-kitten/components";
import { createChatroom } from "../../utils/api/chat";

const NewChatroom = () => {
  const router = useRouter();

  const [value, setValue] = React.useState("");

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
      <Input
        placeholder="Chatroom ID"
        value={value}
        onChangeText={newValue => setValue(newValue)}
      />
      <Button title="Go to Chatroom" onPress={() => router.push(`/chatroom/${value}`)} />
    </View>
  );
};

export default NewChatroom;
