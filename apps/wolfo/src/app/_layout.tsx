import { Stack } from "expo-router";

export default function HomeLayout() {
  return (
    <Stack>
      <Stack.Screen name="auth" options={{ title: "Authentification"}}  />
    </Stack>
  );
}