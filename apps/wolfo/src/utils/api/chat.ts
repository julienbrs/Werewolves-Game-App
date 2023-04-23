import { ChatRoom, Message, NewChatroom } from "types";
import api from "./api";

const chatApi = {
  getMessages: async (): Promise<Message[]> => {
    const { data } = await api.get("/chatrooms/:id/messages");
    return data;
  },
  getHistory: async (chatRoomId: string): Promise<Message[]> => {
    const { data } = await api.get(`/chatrooms/${chatRoomId}/history`);
    return data;
  },
  getChatrooms: async (): Promise<ChatRoom[]> => {
    const { data } = await api.get("/chatrooms");
    return data;
  },
  createChatroom: async (chatroom: NewChatroom): Promise<ChatRoom> => {
    const { data } = await api.post("/chatrooms", chatroom);
    return data;
  },
  postMessage: async (
    chatRoomId: string,
    content: string,
    authorId: string,
    gameId: number
  ): Promise<void> => {
    const response = await api.post(`/chatrooms/${chatRoomId}/messages`, {
      content,
      authorId,
      gameId,
    });

    if (response.status === 201) {
      throw new Error("Failed to send message");
    }
  },
};

export const { getMessages, getHistory, createChatroom, getChatrooms, postMessage } = chatApi;
