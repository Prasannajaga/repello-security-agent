import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { createBrowserRouter, RouterProvider } from 'react-router-dom' 
import MainContent from './pages/MainContent.tsx' 

const routes = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    children: [
      {
        path: '/chat',
        element: <MainContent />,
      }, 
    ]
  }
])

createRoot(document.getElementById('root')!).render(
  <RouterProvider router={routes} />
)
