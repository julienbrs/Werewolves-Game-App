import { useQuery } from "@tanstack/react-query";
import { Button } from "@ui-kitten/components";
import { useRouter, useSearchParams } from "expo-router";
import React, { useRef, useState } from "react";
import { Animated, Pressable, StyleSheet, Text, View } from "react-native";
import { ScrollView } from "react-native-gesture-handler";
import { SafeAreaView } from "react-native-safe-area-context";
import { Game, Player, StatePlayer } from "types";
import Loading from "../../components/loading";
import { getGame } from "../../utils/api/game";
import { getPlayer } from "../../utils/api/player";

interface ChoiceProps {
  choicePlayer: Player;
  activePlayer: Player | null;
  setActivePlayer: React.Dispatch<React.SetStateAction<Player | null>>;
  currentPlayer: Player | undefined;
}
const Choice = ({ choicePlayer, activePlayer, setActivePlayer, currentPlayer }: ChoiceProps) => {
  const [Width, setWidth] = useState(0);
  const shiftAnim = useRef(new Animated.Value(0)).current;
  /* Style animation */
  const buttonContentShifted = {
    right: shiftAnim,
  };
  const confirmHandle = () => {
    //set confirmed player
    cancelHandle();
  };
  const cancelHandle = () => {
    setActivePlayer(null);
    stopAnimation();
  };
  const stopAnimation = () => {
    Animated.timing(shiftAnim, {
      toValue: 0,
      duration: 1000,
      useNativeDriver: true,
    }).start();
  };
  if (choicePlayer !== activePlayer) {
    stopAnimation();
  }
  return (
    <View style={styles.container}>
      {choicePlayer.state === StatePlayer.ALIVE ? (
        <Animated.View style={[styles.buttonContent, buttonContentShifted]}>
          <Pressable
            style={styles.pressableView}
            onPress={() => {
              if (choicePlayer === activePlayer) {
                return;
              }
              setActivePlayer(choicePlayer);
              Animated.timing(shiftAnim, {
                toValue: Width,
                duration: 1000,
                useNativeDriver: true,
              }).start();
            }}
          >
            <View
              style={[styles.buttonViewLeft]}
              onLayout={event => {
                const { width } = event.nativeEvent.layout;
                setWidth(width);
              }}
            >
              <Text style={styles.text}>{choicePlayer?.user!.name}</Text>
            </View>
          </Pressable>

          <View style={[styles.buttonViewRight]}>
            <Button onPress={cancelHandle}>Confirm</Button>
            <Button onPress={cancelHandle}>Cancel</Button>
          </View>
        </Animated.View>
      ) : (
        <View
          style={[styles.buttonViewLeft, styles.deadPlayer]}
          onLayout={event => {
            const { width } = event.nativeEvent.layout;
            setWidth(width);
          }}
        >
          <Text style={styles.text}>{choicePlayer?.user!.name}</Text>
        </View>
      )}
    </View>
  );
};

const Vote = () => {
  const router = useRouter();
  const { gameId, userId } = useSearchParams();
  const [activePlayer, setActivePlayer] = useState<Player | null>(null);

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
    enabled: Boolean(game),
    queryKey: ["player", userId],
    queryFn: () => getPlayer(game?.id!, Array.isArray(userId) ? userId[0] : userId!),
  });

  if (isLoading || isLoadingPlayer) {
    return <Loading title="Power loading" message={"Loading..."} />;
  }

  if (isErrorPlayer || isError) {
    router.back();
  }
  return (
    <SafeAreaView>
      <ScrollView>
        {game?.players.map((player: Player) => (
          <Choice
            choicePlayer={player}
            activePlayer={activePlayer}
            setActivePlayer={setActivePlayer}
            currentPlayer={currentPlayer}
          />
        ))}
        <Text>vote</Text>
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
  buttonContent: {
    position: "relative",
    width: "200%",
    height: "100%",
    display: "flex",
    flexDirection: "row",
    flexWrap: "nowrap",
    backgroundColor: "red",
  },
  pressableView: {
    width: "50%",
  },
  buttonViewLeft: {
    display: "flex",
    textAlign: "center",
    width: "100%",
    height: "100%",
    justifyContent: "center",
  },
  deadPlayer: {
    backgroundColor: "gray",
  },
  buttonViewRight: {
    padding: 20,
    textAlign: "center",
    width: "50%",
    height: "100%",
    backgroundColor: "blue",
    display: "flex",
    justifyContent: "space-around",
    flexDirection: "row",
    alignItems: "center",
  },
});

export default Vote;
