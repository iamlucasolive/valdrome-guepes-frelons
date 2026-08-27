import type { RouteRecord } from 'vite-react-ssg'
import Layout from './components/Layout'
import HomePage from './pages/HomePage'
import GuepesPage from './pages/GuepesPage'
import FrelonsPage from './pages/FrelonsPage'
import FourmisPage from './pages/FourmisPage'
import InterventionsPage from './pages/InterventionsPage'
import ContactPage from './pages/ContactPage'
import CommunePage from './pages/CommunePage'
import LegalPage from './pages/LegalPage'
import { COMMUNES } from './data/communes'
import { toSlug } from './utils/communeSlug'

export const routes: RouteRecord[] = [
  {
    path: '/',
    element: <Layout />,
    entry: 'src/components/Layout.tsx',
    children: [
      { index: true, element: <HomePage />, entry: 'src/pages/HomePage.tsx' },
      { path: 'guepes', element: <GuepesPage />, entry: 'src/pages/GuepesPage.tsx' },
      { path: 'frelons', element: <FrelonsPage />, entry: 'src/pages/FrelonsPage.tsx' },
      { path: 'fourmis', element: <FourmisPage />, entry: 'src/pages/FourmisPage.tsx' },
      { path: 'interventions', element: <InterventionsPage />, entry: 'src/pages/InterventionsPage.tsx' },
      {
        path: 'interventions/:slug',
        element: <CommunePage />,
        entry: 'src/pages/CommunePage.tsx',
        getStaticPaths: () => COMMUNES.map((c) => `interventions/${toSlug(c.nom)}`),
      },
      { path: 'contact', element: <ContactPage />, entry: 'src/pages/ContactPage.tsx' },
      { path: 'mentions-legales', element: <LegalPage />, entry: 'src/pages/LegalPage.tsx' },
    ],
  },
]
