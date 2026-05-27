import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import Home from './routes/Home'
import GameSetup from './routes/GameSetup'
import NameEntry from './routes/NameEntry'
import Reorder from './routes/Reorder'
import Reveal from './routes/Reveal'
import Kick from './routes/Kick'
import Win from './routes/Win'

const router = createBrowserRouter([
  { path: '/', element: <Home /> },
  { path: '/setup', element: <GameSetup /> },
  { path: '/names', element: <NameEntry /> },
  { path: '/reorder', element: <Reorder /> },
  { path: '/reveal/:playerIndex', element: <Reveal /> },
  { path: '/kick', element: <Kick /> },
  { path: '/win', element: <Win /> },
])

export default function App() {
  return <RouterProvider router={router} />
}