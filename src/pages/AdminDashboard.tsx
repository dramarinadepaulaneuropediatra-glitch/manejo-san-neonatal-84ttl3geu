import { useEffect, useState } from 'react'
import pb from '@/lib/pocketbase/client'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Users, BookOpen, Activity, BarChart3, ShieldAlert, FileText } from 'lucide-react'
import { Progress } from '@/components/ui/progress'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
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
        const [users, sections, progress, interactions, responses, whitelist] = await Promise.all([
          pb.collection('users').getFullList({ sort: '-created' }),
          pb.collection('sections').getFullList({ sort: 'order' }),
          pb.collection('progress').getFullList(),
          pb
            .collection('interactions')
            .getFullList({ filter: "type='quiz' || type='scenario' || type='case_study'" }),
          pb.collection('responses').getFullList(),
          pb.collection('masp_whitelist').getFullList({ sort: 'masp' }),
        ])

        setData({ users, sections, progress, interactions, responses, whitelist })
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

  const totalUsers = data.whitelist.length

  const courseCompletedUsersCount = data.whitelist.filter((w: any) => {
    const u = data.users.find((user: any) => user.masp === w.masp)
    if (!u) return false
    const completedCount = data.progress.filter(
      (p: any) => p.user_id === u.id && p.completed,
    ).length
    return completedCount === data.sections.length && data.sections.length > 0
  }).length

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
    <div className="space-y-8 pb-20 animate-fade-in-up max-w-6xl mx-auto">
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

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
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
        <Card className="shadow-sm border-emerald-100">
          <CardHeader className="pb-2 flex flex-row items-center justify-between space-y-0">
            <CardTitle className="text-sm font-medium text-emerald-900">
              Cursos Concluídos
            </CardTitle>
            <BookOpen className="h-4 w-4 text-emerald-600" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-emerald-700">{courseCompletedUsersCount}</div>
            <p className="text-xs text-emerald-600/80 mt-1">Profissionais que finalizaram 100%</p>
          </CardContent>
        </Card>
        <Card className="shadow-sm">
          <CardHeader className="pb-2 flex flex-row items-center justify-between space-y-0">
            <CardTitle className="text-sm font-medium">Módulos Finalizados</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">
              {data.progress.filter((p: any) => p.completed).length}
            </div>
          </CardContent>
        </Card>
        <Card className="shadow-sm">
          <CardHeader className="pb-2 flex flex-row items-center justify-between space-y-0">
            <CardTitle className="text-sm font-medium">Interações Clínicas</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{data.responses.length}</div>
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
          <CardContent className="space-y-4 max-h-[300px] overflow-y-auto custom-scrollbar pr-2">
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
                <TableHead className="w-[130px]">Status</TableHead>
                <TableHead className="w-[150px]">Progresso Geral</TableHead>
                <TableHead>Módulos Concluídos</TableHead>
                <TableHead className="text-right">Avaliações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data.whitelist.map((w: any) => {
                const u = data.users.find((user: any) => user.masp === w.masp)

                const userProgress = u
                  ? data.progress.filter((p: any) => p.user_id === u.id && p.completed)
                  : []
                const comp = userProgress.length
                const perc =
                  data.sections.length > 0 ? Math.round((comp / data.sections.length) * 100) : 0

                let status = 'Não Registrado'
                let statusColor = 'text-slate-500 bg-slate-100'
                if (u) {
                  status = 'Não Iniciado'
                  if (comp === data.sections.length && data.sections.length > 0) {
                    status = 'Concluído'
                    statusColor = 'text-emerald-700 bg-emerald-100'
                  } else if (comp > 0) {
                    status = 'Em Andamento'
                    statusColor = 'text-amber-700 bg-amber-100'
                  }
                }

                const userResponses = u ? data.responses.filter((r: any) => r.user_id === u.id) : []
                const userQuizResponses = userResponses.filter((r: any) =>
                  data.interactions.some(
                    (i: any) =>
                      (i.type === 'quiz' || i.type === 'scenario') && i.id === r.interaction_id,
                  ),
                )
                const totalQuizAnswers = userQuizResponses.length
                const correctQuizAnswers = userQuizResponses.filter((r: any) => {
                  const interaction = data.interactions.find((i: any) => i.id === r.interaction_id)
                  return interaction && interaction.options?.correct === r.answer
                }).length

                return (
                  <TableRow key={w.id} className="hover:bg-muted/30">
                    <TableCell className="font-medium text-slate-800">
                      {u ? u.name || 'Usuário Sem Nome' : '---'}
                    </TableCell>
                    <TableCell className="text-muted-foreground text-sm">
                      {u ? u.email : '---'}
                      <div className="text-xs text-slate-400 mt-0.5">MASP: {w.masp}</div>
                    </TableCell>
                    <TableCell>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusColor}`}>
                        {status}
                      </span>
                    </TableCell>
                    <TableCell>
                      {u ? (
                        <div className="flex flex-col gap-1">
                          <div className="flex items-center justify-between text-xs font-bold text-slate-600">
                            <span>{perc}%</span>
                          </div>
                          <Progress value={perc} className="h-2 bg-slate-100" />
                        </div>
                      ) : (
                        <div className="text-xs text-slate-400">---</div>
                      )}
                    </TableCell>
                    <TableCell>
                      {u ? (
                        <div className="flex flex-wrap gap-1">
                          {data.sections.map((sec: any) => {
                            const isCompleted = userProgress.some(
                              (p: any) => p.section_id === sec.id,
                            )
                            return (
                              <Badge
                                key={sec.id}
                                variant={isCompleted ? 'default' : 'outline'}
                                className={
                                  isCompleted
                                    ? 'bg-emerald-100 text-emerald-800 hover:bg-emerald-200 border-transparent text-[10px] px-1.5'
                                    : 'text-muted-foreground/50 border-muted text-[10px] px-1.5'
                                }
                              >
                                M{sec.order}
                              </Badge>
                            )
                          })}
                        </div>
                      ) : (
                        <div className="text-xs text-slate-400">---</div>
                      )}
                    </TableCell>
                    <TableCell className="text-right">
                      {u ? (
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button variant="outline" size="sm" className="h-8">
                              Ver Respostas
                              <span className="ml-2 inline-flex items-center justify-center px-1.5 py-0.5 rounded-full bg-slate-100 text-[10px] font-bold">
                                <span className="text-emerald-600">{correctQuizAnswers}</span>
                                <span className="mx-0.5 text-slate-400">/</span>
                                <span className="text-slate-600">{totalQuizAnswers}</span>
                              </span>
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto custom-scrollbar">
                            <DialogHeader>
                              <DialogTitle className="text-xl">
                                Respostas do Profissional
                              </DialogTitle>
                              <div className="text-sm text-muted-foreground mt-1">
                                <strong>Nome:</strong> {u.name || 'Sem Nome'} <br />
                                <strong>Email:</strong> {u.email} <br />
                                <strong>MASP:</strong> {w.masp}
                              </div>
                            </DialogHeader>
                            <div className="space-y-4 mt-4">
                              {userResponses.length === 0 ? (
                                <p className="text-center p-6 bg-muted/30 rounded-lg text-muted-foreground">
                                  Este profissional ainda não respondeu a nenhuma interação.
                                </p>
                              ) : (
                                data.interactions.map((int: any, idx: number) => {
                                  const response = userResponses.find(
                                    (r: any) => r.interaction_id === int.id,
                                  )
                                  if (!response) return null

                                  const isQuiz = int.type === 'quiz' || int.type === 'scenario'
                                  const isCorrect =
                                    isQuiz && response.answer === int.options?.correct

                                  let displayAnswer = response.answer
                                  if (isQuiz && typeof response.answer === 'string') {
                                    displayAnswer =
                                      int.options?.choices?.find(
                                        (c: any) => c.id === response.answer,
                                      )?.text || response.answer
                                  }

                                  return (
                                    <div key={int.id} className="p-4 bg-muted/20 border rounded-lg">
                                      <div className="text-xs uppercase tracking-wider font-semibold text-muted-foreground mb-2 flex justify-between items-center">
                                        <span>
                                          Interação {idx + 1} - {int.type}
                                        </span>
                                        {isQuiz && (
                                          <Badge
                                            variant={isCorrect ? 'default' : 'destructive'}
                                            className={isCorrect ? 'bg-emerald-500' : ''}
                                          >
                                            {isCorrect ? 'Correto' : 'Incorreto'}
                                          </Badge>
                                        )}
                                      </div>
                                      <p className="font-medium text-sm mb-3 text-slate-800">
                                        {int.question}
                                      </p>
                                      <div className="p-3 bg-white rounded-md border text-sm text-slate-700">
                                        <span className="font-semibold block mb-1 text-xs text-slate-500">
                                          Resposta:
                                        </span>
                                        {Array.isArray(displayAnswer)
                                          ? displayAnswer.join(', ')
                                          : displayAnswer}
                                      </div>
                                      {isQuiz && !isCorrect && int.options?.correct && (
                                        <div className="p-3 bg-emerald-50 rounded-md border border-emerald-100 text-sm mt-2">
                                          <span className="font-semibold block mb-1 text-xs text-emerald-700">
                                            Resposta Esperada:
                                          </span>
                                          <span className="text-emerald-800">
                                            {
                                              int.options.choices?.find(
                                                (c: any) => c.id === int.options.correct,
                                              )?.text
                                            }
                                          </span>
                                        </div>
                                      )}
                                    </div>
                                  )
                                })
                              )}
                            </div>
                          </DialogContent>
                        </Dialog>
                      ) : (
                        <Button variant="ghost" size="sm" className="h-8" disabled>
                          Sem Respostas
                        </Button>
                      )}
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
