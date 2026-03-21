import { useState, useEffect } from 'react'
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
import { Search, BookOpen } from 'lucide-react'
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

      <div className="rounded-md border overflow-hidden">
        <Table>
          <TableHeader className="bg-muted/50">
            <TableRow>
              <TableHead className="w-[150px]">Fármaco</TableHead>
              <TableHead>Indicação</TableHead>
              <TableHead>Dose / Apresentação</TableHead>
              <TableHead className="hidden md:table-cell">Segurança / Notas</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.map((med) => (
              <TableRow key={med.id}>
                <TableCell className="font-medium text-primary">{med.name}</TableCell>
                <TableCell>
                  <Badge
                    variant={med.indication.includes('1ª') ? 'default' : 'secondary'}
                    className="mb-1"
                  >
                    {med.indication.split('(')[0].trim()}
                  </Badge>
                  <div className="text-xs text-muted-foreground mt-1">
                    {med.indication.includes('(') ? '(' + med.indication.split('(')[1] : ''}
                  </div>
                </TableCell>
                <TableCell>
                  <div className="text-sm font-mono">{med.dose}</div>
                  <div className="text-xs text-muted-foreground mt-1">{med.presentation}</div>
                  {med.references && (
                    <div className="mt-2 text-[11px] text-muted-foreground/90 flex gap-1 items-start bg-muted/40 p-2 rounded-md">
                      <BookOpen className="h-3 w-3 shrink-0 mt-[1px] text-primary/60" />
                      <span className="leading-snug">
                        <span className="font-medium text-foreground/80 block mb-0.5">
                          Referência:
                        </span>
                        {med.references}
                      </span>
                    </div>
                  )}
                </TableCell>
                <TableCell className="hidden md:table-cell">
                  <div className="text-sm">{med.safety_efficacy}</div>
                  <div className="text-xs text-muted-foreground italic mt-1">{med.notes}</div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
