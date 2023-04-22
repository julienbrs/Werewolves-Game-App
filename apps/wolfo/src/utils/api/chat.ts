import { ChatRoom, Message } from "types";
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
  createChatroom: async (chatroom: ChatRoom): Promise<ChatRoom> => {
    const { data } = await api.post("/chatrooms", chatroom);
    return data;
  },
};

export const { getMessages, getHistory, createChatroom } = chatApi;
