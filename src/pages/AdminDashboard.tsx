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
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog'
import { ScrollArea } from '@/components/ui/scroll-area'
import {
  AlertCircle,
  CheckCircle2,
  Clock,
  FileText,
  LayoutDashboard,
  Eye,
  History,
  Package,
  Wand2,
  MessageSquare,
  CalendarDays,
  Activity,
} from 'lucide-react'
import { format, isPast, parseISO } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import { EquipmentList } from '@/components/engineering/EquipmentList'

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
    data: {
      equipments: [
        {
          type: 'esteira_transportadora',
          name: 'Esteira de Roletes Livres',
          data: {
            width: '800mm',
            height: '900mm',
            length: '5000mm',
            material: 'Aço Carbono Galvanizado',
            description:
              'Esteira para transporte de caixas pesadas no setor de expedição com guias laterais.',
            construction_method: 'Estrutura parafusada com roletes em aço zincado',
          },
        },
      ],
    },
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
    data: { equipments: [] },
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
    data: { equipments: [] },
  },
]

const Timeline = ({ history }: { history: any[] }) => {
  if (!history || history.length === 0) {
    return (
      <p className="text-sm text-muted-foreground italic">Nenhum histórico de log encontrado.</p>
    )
  }

  return (
    <div className="space-y-4 pl-2 mt-2">
      {history.map((item, idx) => (
        <div
          key={item.id || idx}
          className="relative pl-6 pb-4 border-l-2 border-slate-200 last:border-l-transparent last:pb-0"
        >
          <div className="absolute -left-[9px] top-0 w-4 h-4 rounded-full bg-blue-500 ring-4 ring-white" />
          <div className="flex flex-col gap-1 -mt-1">
            <span className="text-xs text-slate-500 font-medium flex items-center gap-1">
              <Clock className="w-3 h-3" />
              {item.created_at
                ? format(new Date(item.created_at), "dd/MM/yyyy 'às' HH:mm", { locale: ptBR })
                : '-'}
            </span>
            <p className="text-sm font-semibold text-slate-800">
              Status alterado para:{' '}
              <span className="capitalize text-blue-600 font-bold">
                {item.new_status?.replace('_', ' ')}
              </span>
            </p>
            {item.previous_status && (
              <p className="text-xs text-slate-500">
                Status anterior:{' '}
                <span className="capitalize">{item.previous_status.replace('_', ' ')}</span>
              </p>
            )}
            {item.reason && (
              <p className="text-xs text-slate-600 mt-1 bg-slate-50 p-2.5 rounded-md border border-slate-100 italic">
                "{item.reason}"
              </p>
            )}
          </div>
        </div>
      ))}
    </div>
  )
}

