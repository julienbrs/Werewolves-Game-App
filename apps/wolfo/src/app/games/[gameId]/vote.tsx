import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useRouter, useSearchParams } from "expo-router";
import React, { useContext, useRef } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { ScrollView } from "react-native-gesture-handler";
import { SafeAreaView } from "react-native-safe-area-context";
import { Game, Player, Role, StateGame, StatePlayer, Vote as VoteType } from "types";
import { AuthContext } from "../../../components/context/tokenContext";
import Loading from "../../../components/loading";
import { getGame } from "../../../utils/api/game";
import { getPlayer } from "../../../utils/api/player";
import voteApi from "../../../utils/api/vote";

interface ChoiceProps {
  choicePlayer: Player;
  currentPlayer: Player;
  electionId: number;
  nbVotes: number;
  currentVote: VoteType | undefined;
}
const Choice = ({ choicePlayer, currentPlayer, electionId, nbVotes, currentVote }: ChoiceProps) => {
  const queryClient = useQueryClient();

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
          queryClient.invalidateQueries({ queryKey: ["vote"] });
        })
        .catch(_ => console.log("An error occurred"));
    } else if (currentVote?.targetId !== choicePlayer.userId) {
      await voteApi
        .updateVote(currentPlayer, electionId, vote)
        .then(() => {
          queryClient.invalidateQueries({ queryKey: ["vote"] });
        })
        .catch(_ => console.log("An error occurred"));
    }
  };
  const cancelHandle = async () => {
    if (currentVote?.targetId === choicePlayer.userId) {
      await voteApi.deleteVote(currentPlayer, electionId).then(() => {
        queryClient.invalidateQueries({ queryKey: ["vote"] });
      });
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.voteCount}>
        <Text>{nbVotes}</Text>
      </View>
      <View
        style={[
          styles.buttonView,
          choicePlayer.userId === currentVote?.targetId ? styles.selected : {},
          choicePlayer.state === StatePlayer.DEAD ? styles.deadPlayer : {},
        ]}
      >
        <Text style={styles.text}>{choicePlayer?.user!.name}</Text>
      </View>
      {choicePlayer.state === StatePlayer.ALIVE && currentPlayer.state === StatePlayer.ALIVE ? (
        <Pressable
          style={[
            styles.buttonContent,
            choicePlayer.userId === currentVote?.targetId
              ? styles.buttonCancel
              : styles.buttonConfirm,
          ]}
          onPress={() => {
            if (choicePlayer.userId === currentVote?.targetId) {
              cancelHandle();
            } else {
              confirmHandle();
            }
          }}
        >
          <Text style={styles.text}>
            {choicePlayer.userId === currentVote?.targetId ? "Cancel" : "Vote"}
          </Text>
        </Pressable>
      ) : (
        <></>
      )}
    </View>
  );
};

const Vote = () => {
  const { gameId, userId } = useSearchParams();
  const { token } = useContext(AuthContext);
  const router = useRouter();
  const {
    data: game,
    isLoading,
    isError,
  } = useQuery<Game, Error>({
    enabled: Boolean(gameId) && Boolean(token),
    queryKey: ["mygames", gameId],
    queryFn: () => getGame(Number(gameId)),
  });

  const {
    data: currentPlayer,
    isLoading: isLoadingPlayer,
    isError: isErrorPlayer,
  } = useQuery<Player, Error>({
    enabled: Boolean(game) && Boolean(userId) && Boolean(token),
    queryKey: ["player", userId],
    queryFn: () => getPlayer(game?.id!, Array.isArray(userId) ? userId[0] : userId!),
  });
  const {
    data: votes,
    isLoading: areVotesLoading,
    isError: isErrorVotes,
  } = useQuery<VoteType[][], Error>({
    queryKey: ["vote", "votes"],
    enabled: Boolean(currentPlayer) && Boolean(game?.curElecId) && Boolean(game?.players),
    queryFn: () => {
      return voteApi.getVotes(game?.players, currentPlayer!, game?.curElecId!);
    },
    refetchOnMount: true,
  });
  const {
    data: currentVote,
    isLoading: isLoadingVote,
    isError: isErrorVote,
    isSuccess: isSuccessVote,
  } = useQuery<VoteType, Error>({
    enabled: Boolean(currentPlayer) && Boolean(game?.curElecId),
    queryKey: ["vote"],
    queryFn: () => {
      return voteApi.getVote(currentPlayer!, game?.curElecId!);
    },
    refetchOnMount: true,
  });

  const activeVote = useRef<VoteType | undefined>(undefined);
  if (isLoading || areVotesLoading || isLoadingPlayer || isLoadingVote) {
    return <Loading title="Vote Loading" message={"Loading..."} />;
  }
  if (isSuccessVote) {
    activeVote.current = currentVote;
  }
  if (
    isErrorPlayer ||
    isErrorVotes ||
    isErrorVote ||
    isError ||
    !game ||
    !votes ||
    !currentPlayer
  ) {
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
          (player: Player, i: number) =>
            currentPlayer.userId !== player.userId &&
            (game.state === StateGame.DAY ||
              (currentPlayer.role === Role.WOLF && player.role !== Role.WOLF)) && (
              <Choice
                choicePlayer={player}
                currentPlayer={currentPlayer as Player}
                nbVotes={votes[i].length}
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
    textAlign: "center",
  },
  containerBorder: {
    borderStyle: "solid",
    borderColor: "black",

    borderWidth: 1,
  },
  container: {
    position: "relative",
    display: "flex",
    flexDirection: "row",
    flexWrap: "nowrap",
    // width: "80%",
    // left: "10%",
    height: "18vh",
    overflow: "hidden",
    // borderRadius: 25,
  },
  buttonConfirm: {
    // borderRadius: 25,
    backgroundColor: "green",
  },
  buttonCancel: {
    // borderRadius: 25,
    backgroundColor: "red",
  },
  buttonContent: {
    position: "relative",
    display: "flex",
    justifyContent: "center",
    // backgroundColor: "red",
    height: "clamp(3em, 100%, 8em)",
    paddingHorizontal: "1.5em",
    width: "8%",
  },
  buttonView: {
    flexGrow: 1,
    borderWidth: 5,
    borderStyle: "solid",
    borderColor: "rgb(94, 54, 50)",
    backgroundColor: "rgb(145, 79, 73)",
    position: "relative",
    display: "flex",
    textAlign: "center",
    height: "clamp(3em, 100%, 8em)",
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
  voteCount: {
    borderWidth: 5,
    borderStyle: "solid",
    borderColor: "rgb(59, 54, 54)",
    height: "clamp(3em, 100%, 8em)",
    aspectRatio: 1,
    backgroundColor: "gray",
    display: "flex",
    justifyContent: "center",
    textAlign: "center",
  },
});

export default Vote;
