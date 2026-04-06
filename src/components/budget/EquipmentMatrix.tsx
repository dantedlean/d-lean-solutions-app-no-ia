import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Plus, Trash2 } from 'lucide-react'

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
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Equipamentos</CardTitle>
        <Button
          onClick={() => onAdd({ id: Math.random().toString(), type: 'Bancada', data: {} })}
          size="sm"
          variant="outline"
        >
          <Plus className="w-4 h-4 mr-2" /> Adicionar
        </Button>
      </CardHeader>
      <CardContent className="space-y-4">
        {equipments.length === 0 && (
          <p className="text-sm text-muted-foreground">Nenhum equipamento adicionado.</p>
        )}
        {equipments.map((eq) => (
          <div key={eq.id} className="p-4 border rounded-md space-y-4 relative bg-slate-50/50">
            <Button
              variant="ghost"
              size="icon"
              className="absolute top-2 right-2 text-destructive hover:bg-destructive/10"
              onClick={() => onRemove(eq.id)}
            >
              <Trash2 className="w-4 h-4" />
            </Button>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              <div className="space-y-2">
                <Label>Tipo de Equipamento</Label>
                <select
                  className="flex h-9 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm shadow-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                  value={eq.type}
                  onChange={(e) => onUpdate && onUpdate(eq.id, { type: e.target.value })}
                >
                  <option value="Bancada">Bancada</option>
                  <option value="Carrinho">Carrinho</option>
                  <option value="Flow Rack">Flow Rack</option>
                </select>
              </div>
              <div className="space-y-2">
                <Label>Método de Construção</Label>
                <select
                  className="flex h-9 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm shadow-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                  value={eq.method}
                  onChange={(e) => onUpdate && onUpdate(eq.id, { method: e.target.value })}
                >
                  <option value="Soldado">Soldado</option>
                  <option value="Lean Pipe (Modular)">Lean Pipe (Modular)</option>
                  <option value="Híbrido">Híbrido</option>
                </select>
              </div>
              <div className="space-y-2">
                <Label>Dimensões (mm)</Label>
                <Input
                  value={eq.data?.dimensoes || ''}
                  onChange={(e) =>
                    onUpdate && onUpdate(eq.id, { data: { ...eq.data, dimensoes: e.target.value } })
                  }
                  placeholder="Ex: 1000x500x900"
                />
              </div>
              <div className="space-y-2">
                <Label>Carga Tampo (kg)</Label>
                <Input
                  id="carga_tampo"
                  value={eq.data?.carga_tampo || ''}
                  onChange={(e) =>
                    onUpdate &&
                    onUpdate(eq.id, { data: { ...eq.data, carga_tampo: e.target.value } })
                  }
                  placeholder="Ex: 100"
                />
              </div>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  )
}
