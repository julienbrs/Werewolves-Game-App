import { SafeAreaView } from "react-native-safe-area-context";
import { Link, Redirect, useRouter } from "expo-router";
import useAuthQuery from "../utils/hooks/useAuth";
import { Button, Text, Tab, TabView, SearchBar } from "@rneui/themed";
import React from "react";
import { Platform } from "react-native";
import Loading from "../components/loading";
import * as SecureStore from "expo-secure-store";
import { ListGamesLobby, ListMyGames } from "./games/games";

const Home = () => {
  const router = useRouter();
  const [search, setSearch] = React.useState<string>("");
  const [tabIndex, setTabIndex] = React.useState<number>(0);
  const { data, isError, isLoading } = useAuthQuery();
  if (isLoading) {
    return <Loading title="Loading home" message="loading user information" />;
  }
  if (isError) {
    return <Redirect href="/auth" />;
  }
  return (
    <>
      <Link href="/_sitemap">sitemap</Link>
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
        <TabView.Item style={{ width: "100%" }}>
          <ListMyGames search={search} />
        </TabView.Item>
        <TabView.Item style={{ width: "100%" }}>
          <ListGamesLobby search={search} />
        </TabView.Item>
      </TabView>
    </>
  );
};
export default Home;
