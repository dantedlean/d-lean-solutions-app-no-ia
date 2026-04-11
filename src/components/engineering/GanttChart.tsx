import { useMemo } from 'react'
import { format, differenceInDays, addDays } from 'date-fns'
import { ptBR } from 'date-fns/locale'

export function GanttChart({ tasks }: { tasks: any[] }) {
  const validTasks = useMemo(() => {
    return tasks
      .filter((t) => t.start_date && t.deadline)
      .sort((a, b) => new Date(a.start_date).getTime() - new Date(b.start_date).getTime())
  }, [tasks])

  if (validTasks.length === 0) {
    return (
      <div className="p-8 text-center text-slate-500 border rounded-xl bg-slate-50/50">
        Nenhuma tarefa com data de início e término definidas para exibir no gráfico.
      </div>
    )
  }

  const minDate = new Date(Math.min(...validTasks.map((t) => new Date(t.start_date).getTime())))
  const maxDate = new Date(Math.max(...validTasks.map((t) => new Date(t.deadline).getTime())))

  const startDate = addDays(minDate, -2)
  const endDate = addDays(maxDate, 2)
  const totalDays = differenceInDays(endDate, startDate) + 1

  const days = Array.from({ length: totalDays }).map((_, i) => addDays(startDate, i))

  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden flex flex-col">
      <div className="p-4 border-b border-slate-100 bg-slate-50 flex justify-between items-center">
        <h3 className="font-bold text-brand-blue">Cronograma de Projetos</h3>
      </div>
      <div className="overflow-x-auto">
        <div className="min-w-[800px] p-4">
          <div className="flex border-b border-slate-200 pb-2 mb-2">
            <div className="w-48 flex-shrink-0 font-semibold text-xs text-slate-500 uppercase">
              Projeto / Cliente
            </div>
            <div className="flex-1 flex">
              {days.map((day, i) => (
                <div
                  key={i}
                  className="flex-1 text-center text-[10px] text-slate-400 border-l border-slate-100"
                >
                  {format(day, 'dd/MM')}
                </div>
              ))}
            </div>
          </div>
          <div className="space-y-3">
            {validTasks.map((task) => {
              const tStart = new Date(task.start_date)
              const tEnd = new Date(task.deadline)

              const startOffset = differenceInDays(tStart, startDate)
              const duration = differenceInDays(tEnd, tStart) + 1

              const leftPercent = (startOffset / totalDays) * 100
              const widthPercent = (duration / totalDays) * 100

              const clientName =
                task.quotes?.client_name || task.quotes?.data?.client?.razaoSocial || 'Cliente'
              const orderNumber = task.quotes?.order_number || 'Sem número'

              return (
                <div key={task.id} className="flex items-center group">
                  <div className="w-48 flex-shrink-0 pr-2 flex flex-col">
                    <span className="truncate text-xs font-bold text-slate-800">{orderNumber}</span>
                    <span className="truncate text-[10px] text-slate-500">{clientName}</span>
                  </div>
                  <div className="flex-1 relative h-8 bg-slate-50 rounded-md border border-slate-100 overflow-hidden">
                    <div
                      className="absolute top-1 bottom-1 bg-brand-blue rounded shadow-sm flex items-center px-2 min-w-[20px] transition-all hover:bg-blue-600 cursor-pointer"
                      style={{ left: `${leftPercent}%`, width: `${widthPercent}%` }}
                      title={`${orderNumber} (${format(tStart, 'dd/MM')} - ${format(tEnd, 'dd/MM')})`}
                    >
                      <span className="text-[10px] text-white font-bold truncate">{duration}d</span>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </div>
  )
}
