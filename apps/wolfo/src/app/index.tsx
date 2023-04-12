import { Text } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Stack } from "expo-router";
export default function Home() {
  return (
    <SafeAreaView>
      <Stack.Screen options={{
        title: "Home",
      }} />
        <Text>Home</Text>
    </SafeAreaView>
  );
};