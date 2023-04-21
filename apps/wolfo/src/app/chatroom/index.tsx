import { useRouter } from "expo-router";
import React from "react";
import { Button, Text, View } from "react-native";
const NewChatroom = () => {
  const router = useRouter();
  return (
    <View>
      <Text>New Chatroom</Text>
      <Button title="New Chatroom" onPress={() => router.push("/")} />
      <Button title="Go to Chatroom" onPress={() => router.push("/chatroom")} />
    </View>
  );
};

export default NewChatroom;
