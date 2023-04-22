import { Input } from "@ui-kitten/components";
import { useRouter } from "expo-router";
import React from "react";
import { Button, Text, View } from "react-native";
import { NewChatroom } from "types";
import { createChatroom } from "../../utils/api/chat";

const CreateNewChatroom = () => {
  const router = useRouter();
  const [value, setValue] = React.useState("");

  const handleCreateChatroom = async () => {
    const newChatroom: NewChatroom = {
      createdAt: new Date(),
      updatedAt: new Date(),
      nightChat: [],
      dayChat: [],
      spirit: [],
    };
    try {
      console.log("Creating chatroom...");
      const createdChatroom = await createChatroom(newChatroom);
      console.log("Chatroom created:", createdChatroom);
      // Rediriger vers le chatroom créé
      router.push(`/chatrooms/${createdChatroom.id}`);
    } catch (error) {
      console.error("Index.tsx");
      console.error("Failed to create chatroom:", error);
    }
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
      <Button title="Go to Chatroom" onPress={() => router.push(`/chatrooms/${value}`)} />
    </View>
  );
};

export default CreateNewChatroom;
