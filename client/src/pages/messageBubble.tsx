// src/components/MessageBubble.jsx
const MessageBubble = ({ message } : {message : any}) => {
  const isUser = message.role === 'user';
  return (
    <div
      className={` ${isUser ? " max-w-[50%]" : 'max-w-full' } p-3 rounded-lg shadow-md mb-4 ${
        isUser
          ? 'ml-[30rem]  bg-blue-500 text-white'
          : 'dark:bg-gray-800 bg-[#e7edf4] text-gray-900 dark:text-white'
      }`}
    >
      <p className="break-words">{message.content}</p>
    </div>
  );
};

export default MessageBubble;