import { Text } from "@ui-kitten/components";
import { Stack, useRouter } from "expo-router";
import React, { useContext } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { AuthContext } from "src/components/context/tokenContext";
const InsomniacView = () => {
  const router = useRouter();
  const { id: userId } = useContext(AuthContext);
  if (!userId) {
    router.back();
  }

  return (
    <SafeAreaView>
      <Stack.Screen options={{ title: "Insomniac", headerRight: () => null }} />
      <Text>Spirit | {userId as string}</Text>
    </SafeAreaView>
  );
};

export default InsomniacView;
