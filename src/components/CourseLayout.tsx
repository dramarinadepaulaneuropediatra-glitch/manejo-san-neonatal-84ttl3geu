import { useEffect, useState } from 'react'
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '@/hooks/use-auth'
import { getSections, getMyProgress } from '@/services/api'
import { useRealtime } from '@/hooks/use-realtime'
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarProvider,
  SidebarTrigger,
} from '@/components/ui/sidebar'
import { Progress } from '@/components/ui/progress'
import { Button } from '@/components/ui/button'
import { LogOut, BookOpen, CheckCircle2, Circle } from 'lucide-react'
import pb from '@/lib/pocketbase/client'

export default function CourseLayout() {
  const { user, signOut } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const [sections, setSections] = useState<any[]>([])
  const [progressIds, setProgressIds] = useState<string[]>([])

  useEffect(() => {
    if (!user) navigate('/login')
  }, [user, navigate])

  const loadData = async () => {
    try {
      const secs = await getSections()
      setSections(secs)
      const prog = await getMyProgress()
      setProgressIds(prog.map((p) => p.section_id))
    } catch (e) {
      console.error(e)
    }
  }

  useEffect(() => {
    if (user) loadData()
  }, [user])

  useRealtime('progress', (e) => {
    if (e.record.user_id === user?.id) {
      loadData()
    }
  })

  const progressPercent =
    sections.length > 0 ? Math.round((progressIds.length / sections.length) * 100) : 0

  if (!user) return null

  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full bg-background">
        <Sidebar>
          <SidebarHeader className="border-b px-4 py-4">
            <div className="flex items-center gap-2 text-primary font-bold text-lg">
              <BookOpen className="h-6 w-6" />
              <span>Manejo SAN</span>
            </div>
          </SidebarHeader>
          <SidebarContent className="px-2 py-4">
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton asChild isActive={location.pathname === '/course'}>
                  <Link to="/course">Visão Geral</Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <div className="my-4 px-4">
                <div className="text-xs font-semibold text-muted-foreground mb-2">
                  MÓDULOS DO CURSO
                </div>
                {sections.map((sec) => {
                  const isCompleted = progressIds.includes(sec.id)
                  const isActive = location.pathname === `/course/${sec.order}`
                  return (
                    <SidebarMenuItem key={sec.id} className="mt-1">
                      <SidebarMenuButton asChild isActive={isActive}>
                        <Link
                          to={`/course/${sec.order}`}
                          className="flex items-center justify-between w-full"
                        >
                          <span className="truncate pr-2">
                            {sec.order}. {sec.title}
                          </span>
                          {isCompleted ? (
                            <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0" />
                          ) : (
                            <Circle className="h-4 w-4 text-muted-foreground shrink-0" />
                          )}
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  )
                })}
              </div>
            </SidebarMenu>
          </SidebarContent>
        </Sidebar>

        <div className="flex-1 flex flex-col min-w-0">
          <header className="sticky top-0 z-10 flex h-16 items-center gap-4 border-b bg-background px-6 shadow-sm">
            <SidebarTrigger />
            <div className="flex-1 flex items-center gap-4">
              <div className="hidden md:flex items-center gap-2 flex-1 max-w-md">
                <Progress value={progressPercent} className="h-2" />
                <span className="text-xs text-muted-foreground font-medium w-12">
                  {progressPercent}%
                </span>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <span className="text-sm font-medium hidden sm:inline-block">
                Olá, {user.name || user.email}
              </span>
              <Button variant="ghost" size="sm" onClick={signOut}>
                <LogOut className="h-4 w-4 mr-2" /> Sair
              </Button>
            </div>
          </header>

          <main className="flex-1 overflow-auto p-6 md:p-10">
            <div className="max-w-4xl mx-auto w-full animate-fade-in-up">
              <Outlet context={{ sections }} />
            </div>
          </main>
        </div>
      </div>
    </SidebarProvider>
  )
}
