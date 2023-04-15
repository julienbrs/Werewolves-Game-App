import { useQuery } from "@tanstack/react-query";
import { getGamesLobby, getMyGames } from "../../utils/api/game";
import { Game } from "types";
import Loading from "../../components/loading";
import { Avatar, Button, Icon, ListItem, SearchBar, Text } from "@rneui/themed";
import { FontAwesome } from "@expo/vector-icons";
import { ScrollView, RefreshControl } from "react-native-gesture-handler";
import React, { useState } from "react";
import { Platform } from "react-native";

interface ListProps {
  search: string;
}
export const ListGamesLobby: React.FC<ListProps> = ({ search }) => {
  const { data, isLoading, refetch } = useQuery<Game[]>({
    queryKey: ["games"],
    queryFn: getGamesLobby,
  });

  if (isLoading) {
    return <Loading title="Loading games" message="loading list of games" />;
  }
  //const filteredData = data?.filter((game: Game) => game.name.toLowerCase().includes(search.toLowerCase()));
  return (
    <ScrollView
      refreshControl={
        <RefreshControl refreshing={isLoading} onRefresh={refetch} />
      }
    >
      {data &&
        data!.map((game: Game) => (
          <ListItem key={game.id} topDivider>
            <FontAwesome name="hourglass-o" size={24} color="black" />
            <ListItem.Content>
              <ListItem.Title>{game.name}</ListItem.Title>
              <ListItem.Subtitle>{game.deadline.toString()}</ListItem.Subtitle>
            </ListItem.Content>
          </ListItem>
        ))}
    </ScrollView>
  );
};

export const ListMyGames: React.FC<ListProps> = ({ search }) => {
  const { data, isLoading, isError, refetch } = useQuery<Game[]>({
    queryKey: ["mygames"],
    queryFn: getMyGames,
  });

  if (isLoading) {
    return <Loading title="Loading mygames" message="loading list of games" />;
  }
  if (isError) {
    return <Text>error</Text>;
  }
  const filteredData = data?.filter((game: Game) =>
    game.name.toLowerCase().includes(search.toLowerCase())
  );
  return (
    <ScrollView
      refreshControl={
        <RefreshControl refreshing={isLoading} onRefresh={refetch} />
      }
    >
      {data &&
        filteredData!.map((game: Game) => (
          <ListItem key={game.id}>
            <FontAwesome name="hourglass-o" size={24} color="black" />
            <ListItem.Content>
              <ListItem.Title>{game.name}</ListItem.Title>
              <ListItem.Subtitle>{game.deadline.toString()}</ListItem.Subtitle>
            </ListItem.Content>
          </ListItem>
        ))}
    </ScrollView>
  );
};
