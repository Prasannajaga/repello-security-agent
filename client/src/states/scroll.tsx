// src/hooks/useAutoScroll.js
import { useRef } from 'react';

const useAutoScroll = () => {
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  return { messagesEndRef, scrollToBottom };
};

export default useAutoScroll;