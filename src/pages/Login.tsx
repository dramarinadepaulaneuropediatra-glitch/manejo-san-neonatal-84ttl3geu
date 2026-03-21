import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { extractFieldErrors } from '@/lib/pocketbase/errors'
import { useAuth } from '@/hooks/use-auth'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Stethoscope } from 'lucide-react'
import { useToast } from '@/hooks/use-toast'

export default function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [name, setName] = useState('')
  const [loadingLogin, setLoadingLogin] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const navigate = useNavigate()
  const { toast } = useToast()
  const { user, loading, signIn, signUp } = useAuth()

  useEffect(() => {
    if (!loading && user) {
      navigate('/course', { replace: true })
    }
  }, [user, loading, navigate])

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoadingLogin(true)
    setErrors({})

    const { error } = await signIn(email, password)
    if (error) {
      setErrors(extractFieldErrors(error))
      toast({
        title: 'Erro no login',
        description: 'Credenciais inválidas. Tente novamente.',
        variant: 'destructive',
      })
    }
    setLoadingLogin(false)
  }

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoadingLogin(true)
    setErrors({})

    const { error } = await signUp({ email, password, name })
    if (error) {
      setErrors(extractFieldErrors(error))
      toast({
        title: 'Erro no cadastro',
        description: 'Verifique os dados e tente novamente.',
        variant: 'destructive',
      })
    } else {
      toast({
        title: 'Cadastro concluído',
        description: 'Bem-vindo ao curso!',
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
          <Tabs defaultValue="login" className="w-full" onValueChange={() => setErrors({})}>
            <TabsList className="grid w-full grid-cols-2 mb-6">
              <TabsTrigger value="login">Login</TabsTrigger>
              <TabsTrigger value="register">Cadastrar</TabsTrigger>
            </TabsList>

            <TabsContent value="login">
              <form
                onSubmit={handleLogin}
                className="space-y-4 animate-in fade-in zoom-in-95 duration-200"
              >
                <div className="space-y-2">
                  <Label htmlFor="email">Email Institucional</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="nome@hospital.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                  {errors.email && <p className="text-sm text-destructive">{errors.email}</p>}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="password">Senha</Label>
                  <Input
                    id="password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                  {errors.password && <p className="text-sm text-destructive">{errors.password}</p>}
                </div>
                <Button type="submit" className="w-full" disabled={loadingLogin}>
                  {loadingLogin ? 'Entrando...' : 'Acessar Curso'}
                </Button>
              </form>
            </TabsContent>

            <TabsContent value="register">
              <form
                onSubmit={handleRegister}
                className="space-y-4 animate-in fade-in zoom-in-95 duration-200"
              >
                <div className="space-y-2">
                  <Label htmlFor="reg-name">Nome Completo</Label>
                  <Input
                    id="reg-name"
                    type="text"
                    placeholder="Seu nome"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                  />
                  {errors.name && <p className="text-sm text-destructive">{errors.name}</p>}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="reg-email">Email Institucional</Label>
                  <Input
                    id="reg-email"
                    type="email"
                    placeholder="nome@hospital.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                  {errors.email && <p className="text-sm text-destructive">{errors.email}</p>}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="reg-password">Senha</Label>
                  <Input
                    id="reg-password"
                    type="password"
                    placeholder="Mínimo 8 caracteres"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    minLength={8}
                  />
                  {errors.password && <p className="text-sm text-destructive">{errors.password}</p>}
                </div>
                <Button type="submit" className="w-full" disabled={loadingLogin}>
                  {loadingLogin ? 'Cadastrando...' : 'Criar Conta'}
                </Button>
              </form>
            </TabsContent>
          </Tabs>

          <div className="mt-6 text-center text-sm text-muted-foreground border-t pt-6">
            <p>Acesso restrito a profissionais de saúde.</p>
            <p className="mt-2 text-xs opacity-70">
              Admin: dramarinadepaulaneuropediatra@gmail.com
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
