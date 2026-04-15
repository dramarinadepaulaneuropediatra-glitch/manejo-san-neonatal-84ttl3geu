import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '@/hooks/use-auth'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Stethoscope } from 'lucide-react'
import { useToast } from '@/hooks/use-toast'

export default function Login() {
  const [name, setName] = useState('')
  const [masp, setMasp] = useState('')

  const [loadingLogin, setLoadingLogin] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const navigate = useNavigate()
  const { toast } = useToast()
  const { user, loading, signIn } = useAuth()

  useEffect(() => {
    if (!loading && user) {
      navigate('/course', { replace: true })
    }
  }, [user, loading, navigate])

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoadingLogin(true)
    setErrors({})

    let identifier = masp.trim()

    // Admin login or special cases where masp is empty
    if (!identifier) {
      // Create a slug from the name to act as identifier (e.g. for Cyntia Nayara de Jesus)
      identifier = name
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/[^a-z0-9]/g, '')
    }

    // If it's the admin, they might type their email in the MASP or Name field.
    if (masp.includes('@')) identifier = masp.trim()
    else if (name.includes('@')) identifier = name.trim()

    const { error } = await signIn(identifier, 'Skip@2026')
    if (error) {
      setErrors({ root: 'Credenciais inválidas. Verifique seu Nome e MASP.' })
      toast({
        title: 'Erro no login',
        description: 'Não foi possível autenticar com as credenciais informadas.',
        variant: 'destructive',
      })
    }
    setLoadingLogin(false)
  }

  if (loading || user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-muted/40">
        <div className="animate-pulse text-muted-foreground font-medium">Verificando sessão...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-muted/40 p-4">
      <Card className="w-full max-w-md shadow-elevation border-0">
        <CardHeader className="text-center space-y-2 pb-6">
          <div className="mx-auto bg-primary/10 p-3 rounded-full w-fit mb-2">
            <Stethoscope className="w-8 h-8 text-primary" />
          </div>
          <CardTitle className="text-2xl">Manejo SAN Neonatal</CardTitle>
          <CardDescription>Treinamento Baseado em Evidências</CardDescription>
        </CardHeader>
        <CardContent>
          <form
            onSubmit={handleLogin}
            className="space-y-4 animate-in fade-in zoom-in-95 duration-200"
          >
            <div className="space-y-2">
              <Label htmlFor="name">Nome Completo</Label>
              <Input
                id="name"
                type="text"
                placeholder="Seu nome completo"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="masp">MASP</Label>
                <span className="text-[10px] text-muted-foreground">Opcional se pendente</span>
              </div>
              <Input
                id="masp"
                type="text"
                placeholder="Seu número MASP"
                value={masp}
                onChange={(e) => setMasp(e.target.value)}
              />
            </div>

            {errors.root && (
              <p className="text-sm text-destructive text-center font-medium">{errors.root}</p>
            )}

            <Button type="submit" className="w-full mt-2" disabled={loadingLogin}>
              {loadingLogin ? 'Acessando...' : 'Entrar no Curso'}
            </Button>
          </form>

          <div className="mt-8 text-center text-sm text-muted-foreground border-t pt-6">
            <p>Acesso restrito à equipe autorizada do CTI Neonatal.</p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
