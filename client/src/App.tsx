import { Outlet } from 'react-router-dom'
import './App.css'    
import Sidebar from './pages/SideBar' 

function App() {

  return (
    <div className=" relative flex size-full min-h-screen flex-col bg-slate-50 dark:bg-[#101a23] overflow-x-hidden"
      style={{ fontFamily: 'Inter, "Noto Sans", sans-serif' }}
    >
      <div className="layout-container flex h-full grow flex-col">
        <div className="gap-5 px-6 flex flex-1 py-5">
          <div className=" layout-content-container flex flex-col w-80">
            <Sidebar />
          </div>
          <div className='relative container flex-1'>
            <Outlet />
          </div>
        </div>
      </div> 

    </div>
    // <CustomerBar />
  )
}

export default App
