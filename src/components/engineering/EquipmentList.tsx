import { Package } from 'lucide-react'

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

export function EquipmentList({ equipments }: { equipments: any[] }) {
  return (
    <div>
      <h3 className="text-xl font-bold text-slate-900 mb-4 flex items-center">
        <Package className="w-6 h-6 mr-2 text-blue-600" />
        Configuração dos Produtos
      </h3>

      {equipments?.length > 0 ? (
        <div className="space-y-6">
          {equipments.map((eq: any, idx: number) => (
            <div
              key={idx}
              className="border border-slate-200 rounded-xl bg-white shadow-sm overflow-hidden"
            >
              <div className="bg-slate-800 text-white px-5 py-3 flex justify-between items-center">
                <span className="font-bold text-lg">
                  {eq.name || eq.type || eq.equipamento || 'Equipamento não especificado'}
                </span>
                <span className="text-sm font-mono text-slate-300 bg-slate-700 px-2 py-1 rounded">
                  Item #{idx + 1}
                </span>
              </div>

              <div className="p-5">
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                  {Object.entries({ ...eq, ...(eq.data || {}) })
                    .filter(([k]) => !['id', 'type', 'name', 'equipamento', 'data'].includes(k))
                    .map(([key, value]) => {
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
                          <span className="font-medium text-slate-900 break-words">{rendered}</span>
                        </div>
                      )
                    })}
                </div>

                {Object.entries({ ...eq, ...(eq.data || {}) })
                  .filter(([k]) => !['id', 'type', 'name', 'equipamento', 'data'].includes(k))
                  .filter(([_, v]) => renderValue(v) !== '-').length === 0 && (
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
          <p className="text-slate-500 font-medium">Nenhum equipamento detalhado nesta cotação.</p>
        </div>
      )}
    </div>
  )
}
