import { useQuery } from "@tanstack/react-query";
import { Button, Text } from "@ui-kitten/components";
import { useRouter, useSearchParams } from "expo-router";
import React, { useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { Game, Player } from "types";
import Loading from "../../../components/loading";
import { getGame } from "../../../utils/api/game";
import { getPlayer } from "../../../utils/api/player";

const SpiritView = () => {
  const router = useRouter();
  const { gameId, userId } = useSearchParams();
  // const queryClient = useQueryClient();

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
    // data: currentPlayer,
    isLoading: isLoadingPlayer,
    isError: isErrorPlayer,
  } = useQuery<Player, Error>({
    enabled: !isNaN(Number(gameId)),
    queryKey: ["player", userId],
    queryFn: () => getPlayer(Number(gameId), String(userId)),
  });

  // const { mutate: updateQuery } = useMutation<any, Error, Player>({
  //   mutationFn: playerUpdated => {
  //     return updatePlayer(playerUpdated);
  //   },
  //   onSuccess: async () => {
  //     await queryClient.invalidateQueries(["role", "power", "usedPower"]);
  //   },
  //   onError: (error: Error) => {
  //     setErrorMessageUpdate(error.message);
  //   },
  // });

  const [selectedDeadPlayer, setSelectedDeadPlayer] = useState<Player | undefined>();
  const [isButtonDisabled, setIsButtonDisabled] = useState(false);
  // const [isErrorUpdate, setErrorMessageUpdate] = useState<string>("");

  const handlePlayerClick = async (player: Player) => {
    setSelectedDeadPlayer(player);
    setIsButtonDisabled(true);
    // TODO -> associer chatroom avec le mort selectionné
    // update l'utilisation du pouvoir quand le joueur a selectionné le mort avec lequel il veut parler
    // const updatedContaminator: Player = {
    //   ...currentPlayer!,
    //   usedPower: true,
    // };

    // delete updatedContaminator?.user;
    // updateQuery(updatedContaminator);
  };

  if (isLoading || isLoadingPlayer) {
    return <Loading title="Power loading" message={"Loading..."} />;
  }
  if (isError || isErrorPlayer) {
    return router.back();
  }

  return (
    <SafeAreaView>
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
    </SafeAreaView>
  );
};

export default SpiritView;
