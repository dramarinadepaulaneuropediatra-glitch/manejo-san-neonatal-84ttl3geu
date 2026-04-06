import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { Toaster } from '@/components/ui/toaster'
import { Toaster as Sonner } from '@/components/ui/sonner'
import { TooltipProvider } from '@/components/ui/tooltip'
import { AuthProvider, useAuth } from '@/hooks/use-auth'
import Layout from './components/Layout'
import CourseLayout from './components/CourseLayout'
import Login from './pages/Login'
import CourseOverview from './pages/CourseOverview'
import SectionRenderer from './pages/SectionRenderer'
import Gabarito from './pages/Gabarito'
import AdminDashboard from './pages/AdminDashboard'
import Certificate from './pages/Certificate'
import NotFound from './pages/NotFound'

const RootRedirect = () => {
  const { user, loading } = useAuth()

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-muted/40">
        <div className="animate-pulse text-muted-foreground font-medium">Carregando...</div>
      </div>
    )
  }

  return user ? <Navigate to="/course" replace /> : <Navigate to="/login" replace />
}

const App = () => (
  <AuthProvider>
    <BrowserRouter future={{ v7_startTransition: false, v7_relativeSplatPath: false }}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <Routes>
          <Route path="/" element={<RootRedirect />} />
          <Route path="/login" element={<Login />} />

          {/* Main App Layout */}
          <Route element={<Layout />}>
            <Route path="/course" element={<CourseLayout />}>
              <Route index element={<CourseOverview />} />
              <Route path="admin" element={<AdminDashboard />} />
              <Route path="gabarito" element={<Gabarito />} />
              <Route path="certificate" element={<Certificate />} />
              <Route path=":id" element={<SectionRenderer />} />
            </Route>
          </Route>

          <Route path="*" element={<NotFound />} />
        </Routes>
      </TooltipProvider>
    </BrowserRouter>
  </AuthProvider>
)

export default App
