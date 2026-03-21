import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { getMedications } from '@/services/api'
import { Input } from '@/components/ui/input'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Search, BookOpen, Star } from 'lucide-react'
import { Badge } from '@/components/ui/badge'

export function MedTable() {
  const [meds, setMeds] = useState<any[]>([])
  const [search, setSearch] = useState('')

  useEffect(() => {
    getMedications().then(setMeds)
  }, [])

  const filtered = meds.filter(
    (m) =>
      m.name.toLowerCase().includes(search.toLowerCase()) ||
      m.indication.toLowerCase().includes(search.toLowerCase()),
  )

  return (
    <div className="space-y-4">
      <div className="relative max-w-sm">
        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Buscar medicação..."
          className="pl-9"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      <div className="rounded-md border overflow-hidden bg-card">
        <Table>
          <TableHeader className="bg-muted/50">
            <TableRow>
              <TableHead className="w-[180px]">Fármaco</TableHead>
              <TableHead>Indicação</TableHead>
              <TableHead>Dose Inicial</TableHead>
              <TableHead className="hidden md:table-cell">Manutenção / Desmame</TableHead>
              <TableHead className="hidden lg:table-cell">Segurança / Notas</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.map((med) => {
              const isMethadone = med.name.toLowerCase() === 'metadona'

              return (
                <TableRow
                  key={med.id}
                  className={isMethadone ? 'bg-amber-50/40 hover:bg-amber-50/60' : ''}
                >
                  <TableCell className="font-medium text-primary">
                    <div className="flex flex-col items-start gap-1">
                      <span className="text-base">{med.name}</span>
                      {isMethadone && (
                        <Badge
                          variant="outline"
                          className="text-[10px] bg-amber-100 text-amber-800 border-amber-300 gap-1 px-1.5 py-0"
                        >
                          <Star className="h-3 w-3 fill-amber-500 text-amber-500" /> Destaque
                        </Badge>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant={med.indication.includes('1ª') ? 'default' : 'secondary'}
                      className="mb-1 text-xs"
                    >
                      {med.indication.split('(')[0].trim()}
                    </Badge>
                    <div className="text-[11px] text-muted-foreground mt-1 font-medium">
                      {med.indication.includes('(') ? '(' + med.indication.split('(')[1] : ''}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="text-sm font-mono leading-relaxed text-slate-800 flex items-center gap-2">
                      {med.initial_dose || med.dose}
                      <Link
                        to="/course/8"
                        className="text-[10px] text-primary/70 hover:text-primary hover:underline transition-colors"
                        title="Ver Referências no Módulo 8"
                      >
                        [Ref]
                      </Link>
                    </div>
                    <div className="text-[11px] text-muted-foreground mt-1.5 uppercase tracking-wide">
                      Apresentação:{' '}
                      <span className="text-foreground/80 font-semibold lowercase normal-case">
                        {med.presentation}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell className="hidden md:table-cell">
                    <div className="text-sm text-slate-700 leading-relaxed">
                      {med.maintenance_dose}
                    </div>
                  </TableCell>
                  <TableCell className="hidden lg:table-cell">
                    <div className="text-sm leading-relaxed mb-2">{med.safety_efficacy}</div>
                    {med.references && (
                      <div className="text-[11px] text-muted-foreground/90 flex gap-1.5 items-start bg-muted/40 p-2 rounded-md border border-muted">
                        <BookOpen className="h-3.5 w-3.5 shrink-0 mt-[1px] text-primary/70" />
                        <span className="leading-snug">
                          <span className="font-semibold text-foreground/80 block mb-0.5">
                            Ref:
                          </span>
                          {med.references}
                        </span>
                      </div>
                    )}
                  </TableCell>
                </TableRow>
              )
            })}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
