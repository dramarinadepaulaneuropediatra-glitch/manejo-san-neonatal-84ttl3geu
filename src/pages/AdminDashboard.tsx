import { useEffect, useState } from 'react'
import pb from '@/lib/pocketbase/client'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Users, BookOpen, Activity, BarChart3, ShieldAlert } from 'lucide-react'
import { Progress } from '@/components/ui/progress'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { useAuth } from '@/hooks/use-auth'
import { useNavigate } from 'react-router-dom'

export default function AdminDashboard() {
  const [data, setData] = useState<any>(null)
  const { user } = useAuth()
  const navigate = useNavigate()

  useEffect(() => {
    if (user?.email !== 'dramarinadepaulaneuropediatra@gmail.com') {
      navigate('/course')
      return
    }

    async function load() {
      try {
        const [users, sections, progress, interactions, responses] = await Promise.all([
          pb.collection('users').getFullList({ sort: '-created' }),
          pb.collection('sections').getFullList({ sort: 'order' }),
          pb.collection('progress').getFullList(),
          pb
            .collection('interactions')
            .getFullList({ filter: "type='quiz' || type='scenario' || type='case_study'" }),
          pb.collection('responses').getFullList(),
        ])

        setData({ users, sections, progress, interactions, responses })
      } catch (err) {
        console.error(err)
      }
    }
    load()
  }, [user, navigate])

  if (!data) {
    return (
      <div className="flex items-center justify-center p-20 animate-pulse text-muted-foreground">
        Carregando painel analítico...
      </div>
    )
  }

  const totalUsers = data.users.length

  const sectionProgress = data.sections.map((sec: any) => {
    const completedCount = data.progress.filter(
      (p: any) => p.section_id === sec.id && p.completed,
    ).length
    return {
      id: sec.id,
      title: sec.title,
      order: sec.order,
      percent: totalUsers > 0 ? Math.round((completedCount / totalUsers) * 100) : 0,
    }
  })

  const quizStats = data.interactions
    .filter((i: any) => i.type === 'quiz' || i.type === 'scenario')
    .map((int: any) => {
      const related = data.responses.filter((r: any) => r.interaction_id === int.id)
      const totalAnswers = related.length
      const correctAnswers = related.filter((r: any) => r.answer === int.options?.correct).length
      return {
        id: int.id,
        question: int.question,
        total: totalAnswers,
        percent: totalAnswers > 0 ? Math.round((correctAnswers / totalAnswers) * 100) : 0,
      }
    })

  return (
    <div className="space-y-8 pb-20 animate-fade-in-up max-w-5xl mx-auto">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-3 bg-indigo-100 text-indigo-700 rounded-lg">
          <ShieldAlert className="h-6 w-6" />
        </div>
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-800">
            Painel de Desempenho (Admin)
          </h1>
          <p className="text-muted-foreground">
            Visão agregada da performance da equipe multidisciplinar.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="shadow-sm border-indigo-100">
          <CardHeader className="pb-2 flex flex-row items-center justify-between space-y-0">
            <CardTitle className="text-sm font-medium text-indigo-900">
              Total de Profissionais
            </CardTitle>
            <Users className="h-4 w-4 text-indigo-600" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-indigo-700">{totalUsers}</div>
          </CardContent>
        </Card>
        <Card className="shadow-sm">
          <CardHeader className="pb-2 flex flex-row items-center justify-between space-y-0">
            <CardTitle className="text-sm font-medium">Interações Registradas</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{data.responses.length}</div>
          </CardContent>
        </Card>
        <Card className="shadow-sm">
          <CardHeader className="pb-2 flex flex-row items-center justify-between space-y-0">
            <CardTitle className="text-sm font-medium">Módulos Concluídos</CardTitle>
            <BookOpen className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">
              {data.progress.filter((p: any) => p.completed).length}
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="shadow-sm">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <BarChart3 className="h-5 w-5 text-primary" />
              Taxa de Conclusão por Módulo
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-5">
            {sectionProgress.map((sp: any) => (
              <div key={sp.order}>
                <div className="flex justify-between text-sm mb-1.5">
                  <span className="font-medium text-slate-700 truncate pr-4">
                    {sp.order}. {sp.title}
                  </span>
                  <span className="font-bold text-primary">{sp.percent}%</span>
                </div>
                <Progress value={sp.percent} className="h-2" />
              </div>
            ))}
          </CardContent>
        </Card>

        <Card className="shadow-sm">
          <CardHeader>
            <CardTitle className="text-lg">Taxa de Acerto (Simulações)</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {quizStats.length === 0 ? (
              <div className="text-muted-foreground text-sm">
                Sem dados de questões avaliativas.
              </div>
            ) : (
              quizStats.map((qs: any, i: number) => (
                <div key={qs.id} className="p-3 bg-muted/40 rounded-lg border">
                  <div className="text-xs text-muted-foreground mb-1 uppercase tracking-wider font-semibold">
                    Questão {i + 1} ({qs.total} respostas)
                  </div>
                  <div className="text-sm font-medium text-slate-800 leading-snug line-clamp-2 mb-2">
                    {qs.question}
                  </div>
                  <div className="flex items-center gap-3">
                    <Progress
                      value={qs.percent}
                      className="h-1.5 flex-1 bg-slate-200 [&>div]:bg-emerald-500"
                    />
                    <span className="text-xs font-bold text-emerald-600 w-10 text-right">
                      {qs.percent}%
                    </span>
                  </div>
                </div>
              ))
            )}
          </CardContent>
        </Card>
      </div>

      <Card className="shadow-sm">
        <CardHeader>
          <CardTitle className="text-lg">Progresso Individual da Equipe</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Profissional</TableHead>
                <TableHead>Email</TableHead>
                <TableHead className="w-[200px]">Progresso Geral</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data.users.map((u: any) => {
                const comp = data.progress.filter(
                  (p: any) => p.user_id === u.id && p.completed,
                ).length
                const perc =
                  data.sections.length > 0 ? Math.round((comp / data.sections.length) * 100) : 0
                return (
                  <TableRow key={u.id} className="hover:bg-muted/30">
                    <TableCell className="font-medium text-slate-800">
                      {u.name || 'Usuário Sem Nome'}
                    </TableCell>
                    <TableCell className="text-muted-foreground text-sm">{u.email}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <Progress value={perc} className="h-2 bg-slate-100" />
                        <span className="text-xs font-bold text-slate-600 w-10 text-right">
                          {perc}%
                        </span>
                      </div>
                    </TableCell>
                  </TableRow>
                )
              })}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}
