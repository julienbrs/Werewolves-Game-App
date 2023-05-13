import { useQuery } from "@tanstack/react-query";
import { Button, Text } from "@ui-kitten/components";
import { Stack, useRouter, useSearchParams } from "expo-router";
import { useContext } from "react";
import React, { ImageBackground, StyleSheet, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Game, Player, Power, Role, StateGame } from "types";
import { AuthContext } from "../../../components/context/tokenContext";
import Loading from "../../../components/loading";
import { getPermissions } from "../../../utils/api/chat";
import { getGame } from "../../../utils/api/game";
import { getPlayer } from "../../../utils/api/player";

import imageBackground from "../../../../assets/menu_game_day.png";

const GameView = () => {
  const router = useRouter();
  const { gameId } = useSearchParams(); // idGame
  const { id: userId, token } = useContext(AuthContext);

  // get game data
  const {
    data: game,
    isLoading,
    isError,
  } = useQuery<Game, Error>({
    enabled: !isNaN(Number(gameId)) && Boolean(token),
    queryKey: ["mygames", gameId],
    queryFn: () => getGame(Number(gameId)),
    staleTime: 1000 * 60 * 5,
  });
  // get player data
  const {
    data: player,
    isLoading: isLoadingPlayer,
    isError: isErrorPlayer,
  } = useQuery<Player, Error>({
    enabled: Boolean(game),
    queryKey: ["player", userId],
    queryFn: () => getPlayer(game?.id!, userId),
    staleTime: 1000 * 60 * 5,
  });

  // get permissions
  const { data: spiritPerm } = useQuery({
    enabled: !isNaN(Number(game?.spiritChatRoomId)),
    queryKey: ["permissions", Number(game?.spiritChatRoomId), userId],
    queryFn: () => getPermissions(Number(game?.spiritChatRoomId)),
  });

  if (isLoading || isLoadingPlayer) {
    return <Loading title="Game loading" message={"Game " + String(gameId) + "is loading"} />;
  }
  if (isError || isErrorPlayer || !game || !player) {
    return <Loading title="Game error" message="oui" />;
  }
  const redirectChat = () => {
    const chatId = game.state === StateGame.DAY ? game.dayChatRoomId : game.nightChatRoomId;
    return router.push({
      pathname: `/games/${gameId}/chatroom/${chatId}`,
      params: { gameId, userId },
    });
  };

  const redirectPower = () => {
    switch (player?.power) {
      case Power.SEER:
        router.push({ pathname: `/games/${gameId}/power/seer`, params: { userId } });
        break;
      case Power.SPIRIT:
        router.push({ pathname: `/games/${gameId}/power/spirit`, params: { userId } });
        break;
      case Power.INSOMNIAC:
        router.push({ pathname: `/games/${gameId}/power/insomniac`, params: { userId } });
        break;
      case Power.CONTAMINATOR:
        router.push({
          pathname: `/games/${gameId}/power/contaminator`,
          params: { userId },
        });
        break;
    }
    return;
  };
  const redirectVote = () => {
    router.push({ pathname: `/games/${gameId}/vote`, params: { userId } });
    return;
  };
  return (
    <SafeAreaView>
      <Stack.Screen options={{ title: game.name, headerRight: () => null }} />
      <ImageBackground source={imageBackground} style={styles.imageBackground}>
        <View style={styles.container}>
          {/* display all informations on the game after fetching data from backend*/}
          <Button onPress={redirectVote} style={styles.button}>
            {evaProps => (
              <Text {...evaProps} style={styles.buttonText}>
                Vote
              </Text>
            )}
          </Button>
          <Button
            style={styles.button}
            onPress={redirectPower}
            disabled={
              player.usedPower && player.power !== Power.SPIRIT && player.power !== Power.NONE
            }
          >
            {evaProps => (
              <Text {...evaProps} style={styles.buttonText}>
                Power
              </Text>
            )}
          </Button>
          <Button
            style={
              game.state === StateGame.NIGHT && player.role !== Role.WOLF
                ? [styles.button, styles.disabledButton]
                : styles.button
            }
            onPress={redirectChat}
            disabled={game.state === StateGame.NIGHT && player.role !== Role.WOLF}
          >
            {evaProps => (
              <Text
                {...evaProps}
                style={
                  game.state === StateGame.NIGHT && player.role !== Role.WOLF
                    ? [styles.buttonText, styles.disabledButtonText]
                    : styles.buttonText
                }
              >
                Chat
              </Text>
            )}
          </Button>
          {spiritPerm?.write === true && player.state === "DEAD" && (
            <Button
              style={styles.button}
              onPress={() =>
                router.push({
                  pathname: `/games/${gameId}/chatroom/${game.spiritChatRoomId}`,
                  params: { gameId, userId },
                })
              }
            >
              {evaProps => (
                <Text {...evaProps} style={styles.buttonText}>
                  Spirit Chat
                </Text>
              )}
            </Button>
          )}
        </View>
      </ImageBackground>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  imageBackground: {
    flex: 1,
    resizeMode: "cover",
  },
  container: {
    flex: 1,
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: "20%",
  },
  button: {
    marginVertical: 15,
    width: 200,
    height: 50,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 20,
    boxShadow: "0px 5px 10px rgba(0, 0, 0, 0.15)",
    borderColor: "#834742",
  },
  disabledButton: {
    backgroundColor: "#ceccbd",
    borderColor: "#b0afa1",
    opacity: 0.8,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "white",
  },
  disabledButtonText: {
    color: "#4e4e4e",
  },
});

export default GameView;
