import { Text } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Link, Redirect, useRouter } from "expo-router";
import useAuthQuery from "../utils/hooks/useAuth";
import { Button, ListItem } from "@rneui/themed";
import React from "react";
import { useQuery } from "@tanstack/react-query";
import { getGames } from "../utils/api/game";
import { Game } from "types";
const ListGames = () => {
  const { data, isLoading} = useQuery<Game[]>({
    queryKey: ["games"],
    queryFn: getGames,
  });

  if (isLoading) {
    return <Text>Games loading...</Text>;
  }
  {data!.map((game: Game) => {
  <ListItem key={game.id}>
    <ListItem.Content>

    </ListItem.Content>
  </ListItem>
  })}
};

const Home = () => {
  const router = useRouter();
  const buttonRef = React.useRef(null);
  const { data, isError, isLoading } = useAuthQuery();
  if (isLoading) {
    return <Text>Loading...</Text>;
  }
  if (isError) {
    return <Redirect href="/auth" />;
  }
  return (
    <SafeAreaView>
    <Text style={{}}>Home</Text>
    <Button onPress={() => router.push("/game/new")}>New game</Button>

    </SafeAreaView>
  );
};
export default Home;
