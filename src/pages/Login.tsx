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
import pb from '@/lib/pocketbase/client'

export default function Login() {
  const [identifier, setIdentifier] = useState('') // MASP or admin email
  const [password, setPassword] = useState('HJK2026') // Standard password

  // Register fields
  const [regMasp, setRegMasp] = useState('')
  const [regEmail, setRegEmail] = useState('')
  const [regName, setRegName] = useState('')

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

    if (password !== 'HJK2026') {
      setErrors({ password: 'A senha unificada para todos os usuários é HJK2026.' })
      setLoadingLogin(false)
      return
    }

    const { error } = await signIn(identifier, password)
    if (error) {
      setErrors(extractFieldErrors(error))
      toast({
        title: 'Erro no login',
        description: 'Credenciais inválidas. Verifique seu MASP/Email.',
        variant: 'destructive',
      })
    }
    setLoadingLogin(false)
  }

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoadingLogin(true)
    setErrors({})

    if (password !== 'HJK2026') {
      setErrors({ password: 'A senha unificada para registro e acesso é HJK2026.' })
      setLoadingLogin(false)
      return
    }

    if (regEmail !== 'dramarinadepaulaneuropediatra@gmail.com') {
      try {
        await pb.collection('masp_whitelist').getFirstListItem(`masp="${regMasp}"`)
      } catch {
        setErrors({ regMasp: 'MASP não autorizado. Acesso restrito à equipe treinada.' })
        setLoadingLogin(false)
        return
      }
    }

    const { error } = await signUp({
      email: regEmail,
      password,
      name: regName,
      masp: regMasp,
      username: regMasp,
    })

    if (error) {
      const fieldErrors = extractFieldErrors(error)
      if (fieldErrors.username) fieldErrors.regMasp = fieldErrors.username
      if (fieldErrors.email) fieldErrors.regEmail = fieldErrors.email
      setErrors(fieldErrors)
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
              <TabsTrigger value="login">Entrar</TabsTrigger>
              <TabsTrigger value="register">Cadastrar</TabsTrigger>
            </TabsList>

            <TabsContent value="login">
              <form
                onSubmit={handleLogin}
                className="space-y-4 animate-in fade-in zoom-in-95 duration-200"
              >
                <div className="space-y-2">
                  <Label htmlFor="identifier">MASP / Email</Label>
                  <Input
                    id="identifier"
                    type="text"
                    placeholder="Seu número MASP"
                    value={identifier}
                    onChange={(e) => setIdentifier(e.target.value)}
                    required
                  />
                  {errors.identifier && (
                    <p className="text-sm text-destructive">{errors.identifier}</p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="password">Senha Unificada</Label>
                  <Input
                    id="password"
                    type="password"
                    placeholder="HJK2026"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    readOnly
                    className="bg-muted/50 cursor-not-allowed text-muted-foreground"
                  />
                  {errors.password && <p className="text-sm text-destructive">{errors.password}</p>}
                </div>
                <Button type="submit" className="w-full" disabled={loadingLogin}>
                  {loadingLogin ? 'Acessando...' : 'Entrar no Curso'}
                </Button>
              </form>
            </TabsContent>

            <TabsContent value="register">
              <form
                onSubmit={handleRegister}
                className="space-y-4 animate-in fade-in zoom-in-95 duration-200"
              >
                <div className="space-y-2">
                  <Label htmlFor="reg-masp">MASP</Label>
                  <Input
                    id="reg-masp"
                    type="text"
                    placeholder="Número MASP"
                    value={regMasp}
                    onChange={(e) => setRegMasp(e.target.value)}
                    required
                  />
                  {errors.regMasp && <p className="text-sm text-destructive">{errors.regMasp}</p>}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="reg-name">Nome Completo</Label>
                  <Input
                    id="reg-name"
                    type="text"
                    placeholder="Nome que sairá no certificado"
                    value={regName}
                    onChange={(e) => setRegName(e.target.value)}
                    required
                  />
                  {errors.name && <p className="text-sm text-destructive">{errors.name}</p>}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="reg-email">Email Pessoal ou Institucional</Label>
                  <Input
                    id="reg-email"
                    type="email"
                    placeholder="nome@email.com"
                    value={regEmail}
                    onChange={(e) => setRegEmail(e.target.value)}
                    required
                  />
                  {errors.regEmail && <p className="text-sm text-destructive">{errors.regEmail}</p>}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="reg-password">Senha</Label>
                  <Input
                    id="reg-password"
                    type="password"
                    value={password}
                    readOnly
                    className="bg-muted/50 cursor-not-allowed text-muted-foreground"
                  />
                </div>
                <Button type="submit" className="w-full" disabled={loadingLogin}>
                  {loadingLogin ? 'Verificando MASP...' : 'Criar Cadastro'}
                </Button>
              </form>
            </TabsContent>
          </Tabs>

          <div className="mt-6 text-center text-sm text-muted-foreground border-t pt-6">
            <p>Acesso restrito à equipe autorizada do CTI Neonatal.</p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
