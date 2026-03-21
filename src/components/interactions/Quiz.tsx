import { useState, useEffect } from 'react'
import { saveResponse, getMyResponse } from '@/services/api'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { CheckCircle2, XCircle, HelpCircle, GraduationCap } from 'lucide-react'

export function Quiz({ interaction, onComplete }: { interaction: any; onComplete: () => void }) {
  const [selected, setSelected] = useState<string>('')
  const [submitted, setSubmitted] = useState(false)

  const opts = interaction.options

  useEffect(() => {
    setSelected('')
    setSubmitted(false)
    getMyResponse(interaction.id).then((res) => {
      if (res) {
        setSelected(res.answer)
        setSubmitted(true)
        onComplete()
      }
    })
  }, [interaction.id, onComplete])

  const handleSubmit = async () => {
    if (!selected) return
    setSubmitted(true)
    await saveResponse(interaction.id, selected)
    onComplete()
  }

  const isCorrect = selected === opts.correct

  return (
    <div className="space-y-6 bg-card p-6 rounded-xl border shadow-sm w-full">
      <div className="flex gap-3 items-start">
        <HelpCircle className="h-6 w-6 text-primary shrink-0 mt-0.5" />
        <h3 className="font-semibold text-lg leading-snug">{interaction.question}</h3>
      </div>

      <RadioGroup
        value={selected}
        onValueChange={setSelected}
        disabled={submitted}
        className="space-y-3"
      >
        {opts.choices.map((c: any) => {
          const isSelected = selected === c.id
          const isCorrectChoice = c.id === opts.correct

          let ringClass = ''
          if (submitted) {
            if (isCorrectChoice) ringClass = 'border-emerald-500 bg-emerald-50/50'
            else if (isSelected) ringClass = 'border-rose-500 bg-rose-50/50'
            else ringClass = 'opacity-60 bg-muted/20 border-border'
          } else if (isSelected) {
            ringClass = 'border-primary bg-primary/5'
          } else {
            ringClass = 'hover:bg-muted/50 border-border'
          }

          return (
            <div
              key={c.id}
              className={`flex items-center space-x-3 border p-4 rounded-lg transition-colors ${ringClass}`}
            >
              <RadioGroupItem value={c.id} id={c.id} />
              <Label
                htmlFor={c.id}
                className="flex-1 cursor-pointer font-medium text-[15px] leading-snug text-foreground/90"
              >
                {c.text}
              </Label>
              {submitted && isCorrectChoice && (
                <CheckCircle2 className="h-5 w-5 text-emerald-500 shrink-0" />
              )}
              {submitted && isSelected && !isCorrectChoice && (
                <XCircle className="h-5 w-5 text-rose-500 shrink-0" />
              )}
            </div>
          )
        })}
      </RadioGroup>

      {!submitted ? (
        <Button onClick={handleSubmit} disabled={!selected} size="lg" className="w-full sm:w-auto">
          Confirmar Resposta
        </Button>
      ) : (
        <div className="space-y-4 animate-fade-in-up mt-8 border-t pt-6">
          <div className="flex items-center gap-3 mb-4">
            <GraduationCap className="h-6 w-6 text-indigo-600" />
            <h4 className="font-bold text-lg text-indigo-900">Feedback Pedagógico</h4>
            {isCorrect ? (
              <span className="px-3 py-1 bg-emerald-100 text-emerald-800 text-xs rounded-full font-bold uppercase tracking-wider ml-auto">
                Acerto
              </span>
            ) : (
              <span className="px-3 py-1 bg-rose-100 text-rose-800 text-xs rounded-full font-bold uppercase tracking-wider ml-auto">
                Revisar
              </span>
            )}
          </div>

          <div className="space-y-3">
            {opts.choices.map((c: any) => {
              const choiceCorrect = c.id === opts.correct
              const choiceSelected = c.id === selected

              if (!opts.feedback?.[c.id]) return null

              return (
                <div
                  key={c.id}
                  className={`p-4 rounded-lg border text-sm leading-relaxed ${
                    choiceCorrect
                      ? 'bg-emerald-50/50 border-emerald-200'
                      : choiceSelected
                        ? 'bg-rose-50/50 border-rose-200'
                        : 'bg-muted/20 border-muted'
                  }`}
                >
                  <div className="flex gap-3">
                    <span
                      className={`font-bold mt-0.5 ${
                        choiceCorrect ? 'text-emerald-600' : 'text-muted-foreground'
                      }`}
                    >
                      {choiceCorrect ? '✓' : '✗'}
                    </span>
                    <div>
                      <span className="font-semibold block mb-1 text-foreground/90">{c.text}</span>
                      <span
                        className={
                          choiceCorrect
                            ? 'text-emerald-800'
                            : choiceSelected
                              ? 'text-rose-800'
                              : 'text-muted-foreground'
                        }
                      >
                        {opts.feedback[c.id]}
                      </span>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      )}
    </div>
  )
}
