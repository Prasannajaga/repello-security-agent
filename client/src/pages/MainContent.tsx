import { useEffect, useRef, useState } from "react";
import MessageBubble from "./messageBubble";
import TypingIndicator from "./indicator";
import useChatStore from "../store/chat";
import useAutoScroll from "../states/scroll"; 
import { CircleX } from "lucide-react";
import axios from "axios";
import { uploadHttp } from "../service/ApiService";

const MainContent: React.FC = () => {

  const [input, setInput] = useState('');
  const { messages, isTyping, addMessage, setTyping } = useChatStore();
  const { messagesEndRef, scrollToBottom } = useAutoScroll();
  const [fileURL, setFileURL] = useState(null);
  const [text, setText] = useState("");
  const [pastedImage] = useState(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const handlePaste = (event: any) => {
    event.preventDefault();
    const items = event.clipboardData.items;

    // Loop through clipboard items to find an image
    for (let i = 0; i < items.length; i++) {
      if (items[i].type.indexOf('image') !== -1) {
        const blob = items[i].getAsFile();
        const imageUrl: any = URL.createObjectURL(blob);
        setFileURL(imageUrl);
        break;
      }
    }

    // Optionally, handle text paste if needed
    const text = event.clipboardData.getData('text/plain');
    if (text && !pastedImage) {
      document.execCommand('insertText', false, text);
    }
  };

  const handleFileChange = async (e: any) => {
    const file = e.target.files[0];

    if (!file) return;

    const fileType = file.type;
    console.log(fileType);

    if (fileType === "application/pdf" || fileType === "image/png") {
      // Show PDF in iframe
      const url: any = URL.createObjectURL(file) ?? "";
      setFileURL(url);
    } else if (fileType.startsWith("text/") || file.name.endsWith(".csv")) {
      // Show text/csv in <pre>
      const textContent = await file.text();
      setText(textContent);
      setFileURL(null);
    }
  };

  // Handle input to keep the div clean if needed
  const handleInput = () => {
    if (inputRef?.current?.innerText.trim() === '') {
      if (inputRef.current) {
        inputRef.current.value = '';
      }
    }
  };


  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping, scrollToBottom]);

  const handleKeyDown = (e:any) => {
    console.log("Asasa" , e.key);
    
    if (e.key === "Enter") {
       handleSend()
    }
  };  

  const handleSend = async () => {
    // e.preventDefault();
    if (!input.trim()) return;

    // Add user message
    addMessage({ role: 'user', content: input });
    setInput('');
    setFileURL(null)
    setTyping(true);

    onSubmit();
    setTimeout(() => {
      addMessage({
        role: 'assistant',
        content: `Echo: ${input}`,
      });
      setTyping(false);
    }, 1000);
  };


  const onSubmit = async () => {

    const formData = new FormData();
    if (fileURL) {
      // Fetch the blob from the fileURL
      const response = await fetch(fileURL);
      const blob = await response.blob();
      formData.append("file", blob, "upload");
    }
    formData.append("query", input);

    await uploadHttp.post("document/upload", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
  };


  return (
    <div className="layout-content-container flex flex-col max-w-[960px] flex-1">
      <h2 className="text-[#0d141c] dark:text-gray-100 tracking-tight text-[28px] font-bold leading-tight px-4 text-center pb-3 pt-5">
        How can I help you today?
      </h2>

      <div className="px-4 py-3">

        <div className="z-10 flex-1 h-[550px] overflow-y-auto overflow-hidden no-scrollbar  p-4">
          {messages.map((message, index) => (
            <MessageBubble key={index} message={message} />
          ))}
          {isTyping && <TypingIndicator />}
          <div ref={messagesEndRef} />
        </div>

        <label className="z-20 absolute shadow-md bottom-4 left-[10%] flex flex-col min-w-[40rem]">
          <div id="a" className="dark:bg-gray-800 bg-[#e7edf4] text-white p-4 rounded-lg shadow-lg flex flex-col gap-2 w-full max-w-3xl mx-auto">

            {fileURL && (
              <div className="relative overflow-hidden rounded">
                <CircleX onClick={() => setFileURL(null)} className="absolute top-2 left-14 w-5 h-5 hover:stroke-red-400"/>
                <iframe
                  scrolling="no"
                  className="w-20 h-20"
                  src={fileURL}
                  title="Uploaded PDF"
                  style={{ border: "none" }}
                />
              </div>
            )}

  
            <div
              ref={inputRef}
              contentEditable
              onPaste={handlePaste}
              onInput={handleInput}
              suppressContentEditableWarning
              className="flex items-center dark:bg-gray-800  bg-[#e7edf4] rounded-full px-4 py-2">

              <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                type="text"
                placeholder="Ask anything"
                className="bg-transparent flex-1 outline-none text-gray-800 dark:text-gray-300 placeholder-gray-500"
              />
 
              <div className="flex items-center gap-3">
                <label className="text-gray-400 hover:text-gray-800 cursor-pointer">
                  <input
                    type="file"
                    multiple
                    className="hidden"
                    onChange={handleFileChange}
                  />
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 4v16m8-8H4"
                    />
                  </svg>
                </label>

                <button onClick={handleSend}  className="bg-white text-gray-900 rounded-full p-1 hover:bg-[#e7edf4]">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 10l7-7m0 0l7 7m-7-7v18"
                    />
                  </svg>
                </button>
              </div>
            </div>
 
            <p className="text-xs text-gray-500 text-center">
              Agent can make mistakes. Check important info.{' '} 
            </p>
          </div>
        </label>

      </div>
    </div>
  );
};

export default MainContent;