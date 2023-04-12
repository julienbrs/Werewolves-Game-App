import { Text, Button } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Stack, useRouter } from "expo-router";
export default function Auth() {
  const router = useRouter();
  return (
    <SafeAreaView>
      <Stack.Screen options={{
        title: "Auth",
      }} />
        <Text>Auth</Text>
        <Button title="Go Back" onPress={() => router.back()}/>
    </SafeAreaView>
  );
};