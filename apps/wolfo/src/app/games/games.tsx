import { Dialog, Text } from "@rneui/themed";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import { RefreshControl, ScrollView } from "react-native-gesture-handler";
import { Game } from "types";
import Loading from "../../components/loading";
import { getGamesLobby, getMyGames, joinGame, leaveGame } from "../../utils/api/game";
import { GameItemInGame, GameItemLobby, GameItemNotJoined } from "./gameItem";
interface ListProps {
  search: string;
}
export const ListGamesLobby: React.FC<ListProps> = ({ search }) => {
  const queryClient = useQueryClient();
  const [visible, setVisible] = useState<boolean>(false);
  const [selectedGame, setSelectedGame] = useState<number>(0);
  const toggleVisible = () => setVisible(!visible);
  const {
    data: games,
    isLoading,
    refetch,
  } = useQuery<Game[]>({
    queryKey: ["games"],
    queryFn: getGamesLobby,
  });
  const { mutate } = useMutation<any, Error, number>({
    mutationFn: (gameId: number) => joinGame(gameId),
    onSuccess: data => {
      console.log(data);
      refetch();
      queryClient.invalidateQueries(["mygames"]);
    },
  });
  const handleJoin = (gameId: number) => {
    setSelectedGame(gameId);
    toggleVisible();
  };
  if (isLoading) {
    return <Loading title="Loading games" message="loading list of games" />;
  }
  const filteredGames = games?.filter((game: Game) =>
    game.name.toLowerCase().includes(search.toLowerCase())
  );
  return (
    <ScrollView refreshControl={<RefreshControl refreshing={isLoading} onRefresh={refetch} />}>
      <Dialog isVisible={visible} onBackdropPress={toggleVisible}>
        <Dialog.Title title="Validation" />
        <Text>Êtes vous sur de rejoindre cette partie ?</Text>
        <Dialog.Actions>
          <Dialog.Button
            title="CONFIRM"
            onPress={() => {
              mutate(selectedGame);
              toggleVisible();
            }}
          />
          <Dialog.Button title="CANCEL" onPress={toggleVisible} />
        </Dialog.Actions>
      </Dialog>
      {games &&
        filteredGames!.map((game: Game) => (
          <GameItemNotJoined key={game.id} game={game} handleFunction={handleJoin} />
        ))}
    </ScrollView>
  );
};

export const ListMyGames: React.FC<ListProps> = ({ search }) => {
  const queryClient = useQueryClient();
  const [visible, setVisible] = useState<boolean>(false);
  const [selectedGame, setSelectedGame] = useState<number>(0);
  const toggleVisible = () => setVisible(!visible);
  const router = useRouter();

  const {
    data: games,
    isLoading,
    isError,
    refetch,
  } = useQuery<Game[]>({
    queryKey: ["mygames"],
    queryFn: getMyGames,
    staleTime: Infinity,
  });
  const { mutate } = useMutation<any, Error, number>({
    mutationFn: (gameId: number) => leaveGame(gameId),
    onSuccess: data => {
      console.log(data);
      refetch();
      queryClient.invalidateQueries(["games"]);
    },
  });
  if (isLoading) {
    return <Loading title="Loading mygames" message="loading list of games" />;
  }
  if (isError) {
    return <Text>error</Text>;
  }
  const handleLeave = (gameId: number) => {
    setSelectedGame(gameId);
    toggleVisible();
  };

  const filteredGames = games?.filter((game: Game) =>
    game.name.toLowerCase().includes(search.toLowerCase())
  );
  return (
    <ScrollView refreshControl={<RefreshControl refreshing={isLoading} onRefresh={refetch} />}>
      <Dialog isVisible={visible} onBackdropPress={toggleVisible}>
        <Dialog.Title title="Validation" />
        <Text>Êtes vous sur de quitter cette partie ?</Text>
        <Dialog.Actions>
          <Dialog.Button
            title="CONFIRM"
            onPress={() => {
              mutate(selectedGame);
              toggleVisible();
            }}
          />
          <Dialog.Button title="CANCEL" onPress={toggleVisible} />
        </Dialog.Actions>
      </Dialog>
      {games &&
        filteredGames!.map((game: Game) => (
          <React.Fragment key={game.id}>
            {game.state === "LOBBY" ? (
              <GameItemLobby game={game} handleFunction={handleLeave} />
            ) : (
              <GameItemInGame game={game} handleFunction={() => router.push(`/games/${game.id}`)} />
            )}
          </React.Fragment>
        ))}
    </ScrollView>
  );
};
