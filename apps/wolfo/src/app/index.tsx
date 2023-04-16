import { Button, SearchBar, Tab, TabView } from "@rneui/themed";
import { Link, Redirect, useRouter } from "expo-router";
import React from "react";
import { Platform, StyleSheet } from "react-native";
import Loading from "../components/loading";
import useAuthQuery from "../utils/hooks/useAuth";
import { ListGamesLobby, ListMyGames } from "./games/games";

const Home = () => {
  const router = useRouter();
  const [search, setSearch] = React.useState<string>("");
  const [tabIndex, setTabIndex] = React.useState<number>(0);
  const { isError, isLoading } = useAuthQuery();
  if (isLoading) {
    return <Loading title="Loading home" message="loading user information" />;
  }
  if (isError) {
    return <Redirect href="/user" />;
  }
  return (
    <>
      <Link href="/_sitemap">sitemap</Link>
      <Link href="/userSettings">sitemap</Link>
      <Button onPress={() => router.push("/games/new")}>New game</Button>
      <Tab value={tabIndex} onChange={setTabIndex}>
        <Tab.Item title="Mes parties" />
        <Tab.Item title="Parties à rejoindre" />
      </Tab>
      <SearchBar
        platform={Platform.OS === "ios" ? "ios" : "android"}
        placeholder="Search"
        onChangeText={setSearch}
        value={search}
      />
      <TabView value={tabIndex} onChange={setTabIndex}>
        <TabView.Item style={styles.tabview}>
          <ListMyGames search={search} />
        </TabView.Item>
        <TabView.Item style={styles.tabview}>
          <ListGamesLobby search={search} />
        </TabView.Item>
      </TabView>
    </>
  );
};
export default Home;

const styles = StyleSheet.create({
  tabview: {
    width: "100%",
  },
});
