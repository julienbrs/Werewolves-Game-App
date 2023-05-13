import { Button, Input, Tab, TabView } from "@ui-kitten/components";
import { useRouter } from "expo-router";
import React from "react";
import { ImageBackground, StyleSheet, View } from "react-native";
import imgBackground from "../../assets/homepage_lobby.png";
import { ListGamesLobby, ListMyGames } from "../components/game/gameList";

const Home = () => {
  const router = useRouter();
  const [search, setSearch] = React.useState<string>("");
  const [tabIndex, setTabIndex] = React.useState<number>(0);
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
              <TabView
                selectedIndex={tabIndex}
                onSelect={index => {
                  if (isNaN(index)) {
                    return;
                  }
                  setTabIndex(index);
                }}
                style={styles.tabView}
              >
                <Tab title="Mes parties">
                  <View style={styles.tab}>
                    <ListMyGames search={search} />
                  </View>
                </Tab>
                <Tab title="Parties à rejoindre">
                  <View style={styles.tab}>
                    <ListGamesLobby search={search} />
                  </View>
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
    boxShadow: "0px 5px 10px rgba(0, 0, 0, 0.15)",
  },
  tabViewWrapper: {
    width: "70%",
    alignSelf: "center",
    borderRadius: 16,
    overflow: "hidden",
  },
  tabView: {
    borderRadius: 0,
  },
  tab: {
    borderBottomLeftRadius: 16,
    borderBottomRightRadius: 16,
    overflow: "hidden",
  },
  title: {
    paddingVertical: 5,
  },
  button: {
    width: "70%",
    height: 50,
    borderRadius: 16,
    marginBottom: 20,
    boxShadow: "0px 5px 10px rgba(0, 0, 0, 0.15)",
  },
  rules: {
    backgroundColor: "#d37c4c",
    borderColor: "#d37c4c",
    marginBottom: 60,
  },
});

export default Home;
