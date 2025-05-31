import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export interface SidebarItemProps {
  icon: React.ReactNode;
  label: string;
  path?: string;
  isHighlighted?: boolean;
  theme?: boolean;
}

const SidebarItem: React.FC<SidebarItemProps> = ({ icon, label, isHighlighted = false , theme  , path}) => {

  const [isDarkMode, setIsDarkMode] = useState<boolean>(false);
  const navigate = useNavigate();


  const toggleTheme = (d : boolean) => {
    setIsDarkMode(d);
    const newTheme = d ? 'dark' : 'light'; 
    console.log("newTheme", newTheme);
    
    localStorage.setItem('theme', newTheme);
    document.documentElement.classList.toggle('dark', newTheme === 'dark');
  };

  useEffect(() => {
    const storedTheme = localStorage.getItem('theme') as 'light' | 'dark';
    if (storedTheme) {
      setIsDarkMode(storedTheme === 'dark' ? true : false);
      document.documentElement.classList.toggle('dark', storedTheme === 'dark');
    }
  }, []);  



    return (
     <>
        {theme ?   
          <div  onClick={() => toggleTheme(!isDarkMode)}
            className={`flex items-center cursor-pointer gap-3 px-3 py-2 sidebar-item ${
              isHighlighted ? 'rounded-xl bg-[#e7edf4]  dark:bg-[#223649]' : ''
            }`}
          >
            <div className="text-gray-900 dark:text-gray-100" data-size="24px" data-weight={isHighlighted ? 'fill' : 'regular'}>
              {icon}
            </div>
            <p className="text-gray-900 dark:text-gray-100 text-sm font-medium leading-normal">{isDarkMode ?"Dark mode" : "Light Mode"}</p>
          </div> 
          :
          <div onClick={() => path && navigate(path)}
            className={`flex items-center gap-3 px-3 py-2 cursor-pointer sidebar-item ${
              isHighlighted ? 'rounded-xl bg-[#e7edf4]  dark:bg-[#223649]' : ''
            }`}
          >
            <div className="text-gray-900 dark:text-gray-100" data-size="24px" data-weight={isHighlighted ? 'fill' : 'regular'}>
              {icon}
            </div>
            <p className="text-gray-900 dark:text-gray-100 text-sm font-medium leading-normal">{label}</p>
          </div> 
        }
     
     </> 
  );
};


export default SidebarItem;