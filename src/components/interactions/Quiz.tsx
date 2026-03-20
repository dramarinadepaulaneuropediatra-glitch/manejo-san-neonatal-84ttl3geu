import { useState, useEffect } from 'react'
import { saveResponse, getMyResponse } from '@/services/api'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { CheckCircle2, XCircle, HelpCircle } from 'lucide-react'

export function Quiz({ interaction, onComplete }: { interaction: any; onComplete: () => void }) {
  const [selected, setSelected] = useState<string>('')
  const [submitted, setSubmitted] = useState(false)
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null)

  const opts = interaction.options

  useEffect(() => {
    getMyResponse(interaction.id).then((res) => {
      if (res) {
        setSelected(res.answer)
        setSubmitted(true)
        setIsCorrect(res.answer === opts.correct)
        onComplete()
      }
    })
  }, [interaction.id])

  const handleSubmit = async () => {
    if (!selected) return
    const correct = selected === opts.correct
    setIsCorrect(correct)
    setSubmitted(true)
    await saveResponse(interaction.id, selected)
    onComplete()
  }

  return (
    <div className="space-y-6 bg-card p-6 rounded-xl border shadow-sm">
      <div className="flex gap-3 items-start">
        <HelpCircle className="h-6 w-6 text-primary shrink-0 mt-0.5" />
        <h3 className="font-semibold text-lg">{interaction.question}</h3>
      </div>

      <RadioGroup
        value={selected}
        onValueChange={setSelected}
        disabled={submitted}
        className="space-y-3"
      >
        {opts.choices.map((c: any) => (
          <div
            key={c.id}
            className={`flex items-center space-x-3 border p-4 rounded-lg transition-colors ${selected === c.id ? 'border-primary bg-primary/5' : 'hover:bg-muted/50'}`}
          >
            <RadioGroupItem value={c.id} id={c.id} />
            <Label htmlFor={c.id} className="flex-1 cursor-pointer font-normal text-base">
              {c.text}
            </Label>
          </div>
        ))}
      </RadioGroup>

      {!submitted ? (
        <Button onClick={handleSubmit} disabled={!selected}>
          Verificar Resposta
        </Button>
      ) : (
        <Alert
          variant={isCorrect ? 'default' : 'destructive'}
          className={isCorrect ? 'bg-emerald-50 border-emerald-200' : ''}
        >
          {isCorrect ? (
            <CheckCircle2 className="h-4 w-4 text-emerald-600" />
          ) : (
            <XCircle className="h-4 w-4" />
          )}
          <AlertTitle className={isCorrect ? 'text-emerald-800' : ''}>
            {isCorrect ? 'Correto!' : 'Incorreto'}
          </AlertTitle>
          <AlertDescription className={isCorrect ? 'text-emerald-700' : ''}>
            {isCorrect ? opts.feedback.correct : opts.feedback.incorrect}
          </AlertDescription>
        </Alert>
      )}
    </div>
  )
}
