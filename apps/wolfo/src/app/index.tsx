import { Button, Input, Tab, TabView, Text } from "@ui-kitten/components";
import { useFonts } from "expo-font";
import { useRouter } from "expo-router";
import React from "react";
import { StyleSheet, View } from "react-native";
import { ListGamesLobby, ListMyGames } from "../components/game/gameList";

const Home = () => {
  const router = useRouter();
  const [search, setSearch] = React.useState<string>("");
  const [tabIndex, setTabIndex] = React.useState<number>(0);
  const [loaded] = useFonts({
    Montserrat: require("../../assets/fonts/Montserrat-Regular.ttf"),
    MontserratBold: require("../../assets/fonts/Montserrat-SemiBold.ttf"),
    Voyage: require("../../assets/fonts/Voyage.ttf"),
  });

  if (!loaded) {
    return null;
  }

  return (
    <>
      <View style={styles.container}>
        <View style={styles.centeredView}>
          <Button
            onPress={() => {}}
            style={[styles.button, styles.rules]}
            status="primary"
            testID="rule-button"
          >
            {evaProps => (
              <Text {...evaProps} style={styles.buttonText}>
                See Player
              </Text>
            )}
          </Button>
          <Button
            onPress={() => router.push("/games/new")}
            style={styles.button}
            status="primary"
            testID="new-game-button"
          >
            <Text style={styles.buttonText}>New Game</Text>
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
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "column",
    justifyContent: "center",
    alignContent: "center",
    overflow: "hidden",
    backgroundColor: "#141313",
  },
  centeredView: {
    flex: 1,
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
  },
  searchInput: {
    width: "70%",
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
    fontFamily: "Voyage",
  },
  button: {
    width: "70%",
    height: 50,
    borderRadius: 16,
    marginBottom: 20,
    boxShadow: "0px 5px 10px rgba(0, 0, 0, 0.15)",
  },
  rules: {
    backgroundColor: "#FFBCB5",
    borderColor: "#FFBCB5",
    marginBottom: 60,
  },
  buttonText: {
    fontFamily: "MontserratBold",
    color: "#141313",
    fontSize: 16,
  },
  text: {
    fontFamily: "Montserrat",
    color: "#C38100",
  },
});

export default Home;
