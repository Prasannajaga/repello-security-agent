import { Outlet } from 'react-router-dom'
import './App.css'    
import Sidebar from './pages/SideBar' 

function App() {

  return (
    <div className=" relative bg-slate-50 dark:bg-[#101a23] overflow-x-hidden"
      style={{ fontFamily: 'Inter, "Noto Sans", sans-serif' }}
    > 
       <div className="gap-5 px-6  h-screen flex justify-between py-5">
          <div className=" layout-content-container flex flex-col w-80">
            <Sidebar />
          </div>
          <div className='relative container flex-1'>
            <Outlet />
          </div>
        </div>
      </div>   
  )
}

export default App
