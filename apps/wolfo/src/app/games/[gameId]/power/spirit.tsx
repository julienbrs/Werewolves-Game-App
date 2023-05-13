import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Button, Card, Text } from "@ui-kitten/components";
import { useRouter, useSearchParams } from "expo-router";
import React, { useEffect, useState } from "react";
import { ImageBackground, StyleSheet, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Game, Player } from "types";
import Loading from "../../../../components/loading";
import { addDeadToChatroom } from "../../../../utils/api/chat";
import { getGame } from "../../../../utils/api/game";
import { getPlayer, updatePlayer } from "../../../../utils/api/player";

import imageBackground from "../../../../../assets/spiritPower.png";

const SpiritView = () => {
  const router = useRouter();
  const { gameId, userId } = useSearchParams();
  const queryClient = useQueryClient();
  const [usedPower, setUsedPower] = useState<boolean>(false);
  const [selectedDeadPlayer, setSelectedDeadPlayer] = useState<Player | undefined>();
  const [isButtonDisabled, setIsButtonDisabled] = useState<boolean>(false);

  // get game data
  const {
    data: game,
    isLoading,
    isError,
  } = useQuery<Game, Error>({
    enabled: !isNaN(Number(gameId)),
    queryKey: ["mygames", gameId],
    queryFn: () => getGame(Number(gameId)),
    staleTime: 1000 * 60 * 60 * 24, // 1 day
  });

  // get player data
  const {
    data: currentPlayer,
    isLoading: isLoadingPlayer,
    isError: isErrorPlayer,
  } = useQuery<Player, Error>({
    enabled: !isNaN(Number(gameId)) && Boolean(userId),
    queryKey: ["player", userId],
    queryFn: () => getPlayer(Number(gameId), String(userId)),
  });

  const { mutate: updateQuery } = useMutation<any, Error, Player>({
    mutationFn: playerUpdated => {
      return updatePlayer(playerUpdated);
    },
    onSuccess: async () => {
      setUsedPower(true);
      await queryClient.invalidateQueries(["role", "power", "usedPower"]);
    },
    onError: (error: Error) => {
      console.error("Error while updating power of user", error);
    },
  });

  useEffect(() => {
    setUsedPower(currentPlayer!.usedPower);
  }, [currentPlayer]);

  const handlePlayerClick = async (player: Player) => {
    setSelectedDeadPlayer(player);
    setIsButtonDisabled(true);
    const updatedSpirit: Player = {
      ...currentPlayer!,
      usedPower: true,
    };

    const spiritChatId = game?.spiritChatRoomId;
    if (spiritChatId && player?.userId && gameId) {
      console.log("addDeadToChatroom", spiritChatId, player.userId, Number(gameId));
      addDeadToChatroom(spiritChatId, player.userId, Number(gameId));
      updateQuery(updatedSpirit);
    }
  };

  const redirectChat = () => {
    if (!gameId) return;
    const spiritChatId = game?.spiritChatRoomId;
    return router.push({
      pathname: `/games/${gameId}/chatroom/${spiritChatId}`,
      params: { gameId: gameId, userId },
    });
  };

  if (isLoading || isLoadingPlayer) {
    return <Loading title="Power loading" message={"Loading..."} />;
  }
  if (isError || isErrorPlayer) {
    return router.back();
  }

  return (
    <SafeAreaView>
      <ImageBackground source={imageBackground} style={styles.imageBackground}>
        <View style={styles.centeredContainer}>
          {game.state === "DAY" ? (
            <Card style={styles.cardReason} disabled={true}>
              <Text style={styles.cardText}>It's day, you can't use your power</Text>
            </Card>
          ) : usedPower ? (
            <Card style={styles.cardReason}>
              <Text style={styles.cardText}>You invoked a dead player..</Text>
              <Button onPress={redirectChat} style={styles.chatButton}>
                Go to chat
              </Button>
            </Card>
          ) : (
            <>
              <Card style={styles.cardReason}>
                <Text style={styles.cardText}>Summon a dead one:</Text>
                {game.players &&
                  game.players
                    .filter((player: Player) => player.state === "DEAD")
                    .map((player: Player) => (
                      <Button
                        key={player.userId}
                        onPress={() => handlePlayerClick(player)}
                        disabled={isButtonDisabled}
                        style={styles.playerButton}
                      >
                        {player.user?.name}
                      </Button>
                    ))}
                {selectedDeadPlayer ? (
                  <Text
                    style={styles.pText}
                  >{`You are invoking ${selectedDeadPlayer.user?.name} ...`}</Text>
                ) : (
                  <Text style={styles.pText}>No player summoned for the moment</Text>
                )}
              </Card>
            </>
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
  centeredContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  cardReason: {
    alignSelf: "center",
    width: "80%",
    backgroundColor: "rgba(255, 255, 255, 0.3)",
    padding: 16,
    borderRadius: 16,
    textAlign: "center",
  },
  cardText: {
    color: "#1a151d",
    fontSize: 18,
    textAlign: "center",
    marginBottom: 16,
    fontWeight: "500",
  },
  pText: {
    color: "#1a151d",
    fontSize: 16,
    textAlign: "center",
    marginTop: 16,
    fontWeight: "400",
  },
  chatButton: {
    width: "70%",
    alignSelf: "center",
    borderRadius: 16,
    backgroundColor: "#1a151d",
    borderColor: "#1a151d",
    elevation: 8,
  },
  playerButton: {
    width: "70%",
    alignSelf: "center",
    borderRadius: 20,
    backgroundColor: "#1a151d",
    borderColor: "#1a151d",
    elevation: 8,
    marginBottom: 8,
  },
});

export default SpiritView;
