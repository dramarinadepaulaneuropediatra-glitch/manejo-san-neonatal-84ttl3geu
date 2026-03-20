import { useState, useEffect } from 'react'
import { saveResponse, getMyResponse } from '@/services/api'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Lightbulb } from 'lucide-react'
import { useToast } from '@/hooks/use-toast'

export function CriticalThinking({
  interaction,
  onComplete,
}: {
  interaction: any
  onComplete: () => void
}) {
  const [text, setText] = useState('')
  const [submitted, setSubmitted] = useState(false)
  const { toast } = useToast()

  useEffect(() => {
    getMyResponse(interaction.id).then((res) => {
      if (res) {
        setText(res.answer)
        setSubmitted(true)
        onComplete()
      }
    })
  }, [interaction.id])

  const handleSubmit = async () => {
    if (text.length < 10) {
      toast({
        description: 'Por favor, elabore um pouco mais sua resposta.',
        variant: 'destructive',
      })
      return
    }
    await saveResponse(interaction.id, text)
    setSubmitted(true)
    toast({ title: 'Reflexão salva!', description: 'Sua análise foi registrada no seu perfil.' })
    onComplete()
  }

  return (
    <div className="space-y-4 bg-amber-50/50 p-6 rounded-xl border border-amber-100">
      <div className="flex gap-3 items-center text-amber-800">
        <Lightbulb className="h-6 w-6" />
        <h3 className="font-semibold text-lg">Pense Crítico</h3>
      </div>
      <p className="font-medium text-foreground">{interaction.question}</p>

      <Textarea
        placeholder="Desenvolva seu raciocínio aqui..."
        value={text}
        onChange={(e) => setText(e.target.value)}
        className="bg-white min-h-[120px]"
        readOnly={submitted}
      />

      {!submitted ? (
        <Button onClick={handleSubmit} className="bg-amber-600 hover:bg-amber-700 text-white">
          Salvar Reflexão
        </Button>
      ) : (
        <p className="text-sm text-amber-700 italic">Resposta registrada. Você pode avançar.</p>
      )}
    </div>
  )
}
