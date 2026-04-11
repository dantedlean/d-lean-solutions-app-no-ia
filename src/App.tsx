import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { Toaster } from '@/components/ui/toaster'
import { Toaster as Sonner } from '@/components/ui/sonner'
import { TooltipProvider } from '@/components/ui/tooltip'
import Index from './pages/Index'
import ClientDatabase from './pages/ClientDatabase'
import TechnicalCatalog from './pages/TechnicalCatalog'
import EngineeringDashboard from './pages/EngineeringDashboard'
import AdminDashboard from './pages/AdminDashboard'
import NotFound from './pages/NotFound'
import Layout from './components/Layout'
import Login from './pages/Login'
import { AuthProvider, useAuth } from '@/hooks/use-auth'

const AppRoutes = () => {
  const { user, loading } = useAuth()

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-slate-500 font-medium">
        Carregando painel...
      </div>
    )
  }

  if (!user) {
    return <Login />
  }

  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<Index />} />
        <Route path="/clients" element={<ClientDatabase />} />
        <Route path="/catalog" element={<TechnicalCatalog />} />
        <Route path="/engineering" element={<EngineeringDashboard />} />
        <Route path="/admin" element={<AdminDashboard />} />
      </Route>
      <Route path="*" element={<NotFound />} />
    </Routes>
  )
}

const App = () => (
  <BrowserRouter future={{ v7_startTransition: false, v7_relativeSplatPath: false }}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <AppRoutes />
      </TooltipProvider>
    </AuthProvider>
  </BrowserRouter>
)

export default App
