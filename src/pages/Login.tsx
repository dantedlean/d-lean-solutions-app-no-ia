import { useState } from 'react'
import { useAuth } from '@/hooks/use-auth'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { useToast } from '@/hooks/use-toast'

export default function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const { signIn } = useAuth()
  const { toast } = useToast()

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    try {
      const { error } = await signIn(email, password)
      if (error) throw error
    } catch (err: any) {
      toast({ title: 'Erro ao entrar', description: err.message, variant: 'destructive' })
    } finally {
      setIsLoading(false)
    }
  }

  const fillDemo = (role: 'vendedor' | 'engenharia' | 'admin') => {
    setEmail(`${role}@dlean.com.br`)
    if (role === 'admin') setEmail('dante@dlean.com.br')
    setPassword('Skip@Pass')
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 p-4">
      <Card className="w-full max-w-md shadow-lg border-t-4 border-t-[#1e4b8f]">
        <CardHeader className="text-center space-y-2">
          <CardTitle className="text-3xl font-bold text-[#1e4b8f]">D-Lean Solutions</CardTitle>
          <CardDescription>Acesse seu painel de controle</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700">E-mail</label>
              <Input
                type="email"
                placeholder="seu@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700">Senha</label>
              <Input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <Button
              type="submit"
              className="w-full bg-[#1e4b8f] hover:bg-[#1e4b8f]/90"
              disabled={isLoading}
            >
              {isLoading ? 'Entrando...' : 'Entrar'}
            </Button>
          </form>

          <div className="mt-8 border-t pt-4">
            <p className="text-xs text-center text-slate-500 mb-3 uppercase font-bold tracking-wider">
              Acessos de Demonstração
            </p>
            <div className="grid grid-cols-3 gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => fillDemo('vendedor')}
                className="text-[10px] border-slate-200"
              >
                Vendedor
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => fillDemo('engenharia')}
                className="text-[10px] border-slate-200"
              >
                Engenharia
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => fillDemo('admin')}
                className="text-[10px] border-slate-200"
              >
                Admin
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
