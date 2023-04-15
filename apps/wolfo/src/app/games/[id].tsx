import { View, Text, Button } from "react-native";
import { useRouter, useSearchParams } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
const Game = () => {
  const router = useRouter();
  const { id } = useSearchParams();

  return (
    <SafeAreaView>
      {/* display all informations on the game after fetching data from backend*/}
      <Button title="Go back" onPress={() => router.back()} />
    </SafeAreaView>
  );
};

export default Game;
