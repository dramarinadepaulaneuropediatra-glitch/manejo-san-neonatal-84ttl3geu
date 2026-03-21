import { useState, useEffect } from 'react'
import { saveResponse, getMyResponse } from '@/services/api'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { Label } from '@/components/ui/label'
import { Activity, CheckCircle2, GraduationCap } from 'lucide-react'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'

export function CaseStudy({
  interaction,
  onComplete,
}: {
  interaction: any
  onComplete: () => void
}) {
  const [selected, setSelected] = useState<string[]>([])
  const [submitted, setSubmitted] = useState(false)

  const opts = interaction.options

  useEffect(() => {
    getMyResponse(interaction.id).then((res) => {
      if (res) {
        setSelected(res.answer)
        setSubmitted(true)
        onComplete()
      }
    })
  }, [interaction.id, onComplete])

  const toggleSymptom = (id: string) => {
    if (submitted) return
    setSelected((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]))
  }

  const handleSubmit = async () => {
    setSubmitted(true)
    await saveResponse(interaction.id, selected)
    onComplete()
  }

  return (
    <div className="space-y-6 bg-slate-50 p-6 rounded-xl border w-full">
      <div className="flex gap-3 items-center text-slate-800">
        <Activity className="h-6 w-6 text-primary" />
        <h3 className="font-semibold text-lg">Simulação de Raciocínio Clínico</h3>
      </div>
      <div className="bg-white p-5 rounded-lg border text-sm leading-relaxed border-l-4 border-l-primary shadow-sm">
        <p className="font-semibold text-muted-foreground mb-2 uppercase tracking-wide text-xs">
          Cenário Clínico:
        </p>
        <p className="text-base text-foreground/90">{interaction.question}</p>
      </div>

      <div className="space-y-3 mt-6">
        <p className="font-semibold text-sm text-slate-700">
          Selecione os sintomas / disfunções aplicáveis:
        </p>
        <div className="grid gap-2">
          {opts.symptoms?.map((s: any) => (
            <div
              key={s.id}
              className={`flex items-center space-x-3 p-3 rounded-md transition-colors border ${
                selected.includes(s.id)
                  ? 'border-primary/50 bg-primary/5'
                  : 'border-transparent hover:bg-slate-100'
              }`}
            >
              <Checkbox
                id={s.id}
                checked={selected.includes(s.id)}
                onCheckedChange={() => toggleSymptom(s.id)}
                disabled={submitted}
              />
              <Label
                htmlFor={s.id}
                className="cursor-pointer flex-1 font-medium text-[15px] leading-snug"
              >
                {s.text}
              </Label>
            </div>
          ))}
        </div>
      </div>

      {!submitted ? (
        <Button onClick={handleSubmit} disabled={selected.length === 0} size="lg">
          Finalizar Avaliação
        </Button>
      ) : (
        <Alert className="bg-indigo-50/80 text-indigo-900 border-indigo-200 mt-6 animate-fade-in-up">
          <GraduationCap className="h-5 w-5 text-indigo-600" />
          <AlertTitle className="text-base font-bold">
            Avaliação Concluída! Feedback Pedagógico:
          </AlertTitle>
          <AlertDescription className="text-sm mt-2 leading-relaxed font-medium">
            {opts.feedback ||
              'Avaliação de sintomas registrada com sucesso. A precisão na avaliação é chave para o manejo adequado.'}
          </AlertDescription>
        </Alert>
      )}
    </div>
  )
}
