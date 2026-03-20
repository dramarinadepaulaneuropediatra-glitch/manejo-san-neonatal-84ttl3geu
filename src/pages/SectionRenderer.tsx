import { useEffect, useState } from 'react'
import { useParams, useNavigate, useOutletContext } from 'react-router-dom'
import { getInteractionsBySection, markSectionComplete } from '@/services/api'
import { Button } from '@/components/ui/button'
import { ChevronRight, ChevronLeft } from 'lucide-react'
import { Icebreaker } from '@/components/interactions/Icebreaker'
import { Quiz } from '@/components/interactions/Quiz'
import { CriticalThinking } from '@/components/interactions/CriticalThinking'
import { CaseStudy } from '@/components/interactions/CaseStudy'
import { LivePoll } from '@/components/interactions/LivePoll'
import { WordCloud } from '@/components/interactions/WordCloud'
import { MedTable } from '@/components/interactions/MedTable'
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel'
import { Card, CardContent } from '@/components/ui/card'

export default function SectionRenderer() {
  const { id } = useParams()
  const order = parseInt(id || '1', 10)
  const navigate = useNavigate()
  const { sections } = useOutletContext<{ sections: any[] }>()

  const [interactions, setInteractions] = useState<any[]>([])
  const [canProceed, setCanProceed] = useState(false)

  const section = sections.find((s) => s.order === order)
  const prevSection = sections.find((s) => s.order === order - 1)
  const nextSection = sections.find((s) => s.order === order + 1)

  useEffect(() => {
    if (section) {
      getInteractionsBySection(section.id).then((ints) => {
        setInteractions(ints)
        // If no interactions, or all are non-blocking, they can proceed.
        // For simplicity, we require the interaction to call `onComplete` to unlock.
        if (ints.length === 0) setCanProceed(true)
        else setCanProceed(false) // Wait for interaction completion
      })
    }
  }, [section])

  const handleNext = async () => {
    if (section) await markSectionComplete(section.id)
    if (nextSection) navigate(`/course/${nextSection.order}`)
    else navigate('/course') // Back to overview if done
  }

  if (!section) return <div className="p-8 text-center animate-pulse">Carregando conteúdo...</div>

  return (
    <div className="space-y-10 pb-24" key={section.id}>
      <div className="border-b pb-4">
        <p className="text-sm font-semibold text-primary mb-1">MÓDULO {section.order}</p>
        <h1 className="text-3xl font-bold tracking-tight">{section.title}</h1>
      </div>

      <div className="prose prose-slate max-w-none text-foreground/90">
        {renderStaticContent(section.order)}
      </div>

      {interactions.map((int) => (
        <div key={int.id} className="mt-8">
          {int.type === 'icebreaker' && <Icebreaker interaction={int} />}
          {int.type === 'quiz' && <Quiz interaction={int} onComplete={() => setCanProceed(true)} />}
          {int.type === 'text' && (
            <CriticalThinking interaction={int} onComplete={() => setCanProceed(true)} />
          )}
          {int.type === 'case_study' && (
            <CaseStudy interaction={int} onComplete={() => setCanProceed(true)} />
          )}
          {int.type === 'poll' && (
            <LivePoll interaction={int} onComplete={() => setCanProceed(true)} />
          )}
          {int.type === 'scenario' && (
            <Quiz interaction={int} onComplete={() => setCanProceed(true)} />
          )}
          {int.type === 'wordcloud' && (
            <WordCloud interaction={int} onComplete={() => setCanProceed(true)} />
          )}
        </div>
      ))}

      {section.order === 6 && (
        <div className="mt-8">
          <h2 className="text-xl font-semibold mb-4">Tabela de Medicações</h2>
          <MedTable />
        </div>
      )}

      {/* Persistent Footer Navigation */}
      <div className="fixed bottom-0 right-0 left-0 md:left-[16rem] p-4 bg-background/80 backdrop-blur-md border-t flex justify-between items-center z-20">
        <Button
          variant="outline"
          onClick={() =>
            prevSection ? navigate(`/course/${prevSection.order}`) : navigate('/course')
          }
        >
          <ChevronLeft className="mr-2 h-4 w-4" /> Anterior
        </Button>
        <Button
          onClick={handleNext}
          disabled={!canProceed && interactions.length > 0}
          className={!canProceed && interactions.length > 0 ? 'opacity-50' : 'animate-pulse'}
        >
          {nextSection ? 'Próximo' : 'Concluir Curso'} <ChevronRight className="ml-2 h-4 w-4" />
        </Button>
      </div>
    </div>
  )
}

