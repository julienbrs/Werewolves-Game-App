import { View, Text, Button } from "react-native";
import { useRouter, useSearchParams } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
const NewGame = () => {
  return (
    <SafeAreaView>
      {/* Page de création de la partie */}
      <Text>New Game</Text>
    </SafeAreaView>
  );
};

export default NewGame;
