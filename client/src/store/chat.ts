// src/store/chatStore.js
import { create } from 'zustand';

const useChatStore = create((set : any) => ({
  messages: [],
  isTyping: false,
  addMessage: (message : any) => set((state : any) => ({ messages: [...state.messages, message] })),
  setTyping: (typing : any) => set({ isTyping: typing }),
}));

export default useChatStore;