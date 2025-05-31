import MarkdownTemplate from "./mdFormatter";

const MessageBubble = ({ message }: { message: any }) => {
  const isUser = message.role === 'user';
  return (
    <>

      {isUser ? (

        <div className={` max-w-[50%]  p-4 rounded-lg shadow-md mb-4  ml-[30rem]  bg-blue-500  text-white `}>
          {message.isAttached && <p className="break-words w-fit text-sm p-1 px-2 rounded-md bg-gray-900/60 shadow-sm">
            {message.attachment}
          </p>
          }
          <p className={`break-words ${message.isAttached && ' mt-2'}`}>
            {message.content}
          </p>
        </div>
      ) :

        <div className="max-w-full p-2 rounded-lg shadow-md mb-4 dark:bg-gray-800 bg-[#e7edf4] text-gray-900 dark:text-white animate-fade-in-down">
          <div className="container mx-auto break-words">
            <MarkdownTemplate content={message.content} />
          </div>
        </div>
      }




    </>
  );
};

export default MessageBubble;