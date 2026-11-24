import { BrowserRouter, Routes, Route } from 'react-router-dom'
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

function App() {
  return (
    <BrowserRouter>
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
      </Routes>
      <ChobbyChat />
    </BrowserRouter>
  )
}

export default App
