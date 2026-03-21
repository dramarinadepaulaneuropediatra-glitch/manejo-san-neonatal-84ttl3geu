import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip'
import { Info } from 'lucide-react'

const FINNEGAN_DATA = [
  {
    category: 'Sistema Nervoso Central (SNC)',
    items: [
      {
        sign: 'Choro estridente',
        score: '2 (se intermitente), 3 (se contínuo)',
        tip: 'Choro agudo, difícil de confortar.',
      },
      {
        sign: 'Sono diminuído após mamada',
        score: '< 3h (1), < 2h (2), < 1h (3)',
        tip: 'Observar após alimentação completa e arrotar.',
      },
      {
        sign: 'Reflexo de Moro',
        score: 'Hiperativo (2), Exagerado (3)',
        tip: 'Resposta exagerada ao mínimo estímulo sonoro ou tátil.',
      },
      {
        sign: 'Tremores',
        score: 'Leves(1-3), Moderados/Graves(2-4)',
        tip: 'Distinguir cuidadosamente se ocorrem quando manuseado ou em repouso absoluto.',
      },
      {
        sign: 'Tônus muscular',
        score: 'Aumentado (2)',
        tip: 'Rigidez notável à flexão/extensão passiva dos membros.',
      },
      {
        sign: 'Convulsões',
        score: 'Generalizadas (5)',
        tip: 'Requer avaliação neurológica imediata; não confundir com tremores graves.',
      },
    ],
  },
  {
    category: 'Vasomotor / Respiratório / Metabólico',
    items: [
      {
        sign: 'Sudorese',
        score: '1',
        tip: 'Suor não justificado por calor excessivo no ambiente.',
      },
      {
        sign: 'Febre',
        score: '< 38.4°C (1), >= 38.4°C (2)',
        tip: 'Descartar causas infecciosas primárias sempre.',
      },
      {
        sign: 'Bocejos frequentes',
        score: '> 3 vezes em intervalo curto (1)',
        tip: 'Sinal sutil de hiperatividade autonômica.',
      },
      {
        sign: 'Espirros',
        score: '> 3 vezes em intervalo curto (1)',
        tip: 'Muito comum e característico na abstinência de opióides.',
      },
      {
        sign: 'Taquipneia',
        score: '> 60 irpm (1), com retrações (2)',
        tip: 'Sem sinais evidentes de doença pulmonar de base.',
      },
    ],
  },
  {
    category: 'Gastrointestinal',
    items: [
      {
        sign: 'Sucção excessiva',
        score: '1',
        tip: 'Busca constante pelas mãos ou chupeta de forma frenética.',
      },
      {
        sign: 'Dificuldade de alimentação',
        score: '2',
        tip: 'Sucção descoordenada, engasgos frequentes ou recusa.',
      },
      {
        sign: 'Vômitos / Regurgitação',
        score: 'Regurgita (2), Vômito em jato (3)',
        tip: 'Acompanhar risco elevado de perda ponderal.',
      },
      {
        sign: 'Fezes líquidas',
        score: 'Amolecidas (2), Aquosas (3)',
        tip: 'Risco altíssimo de desidratação e dermatite de fralda grave.',
      },
    ],
  },
]

export function FinneganTable() {
  return (
    <div className="space-y-6">
      <div className="bg-blue-50/70 border border-blue-100 p-5 rounded-xl shadow-sm">
        <h3 className="font-semibold text-blue-900 mb-2 flex items-center gap-2">
          <Info className="h-5 w-5 text-blue-600" />
          Como usar a Escala de Finnegan
        </h3>
        <p className="text-sm text-blue-800 leading-relaxed">
          Avalie o Recém-Nascido rigorosamente a cada 3-4 horas (preferencialmente junto com a
          mamada). Pontuações consecutivas <strong>&gt; 8</strong> (ex: três avaliações) ou{' '}
          <strong>&gt; 12</strong> (duas avaliações) geralmente indicam a falha das medidas
          não-farmacológicas e a necessidade de iniciar tratamento medicamentoso seguro. A avaliação
          deve ser sequencial, padronizada e realizada por equipe devidamente treinada.
        </p>
      </div>

      <div className="space-y-6">
        {FINNEGAN_DATA.map((cat) => (
          <div key={cat.category} className="border rounded-xl overflow-hidden bg-card shadow-sm">
            <div className="bg-muted/60 px-5 py-3 font-semibold border-b text-foreground">
              {cat.category}
            </div>
            <Table>
              <TableHeader>
                <TableRow className="hover:bg-transparent">
                  <TableHead className="w-[45%]">Sinal / Sintoma</TableHead>
                  <TableHead>Pontuação</TableHead>
                  <TableHead className="w-[50px] text-center">Dica</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {cat.items.map((item, idx) => (
                  <TableRow key={idx} className="hover:bg-muted/30">
                    <TableCell className="font-medium text-slate-700">{item.sign}</TableCell>
                    <TableCell className="text-slate-600 font-mono text-sm">{item.score}</TableCell>
                    <TableCell className="text-center">
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <button className="text-muted-foreground hover:text-primary transition-colors focus:outline-none focus:ring-2 focus:ring-primary rounded-full p-1">
                            <Info className="h-4 w-4" />
                            <span className="sr-only">Informação adicional</span>
                          </button>
                        </TooltipTrigger>
                        <TooltipContent
                          side="left"
                          className="max-w-[220px] p-3 text-sm font-medium"
                        >
                          <p>{item.tip}</p>
                        </TooltipContent>
                      </Tooltip>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        ))}
      </div>
    </div>
  )
}
