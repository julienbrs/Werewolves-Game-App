import * as eva from "@eva-design/eva";
import { light as lightTheme } from "@eva-design/eva";
import { AntDesign, Ionicons } from "@expo/vector-icons";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ApplicationProvider } from "@ui-kitten/components";
import { Stack, useRouter } from "expo-router";
import React from "react";

import { SafeAreaProvider } from "react-native-safe-area-context";
import { AuthProvider } from "../components/context/tokenContext";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnMount: false,
      refetchOnWindowFocus: false,
    },
  },
});

const theme = {
  ...lightTheme,
  "color-primary-100": "#ffe3d7",
  "color-primary-200": "#ffc1b3",
  "color-primary-300": "#ffa28f",
  "color-primary-400": "#ff876f",
  "color-primary-500": "#914f49",
  "color-primary-600": "#db4a34",
  "color-primary-700": "#b53120",
  "color-primary-800": "#8f1c13",
  "color-primary-900": "#741108",
};

const HomeLayout = () => {
  const router = useRouter();
  return (
    <ApplicationProvider {...eva} theme={theme}>
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
          <SafeAreaProvider>
            <Stack
              screenOptions={{
                headerRight: () => (
                  <AntDesign
                    name="user"
                    size={24}
                    color="black"
                    onPress={() => router.push("/user")}
                    testID="settings-button"
                  />
                ),
              }}
            >
              <Stack.Screen
                name="(auth)/auth"
                options={{
                  title: "Authentification",
                  header: () => null,
                  headerRight: () => null,
                  headerLeft: () => null,
                }}
              />
              <Stack.Screen
                name="index"
                options={{
                  title: "Home",
                  headerLeft: () => (
                    <Ionicons
                      name="ios-notifications-outline"
                      size={24}
                      color="black"
                      onPress={() => router.push("/notifications")}
                    />
                  ),
                }}
              />
              <Stack.Screen
                name="games/new"
                options={{
                  title: "New game",
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
        </AuthProvider>
      </QueryClientProvider>
    </ApplicationProvider>
  );
};

export default HomeLayout;
