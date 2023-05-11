import { useQuery } from "@tanstack/react-query";
import { Text } from "@ui-kitten/components";
import { Stack, useRouter, useSearchParams } from "expo-router";
import React, { useEffect, useState } from "react";
import { ImageBackground, KeyboardAvoidingView, Platform, StyleSheet } from "react-native";
import { Day, GiftedChat, IMessage } from "react-native-gifted-chat";
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

  useEffect(() => {
    const fetchMessages = async () => {
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
  }, [id, userId, socket]);

  const onSend = (msgList: IMessage[] = []) => {
    msgList.forEach(msg => {
      const newMessage: NewMessage = {
        chatRoomId: Number(id),
        content: msg.text,
        authorId: String(userId),
        gameId: Number(gameId),
      };
      socket?.emit("messagePosted", newMessage);
    });
  };

  const { data, isLoading, isError } = useQuery({
    queryKey: ["permissions", Number(id), userId],
    queryFn: () => getPermissions(Number(id)),
  });

  if (isLoading) {
    return <Text>Loading...</Text>;
  }
  if (isError || !data) {
    return router.back();
  }
  const renderDay = (props: any) => {
    return <Day {...props} textStyle={styles.title} />;
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

        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          style={{ flex: 1 }}
        >
          <GiftedChat
            messages={messagesList}
            onSend={messages => onSend(messages)}
            user={{ _id: String(userId) }}
            renderUsernameOnMessage={true}
            renderDay={renderDay}
          />
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
