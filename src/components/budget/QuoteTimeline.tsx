import { CheckCircle2, Clock, CheckCircle } from 'lucide-react'

export function QuoteTimeline({ status, deadline }: { status: string; deadline: string | null }) {
  return (
    <div className="flex items-center space-x-4">
      <div className="flex flex-col items-center">
        <CheckCircle2 className="text-green-500 w-6 h-6" />
        <span className="text-xs mt-1">Briefing</span>
      </div>
      <div className="flex-1 h-1 bg-green-500"></div>
      <div className="flex flex-col items-center">
        {status === 'engenharia' ? (
          <Clock className="text-orange-500 w-6 h-6" />
        ) : (
          <CheckCircle className="text-slate-300 w-6 h-6" />
        )}
        <span className="text-xs mt-1">Engenharia</span>
      </div>
      {deadline && (
        <div className="ml-4 text-sm text-slate-600 font-medium">
          Prazo: {new Date(deadline).toLocaleDateString()}
        </div>
      )}
    </div>
  )
}
