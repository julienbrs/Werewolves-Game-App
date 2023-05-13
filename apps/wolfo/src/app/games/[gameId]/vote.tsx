import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Button } from "@ui-kitten/components";
import { useRouter, useSearchParams } from "expo-router";
import React, { useRef, useState } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { ScrollView } from "react-native-gesture-handler";
import { SafeAreaView } from "react-native-safe-area-context";
import { Game, Player, Role, StateGame, StatePlayer, Vote as VoteType } from "types";
import Loading from "../../../components/loading";
import { getGame } from "../../../utils/api/game";
import { getPlayer } from "../../../utils/api/player";
import voteApi from "../../../utils/api/vote";

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
    <View style={styles.container}>
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
            <View
              style={[
                styles.buttonView,
                styles.buttonViewLeft,
                choicePlayer.userId === currentVote?.targetId ? styles.selected : {},
              ]}
            >
              <Text style={styles.text}>{choicePlayer?.user!.name}</Text>
            </View>
          )}

          {clicked && (
            <View
              style={[
                styles.buttonView,
                styles.buttonViewRight,
                choicePlayer.userId === currentVote?.targetId ? styles.selected : {},
              ]}
            >
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
            styles.buttonView,
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
  const router = useRouter();
  const {
    data: game,
    isLoading,
    isError,
  } = useQuery<Game, Error>({
    enabled: Boolean(gameId),
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
    enabled: Boolean(currentPlayer) && Boolean(game?.curElecId),
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
    return <Loading title="Vote Loading" message={"Loading..."} />;
  }
  if (isSuccessVote) {
    console.log(currentVote);
    activeVote.current = currentVote;
  }
  if (isErrorPlayer || isErrorVote || isError || !game || !currentPlayer) {
    console.log(game);
    console.log(isErrorVote);
    return <Text>An error occured. Please try again in a little</Text>;
  }
  if (!game.curElecId) {
    router.back();
    return;
  }
  return (
    <SafeAreaView>
      <ScrollView contentContainerStyle={styles.mainView}>
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
  mainView: {
    flexDirection: "column",
    justifyContent: "center",
    gap: 5,
  },
  text: {
    fontWeight: "bold",
  },
  containerBorder: {
    borderStyle: "solid",
    borderColor: "black",

    borderWidth: 1,
  },
  container: {
    position: "relative",
    width: "80%",
    left: "10%",
    height: "18vh",
    overflow: "hidden",
    borderRadius: 25,
  },
  buttonConfirm: {
    borderRadius: 25,
    backgroundColor: "green",
  },
  buttonCancel: {
    borderRadius: 25,
    backgroundColor: "red",
  },
  buttonContent: {
    position: "relative",
    width: "100%",
    flex: 1,
    display: "flex",
    flexDirection: "row",
    flexWrap: "nowrap",
    // backgroundColor: "red",
  },
  buttonView: {
    borderRadius: 25,
    borderWidth: 5,
    borderStyle: "solid",
    borderColor: "rgb(94, 54, 50)",
    backgroundColor: "rgb(145, 79, 73)",
  },
  buttonViewLeft: {
    position: "relative",
    display: "flex",
    textAlign: "center",
    width: "100%",
    height: "100%",
    justifyContent: "center",
  },
  deadPlayer: {
    borderColor: "rgb(59, 54, 54)",
    backgroundColor: "gray",
  },
  selected: {
    borderColor: "rgb(135, 113, 5)",
    backgroundColor: "rgb(235, 212, 99)",
  },
  buttonViewRight: {
    padding: 20,
    textAlign: "center",
    width: "100%",
    height: "100%",
    display: "flex",
    justifyContent: "space-around",
    flexDirection: "row",
    alignItems: "center",
  },
});

export default Vote;
