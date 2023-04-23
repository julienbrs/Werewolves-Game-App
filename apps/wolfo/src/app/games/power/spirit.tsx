import { Text } from "@ui-kitten/components";
import { useRouter } from "expo-router";
import React, { useContext } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { AuthContext } from "../../../components/context/tokenContext";
const SpiritView = () => {
  const router = useRouter();
  const { id } = useContext(AuthContext);
  if (!id) {
    router.back();
  }

  return (
    <SafeAreaView>
      <Text>Spirit | {id as string}</Text>
    </SafeAreaView>
  );
};

export default SpiritView;
