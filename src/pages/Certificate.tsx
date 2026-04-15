import { useEffect, useRef, useState } from 'react'
import { useAuth } from '@/hooks/use-auth'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Download, Award } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { getSections, getMyProgress } from '@/services/api'

export default function Certificate() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const printRef = useRef<HTMLDivElement>(null)
  const [canAccess, setCanAccess] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function checkAccess() {
      try {
        const [sections, progress] = await Promise.all([getSections(), getMyProgress()])
        if (sections.length > 0 && progress.length >= sections.length) {
          setCanAccess(true)
        } else {
          navigate('/course')
        }
      } catch {
        navigate('/course')
      } finally {
        setLoading(false)
      }
    }
    checkAccess()
  }, [navigate])

  const handlePrint = () => {
    window.print()
  }

  if (loading)
    return (
      <div className="p-10 text-center animate-pulse text-muted-foreground">
        Verificando elegibilidade...
      </div>
    )
  if (!canAccess) return null

  const date = new Date().toLocaleDateString('pt-BR')

  return (
    <div className="space-y-6 max-w-4xl mx-auto pb-20 animate-in fade-in zoom-in-95 duration-500">
      <div className="flex items-center justify-between no-print">
        <h1 className="text-2xl font-bold flex items-center gap-2">
          <Award className="h-6 w-6 text-primary" />
          Certificado de Conclusão
        </h1>
        <Button onClick={handlePrint} className="shadow-md">
          <Download className="mr-2 h-4 w-4" />
          Imprimir / Salvar PDF
        </Button>
      </div>

      <Card
        id="printable-certificate"
        className="p-8 md:p-12 print:shadow-none print:border-none border-2 border-primary/20 relative overflow-hidden bg-white shadow-xl"
        ref={printRef}
      >
        <div className="absolute inset-0 bg-[url('https://img.usecurling.com/p/800/800?q=certificate%20pattern&color=blue&dpr=1')] opacity-[0.03] pointer-events-none" />

        <div className="relative z-10 text-center space-y-10">
          <div className="space-y-2">
            <h2 className="text-3xl md:text-5xl font-serif text-slate-800 tracking-tight font-bold">
              CERTIFICADO
            </h2>
            <p className="text-primary font-medium uppercase tracking-widest text-sm md:text-base">
              CTI neonatal Hospital Júlia Kubitschek - rede FHEMIG
            </p>
          </div>

          <div className="py-10">
            <p className="text-lg text-slate-600 mb-4">Certificamos que</p>
            <p className="text-3xl md:text-4xl font-bold text-slate-800 border-b-2 border-primary/20 pb-3 inline-block px-12 uppercase">
              {user?.name || user?.email}
            </p>
            {user?.masp && (
              <p className="text-sm font-medium text-slate-500 mt-4">MASP: {user.masp}</p>
            )}
          </div>

          <p className="text-lg text-slate-700 max-w-2xl mx-auto leading-relaxed">
            concluiu com êxito o curso de capacitação{' '}
            <strong>Manejo da Síndrome de Abstinência Neonatal</strong>, baseado em evidências, com
            carga horária total de <strong>2h</strong>.
          </p>

          <div className="text-slate-600 font-medium space-y-1">
            <p>Belo Horizonte, {date}.</p>
          </div>

          <div className="flex justify-center pt-16 mt-12 border-t border-slate-100">
            <div className="text-center space-y-1">
              <div className="border-t border-slate-300 pt-2 w-64 mx-auto"></div>
              <p className="font-semibold text-sm text-slate-800">
                Dra. Marina de Paula Lima Oliveira
              </p>
              <p className="text-xs text-slate-500">Promotora - MASP 11870979 - Neuropediatra</p>
            </div>
          </div>
        </div>
      </Card>

      <style>{`
        @media print {
          body * { visibility: hidden; }
          .no-print { display: none !important; }
          #printable-certificate, #printable-certificate * { visibility: visible; }
          #printable-certificate { 
            position: absolute; 
            left: 0; 
            top: 0; 
            width: 100%; 
            border: none !important; 
            box-shadow: none !important; 
            margin: 0;
            padding: 20px !important;
          }
        }
      `}</style>
    </div>
  )
}
