import { useState, useEffect, useMemo } from 'react'
import { saveResponse, getMyResponse, getAllResponsesForInteraction } from '@/services/api'
import { useRealtime } from '@/hooks/use-realtime'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { CloudRain } from 'lucide-react'

export function WordCloud({
  interaction,
  onComplete,
}: {
  interaction: any
  onComplete: () => void
}) {
  const [word, setWord] = useState('')
  const [submitted, setSubmitted] = useState(false)
  const [responses, setResponses] = useState<any[]>([])

  const loadData = async () => {
    const all = await getAllResponsesForInteraction(interaction.id)
    setResponses(all)
    const my = await getMyResponse(interaction.id)
    if (my) {
      setSubmitted(true)
      onComplete()
    }
  }

  useEffect(() => {
    loadData()
  }, [interaction.id])

  useRealtime('responses', () => {
    loadData()
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!word.trim() || word.trim().split(' ').length > 2) return
    await saveResponse(interaction.id, word.trim().toLowerCase())
    setSubmitted(true)
    onComplete()
  }

  const wordsData = useMemo(() => {
    const counts: Record<string, number> = {}
    responses.forEach((r) => {
      const w = r.answer
      counts[w] = (counts[w] || 0) + 1
    })

    const maxCount = Math.max(...Object.values(counts), 1)

    return Object.entries(counts)
      .map(([text, count]) => {
        // Calculate font size based on relative frequency
        const minSize = 14
        const maxSize = 48
        const size = minSize + (count / maxCount) * (maxSize - minSize)

        // Random color from palette
        const colors = ['#0D9488', '#0F766E', '#64748B', '#3B82F6', '#8B5CF6', '#10B981']
        const color = colors[text.length % colors.length]

        return { text, count, size, color }
      })
      .sort(() => Math.random() - 0.5) // shuffle
  }, [responses])

  return (
    <div className="space-y-6 bg-card p-6 rounded-xl border shadow-sm text-center">
      <div className="flex justify-center mb-4">
        <div className="p-3 bg-primary/10 rounded-full text-primary">
          <CloudRain className="h-8 w-8" />
        </div>
      </div>
      <h3 className="font-semibold text-lg">{interaction.question}</h3>

      {!submitted ? (
        <form onSubmit={handleSubmit} className="flex gap-2 max-w-sm mx-auto">
          <Input
            value={word}
            onChange={(e) => setWord(e.target.value)}
            placeholder="Digite UMA palavra..."
            maxLength={20}
          />
          <Button type="submit" disabled={!word.trim() || word.trim().split(' ').length > 2}>
            Enviar
          </Button>
        </form>
      ) : null}

      <div className="mt-8 min-h-[200px] flex flex-wrap justify-center items-center gap-4 p-8 bg-muted/30 rounded-xl">
        {wordsData.length === 0 ? (
          <p className="text-muted-foreground italic">A nuvem está vazia. Seja o primeiro!</p>
        ) : (
          wordsData.map((w, i) => (
            <span
              key={i}
              className="inline-block transition-all duration-500 hover:scale-110 font-bold"
              style={{ fontSize: `${w.size}px`, color: w.color }}
              title={`${w.count} pessoas responderam isso`}
            >
              {w.text}
            </span>
          ))
        )}
      </div>
    </div>
  )
}
