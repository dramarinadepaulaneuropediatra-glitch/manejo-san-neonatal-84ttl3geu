import { useEffect, useState } from 'react'
import pb from '@/lib/pocketbase/client'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { CheckCircle2, XCircle, BrainCircuit } from 'lucide-react'

export default function Gabarito() {
  const [data, setData] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function load() {
      try {
        const ints = await pb.collection('interactions').getFullList({
          filter: "type='quiz' || type='scenario'",
          sort: 'section_id.order,created',
        })
        const resps = await pb.collection('responses').getFullList({
          filter: `user_id='${pb.authStore.record?.id}'`,
        })

        const merged = ints.map((int) => {
          const r = resps.find((x) => x.interaction_id === int.id)
          return { interaction: int, response: r }
        })
        setData(merged)
      } catch (err) {
        console.error(err)
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [])

  if (loading) {
    return (
      <div className="flex justify-center py-20 text-muted-foreground animate-pulse">
        Carregando gabarito...
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-fade-in-up pb-20">
      <div className="text-center space-y-4 mb-10">
        <div className="mx-auto bg-primary/10 p-4 rounded-full w-fit mb-4">
          <BrainCircuit className="w-10 h-10 text-primary" />
        </div>
        <h1 className="text-3xl font-bold">Gabarito e Raciocínio Clínico</h1>
        <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
          Revise suas respostas e o racional baseado em evidências para cada simulação e questão do
          curso. O aprendizado contínuo fortalece a prática segura no CTI.
        </p>
      </div>

      <div className="space-y-6">
        {data.length === 0 ? (
          <div className="text-center p-8 bg-muted/30 rounded-xl border">
            Nenhuma questão avaliativa encontrada.
          </div>
        ) : (
          data.map((item, i) => {
            const opts = item.interaction.options || {}
            const userAnsId = item.response?.answer
            const correctAnsId = opts.correct
            const isCorrect = userAnsId === correctAnsId
            const userChoice = opts.choices?.find((c: any) => c.id === userAnsId)

            return (
              <Card
                key={item.interaction.id}
                className="overflow-hidden border-border/60 shadow-sm"
              >
                <CardHeader
                  className={`${
                    isCorrect ? 'bg-emerald-50/50' : 'bg-rose-50/50'
                  } border-b flex flex-row items-start gap-4 space-y-0 p-5`}
                >
                  <div className="mt-1 shrink-0">
                    {isCorrect ? (
                      <CheckCircle2 className="h-6 w-6 text-emerald-600" />
                    ) : (
                      <XCircle className="h-6 w-6 text-rose-500" />
                    )}
                  </div>
                  <div>
                    <div className="text-sm font-semibold text-muted-foreground mb-1 uppercase tracking-wider">
                      Questão {i + 1}
                    </div>
                    <CardTitle className="text-lg leading-relaxed text-foreground/90 font-medium">
                      {item.interaction.question}
                    </CardTitle>
                  </div>
                </CardHeader>
                <CardContent className="p-6 space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="p-4 rounded-lg bg-muted/30 border border-muted-foreground/10">
                      <p className="text-xs text-muted-foreground uppercase tracking-wider font-bold mb-2">
                        Sua Resposta
                      </p>
                      <p className="font-medium text-sm leading-snug">
                        {userChoice ? userChoice.text : 'Não respondido'}
                      </p>
                    </div>
                    <div className="p-4 rounded-lg bg-primary/5 border border-primary/20">
                      <p className="text-xs text-primary uppercase tracking-wider font-bold mb-2">
                        Resposta Correta
                      </p>
                      <p className="font-medium text-sm leading-snug">
                        {opts.choices?.find((c: any) => c.id === correctAnsId)?.text}
                      </p>
                    </div>
                  </div>

                  <div className="pt-6 border-t">
                    <h4 className="font-semibold text-sm mb-4 uppercase tracking-wide text-foreground/80">
                      Análise Detalhada
                    </h4>
                    <div className="space-y-4">
                      {opts.choices?.map((c: any) => {
                        const isCorrectChoice = c.id === correctAnsId
                        const feedbackText =
                          opts.feedback?.[c.id] || 'Sem justificativa cadastrada.'
                        return (
                          <div
                            key={c.id}
                            className="text-sm flex gap-3 p-3 rounded-md bg-secondary/20"
                          >
                            <span
                              className={`font-bold mt-0.5 ${
                                isCorrectChoice ? 'text-emerald-600' : 'text-muted-foreground'
                              }`}
                            >
                              {isCorrectChoice ? '✓' : '✗'}
                            </span>
                            <div>
                              <span className="font-semibold text-foreground/90 block mb-1">
                                {c.text}
                              </span>
                              <span className="text-muted-foreground leading-relaxed">
                                {feedbackText}
                              </span>
                            </div>
                          </div>
                        )
                      })}
                    </div>
                  </div>
                </CardContent>
              </Card>
            )
          })
        )}
      </div>
    </div>
  )
}
