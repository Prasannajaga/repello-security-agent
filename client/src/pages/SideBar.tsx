import { useState } from "react";
import SidebarItem, { type SidebarItemProps } from "./SiteBarItem";
import { useEffect } from "react";
import { useLocation } from "react-router-dom";

const Sidebar: React.FC = () => {
  const data: SidebarItemProps[] = [
    {
      label: 'New Chat',
      isHighlighted: true,
      path : "/chat",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" width="24px" height="24px" fill="currentColor" viewBox="0 0 256 256">
          <path
            d="M208,32H48A16,16,0,0,0,32,48V208a16,16,0,0,0,16,16H208a16,16,0,0,0,16-16V48A16,16,0,0,0,208,32ZM184,136H136v48a8,8,0,0,1-16,0V136H72a8,8,0,0,1,0-16h48V72a8,8,0,0,1,16,0v48h48a8,8,0,0,1,0,16Z"
          />
        </svg>
      ),
    },
    {
      label: 'Logs',
      isHighlighted: false,
      path : "/logs", 
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" width="24px" height="24px" fill="currentColor" viewBox="0 0 256 256">
          <path
            d="M136,80v43.47l36.12,21.67a8,8,0,0,1-8.24,13.72l-40-24A8,8,0,0,1,120,128V80a8,8,0,0,1,16,0Zm-8-48A95.44,95.44,0,0,0,60.08,60.15C52.81,67.51,46.35,74.59,40,82V64a8,8,0,0,0-16,0v40a8,8,0,0,0,8,8H72a8,8,0,0,0,0-16H49c7.15-8.42,14.27-16.35,22.39-24.57a80,80,0,1,1,1.66,114.75,8,8,0,1,0-11,11.64A96,96,0,1,0,128,32Z"
          />
        </svg>
      ),
    }, 
    {
      label: 'Dark Mode',
      isHighlighted: false,
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" width="24px" height="24px" fill="currentColor" viewBox="0 0 256 256">
          <path
            d="M233.54,142.23a8,8,0,0,0-8-2,88.08,88.08,0,0,1-109.8-109.8,8,8,0,0,0-10-10,104.84,104.84,0,0,0-52.91,37A104,104,0,0,0,136,224a103.09,103.09,0,0,0,62.52-20.88,104.84,104.84,0,0,0,37-52.91A8,8,0,0,0,233.54,142.23ZM188.9,190.34A88,88,0,0,1,65.66,67.11a89,89,0,0,1,31.4-26A106,106,0,0,0,96,56,104.11,104.11,0,0,0,200,160a106,106,0,0,0,14.92-1.06A89,89,0,0,1,188.9,190.34Z"
          />
        </svg>
      ),
    },
  ];

  const [items , setItems] = useState<SidebarItemProps[]>(data);

  const location = useLocation();

  useEffect(() => {
    setItems((prevItems) => {
      return prevItems.map((item) => {
        if (item.path === location.pathname) {
          return { ...item, isHighlighted: true };
        } else {
          return { ...item, isHighlighted: false };
        }
      });
    });
  }, [location.pathname]);
 

  return (
    <div className="flex h-full min-h-[700px] flex-col justify-between bg-slate-50 dark:bg-[#101a23] p-4">
      <div className="flex flex-col gap-4">
        <div className="flex flex-col gap-2">
          {items.slice(0, 2).map((item, index) => (
            <SidebarItem
              path={item.path}
              key={index}
              icon={item.icon}
              label={item.label}
              isHighlighted={item.isHighlighted} 
            />
          ))}
        </div>
      </div>
      <div className="flex flex-col gap-1">
        <SidebarItem
          theme={true}
          icon={items[items.length - 1].icon}
          label={items[items.length - 1].label}
          isHighlighted={items[items.length - 1].isHighlighted}
        />
      </div>
    </div>
  );
};


export default Sidebar;