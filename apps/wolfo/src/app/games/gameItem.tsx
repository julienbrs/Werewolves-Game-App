import { Game } from "types";
import { ListItem } from "@rneui/themed";
import { FontAwesome, Ionicons } from "@expo/vector-icons";
import { isDay, parseDeadline } from "../../utils/services/parsedate";
interface GameItemProps {
  game: Game;
  handleFunction: (id: number) => void;
}
export const GameItemLobby = ({ game, handleFunction }: GameItemProps) => {
  return (
    <ListItem topDivider>
      <FontAwesome name="hourglass-o" size={24} color="black" />
      <ListItem.Content>
        <ListItem.Title>
          {game.name} | {game.id}
        </ListItem.Title>
        <ListItem.Subtitle>
          {"Début : " + parseDeadline(game.deadline, game.startDay)}
        </ListItem.Subtitle>
      </ListItem.Content>
      {game.state === "LOBBY" && (
        <Ionicons
          name="exit-outline"
          size={24}
          color="red"
          onPress={() => handleFunction(game.id)}
        />
      )}
    </ListItem>
  );
};

export const GameItemInGame = ({ game, handleFunction }: GameItemProps) => {
  const day = isDay(game.startDay, game.endDay);
  return (
    <ListItem topDivider onPress={() => handleFunction(game.id)}>
      {day ? (
        <FontAwesome name="sun-o" size={24} color="black" />
      ) : (
        <FontAwesome name="moon-o" size={24} color="black" />
      )}
      <ListItem.Content>
        <ListItem.Title>
          {game.name} | {game.id}
        </ListItem.Title>
        <ListItem.Subtitle>In game</ListItem.Subtitle>
      </ListItem.Content>
    </ListItem>
  );
};

export const GameItemNotJoined = ({ game, handleFunction }: GameItemProps) => {
  return (
    <ListItem topDivider>
      <FontAwesome name="hourglass-o" size={24} color="black" />
      <ListItem.Content>
        <ListItem.Title>{game.name}</ListItem.Title>
        <ListItem.Subtitle>
          {"Début : " + parseDeadline(game.deadline, game.startDay)}
        </ListItem.Subtitle>
      </ListItem.Content>
      <Ionicons
        name="enter-outline"
        size={24}
        color="green"
        onPress={() => handleFunction(game.id)}
      />
    </ListItem>
  );
};
