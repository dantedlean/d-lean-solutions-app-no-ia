import { Card, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Clock, Loader2, Calendar, Package } from 'lucide-react'
import { format } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import { StatusBadge } from './StatusBadge'

interface ProjectListProps {
  quotes: any[]
  loading: boolean
  selectedQuote: any
  onSelectQuote: (quote: any) => void
}

export function ProjectList({ quotes, loading, selectedQuote, onSelectQuote }: ProjectListProps) {
  return (
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
                onClick={() => onSelectQuote(quote)}
                className={`w-full text-left p-4 rounded-xl border transition-all duration-200 ${
                  selectedQuote?.id === quote.id
                    ? 'border-blue-500 bg-blue-50 shadow-md ring-1 ring-blue-500'
                    : 'border-slate-200 hover:border-blue-300 hover:bg-slate-50 hover:shadow-sm'
                }`}
              >
                <div className="flex justify-between items-start mb-2">
                  <span className="font-bold text-slate-900">{quote.order_number}</span>
                  <StatusBadge status={quote.status} />
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
  )
}
