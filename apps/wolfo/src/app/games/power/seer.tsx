import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Button, Text } from "@ui-kitten/components";
import { useRouter, useSearchParams } from "expo-router";
import React, { useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { Game, Player } from "types";
import Loading from "../../../components/loading";
import { getGame } from "../../../utils/api/game";
import { getPlayer, updatePlayer } from "../../../utils/api/player";

const SeerView = () => {
  const router = useRouter();
  const { gameId, userId } = useSearchParams();
  const queryClient = useQueryClient();

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
  const {
    data: currentPlayer,
    isLoading: isLoadingPlayer,
    isError: isErrorPlayer,
  } = useQuery<Player, Error>({
    enabled: !isNaN(Number(gameId)),
    queryKey: ["player", userId],
    queryFn: () => getPlayer(Number(gameId), String(userId)),
  });

  const { mutate: updateQuery } = useMutation<any, Error, Player>({
    mutationFn: playerUpdated => {
      delete playerUpdated?.user;
      return updatePlayer(playerUpdated);
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries(["role", "power", "usedPower"]);
    },
    onError: (error: Error) => {
      setErrorMessageUpdate(error.message);
    },
  });

  // const queryClient = useQueryClient();

  const [selectedPlayer, setSelectedPlayer] = useState<Player | undefined>();
  const [isButtonDisabled, setIsButtonDisabled] = useState(false);
  const [isErrorUpdate, setErrorMessageUpdate] = useState<string>("");

  const handlePlayerClick = async (player: Player) => {
    setSelectedPlayer(player);
    setIsButtonDisabled(true);
    // Update the seer's power usage
    const updatedSeer: Player = {
      ...currentPlayer!,
      usedPower: true,
    };
    delete updatedSeer?.user;
    updateQuery(updatedSeer);
  };

  if (isLoading || isLoadingPlayer) {
    return <Loading title="Power loading" message={"Loading..."} />;
  }
  if (isError || isErrorPlayer || isErrorUpdate) {
    // queryClient.invalidateQueries(["players", gameId]);
    return router.back();
  }

  return (
    <SafeAreaView>
      <Text>Players:</Text>
      {game.players &&
        game.players
          .filter((player: Player) => player.userId !== userId)
          .map((player: Player) => (
            <Button
              key={player.userId}
              onPress={() => handlePlayerClick(player)}
              disabled={isButtonDisabled}
            >
              {player.user?.name}
            </Button>
          ))}
      <Text>Selected player:</Text>
      {selectedPlayer ? (
        <Text>
          {`${selectedPlayer.user?.name} is a `}
          {selectedPlayer.role !== undefined ? selectedPlayer.role : ""}
          {selectedPlayer.power !== "NONE" ? `, ${selectedPlayer.power}` : ""}
        </Text>
      ) : (
        <Text>No player selected</Text>
      )}
    </SafeAreaView>
  );
};

export default SeerView;
