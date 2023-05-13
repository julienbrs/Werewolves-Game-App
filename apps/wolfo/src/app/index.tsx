import { useQuery } from "@tanstack/react-query";
import { Button, Input, Tab, TabView } from "@ui-kitten/components";
import { Redirect, useRouter } from "expo-router";
import React from "react";
import { ImageBackground, StyleSheet, View } from "react-native";
import imgBackground from "../../assets/homepage_lobby.png";
import { ListGamesLobby, ListMyGames } from "../components/game/gameList";
import Loading from "../components/loading";
import useAuth from "../utils/hooks/useAuth";

const Home = () => {
  const router = useRouter();
  const [search, setSearch] = React.useState<string>("");
  const [tabIndex, setTabIndex] = React.useState<number>(0);
  const { data, isLoading } = useQuery({
    queryKey: ["token"], // clé de cache
    queryFn: useAuth,
    cacheTime: 0,
  });
  if (isLoading) {
    return <Loading title="Loading home" message="loading user information" />;
  }
  if (data === null) {
    return <Redirect href="/auth" />;
  }
  return (
    <>
      <View style={styles.container}>
        <ImageBackground source={imgBackground} style={styles.image}>
          <View style={styles.centeredView}>
            <Button
              onPress={() => {}}
              style={[styles.button, styles.rules]}
              status="primary"
              testID="rule-button"
            >
              Rules
            </Button>
            <Button
              onPress={() => router.push("/games/new")}
              style={styles.button}
              status="primary"
              testID="new-game-button"
            >
              New game
            </Button>
            <Input
              placeholder="Rechercher une partie"
              onChangeText={setSearch}
              value={search}
              style={styles.searchInput}
              testID="search-game-input"
            />
            <View style={styles.tabViewWrapper}>
              <TabView selectedIndex={tabIndex} onSelect={setTabIndex} style={styles.tabView}>
                <Tab title="Mes parties">
                  <ListMyGames search={search} />
                </Tab>
                <Tab title="Parties à rejoindre">
                  <ListGamesLobby search={search} />
                </Tab>
              </TabView>
            </View>
          </View>
        </ImageBackground>
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "column",
  },
  image: {
    flex: 1,
    resizeMode: "cover",
    justifyContent: "center",
  },
  centeredView: {
    alignItems: "center",
  },
  searchInput: {
    width: "70%",
    color: "brown",
    opacity: 0.95,
    marginBottom: 20,
    borderRadius: 16,
    boxShadow: "0px 10px 20px rgba(0, 0, 0, 0.25)",
  },
  tabViewWrapper: {
    width: "70%",
    alignSelf: "center",
    borderRadius: 16,
  },
  tabView: {
    borderRadius: 16,
  },
  button: {
    width: "70%",
    height: 50,
    borderRadius: 16,
    marginBottom: 20,
    boxShadow: "0px 10px 20px rgba(0, 0, 0, 0.25)",
  },
  rules: {
    backgroundColor: "#d37c4c",
    borderColor: "#d37c4c",
    marginBottom: 60,
  },
});

export default Home;
