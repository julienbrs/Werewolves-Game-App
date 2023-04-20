import { Button, Text } from "@ui-kitten/components";
import { useRouter, useSearchParams } from "expo-router";
import React from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
const ChatRoomView = () => {
  const router = useRouter();
  const { id } = useSearchParams(); // id du chatroom
  return (
    <SafeAreaView>
      <Text>ChatRoom | {Number(id)}</Text>
      <Button onPress={() => router.back()}>Go Back</Button>
    </SafeAreaView>
  );
};

export default ChatRoomView;
