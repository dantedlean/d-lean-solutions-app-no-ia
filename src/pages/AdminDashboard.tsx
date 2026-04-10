import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase/client'
import { Database } from '@/lib/supabase/types'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import { AlertCircle, CheckCircle2, Clock, FileText, LayoutDashboard } from 'lucide-react'
import { format, isPast, parseISO } from 'date-fns'
import { ptBR } from 'date-fns/locale'

type Quote = Database['public']['Tables']['quotes']['Row']

const getMockQuotes = (): Quote[] => [
  {
    id: '1',
    order_number: '#ORC-2026-101',
    client_name: 'Indústria Metalúrgica ABC',
    client_cnpj: '12.345.678/0001-90',
    status: 'briefing',
    engineering_deadline: new Date(Date.now() + 86400000 * 2).toISOString(),
    created_at: new Date(Date.now() - 86400000).toISOString(),
    updated_at: new Date(Date.now() - 86400000).toISOString(),
    user_id: null,
    clickup_task_id: null,
    data: null,
  },
  {
    id: '2',
    order_number: '#ORC-2026-102',
    client_name: 'TechMontagem SA',
    client_cnpj: '98.765.432/0001-10',
    status: 'concluido',
    engineering_deadline: new Date(Date.now() - 86400000).toISOString(),
    created_at: new Date(Date.now() - 172800000).toISOString(),
    updated_at: new Date(Date.now() - 86400000).toISOString(),
    user_id: null,
    clickup_task_id: null,
    data: null,
  },
  {
    id: '3',
    order_number: '#ORC-2026-103',
    client_name: 'AutoPeças Z',
    client_cnpj: '11.222.333/0001-44',
    status: 'engenharia',
    engineering_deadline: new Date(Date.now() - 86400000 * 2).toISOString(),
    created_at: new Date(Date.now() - 86400000 * 5).toISOString(),
    updated_at: new Date(Date.now() - 86400000 * 3).toISOString(),
    user_id: null,
    clickup_task_id: null,
    data: null,
  },
  {
    id: '4',
    order_number: '#ORC-2026-104',
    client_name: 'Logística Global',
    client_cnpj: '44.555.666/0001-77',
    status: 'devolvido',
    engineering_deadline: new Date(Date.now() + 86400000).toISOString(),
    created_at: new Date(Date.now() - 86400000 * 2).toISOString(),
    updated_at: new Date(Date.now() - 86400000 * 1).toISOString(),
    user_id: null,
    clickup_task_id: null,
    data: null,
  },
]

