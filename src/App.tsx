import { createBrowserRouter, Outlet, RouterProvider } from 'react-router-dom'
import Home from './routes/Home'
import GameSetup from './routes/GameSetup'
import NameEntry from './routes/NameEntry'
import Reorder from './routes/Reorder'
import Reveal from './routes/Reveal'
import Kick from './routes/Kick'
import Win from './routes/Win'
import Settings from './routes/Settings'
import ResumeGate from './components/ResumeGate'

// Layout route wraps every child in ResumeGate. ResumeGate uses useNavigate,
// which requires being inside the router — so it can't sit above RouterProvider.
// The layout-route approach gives it a single mount point that covers all
// routes via <Outlet />.
function RootLayout() {
  return (
    <ResumeGate>
      <Outlet />
    </ResumeGate>
  )
}

const router = createBrowserRouter([
  {
    element: <RootLayout />,
    children: [
      { path: '/', element: <Home /> },
      { path: '/setup', element: <GameSetup /> },
      { path: '/names', element: <NameEntry /> },
      { path: '/reorder', element: <Reorder /> },
      { path: '/reveal/:playerIndex', element: <Reveal /> },
      { path: '/kick', element: <Kick /> },
      { path: '/win', element: <Win /> },
      { path: '/settings', element: <Settings /> },
    ],
  },
])

export default function App() {
  return <RouterProvider router={router} />
}