import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Button, Text } from "@ui-kitten/components";
import { useRouter, useSearchParams } from "expo-router";
import React, { useState } from "react";
import { View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Game, Player } from "types";
import Loading from "../../../../components/loading";
import { addDeadToChatroom } from "../../../../utils/api/chat";
import { getGame } from "../../../../utils/api/game";
import { getPlayer, updatePlayer } from "../../../../utils/api/player";

const SpiritView = () => {
  const router = useRouter();
  const { gameId, userId } = useSearchParams();
  const queryClient = useQueryClient();

  const [selectedDeadPlayer, setSelectedDeadPlayer] = useState<Player | undefined>();
  const [isButtonDisabled, setIsButtonDisabled] = useState(false);

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
    enabled: !isNaN(Number(gameId)) && userId !== undefined,
    queryKey: ["player", userId],
    queryFn: () => getPlayer(Number(gameId), String(userId)),
  });

  const { mutate: updateQuery } = useMutation<any, Error, Player>({
    mutationFn: playerUpdated => {
      return updatePlayer(playerUpdated);
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries(["role", "power", "usedPower"]);
    },
    onError: (error: Error) => {
      console.error("Error while updating power of user", error);
    },
  });

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
      {game.state === "DAY" ? (
        <Text>It's day, you can't use your power</Text>
      ) : currentPlayer?.usedPower ? (
        <View>
          <Text>You already invoked a dead player</Text>
          <Button onPress={redirectChat}>Go to chat</Button>
        </View>
      ) : (
        <>
          <Text>Dead players</Text>
          {game.players &&
            game.players
              .filter((player: Player) => player.state === "DEAD")
              .map((player: Player) => (
                <Button
                  key={player.userId}
                  onPress={() => handlePlayerClick(player)}
                  disabled={isButtonDisabled}
                >
                  {player.user?.name}
                </Button>
              ))}
          <Text>Selected dead player:</Text>
          {selectedDeadPlayer ? (
            <Text>{`You are invoking ${selectedDeadPlayer.user?.name} ...`}</Text>
          ) : (
            <Text>No player selected</Text>
          )}
        </>
      )}
    </SafeAreaView>
  );
};

export default SpiritView;
