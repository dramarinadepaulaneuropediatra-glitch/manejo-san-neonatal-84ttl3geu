import { useState, useEffect } from 'react'
import { saveResponse, getMyResponse } from '@/services/api'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { Label } from '@/components/ui/label'
import { Activity } from 'lucide-react'

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
  }, [interaction.id])

  const toggleSymptom = (id: string) => {
    if (submitted) return
    setSelected((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]))
  }

  const handleSubmit = async () => {
    await saveResponse(interaction.id, selected)
    setSubmitted(true)
    onComplete()
  }

  return (
    <div className="space-y-6 bg-slate-50 p-6 rounded-xl border">
      <div className="flex gap-3 items-center text-slate-800">
        <Activity className="h-6 w-6" />
        <h3 className="font-semibold text-lg">Simulação de Caso Clínico</h3>
      </div>
      <div className="bg-white p-4 rounded-lg border text-sm leading-relaxed border-l-4 border-l-primary">
        <p className="font-medium text-muted-foreground mb-1">Cenário:</p>
        {interaction.question}
      </div>

      <div className="space-y-3 mt-4">
        <p className="font-semibold text-sm">Selecione os critérios ESC aplicáveis:</p>
        {opts.symptoms.map((s: any) => (
          <div
            key={s.id}
            className="flex items-center space-x-3 p-2 hover:bg-slate-100 rounded-md transition-colors"
          >
            <Checkbox
              id={s.id}
              checked={selected.includes(s.id)}
              onCheckedChange={() => toggleSymptom(s.id)}
              disabled={submitted}
            />
            <Label
              htmlFor={s.id}
              className="cursor-pointer flex-1 font-normal text-base leading-snug"
            >
              {s.text}
            </Label>
          </div>
        ))}
      </div>

      {!submitted ? (
        <Button onClick={handleSubmit} disabled={selected.length === 0}>
          Finalizar Avaliação
        </Button>
      ) : (
        <div className="bg-emerald-50 text-emerald-800 p-4 rounded-lg text-sm border border-emerald-200">
          <strong>Avaliação concluída!</strong> O uso da escala ESC foca no conforto funcional do RN
          ao invés da mera contagem de sintomas como no Finnegan.
        </div>
      )}
    </div>
  )
}
