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
} from 'lucide-react'
import { format } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import { Badge } from '@/components/ui/badge'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Separator } from '@/components/ui/separator'

export default function EngineeringDashboard() {
  const [quotes, setQuotes] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedQuote, setSelectedQuote] = useState<any>(null)

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
      setQuotes(data || [])
    } catch (error) {
      console.error('Error fetching quotes:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="container mx-auto py-8 animate-fade-in-up px-4 max-w-7xl">
      <div className="flex items-center gap-3 mb-8">
        <div className="p-3 bg-blue-100 text-blue-700 rounded-lg">
          <HardHat className="w-8 h-8" />
        </div>
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Painel de Engenharia</h1>
          <p className="text-slate-500">Gestão de especificações técnicas e arquivos de cotações</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="md:col-span-1 h-[calc(100vh-200px)] flex flex-col">
          <CardHeader className="pb-4">
            <CardTitle className="text-lg">Fila de Projetos</CardTitle>
            <CardDescription>Cotações recebidas</CardDescription>
          </CardHeader>
          <ScrollArea className="flex-1 px-4">
            <div className="space-y-3 pb-4">
              {loading ? (
                <div className="flex justify-center p-8">
                  <Loader2 className="w-6 h-6 animate-spin text-slate-400" />
                </div>
              ) : quotes.length === 0 ? (
                <div className="text-center p-4 text-slate-500 text-sm">Nenhum projeto na fila</div>
              ) : (
                quotes.map((quote) => (
                  <button
                    key={quote.id}
                    onClick={() => setSelectedQuote(quote)}
                    className={`w-full text-left p-4 rounded-xl border transition-all ${
                      selectedQuote?.id === quote.id
                        ? 'border-blue-500 bg-blue-50/50 shadow-sm'
                        : 'border-slate-200 hover:border-blue-300 hover:bg-slate-50'
                    }`}
                  >
                    <div className="flex justify-between items-start mb-2">
                      <span className="font-bold text-blue-900">{quote.order_number}</span>
                      <Badge variant={quote.status === 'engenharia' ? 'default' : 'secondary'}>
                        {quote.status}
                      </Badge>
                    </div>
                    <p className="text-sm font-medium text-slate-700 truncate">
                      {quote.client_name}
                    </p>
                    <div className="flex items-center text-xs text-slate-500 mt-2">
                      <Calendar className="w-3 h-3 mr-1" />
                      {quote.created_at
                        ? format(new Date(quote.created_at), "dd 'de' MMM, yyyy", { locale: ptBR })
                        : 'N/D'}
                    </div>
                  </button>
                ))
              )}
            </div>
          </ScrollArea>
        </Card>

        <Card className="md:col-span-2 h-[calc(100vh-200px)] flex flex-col overflow-hidden">
          {selectedQuote ? (
            <ScrollArea className="flex-1 h-full">
              <div className="p-6 space-y-8">
                <div>
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h2 className="text-2xl font-bold text-slate-900 mb-1">
                        {selectedQuote.order_number}
                      </h2>
                      <div className="flex items-center text-slate-500">
                        <User className="w-4 h-4 mr-2" />
                        {selectedQuote.client_name}{' '}
                        {selectedQuote.client_cnpj ? `(${selectedQuote.client_cnpj})` : ''}
                      </div>
                    </div>
                    <Badge variant="outline" className="text-sm px-3 py-1 bg-slate-50">
                      Recebido em:{' '}
                      {selectedQuote.created_at
                        ? format(new Date(selectedQuote.created_at), 'dd/MM/yyyy HH:mm')
                        : ''}
                    </Badge>
                  </div>

                  {selectedQuote.data?.client?.contato && (
                    <div className="bg-slate-50 p-3 rounded-lg text-sm text-slate-700 inline-block border">
                      <strong>Contato:</strong> {selectedQuote.data.client.contato}
                      {selectedQuote.data.client.telefone &&
                        ` | ${selectedQuote.data.client.telefone}`}
                    </div>
                  )}
                </div>

                <Separator />

                <div>
                  <h3 className="text-lg font-bold text-slate-900 mb-4 flex items-center">
                    <Package className="w-5 h-5 mr-2 text-blue-600" />
                    Especificações Técnicas
                  </h3>

                  {selectedQuote.data?.equipments?.length > 0 ? (
                    <div className="space-y-4">
                      {selectedQuote.data.equipments.map((eq: any, idx: number) => (
                        <div
                          key={idx}
                          className="border border-slate-200 rounded-xl p-5 bg-white shadow-sm"
                        >
                          <div className="flex justify-between mb-3 border-b pb-2">
                            <span className="font-bold text-slate-800">
                              {eq.type || 'Equipamento não especificado'}
                            </span>
                            <span className="text-sm font-mono text-slate-500">
                              Item #{idx + 1}
                            </span>
                          </div>

                          <div className="grid grid-cols-2 md:grid-cols-3 gap-y-4 gap-x-6 text-sm">
                            {Object.entries(eq.data || {}).map(([key, value]) => {
                              if (typeof value === 'object' || !value) return null
                              return (
                                <div key={key} className="flex flex-col">
                                  <span className="text-slate-500 text-xs uppercase tracking-wider mb-1">
                                    {key}
                                  </span>
                                  <span className="font-medium text-slate-800">
                                    {String(value)}
                                  </span>
                                </div>
                              )
                            })}
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-slate-500 italic text-sm">Nenhum equipamento detalhado.</p>
                  )}
                </div>

                <Separator />

                <div>
                  <h3 className="text-lg font-bold text-slate-900 mb-4 flex items-center">
                    <Paperclip className="w-5 h-5 mr-2 text-blue-600" />
                    Arquivos Anexados
                  </h3>

                  {selectedQuote.data?.files?.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {selectedQuote.data.files.map((file: any, idx: number) => (
                        <div
                          key={idx}
                          className="flex items-center justify-between p-3 border rounded-lg bg-slate-50 hover:bg-slate-100 transition-colors"
                        >
                          <div className="flex items-center overflow-hidden mr-3">
                            <FileText className="w-8 h-8 text-slate-400 mr-3 flex-shrink-0" />
                            <div className="truncate">
                              <p className="text-sm font-medium text-slate-700 truncate">
                                {file.name}
                              </p>
                              <p className="text-xs text-slate-500">
                                {(file.size / 1024 / 1024).toFixed(2)} MB
                              </p>
                            </div>
                          </div>
                          <Button
                            size="icon"
                            variant="ghost"
                            className="text-blue-600 hover:text-blue-800 hover:bg-blue-50"
                          >
                            <Download className="w-4 h-4" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="p-8 border-2 border-dashed rounded-xl text-center">
                      <FileText className="w-10 h-10 text-slate-300 mx-auto mb-2" />
                      <p className="text-slate-500 text-sm">
                        Nenhum arquivo anexado a esta cotação.
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </ScrollArea>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center text-slate-400 p-8">
              <HardHat className="w-16 h-16 mb-4 text-slate-200" />
              <p className="text-lg font-medium text-slate-500">Selecione um projeto</p>
              <p className="text-sm">
                Clique em uma cotação na lista para visualizar as especificações
              </p>
            </div>
          )}
        </Card>
      </div>
    </div>
  )
}
