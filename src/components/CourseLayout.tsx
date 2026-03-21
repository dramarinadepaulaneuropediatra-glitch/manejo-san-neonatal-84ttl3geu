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
import { LogOut, BookOpen, CheckCircle2, Circle, GraduationCap, ShieldAlert } from 'lucide-react'

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
    sections.length > 0
      ? Math.min(100, Math.round((progressIds.length / sections.length) * 100))
      : 0

  if (!user) return null

  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full bg-background">
        <Sidebar>
          <SidebarHeader className="border-b px-4 py-4 bg-muted/20">
            <div className="flex items-center gap-3 text-primary font-bold text-lg">
              <div className="bg-primary p-1.5 rounded-lg">
                <BookOpen className="h-5 w-5 text-primary-foreground" />
              </div>
              <span className="tracking-tight">Manejo SAN</span>
            </div>
          </SidebarHeader>
          <SidebarContent className="px-2 py-4">
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton asChild isActive={location.pathname === '/course'}>
                  <Link to="/course" className="font-medium">
                    Visão Geral
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>

              {user.email === 'dramarinadepaulaneuropediatra@gmail.com' && (
                <div className="my-2 px-4">
                  <div className="text-[11px] uppercase tracking-wider font-bold text-indigo-600 mb-3 mt-4">
                    Administração
                  </div>
                  <SidebarMenuItem>
                    <SidebarMenuButton asChild isActive={location.pathname === '/course/admin'}>
                      <Link
                        to="/course/admin"
                        className="flex items-center w-full gap-2 font-medium text-indigo-700"
                      >
                        <ShieldAlert className="h-4 w-4" />
                        <span className="truncate pr-2">Painel da Equipe</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                </div>
              )}

              <div className="my-6 px-4">
                <div className="text-[11px] uppercase tracking-wider font-bold text-muted-foreground mb-3">
                  Conteúdo Programático
                </div>
                {sections.map((sec) => {
                  const isCompleted = progressIds.includes(sec.id)
                  const isActive = location.pathname === `/course/${sec.order}`
                  return (
                    <SidebarMenuItem key={sec.id} className="mt-1">
                      <SidebarMenuButton asChild isActive={isActive}>
                        <Link
                          to={`/course/${sec.order}`}
                          className="flex items-center justify-between w-full group"
                        >
                          <span className="truncate pr-2 font-medium text-[13px]">
                            {sec.order}. {sec.title}
                          </span>
                          {isCompleted ? (
                            <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0 group-hover:scale-110 transition-transform" />
                          ) : (
                            <Circle className="h-4 w-4 text-muted-foreground/40 shrink-0" />
                          )}
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  )
                })}
              </div>

              <div className="my-2 px-4">
                <div className="text-[11px] uppercase tracking-wider font-bold text-muted-foreground mb-3">
                  Conclusão
                </div>
                <SidebarMenuItem>
                  <SidebarMenuButton asChild isActive={location.pathname === '/course/gabarito'}>
                    <Link
                      to="/course/gabarito"
                      className="flex items-center w-full gap-2 font-medium"
                    >
                      <GraduationCap className="h-4 w-4 text-primary" />
                      <span className="truncate pr-2">Gabarito e Revisão</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              </div>
            </SidebarMenu>
          </SidebarContent>
        </Sidebar>

        <div className="flex-1 flex flex-col min-w-0">
          <header className="sticky top-0 z-10 flex h-16 items-center gap-4 border-b bg-background/80 backdrop-blur-md px-6">
            <SidebarTrigger />
            <div className="flex-1 flex items-center gap-4">
              <div className="hidden md:flex items-center gap-3 flex-1 max-w-md">
                <Progress value={progressPercent} className="h-2.5 bg-muted" />
                <span className="text-xs text-muted-foreground font-bold w-12">
                  {progressPercent}%
                </span>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <span className="text-sm font-medium hidden sm:inline-block bg-muted/50 px-3 py-1.5 rounded-full text-muted-foreground border">
                Olá, {user.name || user.email}
              </span>
              <Button
                variant="ghost"
                size="sm"
                onClick={signOut}
                className="hover:bg-rose-50 hover:text-rose-600 transition-colors"
              >
                <LogOut className="h-4 w-4 sm:mr-2" />{' '}
                <span className="hidden sm:inline">Sair</span>
              </Button>
            </div>
          </header>

          <main className="flex-1 overflow-auto bg-muted/10 p-6 md:p-10 custom-scrollbar">
            <div className="mx-auto w-full animate-fade-in-up">
              <Outlet context={{ sections, progressIds }} />
            </div>
          </main>
        </div>
      </div>
    </SidebarProvider>
  )
}
