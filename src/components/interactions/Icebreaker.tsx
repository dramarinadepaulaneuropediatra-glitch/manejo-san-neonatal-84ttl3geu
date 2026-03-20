import { useState, useEffect } from 'react'
import { saveResponse, getMyResponse, getAllResponsesForInteraction } from '@/services/api'
import { useRealtime } from '@/hooks/use-realtime'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent } from '@/components/ui/card'
import { MessageCircle } from 'lucide-react'
import { useToast } from '@/hooks/use-toast'

export function Icebreaker({ interaction }: { interaction: any }) {
  const [text, setText] = useState('')
  const [hasSubmitted, setHasSubmitted] = useState(false)
  const [responses, setResponses] = useState<any[]>([])
  const { toast } = useToast()

  const loadResponses = async () => {
    const all = await getAllResponsesForInteraction(interaction.id)
    setResponses(all)
    const my = await getMyResponse(interaction.id)
    if (my) {
      setHasSubmitted(true)
      setText(my.answer)
    }
  }

  useEffect(() => {
    loadResponses()
  }, [interaction.id])

  useRealtime('responses', () => {
    loadResponses()
  })

  const handleSubmit = async () => {
    if (!text.trim()) return
    try {
      await saveResponse(interaction.id, text)
      setHasSubmitted(true)
      toast({ title: 'Resposta enviada!', description: 'Obrigado por compartilhar.' })
    } catch (e) {
      toast({ title: 'Erro', variant: 'destructive' })
    }
  }

  return (
    <div className="space-y-6 bg-blue-50/50 p-6 rounded-xl border border-blue-100">
      <div className="flex gap-3 items-center text-blue-800">
        <MessageCircle className="h-5 w-5" />
        <h3 className="font-semibold text-lg">{interaction.question}</h3>
      </div>

      {!hasSubmitted ? (
        <div className="space-y-3">
          <Textarea
            placeholder="Digite sua resposta aqui..."
            value={text}
            onChange={(e) => setText(e.target.value)}
            className="bg-white min-h-[100px]"
          />
          <Button onClick={handleSubmit}>Compartilhar</Button>
        </div>
      ) : (
        <div className="space-y-4">
          <p className="text-sm font-medium text-emerald-600 bg-emerald-50 p-3 rounded-md">
            ✅ Sua resposta foi registrada. Veja o que outros colegas disseram:
          </p>
          <div className="space-y-3 max-h-[300px] overflow-y-auto pr-2">
            {responses.map((r, i) => (
              <Card key={r.id} className="animate-fade-in border-none shadow-sm">
                <CardContent className="p-4 flex gap-3">
                  <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold shrink-0">
                    {r.expand?.user_id?.name?.charAt(0) || 'U'}
                  </div>
                  <p className="text-sm text-foreground/90 mt-1">{r.answer}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
