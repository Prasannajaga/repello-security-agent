function TypingIndicator() {
  return (
    <div className="flex items-center space-x-2 p-3">
        <div className="w-2 h-2 bg-gray-500 dark:bg-gray-400 rounded-full animate-bounce"></div>
        <div className="w-2 h-2 bg-gray-500 dark:bg-gray-400 rounded-full animate-bounce [animation-delay:0.1s]"></div>
        <div className="w-2 h-2 bg-gray-500 dark:bg-gray-400 rounded-full animate-bounce [animation-delay:0.2s]"></div>
        <span className="text-gray-500 dark:text-gray-400">Assistant is typing...</span>
    </div>
  );
}

export default TypingIndicator;