export default function AdminDashboard() {
  const [quotes, setQuotes] = useState<Quote[]>([])
  const [loading, setLoading] = useState(true)

  const [selectedQuote, setSelectedQuote] = useState<Quote | null>(null)
  const [quoteHistory, setQuoteHistory] = useState<any[]>([])
  const [engStatus, setEngStatus] = useState<any>(null)
  const [isDetailsOpen, setIsDetailsOpen] = useState(false)

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

  const handleViewDetails = async (quote: Quote) => {
    setSelectedQuote(quote)
    setQuoteHistory([])
    setEngStatus(null)
    setIsDetailsOpen(true)

    try {
      const [historyRes, engRes] = await Promise.all([
        supabase
          .from('quote_status_history')
          .select('*')
          .eq('quote_id', quote.id)
          .order('created_at', { ascending: false }),
        supabase
          .from('quote_engineering_status')
          .select('*')
          .eq('quote_id', quote.id)
          .maybeSingle(),
      ])

      if (historyRes.data && historyRes.data.length > 0) {
        setQuoteHistory(historyRes.data)
      } else {
        setQuoteHistory([
          {
            id: 'mock-1',
            created_at: quote.created_at,
            new_status: quote.status || 'briefing',
            previous_status: null,
            reason: 'Solicitação registrada no sistema de acompanhamento v0.046',
          },
        ])
      }

      if (engRes.data) setEngStatus(engRes.data)
    } catch (err) {
      console.error(err)
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
        return (
          <Badge className="bg-green-500 hover:bg-green-600 text-[10px] uppercase tracking-wider font-bold">
            Devolvido
          </Badge>
        )
      case 'engenharia':
        return (
          <Badge className="bg-blue-500 hover:bg-blue-600 text-[10px] uppercase tracking-wider font-bold">
            Engenharia
          </Badge>
        )
      case 'briefing':
        return (
          <Badge className="bg-amber-500 hover:bg-amber-600 text-[10px] uppercase tracking-wider font-bold">
            Briefing
          </Badge>
        )
      default:
        return (
          <Badge
            variant="outline"
            className="capitalize text-[10px] uppercase tracking-wider font-bold"
          >
            {status || 'Novo'}
          </Badge>
        )
    }
  }

  const renderTable = (data: Quote[]) => (
    <Table>
      <TableHeader className="bg-slate-50">
        <TableRow>
          <TableHead className="font-bold">Pedido</TableHead>
          <TableHead className="font-bold">Cliente / CNPJ</TableHead>
          <TableHead className="font-bold">Status Atual</TableHead>
          <TableHead className="font-bold">Entrada</TableHead>
          <TableHead className="font-bold">Prazo Eng.</TableHead>
          <TableHead className="text-right font-bold">Ações</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {data.length === 0 ? (
          <TableRow>
            <TableCell
              colSpan={6}
              className="text-center py-12 text-muted-foreground bg-slate-50/50"
            >
              Nenhuma solicitação encontrada nesta categoria.
            </TableCell>
          </TableRow>
        ) : (
          data.map((quote) => (
            <TableRow key={quote.id} className="hover:bg-blue-50/30 transition-colors">
              <TableCell className="font-bold text-[#1e4b8f]">{quote.order_number}</TableCell>
              <TableCell>
                <div className="flex flex-col">
                  <span className="font-semibold text-slate-900">
                    {quote.client_name || 'Não informado'}
                  </span>
                  <span className="text-xs text-slate-500 font-mono mt-0.5">
                    {quote.client_cnpj || 'Sem CNPJ'}
                  </span>
                </div>
              </TableCell>
              <TableCell>{getStatusBadge(quote.status)}</TableCell>
              <TableCell className="text-slate-600 font-medium">
                {quote.created_at
                  ? format(parseISO(quote.created_at), 'dd/MM/yyyy', { locale: ptBR })
                  : '-'}
              </TableCell>
              <TableCell>
                {quote.engineering_deadline ? (
                  <div
                    className={`flex items-center gap-1.5 ${isOverdue(quote) ? 'text-red-700 font-bold bg-red-50 px-2 py-1 rounded-md w-fit' : 'text-slate-600 font-medium'}`}
                  >
                    {isOverdue(quote) ? (
                      <AlertCircle className="w-4 h-4" />
                    ) : (
                      <CalendarDays className="w-4 h-4" />
                    )}
                    {format(parseISO(quote.engineering_deadline), 'dd/MM/yyyy', { locale: ptBR })}
                  </div>
                ) : (
                  <span className="text-slate-400 italic text-xs">Sem prazo</span>
                )}
              </TableCell>
              <TableCell className="text-right">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleViewDetails(quote)}
                  className="border-blue-200 text-blue-700 hover:bg-blue-50 hover:text-blue-800 font-semibold shadow-sm"
                >
                  <Eye className="w-4 h-4 mr-2" /> Rastrear
                </Button>
              </TableCell>
            </TableRow>
          ))
        )}
      </TableBody>
    </Table>
  )

  return (
    <div className="flex flex-col gap-6 w-full max-w-6xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-500 pb-12">
      <div className="flex flex-col gap-2 border-b-4 border-brand-orange pb-4">
        <h1 className="text-3xl font-bold tracking-tight text-[#1e4b8f] flex items-center gap-3">
          <LayoutDashboard className="w-7 h-7" />
          Painel do Vendedor - Acompanhamento
        </h1>
        <p className="text-muted-foreground text-lg">
          Visão centralizada e detalhada de todas as solicitações, histórico de status e retornos da
          engenharia (v0.046).
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="shadow-sm border-t-4 border-t-blue-500">
          <CardHeader className="flex flex-row items-center justify-between pb-2 bg-slate-50/50">
            <CardTitle className="text-sm font-bold text-slate-600 uppercase tracking-wider">
              Total de Pedidos
            </CardTitle>
            <FileText className="w-5 h-5 text-blue-500" />
          </CardHeader>
          <CardContent className="pt-4">
            <div className="text-3xl font-bold text-[#1e4b8f]">{allQuotes.length}</div>
            <p className="text-xs text-muted-foreground mt-1 font-medium">
              Cotações ativas no sistema
            </p>
          </CardContent>
        </Card>
        <Card className="shadow-sm border-t-4 border-t-green-500">
          <CardHeader className="flex flex-row items-center justify-between pb-2 bg-slate-50/50">
            <CardTitle className="text-sm font-bold text-slate-600 uppercase tracking-wider">
              Devolvidas (Ação Req.)
            </CardTitle>
            <CheckCircle2 className="w-5 h-5 text-green-500" />
          </CardHeader>
          <CardContent className="pt-4">
            <div className="text-3xl font-bold text-green-600">{returnedQuotes.length}</div>
            <p className="text-xs text-muted-foreground mt-1 font-medium">
              Aguardando retorno ao cliente
            </p>
          </CardContent>
        </Card>
        <Card
          className={`shadow-sm border-t-4 ${overdueQuotes.length > 0 ? 'border-t-red-500 bg-red-50/30' : 'border-t-slate-300'}`}
        >
          <CardHeader className="flex flex-row items-center justify-between pb-2 bg-slate-50/50">
            <CardTitle
              className={`text-sm font-bold uppercase tracking-wider ${overdueQuotes.length > 0 ? 'text-red-700' : 'text-slate-600'}`}
            >
              Em Atraso (SLA)
            </CardTitle>
            <Clock
              className={`w-5 h-5 ${overdueQuotes.length > 0 ? 'text-red-500' : 'text-slate-400'}`}
            />
          </CardHeader>
          <CardContent className="pt-4">
            <div
              className={`text-3xl font-bold ${overdueQuotes.length > 0 ? 'text-red-600' : 'text-slate-700'}`}
            >
              {overdueQuotes.length}
            </div>
            <p className="text-xs text-muted-foreground mt-1 font-medium">
              Ultrapassaram o limite da engenharia
            </p>
          </CardContent>
        </Card>
      </div>

      <Card className="flex-1 shadow-md border-slate-200">
        <CardHeader className="bg-slate-50 border-b border-slate-100">
          <CardTitle className="text-xl text-[#1e4b8f]">Rastreamento de Solicitações</CardTitle>
          <CardDescription className="text-base">
            Acompanhe o status detalhado e histórico de cada pedido de cotação.
          </CardDescription>
        </CardHeader>
        <CardContent className="p-6">
          <Tabs defaultValue="all" className="w-full">
            <TabsList className="mb-6 bg-slate-100 p-1">
              <TabsTrigger
                value="all"
                className="font-semibold data-[state=active]:bg-white data-[state=active]:text-[#1e4b8f]"
              >
                Todos os Pedidos
              </TabsTrigger>
              <TabsTrigger
                value="returned"
                className="font-semibold data-[state=active]:bg-green-50 data-[state=active]:text-green-700"
              >
                Prontos / Devolvidos
              </TabsTrigger>
              <TabsTrigger
                value="overdue"
                className="font-semibold data-[state=active]:bg-red-50 data-[state=active]:text-red-700"
              >
                Atrasados (Alerta)
              </TabsTrigger>
            </TabsList>
            <TabsContent value="all" className="border rounded-xl overflow-hidden shadow-sm">
              {renderTable(allQuotes)}
            </TabsContent>
            <TabsContent value="returned" className="border rounded-xl overflow-hidden shadow-sm">
              {renderTable(returnedQuotes)}
            </TabsContent>
            <TabsContent value="overdue" className="border rounded-xl overflow-hidden shadow-sm">
              {renderTable(overdueQuotes)}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      <Dialog open={isDetailsOpen} onOpenChange={setIsDetailsOpen}>
        <DialogContent className="max-w-4xl w-[95vw] max-h-[90vh] flex flex-col p-0 overflow-hidden bg-slate-50">
          {selectedQuote &&
            (() => {
              const qData = (selectedQuote.data as any) || {}

              return (
                <>
                  <DialogHeader className="px-6 py-5 border-b bg-white shadow-sm z-10">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                      <div>
                        <DialogTitle className="text-2xl font-bold text-[#1e4b8f] flex items-center gap-3">
                          {selectedQuote.order_number}
                          {getStatusBadge(selectedQuote.status)}
                        </DialogTitle>
                        <DialogDescription className="mt-1.5 text-base font-medium text-slate-700 flex items-center">
                          <UserIcon className="w-4 h-4 mr-1.5 text-slate-400" />
                          {selectedQuote.client_name}{' '}
                          <span className="text-slate-400 font-mono text-sm ml-2">
                            ({selectedQuote.client_cnpj})
                          </span>
                        </DialogDescription>
                      </div>
                      <div className="text-left md:text-right bg-slate-50 p-3 rounded-lg border border-slate-100">
                        <p className="text-xs text-slate-500 font-bold uppercase tracking-wider mb-1">
                          Entrada no Sistema
                        </p>
                        <p className="text-sm font-semibold text-slate-800 flex items-center gap-1.5 justify-start md:justify-end">
                          <Clock className="w-4 h-4 text-blue-500" />
                          {selectedQuote.created_at
                            ? format(new Date(selectedQuote.created_at), "dd/MM/yyyy 'às' HH:mm")
                            : '-'}
                        </p>
                      </div>
                    </div>
                  </DialogHeader>

                  <ScrollArea className="flex-1">
                    <div className="p-6 space-y-8">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                        <Card className="border-slate-200 shadow-sm rounded-xl overflow-hidden">
                          <CardHeader className="pb-3 bg-slate-50/80 border-b border-slate-100">
                            <CardTitle className="text-sm font-bold text-[#1e4b8f] flex items-center gap-2 uppercase tracking-wider">
                              <CalendarDays className="w-4 h-4 text-blue-500" /> Prazos e Datas
                              (SLA)
                            </CardTitle>
                          </CardHeader>
                          <CardContent className="pt-4 text-sm space-y-4 bg-white">
                            <div className="flex justify-between items-center pb-3 border-b border-slate-100">
                              <span className="text-slate-500 font-semibold">
                                Prazo de Engenharia:
                              </span>
                              <span
                                className={`font-bold ${isOverdue(selectedQuote) ? 'text-red-700 bg-red-50 px-2.5 py-1 rounded border border-red-100' : 'text-slate-800'}`}
                              >
                                {selectedQuote.engineering_deadline
                                  ? format(
                                      new Date(selectedQuote.engineering_deadline),
                                      'dd/MM/yyyy',
                                    )
                                  : 'Não definido'}
                              </span>
                            </div>
                            <div className="flex justify-between items-center">
                              <span className="text-slate-500 font-semibold">
                                Última Atualização:
                              </span>
                              <span className="font-bold text-slate-700">
                                {selectedQuote.updated_at
                                  ? format(new Date(selectedQuote.updated_at), 'dd/MM/yyyy HH:mm')
                                  : '-'}
                              </span>
                            </div>
                          </CardContent>
                        </Card>

                        {engStatus && (
                          <Card className="border-slate-200 shadow-sm rounded-xl overflow-hidden">
                            <CardHeader className="pb-3 bg-slate-50/80 border-b border-slate-100">
                              <CardTitle className="text-sm font-bold text-[#1e4b8f] flex items-center gap-2 uppercase tracking-wider">
                                <Activity className="w-4 h-4 text-brand-orange" /> Status Interno
                                (Engenharia)
                              </CardTitle>
                            </CardHeader>
                            <CardContent className="pt-4 text-sm space-y-4 bg-white">
                              <div className="flex justify-between items-center pb-3 border-b border-slate-100">
                                <span className="text-slate-500 font-semibold">Fase Atual:</span>
                                <span className="font-bold text-slate-800 uppercase text-[11px] tracking-wider bg-slate-100 px-2.5 py-1 rounded border border-slate-200">
                                  {engStatus.status.replace('_', ' ')}
                                </span>
                              </div>
                              <div className="flex justify-between items-center">
                                <span className="text-slate-500 font-semibold">
                                  Nível de Prioridade:
                                </span>
                                <span
                                  className={`font-bold uppercase text-[11px] tracking-wider px-2.5 py-1 rounded border ${engStatus.priority === 'alta' ? 'bg-red-50 text-red-700 border-red-200' : 'bg-blue-50 text-blue-700 border-blue-200'}`}
                                >
                                  {engStatus.priority || 'Normal'}
                                </span>
                              </div>
                            </CardContent>
                          </Card>
                        )}
                      </div>

                      {qData?.equipments?.length > 0 && (
                        <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
                          <div className="bg-slate-50/80 border-b border-slate-200 px-5 py-3.5">
                            <h3 className="text-sm font-bold text-[#1e4b8f] flex items-center gap-2 uppercase tracking-wider">
                              <Package className="w-4 h-4" /> Configuração Exata dos Equipamentos
                              (V0.046)
                            </h3>
                          </div>
                          <div className="p-6 bg-white">
                            <EquipmentList equipments={qData.equipments} />
                          </div>
                        </div>
                      )}

                      {(qData?.aiJustification ||
                        qData?.aiComments ||
                        engStatus?.engineer_notes) && (
                        <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
                          <div className="bg-slate-50/80 border-b border-slate-200 px-5 py-3.5">
                            <h3 className="text-sm font-bold text-[#1e4b8f] flex items-center gap-2 uppercase tracking-wider">
                              <MessageSquare className="w-4 h-4" /> Notas e Justificativas Técnicas
                            </h3>
                          </div>
                          <div className="p-6 space-y-5 bg-white">
                            {engStatus?.engineer_notes && (
                              <div className="bg-blue-50/60 p-5 rounded-xl border border-blue-100 shadow-inner">
                                <h4 className="text-xs font-bold text-blue-900 uppercase tracking-wider mb-2.5 flex items-center gap-2">
                                  <Activity className="w-4 h-4 text-blue-600" /> Parecer Oficial da
                                  Engenharia
                                </h4>
                                <p className="text-sm text-blue-900 font-medium leading-relaxed whitespace-pre-wrap">
                                  {engStatus.engineer_notes}
                                </p>
                              </div>
                            )}

                            {qData?.aiJustification && (
                              <div className="bg-slate-50 p-5 rounded-xl border border-slate-200 shadow-inner">
                                <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-2.5 flex items-center gap-2">
                                  <Wand2 className="w-4 h-4 text-brand-orange" /> Justificativa
                                  Técnica Estruturada (IA)
                                </h4>
                                <p className="text-sm text-slate-700 font-medium leading-relaxed whitespace-pre-wrap">
                                  {qData.aiJustification}
                                </p>
                              </div>
                            )}

                            {qData?.aiComments && (
                              <div className="bg-slate-50 p-5 rounded-xl border border-slate-200 shadow-inner">
                                <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-2.5 flex items-center gap-2">
                                  <Wand2 className="w-4 h-4 text-brand-orange" /> Análise e Alertas
                                  (IA)
                                </h4>
                                <p className="text-sm text-slate-700 font-medium leading-relaxed whitespace-pre-wrap">
                                  {qData.aiComments}
                                </p>
                              </div>
                            )}
                          </div>
                        </div>
                      )}

                      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
                        <div className="bg-slate-50/80 border-b border-slate-200 px-5 py-3.5">
                          <h3 className="text-sm font-bold text-[#1e4b8f] flex items-center gap-2 uppercase tracking-wider">
                            <History className="w-4 h-4" /> Histórico de Rastreamento (Log Original)
                          </h3>
                        </div>
                        <div className="p-6 bg-white">
                          <Timeline history={quoteHistory} />
                        </div>
                      </div>
                    </div>
                  </ScrollArea>
                </>
              )
            })()}
        </DialogContent>
      </Dialog>
    </div>
  )
}

const UserIcon = ({ className }: { className?: string }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
    <circle cx="12" cy="7" r="4" />
  </svg>
)
