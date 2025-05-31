import { useEffect, useState } from "react"
import { uploadHttp } from "../service/ApiService";

export default function LoggTemplate() {

   const [logs, setLogs] = useState<any[]>([]);

  useEffect(() => {
    const fetchLogs = async () => {
      try {
        const response = await uploadHttp.get('logs');
        if (!response.data) {
          throw new Error('Network response was not ok');
        }
        const data = await response.data.logs;
        setLogs(data);  
        console.log(data);
      } catch (error) {
        console.error('There was a problem with the fetch operation:', error);
      }
    };

    fetchLogs();

  }, []); 


  return (
    <>  
    <div className="p-4 h-full">
        <h2 className="text-2xl font-bold mb-4 text-gray-800 dark:text-gray-100">Logs</h2>

        {logs.length === 0 ? (
            <div className="text-gray-500 dark:text-gray-400">No logs found.</div>
        ) : (
            <div className="bg-gray-100 dark:bg-gray-800 rounded-md p-4 h-[80%] overflow-y-auto border border-gray-200 dark:border-gray-700">
                <pre className="text-sm text-gray-800 dark:text-gray-200 whitespace-pre-wrap break-words">
                    {logs.map((log, idx) => `${idx + 1}. ${String(log)}\n`).join('')}
                </pre>
            </div>
        )}
    </div>
    
    
    </>
  )
}