export default function AdminDashboard() {
  const [quotes, setQuotes] = useState<Quote[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchQuotes()
  }, [])

  const fetchQuotes = async () => {
    try {
      const { data, error } = await supabase
        .from('quotes')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) throw error

      if (!data || data.length === 0) {
        setQuotes(getMockQuotes())
      } else {
        setQuotes(data)
      }
    } catch (error) {
      console.error('Error fetching quotes:', error)
      setQuotes(getMockQuotes())
    } finally {
      setLoading(false)
    }
  }

  const isOverdue = (quote: Quote) => {
    if (quote.status === 'concluido' || quote.status === 'devolvido') return false
    if (!quote.engineering_deadline) return false
    return isPast(parseISO(quote.engineering_deadline))
  }

  const allQuotes = quotes
  const returnedQuotes = quotes.filter((q) => q.status === 'concluido' || q.status === 'devolvido')
  const overdueQuotes = quotes.filter(isOverdue)

  const getStatusBadge = (status: string | null) => {
    switch (status) {
      case 'concluido':
      case 'devolvido':
        return <Badge className="bg-green-500 hover:bg-green-600">Devolvido</Badge>
      case 'engenharia':
        return <Badge className="bg-blue-500 hover:bg-blue-600">Engenharia</Badge>
      case 'briefing':
        return <Badge className="bg-amber-500 hover:bg-amber-600">Briefing</Badge>
      default:
        return (
          <Badge variant="outline" className="capitalize">
            {status || 'Novo'}
          </Badge>
        )
    }
  }

  const renderTable = (data: Quote[]) => (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Pedido</TableHead>
          <TableHead>Cliente</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Data Criação</TableHead>
          <TableHead>Prazo Engenharia</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {data.length === 0 ? (
          <TableRow>
            <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
              Nenhuma cotação encontrada nesta categoria.
            </TableCell>
          </TableRow>
        ) : (
          data.map((quote) => (
            <TableRow key={quote.id}>
              <TableCell className="font-medium text-[#1e4b8f]">{quote.order_number}</TableCell>
              <TableCell>
                <div className="flex flex-col">
                  <span className="font-medium">{quote.client_name || 'Não informado'}</span>
                  <span className="text-xs text-muted-foreground">
                    {quote.client_cnpj || 'Sem CNPJ'}
                  </span>
                </div>
              </TableCell>
              <TableCell>{getStatusBadge(quote.status)}</TableCell>
              <TableCell>
                {quote.created_at
                  ? format(parseISO(quote.created_at), 'dd/MM/yyyy', { locale: ptBR })
                  : '-'}
              </TableCell>
              <TableCell>
                {quote.engineering_deadline ? (
                  <div
                    className={`flex items-center gap-1.5 ${isOverdue(quote) ? 'text-red-600 font-medium' : ''}`}
                  >
                    {isOverdue(quote) && <AlertCircle className="w-3.5 h-3.5" />}
                    {format(parseISO(quote.engineering_deadline), 'dd/MM/yyyy', { locale: ptBR })}
                  </div>
                ) : (
                  '-'
                )}
              </TableCell>
            </TableRow>
          ))
        )}
      </TableBody>
    </Table>
  )

  return (
    <div className="flex flex-col gap-6 w-full max-w-6xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col gap-2">
        <h1 className="text-2xl font-bold tracking-tight text-[#1e4b8f] flex items-center gap-2">
          <LayoutDashboard className="w-6 h-6" />
          Painel de Gestão
        </h1>
        <p className="text-muted-foreground">
          Visão centralizada de todas as solicitações, devoluções e atrasos.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total de Pedidos
            </CardTitle>
            <FileText className="w-4 h-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{allQuotes.length}</div>
            <p className="text-xs text-muted-foreground mt-1">Cotações registradas no sistema</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Devolvidas aos Vendedores
            </CardTitle>
            <CheckCircle2 className="w-4 h-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{returnedQuotes.length}</div>
            <p className="text-xs text-muted-foreground mt-1">
              Cotações finalizadas pela engenharia
            </p>
          </CardContent>
        </Card>
        <Card className={overdueQuotes.length > 0 ? 'border-red-200 bg-red-50/30' : ''}>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Cotações em Atraso
            </CardTitle>
            <Clock
              className={`w-4 h-4 ${overdueQuotes.length > 0 ? 'text-red-500' : 'text-muted-foreground'}`}
            />
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold ${overdueQuotes.length > 0 ? 'text-red-600' : ''}`}>
              {overdueQuotes.length}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Ultrapassaram o prazo da engenharia
            </p>
          </CardContent>
        </Card>
      </div>

      <Card className="flex-1">
        <CardHeader>
          <CardTitle>Listagem de Cotações</CardTitle>
          <CardDescription>Acompanhe o status detalhado de cada solicitação.</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="all" className="w-full">
            <TabsList className="mb-4">
              <TabsTrigger value="all">Todos os Pedidos</TabsTrigger>
              <TabsTrigger value="returned">Devolvidas</TabsTrigger>
              <TabsTrigger value="overdue">Em Atraso</TabsTrigger>
            </TabsList>
            <TabsContent value="all" className="border rounded-md">
              {renderTable(allQuotes)}
            </TabsContent>
            <TabsContent value="returned" className="border rounded-md">
              {renderTable(returnedQuotes)}
            </TabsContent>
            <TabsContent value="overdue" className="border rounded-md">
              {renderTable(overdueQuotes)}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  )
}
