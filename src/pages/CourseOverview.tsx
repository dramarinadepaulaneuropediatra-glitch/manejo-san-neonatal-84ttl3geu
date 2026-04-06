import { Link, useOutletContext } from 'react-router-dom'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Brain, HeartPulse, Stethoscope, Pill, Baby, Award } from 'lucide-react'

export default function CourseOverview() {
  const { sections, progressIds } = useOutletContext<{ sections: any[]; progressIds: string[] }>()

  const nextSection = sections?.find((s) => !progressIds?.includes(s.id))
  const nextOrder = nextSection ? nextSection.order : 1
  const isCompleted = sections?.length > 0 && progressIds?.length === sections.length

  const buttonText =
    progressIds?.length === 0
      ? 'Iniciar Curso'
      : isCompleted
        ? 'Revisar Curso (Gabarito)'
        : `Continuar Curso (Módulo ${nextOrder})`

  const targetLink = isCompleted ? '/course/gabarito' : `/course/${nextOrder}`

  return (
    <div className="space-y-8 pb-10">
      <div className="bg-primary/5 rounded-2xl p-8 border border-primary/10 text-center space-y-4">
        <h1 className="text-3xl md:text-4xl font-bold text-primary tracking-tight">
          Síndrome de Abstinência Neonatal (SAN)
        </h1>
        <p className="text-xl text-muted-foreground font-medium max-w-2xl mx-auto">
          Manejo Baseado em Evidências no CTI Neonatal
        </p>
        <div className="pt-6 flex flex-col sm:flex-row items-center justify-center gap-4">
          <Button
            asChild
            size="lg"
            className="rounded-full px-8 text-lg h-12 shadow-md hover:scale-105 transition-transform"
          >
            <Link to={targetLink}>{buttonText}</Link>
          </Button>

          {isCompleted && (
            <Button
              asChild
              size="lg"
              variant="outline"
              className="rounded-full px-8 text-lg h-12 shadow-sm hover:scale-105 transition-transform border-primary/20 text-primary hover:bg-primary/5"
            >
              <Link to="/course/certificate">
                <Award className="mr-2 h-5 w-5" />
                Emitir Certificado
              </Link>
            </Button>
          )}
        </div>
      </div>

      <div className="space-y-4">
        <h2 className="text-2xl font-semibold">Objetivos de Aprendizagem</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <ObjectiveCard
            icon={<Brain className="h-6 w-6 text-blue-500" />}
            title="Compreender a Fisiopatologia"
            desc="Entender os mecanismos neurológicos e sistêmicos por trás da SAN."
          />
          <ObjectiveCard
            icon={<Stethoscope className="h-6 w-6 text-emerald-500" />}
            title="Avaliação Clínica Precisa"
            desc="Aplicar corretamente as escalas de Finnegan e ESC para tomada de decisão."
          />
          <ObjectiveCard
            icon={<HeartPulse className="h-6 w-6 text-rose-500" />}
            title="Manejo Não Farmacológico"
            desc="Implementar técnicas de conforto, redução de estímulos e dieta otimizada."
          />
          <ObjectiveCard
            icon={<Pill className="h-6 w-6 text-amber-500" />}
            title="Farmacoterapia Segura"
            desc="Dominar as indicações, doses e desmame de opióides e adjuvantes."
          />
        </div>
      </div>

      <div className="bg-muted p-6 rounded-xl flex items-center gap-4">
        <Baby className="h-10 w-10 text-muted-foreground shrink-0" />
        <div>
          <h3 className="font-semibold">Público Alvo</h3>
          <p className="text-sm text-muted-foreground">
            Desenhado para médicos residentes, pediatras, neonatologistas e equipe de enfermagem
            atuante em Unidades de Terapia Intensiva Neonatal.
          </p>
        </div>
      </div>
    </div>
  )
}

function ObjectiveCard({
  icon,
  title,
  desc,
}: {
  icon: React.ReactNode
  title: string
  desc: string
}) {
  return (
    <Card className="border-none shadow-subtle hover:shadow-md transition-shadow">
      <CardContent className="p-6 flex gap-4 items-start">
        <div className="p-2 bg-background rounded-lg shadow-sm shrink-0">{icon}</div>
        <div>
          <h4 className="font-semibold mb-1">{title}</h4>
          <p className="text-sm text-muted-foreground leading-relaxed">{desc}</p>
        </div>
      </CardContent>
    </Card>
  )
}
