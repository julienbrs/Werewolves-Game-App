import { useQuery } from "@tanstack/react-query";
import { Button, Input, Tab, TabView } from "@ui-kitten/components";
import { Redirect, useRouter } from "expo-router";
import React from "react";
import { ListGamesLobby, ListMyGames } from "../components/game/gameList";
import Loading from "../components/loading";
import useAuth from "../utils/hooks/useAuth";
const Home = () => {
  const router = useRouter();
  const [search, setSearch] = React.useState<string>("");
  const [tabIndex, setTabIndex] = React.useState<number>(0);
  const { isError, isLoading } = useQuery({
    queryKey: ["token"], // clé de cache
    queryFn: useAuth,
    staleTime: 0, // à chaque fois que la page est chargée, on refait la requête
  });
  if (isLoading) {
    return <Loading title="Loading home" message="loading user information" />;
  }
  if (isError) {
    return <Redirect href="/auth" />;
  }
  return (
    <>
      <Button onPress={() => router.push("/games/new")}>New game</Button>
      <Input placeholder="Recherche" onChangeText={setSearch} value={search} />
      <TabView selectedIndex={tabIndex} onSelect={setTabIndex}>
        <Tab title="Mes parties">
          <ListMyGames search={search} />
        </Tab>
        <Tab title="Parties à rejoindre">
          <ListGamesLobby search={search} />
        </Tab>
      </TabView>
    </>
  );
};
export default Home;
