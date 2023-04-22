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
};

export const { getMessages, getHistory, createChatroom, getChatrooms } = chatApi;
