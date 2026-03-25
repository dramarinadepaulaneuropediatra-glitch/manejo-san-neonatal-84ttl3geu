import { useEffect, useState, useMemo } from 'react'
import { useParams, useNavigate, useOutletContext } from 'react-router-dom'
import { getInteractionsBySection, markSectionComplete } from '@/services/api'
import { Button } from '@/components/ui/button'
import { ChevronRight, ChevronLeft, BookOpen, AlertTriangle } from 'lucide-react'
import { Icebreaker } from '@/components/interactions/Icebreaker'
import { Quiz } from '@/components/interactions/Quiz'
import { CriticalThinking } from '@/components/interactions/CriticalThinking'
import { CaseStudy } from '@/components/interactions/CaseStudy'
import { LivePoll } from '@/components/interactions/LivePoll'
import { WordCloud } from '@/components/interactions/WordCloud'
import { MedTable } from '@/components/interactions/MedTable'
import { FinneganTable } from '@/components/interactions/FinneganTable'
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
  const [loadingInts, setLoadingInts] = useState(true)
  const [currentSlide, setCurrentSlide] = useState(0)
  const [canProceed, setCanProceed] = useState(true)

  const section = sections?.find((s) => s.order === order)
  const prevSection = sections?.find((s) => s.order === order - 1)
  const nextSection = sections?.find((s) => s.order === order + 1)

  useEffect(() => {
    let isMounted = true
    if (section) {
      setLoadingInts(true)
      getInteractionsBySection(section.id)
        .then((ints) => {
          if (isMounted) {
            setInteractions(ints || [])
            setLoadingInts(false)
            setCurrentSlide(0)
          }
        })
        .catch((err) => {
          console.error(err)
          if (isMounted) {
            setInteractions([])
            setLoadingInts(false)
            setCurrentSlide(0)
          }
        })
    }
    return () => {
      isMounted = false
    }
  }, [section])

  const slides = useMemo(() => {
    const arr: any[] = []
    if (section) {
      arr.push({
        id: `content-${section.id}`,
        type: 'content',
        content: renderStaticContent(section.order),
      })

      if (section.order === 4) {
        arr.push({ id: 'finnegan_table', type: 'finnegan_table' })
      }
      if (section.order === 6) {
        arr.push({ id: 'med_table', type: 'med_table' })
      }

      if (Array.isArray(interactions)) {
        interactions.forEach((int) => {
          if (int && int.id && int.type) {
            arr.push({ id: int.id, type: 'interaction', interaction: int })
          }
        })
      }
    }
    return arr
  }, [section, interactions])

  const slide = slides[currentSlide]

  useEffect(() => {
    if (slide?.type === 'interaction') {
      setCanProceed(false)
    } else {
      setCanProceed(true)
    }
  }, [currentSlide, slide])

  const handleNext = async () => {
    if (slides.length > 0 && currentSlide < slides.length - 1) {
      setCurrentSlide((c) => c + 1)
      window.scrollTo({ top: 0, behavior: 'smooth' })
    } else {
      if (section) await markSectionComplete(section.id)
      if (nextSection) navigate(`/course/${nextSection.order}`)
      else navigate('/course/gabarito')
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }
  }

  const prevSlide = () => {
    if (currentSlide > 0) {
      setCurrentSlide((c) => c - 1)
      window.scrollTo({ top: 0, behavior: 'smooth' })
    } else {
      if (prevSection) navigate(`/course/${prevSection.order}`)
      else navigate('/course')
    }
  }

  const renderInteraction = (int: any) => {
    if (!int || typeof int !== 'object' || !int.type) return null
    if (int.type === 'icebreaker')
      return <Icebreaker interaction={int} onComplete={() => setCanProceed(true)} />
    if (int.type === 'quiz' || int.type === 'scenario')
      return <Quiz interaction={int} onComplete={() => setCanProceed(true)} />
    if (int.type === 'text')
      return <CriticalThinking interaction={int} onComplete={() => setCanProceed(true)} />
    if (int.type === 'case_study')
      return <CaseStudy interaction={int} onComplete={() => setCanProceed(true)} />
    if (int.type === 'poll')
      return <LivePoll interaction={int} onComplete={() => setCanProceed(true)} />
    if (int.type === 'wordcloud')
      return <WordCloud interaction={int} onComplete={() => setCanProceed(true)} />
    return null
  }

  if (!section || loadingInts)
    return (
      <div className="p-10 text-center animate-pulse text-muted-foreground">
        Preparando módulo...
      </div>
    )

  return (
    <div className="space-y-8 pb-32 max-w-4xl mx-auto" key={`${section.id}-${currentSlide}`}>
      <div className="border-b pb-4 mb-6">
        <div className="flex justify-between items-end gap-4">
          <div>
            <p className="text-xs font-bold text-primary mb-1 tracking-wider uppercase">
              Módulo {section.order}
            </p>
            <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-foreground/90">
              {section.title}
            </h1>
          </div>
          <div className="text-xs font-semibold text-muted-foreground bg-muted px-3 py-1 rounded-full whitespace-nowrap">
            Parte {currentSlide + 1} de {slides.length > 0 ? slides.length : 1}
          </div>
        </div>
        <div className="w-full bg-secondary h-1.5 rounded-full mt-4 overflow-hidden">
          <div
            className="bg-primary h-full rounded-full transition-all duration-500 ease-in-out"
            style={{ width: `${((currentSlide + 1) / Math.max(slides.length, 1)) * 100}%` }}
          />
        </div>
      </div>

      <div className="slide-content animate-fade-in-up duration-500">
        {slide?.type === 'content' && (
          <div className="prose prose-slate prose-lg max-w-none text-foreground/90 leading-relaxed">
            {slide.content}
          </div>
        )}

        {slide?.type === 'finnegan_table' && (
          <div className="mt-2">
            <h2 className="text-2xl font-bold mb-6 text-slate-800">
              Tabela de Referência Finnegan
            </h2>
            <FinneganTable />
          </div>
        )}

        {slide?.type === 'med_table' && (
          <div className="mt-2">
            <h2 className="text-2xl font-bold mb-6 text-slate-800">Compêndio Farmacológico</h2>
            <MedTable />
          </div>
        )}

        {slide?.type === 'interaction' && slide.interaction && (
          <div className="mt-4 flex flex-col items-center">
            {renderInteraction(slide.interaction)}
          </div>
        )}
      </div>

      {/* Persistent Footer Navigation */}
      <div className="fixed bottom-0 right-0 left-0 md:left-[16rem] p-4 bg-background/95 backdrop-blur-md border-t flex justify-between items-center z-20 shadow-[0_-15px_40px_-15px_rgba(0,0,0,0.1)]">
        <Button variant="outline" onClick={prevSlide} className="font-semibold">
          <ChevronLeft className="mr-2 h-4 w-4" /> Anterior
        </Button>

        <Button
          onClick={handleNext}
          disabled={!canProceed}
          className={`font-semibold transition-all ${!canProceed ? 'opacity-50 grayscale' : 'hover:scale-[1.02] shadow-md'}`}
          size="lg"
        >
          {slides.length > 0 && currentSlide < slides.length - 1
            ? 'Avançar Tópico'
            : nextSection
              ? 'Concluir e Ir Próximo Módulo'
              : 'Concluir Curso e Ver Gabarito'}
          <ChevronRight className="ml-2 h-5 w-5" />
        </Button>
      </div>
    </div>
  )
}

