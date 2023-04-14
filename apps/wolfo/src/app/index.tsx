import { Text } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Link, Redirect, Stack } from "expo-router";
import useAuthQuery from "../utils/hooks/useAuth";
import * as SecureStore from "expo-secure-store";

const Home = () => {
  const { data, isError, isLoading } = useAuthQuery();
  if (isLoading) {
    return <Text>Loading...</Text>;
  }
  if (isError) {
    return <Redirect href="/auth" />;
  }
  return (
    <SafeAreaView>
      <Stack.Screen
        options={{
          title: "Home",
        }}
      />
      <Text style={{}}>Home test</Text>
      <Link href="/game/new">new Game</Link>
    </SafeAreaView>
  );
};
export default Home;
