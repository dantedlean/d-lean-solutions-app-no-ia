import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Trash2, Copy, Layers } from 'lucide-react'
import { BancadaForm } from './forms/BancadaForm'
import { CartForm } from './forms/CartForm'
import { EsteiraForm } from './forms/EsteiraForm'
import { FlowRackForm } from './forms/FlowRackForm'

export function EquipmentMatrix({
  equipments,
  onAdd,
  onRemove,
  onUpdate,
}: {
  equipments: any[]
  onAdd: (eq: any) => void
  onRemove: (id: string) => void
  onUpdate?: (id: string, data: any) => void
}) {
  const [newType, setNewType] = useState<string>('bancada')
  const [newMethod, setNewMethod] = useState<string>('lean')

  const handleAdd = (data: any) => {
    onAdd({
      id: Math.random().toString(),
      type: newType,
      method: newMethod,
      data,
    })
  }

  return (
    <div className="space-y-6">
      <Card className="border-brand-blue/20 shadow-sm overflow-visible">
        <CardHeader className="bg-slate-50/80 border-b pb-4">
          <CardTitle className="text-xl text-brand-blue flex items-center gap-2">
            <Layers className="w-5 h-5" />
            Configuração de Equipamentos
          </CardTitle>
          <CardDescription>
            Configure as especificações técnicas detalhadas de cada equipamento do seu projeto. Esta
            matriz mantém as regras completas de engenharia originais.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6 pt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-slate-50/50 p-5 rounded-xl border border-slate-200">
            <div className="space-y-2">
              <Label className="text-sm font-bold text-slate-700 uppercase tracking-wider">
                Família do Equipamento
              </Label>
              <Select value={newType} onValueChange={setNewType}>
                <SelectTrigger className="h-12 text-md shadow-sm border-brand-blue/20 focus:ring-brand-blue bg-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="bancada">Bancada / Estante</SelectItem>
                  <SelectItem value="carrinho">Carrinho / Rota</SelectItem>
                  <SelectItem value="flowrack">Flow Rack</SelectItem>
                  <SelectItem value="esteira">Esteira / Transportador</SelectItem>
                  <SelectItem value="quadro">Quadro de Gestão</SelectItem>
                  <SelectItem value="outro">Outro (Genérico)</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label className="text-sm font-bold text-slate-700 uppercase tracking-wider">
                Método Construtivo
              </Label>
              <Select value={newMethod} onValueChange={setNewMethod}>
                <SelectTrigger className="h-12 text-md shadow-sm border-brand-blue/20 focus:ring-brand-blue bg-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="lean">Modular (Lean Pipe)</SelectItem>
                  <SelectItem value="soldado">Soldado (Aço Carbono/Inox)</SelectItem>
                  <SelectItem value="hibrido">Híbrido</SelectItem>
                  <SelectItem value="aluminio">Perfil de Alumínio</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="bg-white p-5 rounded-xl border shadow-sm relative mt-8">
            <div className="absolute -top-3 left-4 bg-white px-2 text-xs font-bold text-brand-orange uppercase tracking-wider">
              Parâmetros Técnicos ({newType})
            </div>
            {newType === 'bancada' && <BancadaForm method={newMethod} onAdd={handleAdd} />}
            {newType === 'carrinho' && <CartForm method={newMethod} onAdd={handleAdd} />}
            {newType === 'esteira' && <EsteiraForm method={newMethod} onAdd={handleAdd} />}
            {newType === 'flowrack' && <FlowRackForm method={newMethod} onAdd={handleAdd} />}
            {(newType === 'quadro' || newType === 'outro') && (
              <div className="space-y-4 pt-2">
                <p className="text-sm text-slate-500">
                  Para este tipo de equipamento, utilize a descrição genérica. Você poderá detalhar
                  mais no campo de observações ao revisar o orçamento.
                </p>
                <Button
                  onClick={() => handleAdd({ dimensoes: 'A definir', observacoes: '' })}
                  className="w-full bg-[#1e4b8f] hover:bg-[#1e4b8f]/90 h-12 text-md font-semibold shadow-sm text-white"
                >
                  Adicionar {newType === 'quadro' ? 'Quadro de Gestão' : 'Item Genérico'} ao Projeto
                </Button>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {equipments.length > 0 && (
        <Card className="border-brand-blue/20 shadow-sm overflow-hidden animate-fade-in">
          <CardHeader className="bg-slate-50/80 border-b pb-4 flex flex-row items-center justify-between">
            <CardTitle className="text-lg text-brand-blue">
              Itens Adicionados ({equipments.length})
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-6 space-y-4">
            {equipments.map((eq, index) => (
              <div
                key={eq.id}
                className="p-5 border border-slate-200 rounded-xl relative bg-white shadow-sm flex flex-col md:flex-row gap-5 justify-between transition-all hover:shadow-md hover:border-brand-blue/30 group"
              >
                <div className="space-y-3 flex-1">
                  <div className="flex items-center gap-3 border-b border-slate-100 pb-3">
                    <span className="bg-blue-100 text-brand-blue w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold shadow-sm shrink-0">
                      {index + 1}
                    </span>
                    <h4 className="font-bold text-brand-blue text-lg capitalize">{eq.type}</h4>
                    <span className="text-xs bg-slate-100 text-slate-600 px-3 py-1 rounded-full capitalize font-medium border border-slate-200">
                      {eq.method}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-x-4 gap-y-4 text-sm pt-2">
                    {Object.entries(eq.data || {}).map(([key, value]) => {
                      if (!value || typeof value === 'object') return null
                      const formattedKey = key
                        .replace(/([A-Z])/g, ' $1')
                        .replace(/^./, (str) => str.toUpperCase())

                      return (
                        <div
                          key={key}
                          className="flex flex-col bg-slate-50/50 p-2 rounded border border-slate-100"
                        >
                          <span className="text-[10px] text-slate-500 font-semibold uppercase tracking-wider mb-1 line-clamp-1 truncate">
                            {formattedKey}
                          </span>
                          <span className="font-medium text-slate-800 break-words line-clamp-2">
                            {String(value)}
                          </span>
                        </div>
                      )
                    })}
                  </div>
                </div>

                <div className="flex md:flex-col items-center gap-2 border-t md:border-t-0 md:border-l border-slate-100 pt-4 md:pt-0 md:pl-4 justify-center shrink-0">
                  <Button
                    variant="outline"
                    size="sm"
                    title="Duplicar Item"
                    onClick={() => onAdd({ ...eq, id: Math.random().toString() })}
                    className="w-full text-slate-600 hover:text-brand-blue hover:bg-blue-50 border-slate-200"
                  >
                    <Copy className="w-4 h-4 md:mr-2" />
                    <span className="hidden md:inline font-medium">Duplicar</span>
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    title="Remover Item"
                    className="w-full text-destructive hover:bg-destructive hover:text-white border-destructive/30"
                    onClick={() => onRemove(eq.id)}
                  >
                    <Trash2 className="w-4 h-4 md:mr-2" />
                    <span className="hidden md:inline font-medium">Remover</span>
                  </Button>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      )}
    </div>
  )
}
