import { AntDesign } from "@expo/vector-icons";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Button, Divider, List, Text } from "@ui-kitten/components";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { Game, StateGame } from "types";
import { getGamesLobby, getMyGames, joinGame, leaveGame } from "../../utils/api/game";
import Loading from "../loading";
import { ModalConfirmChoice } from "../modals/modalConfirm";
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

  const listGame = ({ item }: { item: Game; index: number }) => (
    <GameItemNotJoined key={item.id} game={item} handleFunction={handleJoin} />
  );
  return (
    <SafeAreaView>
      {games ? (
        <List
          data={filteredGames}
          renderItem={listGame}
          ItemSeparatorComponent={Divider}
          onRefresh={refetch}
          refreshing={isLoading}
        />
      ) : (
        <Button onPress={() => refetch()}>
          <AntDesign name="reload1" size={24} color="black" />
        </Button>
      )}
      <ModalConfirmChoice
        title="Validation"
        description="Êtes vous sur de rejoindre cette partie ?"
        visible={visible}
        setVisible={setVisible}
        confirmFunction={() => {
          mutate(selectedGame);
        }}
      />
    </SafeAreaView>
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
  const listGame = ({ item }: { item: Game; index: number }) => {
    return item.state === StateGame.LOBBY ? (
      <GameItemLobby game={item} handleFunction={handleLeave} />
    ) : (
      <GameItemInGame game={item} handleFunction={() => router.push(`/games/${item.id}`)} />
    );
  };
  return (
    <SafeAreaView>
      {games ? (
        <List
          data={filteredGames}
          renderItem={listGame}
          ItemSeparatorComponent={Divider}
          onRefresh={refetch}
          refreshing={isLoading}
        />
      ) : (
        <Button onPress={refetch}>
          <AntDesign name="reload1" size={24} color="black" />
        </Button>
      )}
      <ModalConfirmChoice
        title="Validation"
        description="Êtes vous sur de rejoindre cette partie ?"
        visible={visible}
        setVisible={setVisible}
        confirmFunction={() => {
          mutate(selectedGame);
        }}
      />
    </SafeAreaView>
  );
};
