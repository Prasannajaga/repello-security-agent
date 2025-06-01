import { useEffect, useRef, useState } from "react";
import MessageBubble from "./messageBubble";
import TypingIndicator from "./indicator";
import useChatStore from "../store/chat";
import useAutoScroll from "../states/scroll"; 
import { CircleX } from "lucide-react"; 
import { uploadHttp } from "../service/ApiService";

const MainContent: React.FC = () => {

  const [input, setInput] = useState('');
  const { messages, isTyping, addMessage, setTyping } = useChatStore();
  const { messagesEndRef, scrollToBottom } = useAutoScroll();
  const [fileURL, setFileURL] = useState<string | null>(null);
  const [text, setText] = useState("");
  const [pastedImage] = useState(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
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
 
    const renderableTypes = [
      "application/pdf",
      "image/png",
      "image/jpeg",
      "image/jpg"
    ];
 

    if (renderableTypes.includes(fileType)) {
      const url: string = URL.createObjectURL(file);
      setFileURL(url);
      setText("");
      setSelectedFile(file);
    } else if (
      fileType.startsWith("text/") ||
      file.name.endsWith(".csv") ||
      fileType === "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" ||
      fileType === "application/vnd.ms-excel"
    ) {
      setFileURL(null);
      setText(file.name);
      setSelectedFile(file);
    } else {
      setFileURL(null);
      setText(file.name);
      setSelectedFile(file);
    }

    // Reset the input value so the same file can be uploaded again
    e.target.value = "";
  }; 

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping, scrollToBottom]);

  const handleKeyDown = (e:any) => { 
    if (e.key === "Enter") {
       handleSend()
    }
  };  

  const handleSend = async () => { 
    if (!input.trim()) return;
    
    const isAttached =  fileURL !== null || selectedFile !== null;

    addMessage({ role: 'user', content: input , isAttached :  isAttached , attachment : selectedFile?.name ?? "" });
    setInput('');
    setFileURL(null)
    setSelectedFile(null);
    setText("");
    setTyping(true);

    const response = await onSubmit();
    if(response) { 
      addMessage({
        role: 'assistant',
        content: response.answer,
      });
      setTyping(false); 
    } 

  };


  const onSubmit = async () => {
    const formData = new FormData();

    if (fileURL) { 
      const response = await fetch(fileURL);
      const blob = await response.blob();
      formData.append("file", blob, "upload");
    }
    else if (selectedFile) {
      formData.append("file", selectedFile);  
    }

    formData.append("query", input);

    try {
      const response = await uploadHttp.post("document/upload", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      return response.data;

    } catch (error: any) {
      console.log(error);
      const status = error.response ? error.response.status : 500;

      // if(error.response){

        if (status === 413 || status === 415 || status === 400 || status === 500) { 
          addMessage({
            role: 'assistant',
            content: error?.response?.data?.detail ?? "Something went wrong with your request. Please try again.",
          });
        }else { 
          addMessage({
            role: 'assistant',
            content: `Yikes! Something went sideways: ${error?.message || "Gremlins in the system?"}`,
          });
        }
      // }
      
      setTyping(false); 
      return null;
    }
  };


  return (
 <div className="container h-auto relative mx-auto flex flex-col items-center">
    {/* Title moved closer to message area for better hierarchy */}
    <h5 className="text-[#0d141c] dark:text-gray-100 tracking-tight text-[20px] font-bold leading-tight px-4 text-center pt-5 pb-2">
      Ask anything about your document. I’ll keep it safe!
    </h5>

    {/* Message area with adjusted max-width for better alignment with input */}
    <div className="w-full max-w-5xl mx-auto flex-1">
      <div className="z-10 flex-1 h-[650px] overflow-y-auto overflow-hidden no-scrollbar p-4">
        {messages.map((message, index) => (
          <MessageBubble key={index} message={message} />
        ))}
        {isTyping && <TypingIndicator />}
        <div ref={messagesEndRef} />
      </div>
    </div>

    {/* Input section with adjusted positioning and compact layout */}
    <section className="z-20 w-full max-w-5xl mx-auto mb-2">
      <div id="a" className="dark:bg-gray-800 bg-[#e7edf4] text-white p-4 rounded-lg shadow-lg flex flex-col gap-2">
        {/* File preview iframe moved above input for better flow */}
        {fileURL ? (
          <div className="relative overflow-hidden rounded mb-2">
            <CircleX
              onClick={() => setFileURL(null)}
              className="absolute top-2 left-14 w-5 h-5 hover:stroke-red-400"
            />
            <iframe
              scrolling="no"
              className="w-20 h-20"
              src={fileURL}
              title="Uploaded PDF"
              style={{ border: "none" }}
            />
          </div>
        ) : 
         <>
          {text && (
            <div className="flex gap-2  text-gray-500 dark:text-gray-400 text-sm mb-2">
              {text}
              <CircleX
                onClick={() => setText("")}
                className="w-5 h-5 hover:stroke-red-400"
              />
             </div>  
          )}  
         </>
        }

        {/* Input area with consistent padding and alignment */}
        <div className="flex items-center dark:bg-gray-800 bg-[#e7edf4] rounded-full px-4 py-2 gap-3">
          <input
            ref={inputRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            onPaste={handlePaste}
            type="text"
            placeholder="Ask anything"
            className="flex-1 outline-none text-gray-800 dark:text-gray-300 bg-transparent w-full placeholder-gray-500"
          />

          {/* Action buttons in a compact row */}
          <div className="flex items-center gap-3">
            <label className="text-gray-400 cursor-pointer">
              <input
              type="file"
              accept=".pdf, .jpeg, .txt, .jpg, application/pdf, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel"
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

            <button
              onClick={handleSend}
              className="bg-white text-gray-900 rounded-full p-1 hover:bg-[#e7edf4]"
            >
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

        {/* Footer text centered and compact */}
        <p className="text-xs text-gray-500 text-center mt-2">
          Agent can make mistakes. Check important info.
        </p>
      </div>
    </section>
</div>
  );
};

export default MainContent;