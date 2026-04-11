import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase/client'
import { useAuth } from '@/hooks/use-auth'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  Loader2,
  FileText,
  Download,
  CheckCircle2,
  Clock,
  AlertTriangle,
  PlayCircle,
} from 'lucide-react'
import { formatDistanceToNow, format } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import { cn } from '@/lib/utils'

interface SellerTrackingDashboardProps {
  onReview: (quote: any) => void
}

export function SellerTrackingDashboard({ onReview }: SellerTrackingDashboardProps) {
  const { user } = useAuth()
  const [quotes, setQuotes] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  const fetchQuotes = async () => {
    if (!user) return
    setLoading(true)
    try {
      const isAdmin = user.user_metadata?.role === 'admin'
      let query = supabase
        .from('quotes')
        .select(`*, quote_engineering_status ( status, engineer_notes )`)
        .order('created_at', { ascending: false })

      if (!isAdmin) {
        query = query.eq('user_id', user.id)
      }

      const { data, error } = await query
      if (error) throw error
      setQuotes(data || [])
    } catch (error) {
      console.error('Erro ao buscar pedidos:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchQuotes()
  }, [user])

  if (loading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-brand-blue" />
      </div>
    )
  }

  if (quotes.length === 0) {
    return (
      <div className="text-center py-16 bg-slate-50 border border-slate-200 rounded-xl shadow-inner">
        <FileText className="mx-auto h-12 w-12 text-slate-300 mb-4" />
        <h3 className="text-lg font-semibold text-slate-700">Nenhum pedido encontrado</h3>
        <p className="text-slate-500 max-w-sm mx-auto mt-2">
          Você ainda não enviou nenhum orçamento para a engenharia. Crie um novo orçamento para
          começar.
        </p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-xl font-bold text-brand-blue">Acompanhamento de Pedidos</h3>
        <Button variant="outline" size="sm" onClick={fetchQuotes} className="h-8">
          Atualizar
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {quotes.map((q) => {
          const status = q.status || 'briefing'
          const isConcluido = status === 'concluido' || status === 'aprovado'
          const isRevisao = status === 'revisao_solicitada'

          return (
            <Card
              key={q.id}
              className={cn(
                'transition-all hover:shadow-md',
                isRevisao && 'border-amber-300 bg-amber-50/10',
              )}
            >
              <CardHeader className="pb-3 border-b border-slate-100 bg-slate-50/50">
                <div className="flex justify-between items-start mb-2">
                  <Badge
                    variant="outline"
                    className={cn(
                      'font-mono font-bold uppercase tracking-wider',
                      isConcluido
                        ? 'text-green-700 bg-green-50 border-green-200'
                        : isRevisao
                          ? 'text-amber-700 bg-amber-50 border-amber-200'
                          : 'text-brand-blue bg-blue-50 border-blue-200',
                    )}
                  >
                    {status.replace('_', ' ')}
                  </Badge>
                  <span className="text-[10px] text-slate-500 font-medium flex items-center bg-white px-2 py-0.5 rounded border shadow-sm">
                    <Clock className="w-3 h-3 mr-1" />
                    {q.created_at ? format(new Date(q.created_at), 'dd/MM/yy HH:mm') : ''}
                  </span>
                </div>
                <CardTitle className="text-lg text-slate-800">{q.order_number}</CardTitle>
                <CardDescription className="font-medium text-slate-600">
                  {q.client_name || 'Cliente não informado'}
                </CardDescription>
              </CardHeader>

              <CardContent className="pt-4 space-y-4">
                <div className="text-sm space-y-2">
                  <div className="flex justify-between border-b border-slate-100 pb-2">
                    <span className="text-slate-500">Itens:</span>
                    <span className="font-semibold text-slate-700">
                      {q.data?.equipments?.length || 0} equipamentos
                    </span>
                  </div>

                  {q.quote_engineering_status?.engineer_notes && (
                    <div className="bg-blue-50 p-3 rounded-md border border-blue-100 text-xs">
                      <strong className="block text-brand-blue mb-1">Notas da Engenharia:</strong>
                      <p className="text-slate-700">{q.quote_engineering_status.engineer_notes}</p>
                    </div>
                  )}

                  {q.data?.aiJustification && (
                    <div className="bg-slate-50 p-3 rounded-md border border-slate-200 text-xs">
                      <strong className="block text-slate-700 mb-1">Justificativa Técnica:</strong>
                      <p className="text-slate-600 line-clamp-3" title={q.data.aiJustification}>
                        {q.data.aiJustification}
                      </p>
                    </div>
                  )}
                </div>

                <div className="pt-2 flex flex-col gap-2">
                  {q.data?.engineer_files?.length > 0 && (
                    <div className="space-y-2">
                      <strong className="text-[10px] uppercase tracking-wider text-slate-500 block">
                        Arquivos de Retorno
                      </strong>
                      <div className="flex flex-wrap gap-2">
                        {q.data.engineer_files.map((f: any, i: number) => (
                          <Button
                            key={i}
                            variant="outline"
                            size="sm"
                            asChild
                            className="text-xs h-8 bg-green-50 border-green-200 text-green-700 hover:bg-green-100"
                          >
                            <a href={f.url} target="_blank" rel="noreferrer">
                              <Download className="w-3 h-3 mr-1" /> {f.name}
                            </a>
                          </Button>
                        ))}
                      </div>
                    </div>
                  )}

                  <div className="flex justify-end gap-2 mt-2">
                    {isRevisao && (
                      <Button
                        size="sm"
                        className="bg-amber-500 hover:bg-amber-600 text-white"
                        onClick={() => onReview(q)}
                      >
                        <AlertTriangle className="w-4 h-4 mr-1" /> Revisar Orçamento
                      </Button>
                    )}
                    {isConcluido && (
                      <Button
                        size="sm"
                        variant="outline"
                        className="border-brand-blue text-brand-blue hover:bg-blue-50"
                        onClick={() => onReview(q)}
                      >
                        <FileText className="w-4 h-4 mr-1" /> Ver Detalhes
                      </Button>
                    )}
                    {!isConcluido && !isRevisao && (
                      <Button
                        size="sm"
                        variant="secondary"
                        className="bg-slate-100 text-slate-600"
                        onClick={() => onReview(q)}
                      >
                        <PlayCircle className="w-4 h-4 mr-1" /> Continuar Edição
                      </Button>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>
    </div>
  )
}
