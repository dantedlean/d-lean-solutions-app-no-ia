import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { Toaster } from '@/components/ui/toaster'
import { Toaster as Sonner } from '@/components/ui/sonner'
import { TooltipProvider } from '@/components/ui/tooltip'
import Index from './pages/Index'
import ClientDatabase from './pages/ClientDatabase'
import TechnicalCatalog from './pages/TechnicalCatalog'
import EngineeringDashboard from './pages/EngineeringDashboard'
import NotFound from './pages/NotFound'
import Layout from './components/Layout'
import { AuthProvider } from '@/hooks/use-auth'

const App = () => (
  <BrowserRouter future={{ v7_startTransition: false, v7_relativeSplatPath: false }}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <Routes>
          <Route element={<Layout />}>
            <Route path="/" element={<Index />} />
            <Route path="/clients" element={<ClientDatabase />} />
            <Route path="/catalog" element={<TechnicalCatalog />} />
            <Route path="/engineering" element={<EngineeringDashboard />} />
          </Route>
          <Route path="*" element={<NotFound />} />
        </Routes>
      </TooltipProvider>
    </AuthProvider>
  </BrowserRouter>
)

export default App
