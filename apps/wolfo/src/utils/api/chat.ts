import { ChatRoom, Message } from "types";
import api from "./api";

const chatApi = {
  getMessages: async (): Promise<Message[]> => {
    const { data } = await api.get("/chatroom/:id/messages");
    return data;
  },
  getHistory: async (): Promise<Message[]> => {
    const { data } = await api.get("/chatroom/:id/history");
    return data;
  },
  createChatroom: async (chatroom: ChatRoom): Promise<ChatRoom> => {
    const { data } = await api.post("/chatroom", chatroom);
    return data;
  },
};

export const { getMessages, getHistory, createChatroom } = chatApi;
