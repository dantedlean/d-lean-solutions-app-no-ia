import { Users, Search } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'

export default function ClientDatabase() {
  return (
    <div className="space-y-6 animate-fade-in-up">
      <div>
        <h2 className="text-3xl font-bold tracking-tight text-primary">Banco de Clientes</h2>
        <p className="text-muted-foreground">
          Gerencie seus contatos e histórico de empresas atendidas.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Diretório</CardTitle>
          <CardDescription>Procure por CNPJ, Razão Social ou Contato.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input placeholder="Pesquisar clientes..." className="pl-8" />
            </div>
            <Button>Buscar</Button>
          </div>

          <div className="text-center py-12 border-2 border-dashed rounded-lg bg-muted/20">
            <Users className="mx-auto h-12 w-12 text-muted-foreground/50 mb-4" />
            <h3 className="text-lg font-medium text-foreground">Nenhum cliente encontrado</h3>
            <p className="text-sm text-muted-foreground mt-1">
              Faça uma busca ou cadastre um novo cliente durante o orçamento.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
