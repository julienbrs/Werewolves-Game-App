import { Text } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Link, Redirect, Stack } from "expo-router";
import useAuth from "../utils/hooks/useAuth";

export default function Home() {
  const { username } = useAuth();
  if (!username) {
    return <Redirect href="/auth" />;
  }
  console.log("Home");
  return (
    <SafeAreaView>
      <Stack.Screen options={{
        title: "Home",
      }} />
        <Text>Home test</Text>
    </SafeAreaView>
  );
};