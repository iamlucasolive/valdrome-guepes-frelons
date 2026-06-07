import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import Layout from './components/Layout'
import HomePage from './pages/HomePage'
import GuepesPage from './pages/GuepesPage'
import FrelonsPage from './pages/FrelonsPage'
import FourmisPage from './pages/FourmisPage'
import InterventionsPage from './pages/InterventionsPage'
import ContactPage from './pages/ContactPage'
import CommunePage from './pages/CommunePage'

const router = createBrowserRouter([
  {
    path: '/',
    element: <Layout />,
    children: [
      { index: true, element: <HomePage /> },
      { path: 'guepes', element: <GuepesPage /> },
      { path: 'frelons', element: <FrelonsPage /> },
      { path: 'fourmis', element: <FourmisPage /> },
      { path: 'interventions', element: <InterventionsPage /> },
      { path: 'interventions/:slug', element: <CommunePage /> },
      { path: 'contact', element: <ContactPage /> },
    ],
  },
])

export default function App() {
  return <RouterProvider router={router} />
}
