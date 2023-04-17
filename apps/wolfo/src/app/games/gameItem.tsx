import { FontAwesome, Ionicons } from "@expo/vector-icons";
import { ListItem } from "@ui-kitten/components";
import React from "react";
import { Game } from "types";
import { isDay, parseDeadline } from "../../utils/services/parsedate";
interface GameItemProps {
  game: Game;
  handleFunction: (id: number) => void;
}
export const GameItemLobby = ({ game, handleFunction }: GameItemProps) => {
  return (
    <ListItem
      title={game.name}
      description={"Début : " + parseDeadline(game.deadline, game.startDay)}
      accessoryLeft={() => <FontAwesome name="hourglass-o" size={24} color="black" />}
      accessoryRight={() => (
        <Ionicons
          name="exit-outline"
          size={24}
          color="red"
          onPress={() => handleFunction(game.id)}
        />
      )}
    />
  );
};

export const GameItemInGame = ({ game, handleFunction }: GameItemProps) => {
  const day = isDay(game.startDay, game.endDay);
  return (
    <ListItem
      onPress={() => handleFunction(game.id)}
      title={game.name}
      description={"In game"}
      accessoryLeft={() =>
        day ? (
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
      accessoryRight={() => (
        <Ionicons
          name="enter-outline"
          size={24}
          color="green"
          onPress={() => handleFunction(game.id)}
        />
      )}
    />
  );
};
