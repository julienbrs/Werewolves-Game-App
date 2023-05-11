import { useQuery } from "@tanstack/react-query";
import { Text } from "@ui-kitten/components";
import { Stack, useRouter, useSearchParams } from "expo-router";
import React, { useEffect, useState } from "react";
import { Button, ImageBackground, KeyboardAvoidingView, Platform, StyleSheet } from "react-native";
import { Day, GiftedChat, IMessage, InputToolbar } from "react-native-gifted-chat";
import { SafeAreaProvider } from "react-native-safe-area-context";
import io, { Socket } from "socket.io-client";
import { Message, NewMessage } from "types";
import { getMessages, getPermissions } from "../../../utils/api/chat";

const IP = process.env.IP || "localhost";
const PORT = process.env.PORT || 3000;
const socketEndpoint = `http://${IP}:${PORT}`;

import imgBackground from "../../../../assets/chatroom_day.png";

const ChatRoomView = () => {
  const [messagesList, setMessagesList] = useState<IMessage[]>([]);
  const { id, userId, gameId } = useSearchParams();
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
    queryKey: ["permissions", Number(id), userId],
    queryFn: () => getPermissions(Number(id)),
  });

  useEffect(() => {
    const fetchMessages = async () => {
      if (data?.read === true) {
        try {
          const messages: Message[] = await getMessages(Number(id));
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

    fetchMessages();

    if (socket) {
      socket.on("connect", () => {
        console.log("Connected to socket server");
        socket.emit("joinChatRoom", { chatRoomId: id, userId });
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
  }, [id, userId, socket, data]);

  const onSend = (msgList: IMessage[] = []) => {
    if (data?.write === true) {
      msgList.forEach(msg => {
        const newMessage: NewMessage = {
          chatRoomId: Number(id),
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
      <ImageBackground source={imgBackground} style={styles.imageBackground}>
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
          style={{ flex: 1 }}
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
            <Text>Vous n'avez pas les droits pour accéder à ce chat</Text>
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
});

export default ChatRoomView;
