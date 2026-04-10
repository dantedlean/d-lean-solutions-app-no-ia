import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Plus, Trash2, Copy } from 'lucide-react'

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
  return (
    <Card className="border-brand-blue/20 shadow-sm overflow-hidden">
      <CardHeader className="flex flex-col sm:flex-row sm:items-center justify-between bg-slate-50/80 border-b pb-4 gap-4">
        <div>
          <CardTitle className="text-xl text-brand-blue">Matriz de Equipamentos</CardTitle>
          <CardDescription>
            Configure as especificações técnicas detalhadas de cada item
          </CardDescription>
        </div>
        <Button
          onClick={() =>
            onAdd({
              id: Math.random().toString(),
              type: 'Bancada',
              method: 'Lean Pipe (Modular)',
              data: { quantidade: 1, nNiveis: 1 },
            })
          }
          className="bg-brand-orange hover:bg-brand-orange/90 text-white shrink-0"
        >
          <Plus className="w-4 h-4 mr-2" /> Adicionar Item
        </Button>
      </CardHeader>
      <CardContent className="space-y-6 pt-6">
        {equipments.length === 0 && (
          <div className="text-center py-10 text-muted-foreground border-2 border-dashed border-slate-200 rounded-xl bg-slate-50/50">
            Nenhum equipamento adicionado ao projeto ainda.
            <br />
            Clique em "Adicionar Item" para iniciar a configuração.
          </div>
        )}
        {equipments.map((eq, index) => (
          <div
            key={eq.id}
            className="p-5 border border-slate-200 rounded-xl space-y-5 relative bg-white shadow-sm transition-all hover:shadow-md hover:border-brand-blue/30"
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b pb-3 gap-3">
              <h4 className="font-bold text-brand-blue flex items-center gap-2 text-lg">
                <span className="bg-blue-100 text-brand-blue w-7 h-7 rounded-full flex items-center justify-center text-sm">
                  {index + 1}
                </span>
                {eq.type || 'Novo Equipamento'}
              </h4>
              <div className="flex items-center gap-2 self-end sm:self-auto">
                <Button
                  variant="outline"
                  size="sm"
                  title="Duplicar item"
                  onClick={() =>
                    onAdd({
                      ...eq,
                      id: Math.random().toString(),
                    })
                  }
                  className="text-slate-600 hover:text-brand-blue hover:border-brand-blue hover:bg-blue-50"
                >
                  <Copy className="w-4 h-4" />
                  <span className="ml-2 hidden sm:inline-block text-xs">Duplicar</span>
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  title="Remover item"
                  className="text-destructive hover:bg-destructive hover:text-white border-destructive/30"
                  onClick={() => onRemove(eq.id)}
                >
                  <Trash2 className="w-4 h-4" />
                  <span className="ml-2 hidden sm:inline-block text-xs">Remover</span>
                </Button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-5">
              <div className="space-y-2">
                <Label className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                  Tipo de Estrutura
                </Label>
                <select
                  className="flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm shadow-sm focus:outline-none focus:ring-1 focus:ring-brand-blue"
                  value={eq.type || ''}
                  onChange={(e) => onUpdate && onUpdate(eq.id, { type: e.target.value })}
                >
                  <option value="Bancada">Bancada</option>
                  <option value="Carrinho">Carrinho</option>
                  <option value="Flow Rack">Flow Rack</option>
                  <option value="Quadro de Gestão">Quadro de Gestão</option>
                  <option value="Estante">Estante</option>
                  <option value="Outro">Outro</option>
                </select>
              </div>

              <div className="space-y-2">
                <Label className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                  Método Construtivo
                </Label>
                <select
                  className="flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm shadow-sm focus:outline-none focus:ring-1 focus:ring-brand-blue"
                  value={eq.method || ''}
                  onChange={(e) => onUpdate && onUpdate(eq.id, { method: e.target.value })}
                >
                  <option value="Lean Pipe (Modular)">Lean Pipe (Modular)</option>
                  <option value="Perfil de Alumínio">Perfil de Alumínio</option>
                  <option value="Soldado (Aço Carbono)">Soldado (Aço Carbono)</option>
                  <option value="Híbrido">Híbrido</option>
                </select>
              </div>

              <div className="space-y-2">
                <Label className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                  Quantidade
                </Label>
                <Input
                  type="number"
                  min="1"
                  value={eq.data?.quantidade || 1}
                  onChange={(e) =>
                    onUpdate &&
                    onUpdate(eq.id, { data: { ...eq.data, quantidade: e.target.value } })
                  }
                  placeholder="Ex: 5"
                  className="h-10"
                />
              </div>

              <div className="space-y-2">
                <Label className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                  Dimensões (C x L x A)
                </Label>
                <Input
                  value={eq.data?.dimensoes || ''}
                  onChange={(e) =>
                    onUpdate && onUpdate(eq.id, { data: { ...eq.data, dimensoes: e.target.value } })
                  }
                  placeholder="Ex: 1200x600x900 mm"
                  className="h-10"
                />
              </div>

              <div className="space-y-2">
                <Label className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                  Nº de Níveis/Planos
                </Label>
                <Input
                  type="number"
                  min="1"
                  value={eq.data?.nNiveis || ''}
                  onChange={(e) =>
                    onUpdate && onUpdate(eq.id, { data: { ...eq.data, nNiveis: e.target.value } })
                  }
                  placeholder="Ex: 3"
                  className="h-10"
                />
              </div>

              <div className="space-y-2">
                <Label className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                  Carga Total (kg)
                </Label>
                <Input
                  type="number"
                  value={eq.data?.cargaTotal || eq.data?.carga_tampo || ''}
                  onChange={(e) =>
                    onUpdate &&
                    onUpdate(eq.id, {
                      data: { ...eq.data, cargaTotal: e.target.value, carga_tampo: e.target.value },
                    })
                  }
                  placeholder="Ex: 250"
                  className="h-10"
                />
              </div>

              <div className="space-y-2">
                <Label className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                  Espessura do Tubo
                </Label>
                <select
                  className="flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm shadow-sm focus:outline-none focus:ring-1 focus:ring-brand-blue"
                  value={eq.data?.espessuraTubo || ''}
                  onChange={(e) =>
                    onUpdate &&
                    onUpdate(eq.id, { data: { ...eq.data, espessuraTubo: e.target.value } })
                  }
                >
                  <option value="">Selecione...</option>
                  <option value="1.0mm">1.0mm (Carga Leve)</option>
                  <option value="1.2mm">1.2mm (Carga Padrão)</option>
                  <option value="2.0mm">2.0mm (Carga Pesada)</option>
                </select>
              </div>

              <div className="space-y-2">
                <Label className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                  Cor da Estrutura
                </Label>
                <select
                  className="flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm shadow-sm focus:outline-none focus:ring-1 focus:ring-brand-blue"
                  value={eq.data?.corTubo || ''}
                  onChange={(e) =>
                    onUpdate && onUpdate(eq.id, { data: { ...eq.data, corTubo: e.target.value } })
                  }
                >
                  <option value="">Selecione...</option>
                  <option value="Marfim">Marfim (Padrão Lean)</option>
                  <option value="Cinza">Cinza</option>
                  <option value="Preto">Preto</option>
                  <option value="Azul">Azul</option>
                  <option value="Branco">Branco</option>
                  <option value="Inox/Zincado">Inox/Zincado</option>
                </select>
              </div>

              <div className="space-y-2">
                <Label className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                  Tipo de Base
                </Label>
                <select
                  className="flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm shadow-sm focus:outline-none focus:ring-1 focus:ring-brand-blue"
                  value={eq.data?.base || ''}
                  onChange={(e) =>
                    onUpdate && onUpdate(eq.id, { data: { ...eq.data, base: e.target.value } })
                  }
                >
                  <option value="">Selecione...</option>
                  <option value="Sapatas Niveladoras">Sapatas Niveladoras</option>
                  <option value="Rodízios">Rodízios</option>
                  <option value="Fixação no Piso">Fixação no Piso</option>
                </select>
              </div>

              {eq.data?.base === 'Rodízios' && (
                <div className="space-y-2 animate-fade-in-up">
                  <Label className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                    Diâmetro do Rodízio
                  </Label>
                  <select
                    className="flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm shadow-sm focus:outline-none focus:ring-1 focus:ring-brand-blue"
                    value={eq.data?.diametroRodizio || ''}
                    onChange={(e) =>
                      onUpdate &&
                      onUpdate(eq.id, { data: { ...eq.data, diametroRodizio: e.target.value } })
                    }
                  >
                    <option value="">Selecione...</option>
                    <option value="3 polegadas">3"</option>
                    <option value="4 polegadas">4"</option>
                    <option value="5 polegadas">5"</option>
                    <option value="6 polegadas">6"</option>
                    <option value="8 polegadas">8"</option>
                  </select>
                </div>
              )}

              <div className="space-y-2 md:col-span-2 lg:col-span-2 xl:col-span-2">
                <Label className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                  Acessórios / Observações
                </Label>
                <Input
                  value={eq.data?.observacoes || ''}
                  onChange={(e) =>
                    onUpdate &&
                    onUpdate(eq.id, { data: { ...eq.data, observacoes: e.target.value } })
                  }
                  placeholder="Ex: Tampo em MDF 18mm ESD, Suporte para monitor, Calha de tomadas..."
                  className="h-10"
                />
              </div>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  )
}
