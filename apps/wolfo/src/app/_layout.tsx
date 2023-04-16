import { Stack } from "expo-router";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { SafeAreaProvider } from "react-native-safe-area-context";
const queryClient = new QueryClient();

const HomeLayout = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <SafeAreaProvider>
        <Stack>
          <Stack.Screen name="auth/index" options={{ title: "Authentification" }} />
          <Stack.Screen
            name="index"
            options={{
              title: "Home",
            }}
          />
        </Stack>
      </SafeAreaProvider>
    </QueryClientProvider>
  );
};

export default HomeLayout;
