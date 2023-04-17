import * as eva from "@eva-design/eva";
import { AntDesign } from "@expo/vector-icons";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ApplicationProvider } from "@ui-kitten/components";
import { Stack, useRouter } from "expo-router";
import React from "react";

import { SafeAreaProvider } from "react-native-safe-area-context";

const queryClient = new QueryClient();

const HomeLayout = () => {
  const router = useRouter();
  return (
    <ApplicationProvider {...eva} theme={eva.light}>
      <QueryClientProvider client={queryClient}>
        <SafeAreaProvider>
          <Stack
            screenOptions={{
              headerRight: () => (
                <AntDesign
                  name="user"
                  size={24}
                  color="black"
                  onPress={() => router.push("/user")}
                />
              ),
            }}
          >
            <Stack.Screen
              name="auth/index"
              options={{
                title: "Authentification",
                headerRight: () => null,
                headerLeft: () => null,
              }}
            />
            <Stack.Screen
              name="index"
              options={{
                title: "Home",
              }}
            />
            <Stack.Screen
              name="user/index"
              options={{
                title: "User settings",
                headerRight: () => null,
              }}
            />
          </Stack>
        </SafeAreaProvider>
      </QueryClientProvider>
    </ApplicationProvider>
  );
};

export default HomeLayout;
