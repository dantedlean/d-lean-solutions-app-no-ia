import { User, AlertCircle } from 'lucide-react'
import { format } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import { StatusBadge } from './StatusBadge'

export function ProjectHeader({ quote }: { quote: any }) {
  return (
    <div className="bg-white p-6 rounded-xl border shadow-sm">
      <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-4 mb-6">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <h2 className="text-2xl font-bold text-slate-900">{quote.order_number}</h2>
            <StatusBadge status={quote.status} />
          </div>
          <div className="flex items-center text-slate-600 text-lg">
            <User className="w-5 h-5 mr-2 text-slate-400" />
            {quote.client_name || 'Cliente não identificado'}
            {quote.client_cnpj && (
              <span className="text-slate-400 ml-2 text-sm font-mono">({quote.client_cnpj})</span>
            )}
          </div>
        </div>
        <div className="text-right">
          <p className="text-sm text-slate-500 mb-1">Data de Entrada</p>
          <p className="font-medium text-slate-900">
            {quote.created_at
              ? format(new Date(quote.created_at), "dd 'de' MMMM 'de' yyyy 'às' HH:mm", {
                  locale: ptBR,
                })
              : 'Não registrada'}
          </p>
        </div>
      </div>

      {quote.data?.client?.contato && (
        <div className="flex items-center gap-4 p-4 bg-slate-50 rounded-lg border">
          <div className="text-sm">
            <span className="text-slate-500 block mb-1">Contato Responsável</span>
            <span className="font-medium text-slate-900">
              {quote.data.client.contato}
              {quote.data.client.telefone && ` • ${quote.data.client.telefone}`}
              {quote.data.client.email && ` • ${quote.data.client.email}`}
            </span>
          </div>
        </div>
      )}

      {quote.quote_engineering_status && (
        <div className="mt-4 p-4 bg-blue-50/50 border border-blue-100 rounded-lg text-sm text-blue-900 flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-blue-500 flex-shrink-0 mt-0.5" />
          <div>
            <p className="font-semibold mb-1">
              Status da Engenharia: {quote.quote_engineering_status.status}
            </p>
            {quote.quote_engineering_status.engineer_notes && (
              <p className="text-blue-800 mt-2 italic">
                "{quote.quote_engineering_status.engineer_notes}"
              </p>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
