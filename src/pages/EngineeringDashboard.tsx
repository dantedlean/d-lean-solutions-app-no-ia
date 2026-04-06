import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase/client'
import { Card, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import {
  FileText,
  Download,
  User,
  Calendar,
  HardHat,
  Loader2,
  Package,
  Paperclip,
  CheckCircle2,
  Clock,
  AlertCircle,
} from 'lucide-react'
import { format } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import { Badge } from '@/components/ui/badge'
import { ScrollArea } from '@/components/ui/scroll-area'
import { useToast } from '@/hooks/use-toast'

export default function EngineeringDashboard() {
  const [quotes, setQuotes] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedQuote, setSelectedQuote] = useState<any>(null)
  const { toast } = useToast()

  useEffect(() => {
    fetchQuotes()
  }, [])

  const fetchQuotes = async () => {
    try {
      const { data, error } = await supabase
        .from('quotes')
        .select(`
          *,
          quote_engineering_status (*)
        `)
        .order('created_at', { ascending: false })

      if (error) throw error
      setQuotes(data || [])
    } catch (error) {
      console.error('Error fetching quotes:', error)
      toast({
        title: 'Erro ao carregar',
        description: 'Não foi possível carregar a lista de projetos.',
        variant: 'destructive',
      })
    } finally {
      setLoading(false)
    }
  }

  const renderValue = (val: any): string => {
    if (val === null || val === undefined || val === '') return '-'
    if (typeof val === 'boolean') return val ? 'Sim' : 'Não'
    if (typeof val === 'object') {
      if (Array.isArray(val)) {
        const arr = val.filter((v) => v !== null && v !== undefined && v !== '')
        return arr.length > 0 ? arr.map((v) => renderValue(v)).join(', ') : '-'
      }
      const entries = Object.entries(val).filter(
        ([_, v]) => v !== null && v !== undefined && v !== '',
      )
      if (entries.length === 0) return '-'
      return entries.map(([k, v]) => `${k}: ${renderValue(v)}`).join(' | ')
    }
    return String(val)
  }

  const handleDownload = (file: any) => {
    if (file.url || file.path) {
      window.open(file.url || file.path, '_blank')
    } else {
      toast({
        title: 'Download indisponível',
        description: 'Este arquivo não possui um link direto para download no momento.',
        variant: 'destructive',
      })
    }
  }

  const getStatusBadge = (status: string | null) => {
    if (!status) return <Badge variant="secondary">Pendente</Badge>
    const s = status.toLowerCase()
    if (s === 'engenharia')
      return (
        <Badge variant="default" className="bg-blue-600">
          Engenharia
        </Badge>
      )
    if (s === 'concluído' || s === 'concluido')
      return (
        <Badge variant="default" className="bg-green-600">
          Concluído
        </Badge>
      )
    return (
      <Badge variant="secondary" className="capitalize">
        {status}
      </Badge>
    )
  }

  return (
    <div className="container mx-auto py-8 animate-fade-in-up px-4 max-w-7xl">
      <div className="flex items-center gap-3 mb-8">
        <div className="p-3 bg-blue-100 text-blue-700 rounded-lg">
          <HardHat className="w-8 h-8" />
        </div>
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Painel de Engenharia</h1>
          <p className="text-slate-500">
            Acesso completo às especificações técnicas e arquivos das cotações
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="md:col-span-1 h-[calc(100vh-200px)] flex flex-col">
          <CardHeader className="pb-4 border-b">
            <CardTitle className="text-lg flex items-center gap-2">
              <Clock className="w-5 h-5 text-slate-500" />
              Fila de Projetos
            </CardTitle>
            <CardDescription>Cotações recebidas para análise</CardDescription>
          </CardHeader>
          <ScrollArea className="flex-1">
            <div className="p-4 space-y-3">
              {loading ? (
                <div className="flex justify-center p-8">
                  <Loader2 className="w-6 h-6 animate-spin text-slate-400" />
                </div>
              ) : quotes.length === 0 ? (
                <div className="text-center p-8 text-slate-500 text-sm border-2 border-dashed rounded-lg">
                  Nenhum projeto na fila
                </div>
              ) : (
                quotes.map((quote) => (
                  <button
                    key={quote.id}
                    onClick={() => setSelectedQuote(quote)}
                    className={`w-full text-left p-4 rounded-xl border transition-all duration-200 ${
                      selectedQuote?.id === quote.id
                        ? 'border-blue-500 bg-blue-50 shadow-md ring-1 ring-blue-500'
                        : 'border-slate-200 hover:border-blue-300 hover:bg-slate-50 hover:shadow-sm'
                    }`}
                  >
                    <div className="flex justify-between items-start mb-2">
                      <span className="font-bold text-slate-900">{quote.order_number}</span>
                      {getStatusBadge(quote.status)}
                    </div>
                    <p className="text-sm font-medium text-slate-700 truncate mb-2">
                      {quote.client_name || 'Cliente não identificado'}
                    </p>
                    <div className="flex items-center justify-between text-xs text-slate-500">
                      <div className="flex items-center">
                        <Calendar className="w-3 h-3 mr-1" />
                        {quote.created_at
                          ? format(new Date(quote.created_at), 'dd MMM yy', { locale: ptBR })
                          : 'N/D'}
                      </div>
                      {quote.data?.equipments?.length > 0 && (
                        <span className="flex items-center">
                          <Package className="w-3 h-3 mr-1" />
                          {quote.data.equipments.length} item(s)
                        </span>
                      )}
                    </div>
                  </button>
                ))
              )}
            </div>
          </ScrollArea>
        </Card>

        <Card className="md:col-span-2 h-[calc(100vh-200px)] flex flex-col overflow-hidden">
          {selectedQuote ? (
            <ScrollArea className="flex-1 h-full bg-slate-50/50">
              <div className="p-6 md:p-8 space-y-8">
                {/* Cabeçalho do Projeto */}
                <div className="bg-white p-6 rounded-xl border shadow-sm">
                  <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-4 mb-6">
                    <div>
                      <div className="flex items-center gap-3 mb-2">
                        <h2 className="text-2xl font-bold text-slate-900">
                          {selectedQuote.order_number}
                        </h2>
                        {getStatusBadge(selectedQuote.status)}
                      </div>
                      <div className="flex items-center text-slate-600 text-lg">
                        <User className="w-5 h-5 mr-2 text-slate-400" />
                        {selectedQuote.client_name || 'Cliente não identificado'}
                        {selectedQuote.client_cnpj ? (
                          <span className="text-slate-400 ml-2 text-sm font-mono">
                            ({selectedQuote.client_cnpj})
                          </span>
                        ) : (
                          ''
                        )}
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-slate-500 mb-1">Data de Entrada</p>
                      <p className="font-medium text-slate-900">
                        {selectedQuote.created_at
                          ? format(
                              new Date(selectedQuote.created_at),
                              "dd 'de' MMMM 'de' yyyy 'às' HH:mm",
                              { locale: ptBR },
                            )
                          : 'Não registrada'}
                      </p>
                    </div>
                  </div>

                  {selectedQuote.data?.client?.contato && (
                    <div className="flex items-center gap-4 p-4 bg-slate-50 rounded-lg border">
                      <div className="text-sm">
                        <span className="text-slate-500 block mb-1">Contato Responsável</span>
                        <span className="font-medium text-slate-900">
                          {selectedQuote.data.client.contato}
                          {selectedQuote.data.client.telefone &&
                            ` • ${selectedQuote.data.client.telefone}`}
                          {selectedQuote.data.client.email &&
                            ` • ${selectedQuote.data.client.email}`}
                        </span>
                      </div>
                    </div>
                  )}

                  {selectedQuote.quote_engineering_status && (
                    <div className="mt-4 p-4 bg-blue-50/50 border border-blue-100 rounded-lg text-sm text-blue-900 flex items-start gap-3">
                      <AlertCircle className="w-5 h-5 text-blue-500 flex-shrink-0 mt-0.5" />
                      <div>
                        <p className="font-semibold mb-1">
                          Status da Engenharia: {selectedQuote.quote_engineering_status.status}
                        </p>
                        {selectedQuote.quote_engineering_status.engineer_notes && (
                          <p className="text-blue-800 mt-2 italic">
                            "{selectedQuote.quote_engineering_status.engineer_notes}"
                          </p>
                        )}
                      </div>
                    </div>
                  )}
                </div>

                {/* Especificações Técnicas */}
                <div>
                  <h3 className="text-xl font-bold text-slate-900 mb-4 flex items-center">
                    <Package className="w-6 h-6 mr-2 text-blue-600" />
                    Configuração dos Produtos
                  </h3>

                  {selectedQuote.data?.equipments?.length > 0 ? (
                    <div className="space-y-6">
                      {selectedQuote.data.equipments.map((eq: any, idx: number) => (
                        <div
                          key={idx}
                          className="border border-slate-200 rounded-xl bg-white shadow-sm overflow-hidden"
                        >
                          <div className="bg-slate-800 text-white px-5 py-3 flex justify-between items-center">
                            <span className="font-bold text-lg">
                              {eq.type || 'Equipamento não especificado'}
                            </span>
                            <span className="text-sm font-mono text-slate-300 bg-slate-700 px-2 py-1 rounded">
                              Item #{idx + 1}
                            </span>
                          </div>

                          <div className="p-5">
                            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                              {Object.entries(eq.data || {}).map(([key, value]) => {
                                const rendered = renderValue(value)
                                if (rendered === '-') return null

                                return (
                                  <div
                                    key={key}
                                    className="flex flex-col bg-slate-50 p-3 rounded-lg border border-slate-100"
                                  >
                                    <span className="text-slate-500 text-xs uppercase tracking-wider mb-1 font-semibold">
                                      {key.replace(/_/g, ' ')}
                                    </span>
                                    <span className="font-medium text-slate-900 break-words">
                                      {rendered}
                                    </span>
                                  </div>
                                )
                              })}
                            </div>

                            {/* Caso não tenha propriedades válidas após o filtro */}
                            {Object.entries(eq.data || {}).filter(
                              ([_, v]) => renderValue(v) !== '-',
                            ).length === 0 && (
                              <p className="text-slate-500 text-sm italic">
                                Nenhum detalhe técnico fornecido para este item.
                              </p>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="bg-white p-8 border rounded-xl text-center shadow-sm">
                      <Package className="w-10 h-10 text-slate-300 mx-auto mb-3" />
                      <p className="text-slate-500 font-medium">
                        Nenhum equipamento detalhado nesta cotação.
                      </p>
                    </div>
                  )}
                </div>

                {/* Arquivos Anexados */}
                <div>
                  <h3 className="text-xl font-bold text-slate-900 mb-4 flex items-center">
                    <Paperclip className="w-6 h-6 mr-2 text-blue-600" />
                    Arquivos e Anexos
                  </h3>

                  {selectedQuote.data?.files?.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {selectedQuote.data.files.map((file: any, idx: number) => (
                        <div
                          key={idx}
                          className="flex items-center justify-between p-4 border rounded-xl bg-white shadow-sm hover:shadow-md hover:border-blue-200 transition-all group"
                        >
                          <div className="flex items-center overflow-hidden mr-3">
                            <div className="p-2 bg-blue-50 text-blue-600 rounded-lg mr-3 group-hover:bg-blue-100 transition-colors">
                              <FileText className="w-6 h-6" />
                            </div>
                            <div className="truncate">
                              <p
                                className="text-sm font-bold text-slate-700 truncate"
                                title={file.name}
                              >
                                {file.name || `Anexo ${idx + 1}`}
                              </p>
                              {file.size && (
                                <p className="text-xs text-slate-500 font-mono mt-0.5">
                                  {(file.size / 1024 / 1024).toFixed(2)} MB
                                </p>
                              )}
                            </div>
                          </div>
                          <Button
                            size="icon"
                            variant="outline"
                            onClick={() => handleDownload(file)}
                            className="text-blue-600 border-blue-200 hover:text-blue-800 hover:bg-blue-50 flex-shrink-0"
                            title="Baixar arquivo"
                          >
                            <Download className="w-4 h-4" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="bg-white p-8 border border-dashed rounded-xl text-center shadow-sm">
                      <Paperclip className="w-10 h-10 text-slate-300 mx-auto mb-3" />
                      <p className="text-slate-500 font-medium">
                        Nenhum arquivo anexado a esta cotação.
                      </p>
                      <p className="text-sm text-slate-400 mt-1">
                        Os anexos do cliente aparecerão aqui.
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </ScrollArea>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center text-slate-400 p-8 bg-slate-50/50">
              <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center shadow-sm border border-slate-100 mb-6">
                <HardHat className="w-12 h-12 text-blue-200" />
              </div>
              <h3 className="text-xl font-bold text-slate-700 mb-2">Selecione um projeto</h3>
              <p className="text-slate-500 text-center max-w-sm">
                Clique em uma cotação na lista lateral para visualizar todas as especificações
                técnicas e arquivos anexados.
              </p>
            </div>
          )}
        </Card>
      </div>
    </div>
  )
}
