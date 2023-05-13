import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Button } from "@ui-kitten/components";
import { useSearchParams } from "expo-router";
import React, { useRef, useState } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { ScrollView } from "react-native-gesture-handler";
import { SafeAreaView } from "react-native-safe-area-context";
import { Game, Player, Role, StateGame, StatePlayer, Vote as VoteType } from "types";
import voteApi from "../../../utils/api/vote";
import Loading from "../../../components/loading";
import { getGame } from "../../../utils/api/game";
import { getPlayer } from "../../../utils/api/player";

interface ChoiceProps {
  choicePlayer: Player;
  activePlayer: Player | null;
  setActivePlayer: React.Dispatch<React.SetStateAction<Player | null>>;
  currentPlayer: Player;
  electionId: number;
  currentVote: VoteType | undefined;
}
const Choice = ({
  choicePlayer,
  activePlayer,
  setActivePlayer,
  currentPlayer,
  electionId,
  currentVote,
}: ChoiceProps) => {
  const [clicked, setClicked] = useState(false);
  const queryClient = useQueryClient();
  /* Style animation */

  const confirmHandle = async () => {
    const vote: VoteType = {
      voterId: currentPlayer.userId,
      targetId: choicePlayer.userId,
      gameId: choicePlayer.gameId,
      electionId: electionId,
    };
    if (currentVote === null) {
      await voteApi
        .createVote(currentPlayer, electionId, vote)
        .then(() => {
          queryClient.invalidateQueries(["vote"]);
        })
        .catch(_ => console.log("An error occurred"));
    } else if (currentVote?.targetId !== choicePlayer.userId) {
      console.log("here");
      await voteApi
        .updateVote(currentPlayer, electionId, vote)
        .then(() => {
          queryClient.invalidateQueries(["vote"]);
        })
        .catch(_ => console.log("An error occurred"));
    }
    setActivePlayer(null);
    setClicked(false);
  };
  const cancelHandle = async () => {
    if (currentVote?.targetId === choicePlayer.userId) {
      console.log("deleted");
      await voteApi.deleteVote(currentPlayer, electionId).then(() => {
        queryClient.invalidateQueries(["vote"]);
      });
    }
    setActivePlayer(null);
    setClicked(true);
  };
  if (choicePlayer !== activePlayer) {
    if (clicked) {
      setClicked(false);
    }
  }
  return (
    <View
      style={
        (styles.container, choicePlayer.userId === currentVote?.targetId ? styles.selected : {})
      }
    >
      {choicePlayer.state === StatePlayer.ALIVE && currentPlayer.state === StatePlayer.ALIVE ? (
        <Pressable
          style={[styles.buttonContent]}
          onPress={() => {
            if (choicePlayer === activePlayer) {
              return;
            }
            setActivePlayer(choicePlayer);
            setClicked(true);
          }}
        >
          {!clicked && (
            <View style={[styles.buttonViewLeft]}>
              <Text style={styles.text}>{choicePlayer?.user!.name}</Text>
            </View>
          )}

          {clicked && (
            <View style={[styles.buttonViewRight]}>
              <Button onPress={confirmHandle} style={styles.buttonConfirm}>
                Confirm
              </Button>
              <Button onPress={cancelHandle} style={styles.buttonCancel}>
                Cancel
              </Button>
            </View>
          )}
        </Pressable>
      ) : (
        <View
          style={[
            styles.buttonViewLeft,
            choicePlayer.state === StatePlayer.DEAD ? styles.deadPlayer : {},
          ]}
        >
          <Text style={styles.text}>{choicePlayer?.user!.name}</Text>
        </View>
      )}
    </View>
  );
};

const Vote = () => {
  const { gameId, userId } = useSearchParams();
  const {
    data: game,
    isLoading,
    isError,
  } = useQuery<Game, Error>({
    queryKey: ["mygames", gameId],
    queryFn: () => getGame(Number(gameId)),
  });
  const {
    data: currentPlayer,
    isLoading: isLoadingPlayer,
    isError: isErrorPlayer,
  } = useQuery<Player, Error>({
    enabled: Boolean(game) && Boolean(userId),
    queryKey: ["player", userId],
    queryFn: () => getPlayer(game?.id!, Array.isArray(userId) ? userId[0] : userId!),
  });
  const {
    data: currentVote,
    isLoading: isLoadingVote,
    isError: isErrorVote,
    isSuccess: isSuccessVote,
  } = useQuery<VoteType, Error>({
    queryKey: ["vote", userId],
    queryFn: () => {
      return voteApi.getVote(currentPlayer!, game?.curElecId!);
    },
    refetchOnMount: true,
    refetchOnWindowFocus: true,
  });

  const [activePlayer, setActivePlayer] = useState<Player | null>(null);
  const activeVote = useRef<VoteType | undefined>(undefined);
  console.log(currentVote);
  if (isLoading || isLoadingPlayer || isLoadingVote) {
    return <Loading title="Player list loading" message={"Loading..."} />;
  }
  if (isSuccessVote) {
    console.log(currentVote);
    activeVote.current = currentVote;
  }
  if (isErrorPlayer || isErrorVote || isError || !game || !currentPlayer || !game.curElecId) {
    console.log(game);
    console.log(isErrorVote);
    return <Text>An error occured. Please try again in a little</Text>;
  }

  return (
    <SafeAreaView>
      <ScrollView>
        {game.state === StateGame.NIGHT && currentPlayer.role !== Role.WOLF && (
          <Text>Can't vote at night. Come back in the morning!</Text>
        )}
        {game?.players.map(
          (player: Player) =>
            currentPlayer.userId !== player.userId &&
            (game.state === StateGame.DAY ||
              (currentPlayer.role === Role.WOLF && player.role !== Role.WOLF)) && (
              <Choice
                choicePlayer={player}
                activePlayer={activePlayer}
                setActivePlayer={setActivePlayer}
                currentPlayer={currentPlayer as Player}
                electionId={game?.curElecId!}
                currentVote={currentVote}
              />
            )
        )}
      </ScrollView>
    </SafeAreaView>
  );
};
const styles = StyleSheet.create({
  text: {
    fontWeight: "bold",
  },
  containerBorder: {
    borderStyle: "solid",
    borderColor: "black",

    borderWidth: 1,
  },
  container: {
    width: "80%",
    left: "10%",
    height: 80,
    overflow: "hidden",
    borderRadius: 20,
  },
  buttonConfirm: {
    backgroundColor: "green",
  },
  buttonCancel: {
    backgroundColor: "red",
  },
  buttonContent: {
    position: "relative",
    width: "100%",
    height: "100%",
    display: "flex",
    flexDirection: "row",
    flexWrap: "nowrap",
    // backgroundColor: "red",
  },
  buttonViewLeft: {
    backgroundColor: "brown",
    display: "flex",
    paddingVertical: "2.5em",
    textAlign: "center",
    width: "100%",
    height: "100%",
    justifyContent: "center",
  },
  deadPlayer: {
    backgroundColor: "gray",
  },
  selected: {
    borderColor: "gold",
    borderWidth: 3,
    borderStyle: "solid",
  },
  buttonViewRight: {
    padding: 20,
    textAlign: "center",
    width: "100%",
    height: "100%",
    backgroundColor: "#8F4401",
    display: "flex",
    justifyContent: "space-around",
    flexDirection: "row",
    alignItems: "center",
  },
});

export default Vote;
