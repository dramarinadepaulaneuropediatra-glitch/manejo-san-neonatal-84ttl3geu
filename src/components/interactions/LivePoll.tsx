import { useState, useEffect, useMemo } from 'react'
import { saveResponse, getMyResponse, getAllResponsesForInteraction } from '@/services/api'
import { useRealtime } from '@/hooks/use-realtime'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { BarChart3 } from 'lucide-react'
import { Bar, BarChart, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts'
import { ChartContainer, ChartTooltipContent } from '@/components/ui/chart'

export function LivePoll({
  interaction,
  onComplete,
}: {
  interaction: any
  onComplete: () => void
}) {
  const [selected, setSelected] = useState<string>('')
  const [submitted, setSubmitted] = useState(false)
  const [responses, setResponses] = useState<any[]>([])

  const opts = interaction.options

  const loadData = async () => {
    const all = await getAllResponsesForInteraction(interaction.id)
    setResponses(all)
    const my = await getMyResponse(interaction.id)
    if (my) {
      setSelected(my.answer)
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

  const handleSubmit = async () => {
    if (!selected) return
    await saveResponse(interaction.id, selected)
    setSubmitted(true)
    onComplete()
  }

  const chartData = useMemo(() => {
    const counts: Record<string, number> = {}
    opts.choices.forEach((c: any) => (counts[c.id] = 0))
    responses.forEach((r) => {
      if (counts[r.answer] !== undefined) counts[r.answer]++
    })
    return opts.choices.map((c: any) => ({
      name: c.text,
      shortName: c.text.split(' ')[0], // just for mobile x-axis
      votos: counts[c.id],
      fill: 'hsl(var(--primary))',
    }))
  }, [responses, opts.choices])

  const chartConfig = {
    votos: { label: 'Votos', color: 'hsl(var(--primary))' },
  }

  return (
    <div className="space-y-6 bg-card p-6 rounded-xl border shadow-sm">
      <div className="flex gap-3 items-center">
        <BarChart3 className="h-6 w-6 text-primary" />
        <h3 className="font-semibold text-lg">{interaction.question}</h3>
      </div>

      {!submitted ? (
        <div className="space-y-4">
          <RadioGroup value={selected} onValueChange={setSelected} className="space-y-3">
            {opts.choices.map((c: any) => (
              <div
                key={c.id}
                className="flex items-center space-x-3 border p-4 rounded-lg hover:bg-muted/50 transition-colors cursor-pointer"
              >
                <RadioGroupItem value={c.id} id={c.id} />
                <Label htmlFor={c.id} className="flex-1 cursor-pointer font-normal text-base">
                  {c.text}
                </Label>
              </div>
            ))}
          </RadioGroup>
          <Button onClick={handleSubmit} disabled={!selected}>
            Votar
          </Button>
        </div>
      ) : (
        <div className="space-y-6 animate-fade-in">
          <p className="text-sm font-medium text-muted-foreground text-center">
            Resultados em tempo real ({responses.length} votos)
          </p>
          <div className="h-[250px] w-full">
            <ChartContainer config={chartConfig} className="h-full w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <XAxis dataKey="shortName" tickLine={false} axisLine={false} fontSize={12} />
                  <YAxis tickLine={false} axisLine={false} allowDecimals={false} fontSize={12} />
                  <Tooltip cursor={{ fill: 'var(--muted)' }} content={<ChartTooltipContent />} />
                  <Bar dataKey="votos" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </ChartContainer>
          </div>
        </div>
      )}
    </div>
  )
}
