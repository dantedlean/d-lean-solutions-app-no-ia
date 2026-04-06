import { Package } from 'lucide-react'

export function EquipmentList({ equipments }: { equipments: any[] }) {
  if (!equipments?.length) return null

  return (
    <div className="space-y-3">
      <h4 className="text-sm font-semibold flex items-center gap-2 text-slate-800">
        <Package className="w-4 h-4" />
        Equipamentos Solicitados
      </h4>
      <div className="grid gap-4">
        {equipments.map((eq, i) => (
          <div key={i} className="border border-slate-200 rounded-lg p-3.5 bg-slate-50">
            <h5 className="font-bold text-sm text-slate-800 mb-3">{eq.name}</h5>

            {eq.data && (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-xs mb-3 bg-white p-3 rounded-md border border-slate-100 shadow-sm">
                <div>
                  <span className="text-slate-500 block text-[10px] uppercase font-bold mb-0.5">
                    Largura
                  </span>
                  <span className="font-medium text-slate-700">{eq.data.width || '-'}</span>
                </div>
                <div>
                  <span className="text-slate-500 block text-[10px] uppercase font-bold mb-0.5">
                    Altura
                  </span>
                  <span className="font-medium text-slate-700">{eq.data.height || '-'}</span>
                </div>
                <div>
                  <span className="text-slate-500 block text-[10px] uppercase font-bold mb-0.5">
                    Comprimento
                  </span>
                  <span className="font-medium text-slate-700">{eq.data.length || '-'}</span>
                </div>
                <div>
                  <span className="text-slate-500 block text-[10px] uppercase font-bold mb-0.5">
                    Material
                  </span>
                  <span className="font-medium text-slate-700">{eq.data.material || '-'}</span>
                </div>
              </div>
            )}

            {(eq.data?.description || eq.data?.construction_method) && (
              <div className="space-y-2.5 text-xs border-t border-slate-200 pt-3">
                {eq.data?.description && (
                  <div>
                    <span className="text-slate-500 block font-bold text-[10px] uppercase mb-0.5">
                      Descrição Técnica
                    </span>
                    <p className="text-slate-700 leading-relaxed">{eq.data.description}</p>
                  </div>
                )}
                {eq.data?.construction_method && (
                  <div>
                    <span className="text-slate-500 block font-bold text-[10px] uppercase mb-0.5">
                      Método Construtivo
                    </span>
                    <p className="text-slate-700 leading-relaxed">{eq.data.construction_method}</p>
                  </div>
                )}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
