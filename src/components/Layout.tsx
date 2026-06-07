import { Outlet } from 'react-router-dom'
import Navbar from './Navbar'
import Footer from './Footer'
import CtaBanner from './CtaBanner'
import UrgencyBanner from './UrgencyBanner'
import FloatingCallButton from './FloatingCallButton'

export default function Layout() {
  return (
    <div className="flex min-h-screen flex-col">
      <UrgencyBanner />
      <Navbar />
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
      <CtaBanner />
      <FloatingCallButton />
      <div className="h-16 md:hidden" />
    </div>
  )
}
