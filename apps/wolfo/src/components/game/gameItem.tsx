import { FontAwesome, Ionicons } from "@expo/vector-icons";
import { ListItem, Text } from "@ui-kitten/components";
import { useRouter } from "expo-router";
import React from "react";
import { Button, StyleSheet, View } from "react-native";
import { Game, StateGame } from "types";
import { parseDeadline } from "../../utils/services/parsedate";

interface GameItemProps {
  game: Game;
  handleFunction: (id: number) => void;
}
export const GameItemLobby = ({ game, handleFunction }: GameItemProps) => {
  const router = useRouter();
  return (
    <ListItem
      title={game.name}
      description={"Début : " + parseDeadline(game.deadline, game.startDay)}
      accessoryLeft={() => <FontAwesome name="hourglass-o" size={24} color="black" />}
      accessoryRight={() => {
        return (
          <View style={styles.containerRight}>
            <Text>
              {game.players.length}/{game.maxPlayer}
            </Text>
            <Text style={styles.players}>players</Text>
            <Ionicons
              name="exit-outline"
              size={24}
              color="red"
              onPress={() => handleFunction(game.id)}
            />

            <Button title="join chatroom" onPress={() => router.push(`/chatroom/${game.id}`)} />
            <Text>ID: {game.id}</Text>
          </View>
        );
      }}
    />
  );
};

export const GameItemInGame = ({ game, handleFunction }: GameItemProps) => {
  return (
    <ListItem
      onPress={() => handleFunction(game.id)}
      title={game.name}
      description={"In game"}
      accessoryLeft={() =>
        game.state === StateGame.DAY ? (
          <FontAwesome name="sun-o" size={24} color="black" />
        ) : (
          <FontAwesome name="moon-o" size={24} color="black" />
        )
      }
    />
  );
};

export const GameItemNotJoined = ({ game, handleFunction }: GameItemProps) => {
  return (
    <ListItem
      title={game.name}
      description={"Début : " + parseDeadline(game.deadline, game.startDay)}
      accessoryLeft={() => <FontAwesome name="hourglass-o" size={24} color="black" />}
      accessoryRight={() => {
        return (
          <View style={styles.containerRight}>
            <Text>
              {game.players.length}/{game.maxPlayer}
            </Text>
            <Text style={styles.players}>players</Text>
            <Ionicons
              name="exit-outline"
              size={24}
              color="red"
              onPress={() => handleFunction(game.id)}
            />
          </View>
        );
      }}
    />
  );
};

const styles = StyleSheet.create({
  players: {
    marginRight: 30,
    fontSize: 10,
  },
  containerRight: {
    flexDirection: "row",
    alignItems: "center",
  },
});