// Helper to render static text/images based on section order since we didn't use a rich text editor for the seed
function renderStaticContent(order: number) {
  switch (order) {
    case 1:
      return (
        <>
          <p className="lead text-lg">
            A Síndrome de Abstinência Neonatal (SAN) é um conjunto de sinais e sintomas
            experimentados por recém-nascidos expostos a substâncias viciantes no útero.
          </p>
          <img
            src="https://img.usecurling.com/p/800/400?q=newborn%20hospital&color=blue"
            alt="UTI Neonatal"
            className="rounded-xl w-full object-cover my-6 shadow-sm"
          />
          <p>
            A prevalência da SAN aumentou dramaticamente nas últimas décadas. O manejo requer uma
            abordagem padronizada e baseada em evidências para garantir o melhor
            neurodesenvolvimento.
          </p>
        </>
      )
    case 2:
      return (
        <>
          <p>
            A apresentação clínica da SAN é multissistêmica. A hiperatividade do Sistema Nervoso
            Central (SNC) é a marca registrada, mas sintomas gastrointestinais e autonômicos também
            são prevalentes.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 my-8">
            <Card className="bg-rose-50 border-rose-100">
              <CardContent className="p-4">
                <h4 className="font-bold text-rose-800 mb-2">Neurológico</h4>
                <ul className="text-sm list-disc pl-4 space-y-1 text-rose-900/80">
                  <li>Tremores</li>
                  <li>Irritabilidade</li>
                  <li>Choro estridente</li>
                  <li>Hipertonia</li>
                </ul>
              </CardContent>
            </Card>
            <Card className="bg-amber-50 border-amber-100">
              <CardContent className="p-4">
                <h4 className="font-bold text-amber-800 mb-2">Gastrointestinal</h4>
                <ul className="text-sm list-disc pl-4 space-y-1 text-amber-900/80">
                  <li>Dificuldade de sucção</li>
                  <li>Vômitos</li>
                  <li>Diarreia</li>
                  <li>Baixo ganho ponderal</li>
                </ul>
              </CardContent>
            </Card>
            <Card className="bg-emerald-50 border-emerald-100">
              <CardContent className="p-4">
                <h4 className="font-bold text-emerald-800 mb-2">Autonômico</h4>
                <ul className="text-sm list-disc pl-4 space-y-1 text-emerald-900/80">
                  <li>Febre / Instabilidade térmica</li>
                  <li>Sudorese</li>
                  <li>Espirros frequentes</li>
                  <li>Taquipneia</li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </>
      )
    case 3:
      return (
        <>
          <p>
            O quadro de SAN não se restringe apenas ao uso materno de drogas ilícitas. Fatores
            predisponentes incluem:
          </p>
          <ul className="my-4 space-y-2">
            <li>
              <strong>Uso de prescrições médicas:</strong> Analgésicos opióides, antidepressivos
              (ISRS), e gabapentinoides usados na gestação.
            </li>
            <li>
              <strong>Iatrogênica:</strong> SAN pode ocorrer em RNs internados em CTI que
              necessitaram de sedação prolongada (fentanil, midazolam) e sofreram desmame rápido.
            </li>
            <li>
              <strong>Poliuso:</strong> O uso combinado de substâncias (ex: Opióide + Tabaco + ISRS)
              agrava a severidade e prolonga o internamento.
            </li>
          </ul>
        </>
      )
    case 4:
      return (
        <>
          <p>
            A avaliação correta é fundamental para iniciar ou desmamar o tratamento farmacológico.
          </p>
          <div className="flex flex-col md:flex-row gap-6 my-6">
            <div className="flex-1 bg-muted p-5 rounded-lg border">
              <h3 className="font-bold mb-2">Escala de Finnegan</h3>
              <p className="text-sm text-muted-foreground mb-3">
                Tradicional, avalia 21 sintomas. Complexa e sujeita a variações interobservador.
                Pontuações &gt; 8 indicam intervenção.
              </p>
            </div>
            <div className="flex-1 bg-primary/10 p-5 rounded-lg border border-primary/20">
              <h3 className="font-bold text-primary mb-2">Abordagem ESC (Eat, Sleep, Console)</h3>
              <p className="text-sm text-primary/80 mb-3">
                Foca na funcionalidade. O RN consegue comer? Consegue dormir? É consolável? Reduz
                drasticamente o tempo de UTI e uso de medicações.
              </p>
            </div>
          </div>
        </>
      )
    case 5:
      return (
        <>
          <p>
            Antes de iniciar a medicação, intervenções não farmacológicas rigorosas devem ser
            implementadas e mantidas durante toda a internação.
          </p>
          <div className="my-8 px-8">
            <Carousel className="w-full max-w-xl mx-auto">
              <CarouselContent>
                <CarouselItem>
                  <Card>
                    <CardContent className="flex flex-col aspect-square items-center justify-center p-6 text-center">
                      <img
                        src="https://img.usecurling.com/i?q=moon&color=blue"
                        alt="Ambiente"
                        className="h-16 w-16 mb-4 opacity-70"
                      />
                      <h3 className="font-bold text-lg">Ambiente</h3>
                      <p className="text-sm text-muted-foreground mt-2">
                        Redução drástica de luz e ruído. Agrupar os cuidados para evitar manipulação
                        excessiva.
                      </p>
                    </CardContent>
                  </Card>
                </CarouselItem>
                <CarouselItem>
                  <Card>
                    <CardContent className="flex flex-col aspect-square items-center justify-center p-6 text-center">
                      <img
                        src="https://img.usecurling.com/i?q=heart&color=rose"
                        alt="Conforto"
                        className="h-16 w-16 mb-4 opacity-70"
                      />
                      <h3 className="font-bold text-lg">Conforto</h3>
                      <p className="text-sm text-muted-foreground mt-2">
                        Swaddling (enrolamento contido), balanço suave e uso de chupeta não
                        nutritiva.
                      </p>
                    </CardContent>
                  </Card>
                </CarouselItem>
                <CarouselItem>
                  <Card>
                    <CardContent className="flex flex-col aspect-square items-center justify-center p-6 text-center">
                      <img
                        src="https://img.usecurling.com/i?q=milk&color=orange"
                        alt="Alimentação"
                        className="h-16 w-16 mb-4 opacity-70"
                      />
                      <h3 className="font-bold text-lg">Alimentação</h3>
                      <p className="text-sm text-muted-foreground mt-2">
                        Pequenos volumes frequentes sob demanda. Calorias extras (fórmulas 24
                        kcal/oz) se houver perda de peso severa.
                      </p>
                    </CardContent>
                  </Card>
                </CarouselItem>
              </CarouselContent>
              <CarouselPrevious />
              <CarouselNext />
            </Carousel>
          </div>
        </>
      )
    case 6:
      return (
        <>
          <p>
            Quando as medidas não farmacológicas falham (ex: pontuações Finnegan altas consecutivas,
            ou falha grave no ESC), a farmacoterapia é indicada. O objetivo é controlar os sintomas
            para permitir alimentação e sono, desmamando progressivamente.
          </p>
        </>
      )
    case 7:
      return (
        <>
          <div className="bg-gradient-to-r from-primary to-blue-600 text-white p-8 rounded-2xl shadow-lg my-6 text-center">
            <h2 className="text-2xl font-bold mb-4 text-white">Parabéns pela Conclusão!</h2>
            <p className="text-white/90 text-lg">
              O manejo humanizado e baseado em evidências transforma o futuro neurológico destes
              recém-nascidos. A abordagem ESC e o uso racional de adjuvantes são os pilares modernos
              do tratamento.
            </p>
          </div>
        </>
      )
    default:
      return null
  }
}
