import { Stack } from "expo-router";

const HomeLayout = () => {
  return (
    <Stack>
      <Stack.Screen name="auth" options={{ title: "Authentification"}}  />
    </Stack>
  );
}

export default HomeLayout;