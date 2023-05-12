import { useQuery } from "@tanstack/react-query";
import { Card, Text } from "@ui-kitten/components";
import { Stack, useRouter, useSearchParams } from "expo-router";
import { default as React, useContext, useEffect, useState } from "react";
import {
  Button,
  ImageBackground,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  View,
} from "react-native";
import { Day, GiftedChat, IMessage, InputToolbar } from "react-native-gifted-chat";
import { SafeAreaProvider } from "react-native-safe-area-context";
import io, { Socket } from "socket.io-client";
import { Game, Message, NewMessage, Player } from "types";
import { getMessages, getPermissions } from "../../../../utils/api/chat";
import { getGame } from "../../../../utils/api/game";
import { getPlayer } from "../../../../utils/api/player";

const IP = process.env.IP || "localhost";
const PORT = process.env.PORT || 3000;
const socketEndpoint = `http://${IP}:${PORT}`;

import { default as imgChatroomDay } from "../../../../../assets/chatroom_day.png";
import imgChatroomInsomniac from "../../../../../assets/chatroom_insomniac.png";
import imgChatroomNight from "../../../../../assets/chatroom_night.png";
import imgChatroomSpirit from "../../../../../assets/chatroom_spirit.png";
import { AuthContext } from "../../../../components/context/tokenContext";

const ChatRoomView = () => {
  //console.log(usePathname());
  const [messagesList, setMessagesList] = useState<IMessage[]>([]);
  const [imageBackground, setImgBackground] = useState(imgChatroomDay);
  const { chat, gameId } = useSearchParams();
  const { id: userId } = useContext(AuthContext);
  const [textReason, setTextReason] = useState<string>("");

  const router = useRouter();
  const [socket, setSocket] = useState<Socket | null>(null);

  useEffect(() => {
    const newSocket = io(socketEndpoint);
    setSocket(newSocket);

    return () => {
      if (newSocket) {
        newSocket.disconnect();
      }
    };
  }, []);

  const { data, isLoading, isError } = useQuery({
    enabled: !isNaN(Number(chat)),
    queryKey: ["permissions", Number(chat), userId],
    queryFn: () => getPermissions(Number(chat)),
  });

  const { data: game } = useQuery<Game, Error>({
    enabled: !isNaN(Number(gameId)),
    queryKey: ["mygames", gameId],
    queryFn: () => getGame(Number(gameId)),
    staleTime: 1000 * 60 * 5,
  });
  // get player data
  const { data: player } = useQuery<Player, Error>({
    enabled: Boolean(game),
    queryKey: ["player", userId],
    queryFn: () => getPlayer(game?.id!, userId),
    staleTime: 1000 * 60 * 5,
  });

  useEffect(() => {
    const setUpAssets = () => {
      if (player?.power === "INSOMNIAC") {
        if (player?.usedPower === true) {
          setImgBackground(imgChatroomInsomniac);
        } else {
          setTextReason("You can use your power to spy werewolves, go to power menu.");
        }
      } else if (player?.power === "SPIRIT" && player?.usedPower === true) {
        setImgBackground(imgChatroomSpirit);
      } else if (game?.state === "NIGHT") {
        setImgBackground(imgChatroomNight);
        if (player?.role === "VILLAGER") {
          setTextReason("You are a villager. You can't see anything at night.");
        }
      } else {
        setImgBackground(imgChatroomDay);
      }
    };

    if (!chat) {
      return;
    }

    const fetchMessages = async () => {
      if (data?.read === true) {
        try {
          const messages: Message[] = await getMessages(Number(chat));
          const convertedMessages: any = messages.map(
            (msg: {
              id: any;
              content: any;
              createdAt: string | number | Date;
              authorId: string;
              author: { user: { name: any } };
            }) => ({
              _id: msg.id,
              text: msg.content,
              createdAt: new Date(msg.createdAt),
              authorId: msg.authorId,
              user: {
                _id: msg.authorId,
                name: msg.author.user.name,
              },
            })
          );
          setMessagesList(convertedMessages.reverse());
        } catch (error) {
          console.error("Error fetching messages:", error);
        }
      } else {
        console.error("You don't have permission to view this chatroom");
      }
    };
    setUpAssets();

    fetchMessages();

    if (socket) {
      socket.on("connect", () => {
        console.log("Connected to socket server");
        socket.emit("joinChatRoom", { chatRoomId: chat, userId });
      });

      socket.on("disconnect", () => {
        console.log("Disconnected from socket server");
      });

      const handleNewMessage = (args: [Message, any]) => {
        const msg = args[0];
        const author = args[1];

        const convertedMessage: IMessage = {
          _id: msg.id,
          text: msg.content,
          createdAt: new Date(msg.createdAt),
          user: {
            _id: msg.authorId,
            name: author,
          },
        };
        setMessagesList(previousMessages => [convertedMessage, ...previousMessages]);
      };

      socket.on("newMessage", handleNewMessage);

      return () => {
        socket.off("newMessage", handleNewMessage);
        socket.disconnect();
      };
    }
  }, [chat, userId, socket, data, game, player]);

  const onSend = (msgList: IMessage[] = []) => {
    console.log("in onsend, we got: data", data);
    if (data?.write === true) {
      msgList.forEach(msg => {
        const newMessage: NewMessage = {
          chatRoomId: Number(chat),
          content: msg.text,
          authorId: String(userId),
          gameId: Number(gameId),
        };
        socket?.emit("messagePosted", [newMessage, data.write]);
      });
    } else {
      console.error("You don't have permission to write in this chatroom");
    }
  };

  if (isLoading) {
    return <Text>Loading...</Text>;
  }
  if (isError || !data) {
    return router.back();
  }
  const renderDay = (props: any) => {
    return <Day {...props} textStyle={styles.title} />;
  };

  const renderInputToolbar = (props: any) => {
    if (data.write === true) {
      return <InputToolbar {...props} />;
    }
    return null;
  };

  return (
    <SafeAreaProvider>
      <ImageBackground source={imageBackground} style={styles.imageBackground}>
        <Stack.Screen
          options={{
            title: `Chatroom day/night (à changer)`,
            headerRight: () => null,
          }}
        />
        <Button
          onPress={() => {
            console.log("data:", data);
          }}
          title="permissions"
        />

        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          style={styles.keyboard}
        >
          {data.read === true ? (
            <GiftedChat
              messages={messagesList}
              onSend={messages => onSend(messages)}
              user={{ _id: String(userId) }}
              renderUsernameOnMessage={true}
              renderDay={renderDay}
              renderInputToolbar={props => renderInputToolbar(props)}
            />
          ) : (
            <View style={styles.centeredContainer}>
              <Card style={styles.cardReason}>
                <Text style={styles.cardText}>{textReason}</Text>{" "}
              </Card>
            </View>
          )}
        </KeyboardAvoidingView>
      </ImageBackground>
    </SafeAreaProvider>
  );
};

const styles = StyleSheet.create({
  imageBackground: {
    flex: 1,
    resizeMode: "cover",
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    color: "black",
  },
  centeredContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  cardReason: {
    alignSelf: "center",
    width: "80%",
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    padding: 16,
    borderRadius: 16,
    textAlign: "center",
  },
  cardText: {
    color: "white",
    fontSize: 16,
  },
  keyboard: {
    flex: 1,
  },
});

export default ChatRoomView;
