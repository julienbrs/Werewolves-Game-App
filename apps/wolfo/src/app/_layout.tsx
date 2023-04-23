import * as eva from "@eva-design/eva";
import { AntDesign, Ionicons } from "@expo/vector-icons";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ApplicationProvider } from "@ui-kitten/components";
import { Stack, useRouter } from "expo-router";
import React from "react";

import { SafeAreaProvider } from "react-native-safe-area-context";
import { AuthProvider } from "../components/context/tokenContext";
const queryClient = new QueryClient();

const HomeLayout = () => {
  const router = useRouter();
  return (
    <ApplicationProvider {...eva} theme={eva.light}>
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