function TextCitation({ title, desc }: { title: string; desc: string }) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 bg-card border rounded-xl shadow-sm">
      <div>
        <h4 className="font-bold text-lg text-foreground">{title}</h4>
        <p className="text-sm text-muted-foreground mt-1">{desc}</p>
      </div>
      <div className="bg-primary/5 text-primary p-2 rounded-full shrink-0 self-start sm:self-center">
        <BookOpen className="h-5 w-5" />
      </div>
    </div>
  )
}

function renderStaticContent(order: number) {
  switch (order) {
    case 1:
      return (
        <>
          <p className="text-xl font-medium text-slate-700">
            A síndrome de abstinência neonatal (SAN) é definida como uma síndrome de retirada de
            drogas que ocorre em neonatos após exposição crônica a opioides e outras substâncias,
            seja por exposição intrauterina (através do uso materno durante a gestação) ou por
            exposição iatrogênica pós-natal (através de sedoanalgesia administrada após o nascimento
            durante hospitalização).
          </p>
          <img
            src="https://img.usecurling.com/p/800/400?q=newborn%20hospital&color=blue"
            alt="UTI Neonatal"
            className="rounded-xl w-full object-cover my-8 shadow-sm border"
          />
          <p>
            A prevalência da SAN aumentou dramaticamente nas últimas duas décadas, tornando-se um
            dos principais desafios nas Unidades de Terapia Intensiva Neonatal. O manejo requer uma
            abordagem rigorosa, padronizada e baseada em evidências para garantir o melhor
            neurodesenvolvimento a longo prazo e reduzir o tempo de internação.
          </p>
        </>
      )
    case 2:
      return (
        <>
          <p>
            A apresentação clínica da SAN é predominantemente multissistêmica. A hiperatividade
            disfuncional do Sistema Nervoso Central (SNC) é a marca registrada, mas os sintomas
            gastrointestinais e autonômicos também são altamente prevalentes e determinantes para a
            sobrevida nutricional.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 my-10">
            <Card className="bg-rose-50/50 border-rose-100 shadow-sm hover:shadow-md transition-shadow">
              <CardContent className="p-5">
                <h4 className="font-bold text-rose-800 mb-3 text-lg border-b border-rose-200 pb-2">
                  Neurológico
                </h4>
                <ul className="text-[15px] list-disc pl-4 space-y-2 text-rose-900/80 font-medium">
                  <li>Tremores</li>
                  <li>Irritabilidade</li>
                  <li>Choro estridente</li>
                  <li>Hipertonia severa</li>
                </ul>
              </CardContent>
            </Card>
            <Card className="bg-amber-50/50 border-amber-100 shadow-sm hover:shadow-md transition-shadow">
              <CardContent className="p-5">
                <h4 className="font-bold text-amber-800 mb-3 text-lg border-b border-amber-200 pb-2">
                  Gastrointestinal
                </h4>
                <ul className="text-[15px] list-disc pl-4 space-y-2 text-amber-900/80 font-medium">
                  <li>Dificuldade de sucção</li>
                  <li>Vômitos / Regurgitação</li>
                  <li>Diarreia profusa</li>
                  <li>Baixo ganho ponderal</li>
                </ul>
              </CardContent>
            </Card>
            <Card className="bg-emerald-50/50 border-emerald-100 shadow-sm hover:shadow-md transition-shadow">
              <CardContent className="p-5">
                <h4 className="font-bold text-emerald-800 mb-3 text-lg border-b border-emerald-200 pb-2">
                  Autonômico
                </h4>
                <ul className="text-[15px] list-disc pl-4 space-y-2 text-emerald-900/80 font-medium">
                  <li>Febre / Instabilidade térmica</li>
                  <li>Sudorese excessiva</li>
                  <li>Espirros e bocejos</li>
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
            O quadro de SAN não se restringe de forma alguma ao uso materno de drogas ilícitas. A
            epidemiologia atual revela fatores predisponentes amplos e, muitas vezes, não
            investigados:
          </p>
          <ul className="my-6 space-y-4 text-[15px] p-4 bg-muted/30 rounded-xl border">
            <li className="flex gap-3">
              <span className="text-primary mt-1">•</span>
              <div>
                <strong className="text-foreground">Uso de prescrições médicas:</strong> Analgésicos
                opióides para dor crônica, antidepressivos inibidores de recaptação de serotonina
                (ISRS), e gabapentinoides usados legalmente na gestação.
              </div>
            </li>
            <li className="flex gap-3">
              <span className="text-primary mt-1">•</span>
              <div>
                <strong className="text-foreground">Iatrogênica (Intra-Hospitalar):</strong> SAN
                ocorre frequentemente em RNs internados em CTI que necessitaram de sedação/analgesia
                prolongada (ex: fentanil, midazolam pós-cirúrgico) e sofreram desmame muito rápido.
              </div>
            </li>
            <li className="flex gap-3">
              <span className="text-primary mt-1">•</span>
              <div>
                <strong className="text-foreground">Poliuso de Substâncias:</strong> O uso combinado
                de substâncias lícitas e ilícitas (ex: Opióide + Tabaco + Maconha) potencializa o
                efeito cruzado, agrava a severidade dos sintomas e prolonga exponencialmente o
                internamento.
              </div>
            </li>
          </ul>
        </>
      )
    case 4:
      return (
        <>
          <p className="text-lg">
            A avaliação correta, seriada e por múltiplos profissionais é o pilar fundamental para
            iniciar ou desmamar o tratamento na SAN. O julgamento clínico subjetivo frequentemente
            leva a internações prolongadas e prescrições errôneas.
          </p>
          <div className="flex flex-col md:flex-row gap-6 my-8">
            <div className="flex-1 bg-slate-50 p-6 rounded-xl border border-slate-200">
              <h3 className="font-bold mb-3 text-lg text-slate-800">Escala de Finnegan</h3>
              <p className="text-[15px] text-slate-600 leading-relaxed mb-4">
                A escala tradicional de ouro. Avalia detalhadamente 21 sintomas. É complexa e, por
                isso, muito sujeita a variações interobservador. Geralmente, pontuações consecutivas
                maiores que 8 indicam falha não-farmacológica e início de intervenção medicamentosa.
              </p>
            </div>
            <div className="flex-1 bg-primary/5 p-6 rounded-xl border border-primary/20">
              <h3 className="font-bold text-primary mb-3 text-lg">
                Abordagem ESC (Eat, Sleep, Console)
              </h3>
              <p className="text-[15px] text-primary/80 leading-relaxed mb-4">
                O modelo moderno focado na funcionalidade global do RN. O RN consegue{' '}
                <strong>Comer</strong>? Consegue <strong>Dormir</strong>? É{' '}
                <strong>Consolável</strong>? Evidências mostram que esta abordagem reduz
                drasticamente o uso de medicações sem piorar os desfechos em longo prazo.
              </p>
            </div>
          </div>
        </>
      )
    case 5:
      return (
        <>
          <p className="text-lg mb-6">
            O tratamento <strong>sempre</strong> inicia com medidas não farmacológicas intensivas. E
            mesmo quando a medicação é necessária, estas medidas devem ser mantidas e reforçadas
            durante toda a internação. Elas são o suporte estrutural do sistema nervoso simpático.
          </p>
          <div className="my-10 px-0 md:px-8">
            <Carousel className="w-full max-w-2xl mx-auto">
              <CarouselContent>
                <CarouselItem>
                  <Card className="border-none shadow-md">
                    <CardContent className="flex flex-col aspect-video items-center justify-center p-8 text-center bg-blue-50/50">
                      <img
                        src="https://img.usecurling.com/i?q=moon&color=blue"
                        alt="Ambiente"
                        className="h-20 w-20 mb-6 opacity-80"
                      />
                      <h3 className="font-bold text-2xl text-blue-900 mb-3">Modulação Ambiental</h3>
                      <p className="text-base text-blue-800/80 leading-relaxed">
                        Redução drástica de luz (penumbra) e ruído sonoro contínuo. Agrupar os
                        cuidados de enfermagem e médicos para evitar manipulação tátil excessiva e
                        desnecessária.
                      </p>
                    </CardContent>
                  </Card>
                </CarouselItem>
                <CarouselItem>
                  <Card className="border-none shadow-md">
                    <CardContent className="flex flex-col aspect-video items-center justify-center p-8 text-center bg-rose-50/50">
                      <img
                        src="https://img.usecurling.com/i?q=heart&color=rose"
                        alt="Conforto"
                        className="h-20 w-20 mb-6 opacity-80"
                      />
                      <h3 className="font-bold text-2xl text-rose-900 mb-3">
                        Técnicas de Conforto
                      </h3>
                      <p className="text-base text-rose-800/80 leading-relaxed">
                        Swaddling (enrolamento contido, braços fletidos próximos à linha média),
                        balanço suave vertical e uso contínuo de chupeta não nutritiva para
                        organizar as sucções.
                      </p>
                    </CardContent>
                  </Card>
                </CarouselItem>
                <CarouselItem>
                  <Card className="border-none shadow-md">
                    <CardContent className="flex flex-col aspect-video items-center justify-center p-8 text-center bg-orange-50/50">
                      <img
                        src="https://img.usecurling.com/i?q=milk&color=orange"
                        alt="Alimentação"
                        className="h-20 w-20 mb-6 opacity-80"
                      />
                      <h3 className="font-bold text-2xl text-orange-900 mb-3">
                        Otimização Dietética
                      </h3>
                      <p className="text-base text-orange-800/80 leading-relaxed">
                        Pequenos volumes, frequentes e sob demanda (hipercalórica, ex: 24 kcal/oz)
                        se houver perda ponderal grave ou diarreia. Manter contato materno
                        (aleitamento se liberado).
                      </p>
                    </CardContent>
                  </Card>
                </CarouselItem>
              </CarouselContent>
              <CarouselPrevious className="-left-4 md:-left-12" />
              <CarouselNext className="-right-4 md:-right-12" />
            </Carousel>
          </div>
        </>
      )
    case 6:
      return (
        <>
          <p className="text-lg">
            Quando as medidas não farmacológicas máximas falham — comprovado por escores Finnegan
            altos consecutivos ou falha funcional grave na escala ESC —, a intervenção farmacológica
            está plenamente indicada.
          </p>
          <div className="bg-primary/5 border border-primary/20 p-5 rounded-lg my-6 shadow-sm">
            <h4 className="font-bold text-primary mb-2">Objetivo Primário da Terapêutica</h4>
            <p className="text-sm leading-relaxed text-foreground/80">
              O objetivo <strong>não</strong> é reverter imediatamente todos os tremores ou criar um
              recém-nascido completamente letárgico, mas sim controlar a hiperatividade autonômica a
              um nível que permita que o neonato descanse, se alimente de forma coordenada e ganhe
              peso. Uma vez estabilizado, inicia-se o desmame progressivo e monitorado.
            </p>
          </div>
        </>
      )
    case 7:
      return (
        <>
          <div className="bg-gradient-to-br from-primary to-blue-700 text-white p-10 rounded-2xl shadow-xl my-10 text-center animate-fade-in-up">
            <div className="bg-white/20 p-4 rounded-full w-fit mx-auto mb-6">
              <svg
                className="w-12 h-12 text-white"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
              </svg>
            </div>
            <h2 className="text-3xl font-bold mb-4 text-white">Parabéns pela Conclusão!</h2>
            <p className="text-white/90 text-lg leading-relaxed max-w-xl mx-auto mb-8">
              O manejo humano, interdisciplinar e rigorosamente baseado em evidências transforma e
              protege o futuro neurológico de recém-nascidos afetados pela SAN. A consolidação da
              abordagem ESC e o uso racional dos suportes farmacológicos são a fundação do cuidado
              moderno no CTI.
            </p>
          </div>
        </>
      )
    case 8:
      return (
        <div className="space-y-8 animate-fade-in-up">
          <div className="bg-primary/5 border border-primary/20 p-6 rounded-xl shadow-sm">
            <h3 className="text-xl font-bold text-primary flex items-center gap-2 mb-3">
              <BookOpen className="h-6 w-6" />
              8. Referências Clínicas e Científicas
            </h3>
            <p className="text-[15px] leading-relaxed text-foreground/80">
              O conteúdo deste curso, bem como as diretrizes de dosagem e protocolos de manejo
              farmacológico, foram rigorosamente embasados nas diretrizes e publicações científicas
              institucionais listadas abaixo, priorizando o sigilo e segurança em ambiente
              acadêmico.
            </p>

            <div className="mt-5 p-4 bg-amber-50 border border-amber-200 rounded-lg flex gap-3 items-start text-amber-900 text-sm shadow-sm">
              <AlertTriangle className="h-5 w-5 shrink-0 text-amber-600 mt-0.5" />
              <p className="leading-relaxed">
                <strong>Aviso Obrigatório:</strong> Consulte a literatura oficial das instituições
                citadas para revisar as dosagens e dados de suporte que estão em constante evolução.
              </p>
            </div>
          </div>

          <div className="space-y-4">
            <div className="grid gap-4">
              <TextCitation
                title="1. Artigos do JAMA (Journal of the American Medical Association)"
                desc="Publicações e diretrizes revisadas por pares sobre o manejo e desfechos clínicos de neonatos com SAN."
              />
              <TextCitation
                title="2. Pediatrics"
                desc="Revista oficial da Academia Americana de Pediatria (AAP), fonte central de protocolos baseados em evidências."
              />
              <TextCitation
                title="3. Neurology"
                desc="Literatura especializada essencial para a compreensão e manejo da fisiopatologia e sintomas autonômicos."
              />
              <TextCitation
                title="4. Artigos da Sociedade Brasileira de Pediatria (SBP)"
                desc="Documentos científicos e consensos nacionais de aplicação direta e adaptada às UTIs Neonatais no Brasil."
              />
              <TextCitation
                title="5. Neofax"
                desc="Referência internacional padronizada para indicações, dosagens e segurança na farmacoterapia neonatal."
              />
            </div>
          </div>
        </div>
      )
    default:
      return null
  }
}
