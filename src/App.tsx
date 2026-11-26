import { useEffect } from 'react'
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom'
import { Home } from '@/pages/Home'
import { Pricing } from '@/pages/Pricing'
import { FAQContact } from '@/pages/FAQContact'
import { HowItWorks } from '@/pages/HowItWorks'
import { Features } from '@/pages/Features'
import { Explore } from '@/pages/Explore'
import { About } from '@/pages/About'
import { Dashboard } from '@/pages/Dashboard'
import { AiCriteria } from '@/pages/dashboard/AiCriteria'
import { Comparison } from '@/pages/dashboard/Comparison'
import { Ranking } from '@/pages/dashboard/Ranking'
import { WhatIf } from '@/pages/dashboard/WhatIf'
import { ChobbyChat } from '@/components/chobby/ChobbyChat'
import { AdminRoot } from '@/admin/AdminRoot'
import { RequireAdmin } from '@/admin/AdminShell'
import { AdminLogin } from '@/admin/pages/AdminLogin'
import { AdminOverview } from '@/admin/pages/AdminOverview'
import { AdminUsers } from '@/admin/pages/AdminUsers'
import { AdminCatalogue } from '@/admin/pages/AdminCatalogue'
import { AdminReports } from '@/admin/pages/AdminReports'
import { AdminNotifications } from '@/admin/pages/AdminNotifications'
import { AdminSettings } from '@/admin/pages/AdminSettings'

/** Every navigation starts at the top of the new page instead of keeping the previous scroll. */
function ScrollToTop() {
  const { pathname } = useLocation()

  useEffect(() => {
    document.documentElement.scrollTop = 0
    document.body.scrollTop = 0
  }, [pathname])

  return null
}

/** The public support widget stays out of the admin console. */
function SupportWidget() {
  const { pathname } = useLocation()
  if (pathname.startsWith('/admin')) return null
  return <ChobbyChat />
}

function App() {
  return (
    <BrowserRouter>
      <ScrollToTop />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/pricing" element={<Pricing />} />
        <Route path="/faq" element={<FAQContact />} />
        <Route path="/how-it-works" element={<HowItWorks />} />
        <Route path="/features" element={<Features />} />
        <Route path="/explore" element={<Explore />} />
        <Route path="/about" element={<About />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/dashboard/ai-criteria" element={<AiCriteria />} />
        <Route path="/dashboard/comparison" element={<Comparison />} />
        <Route path="/dashboard/ranking" element={<Ranking />} />
        <Route path="/dashboard/what-if" element={<WhatIf />} />

        <Route path="/admin" element={<AdminRoot />}>
          <Route path="login" element={<AdminLogin />} />
          <Route element={<RequireAdmin />}>
            <Route index element={<AdminOverview />} />
            <Route path="users" element={<AdminUsers />} />
            <Route path="catalogue" element={<AdminCatalogue />} />
            <Route path="reports" element={<AdminReports />} />
            <Route path="notifications" element={<AdminNotifications />} />
            <Route path="settings" element={<AdminSettings />} />
          </Route>
        </Route>
      </Routes>
      <SupportWidget />
    </BrowserRouter>
  )
}

export default App
