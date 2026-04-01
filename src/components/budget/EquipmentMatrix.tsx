import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Wrench, Trash2 } from 'lucide-react'
import { CartForm } from './forms/CartForm'
import { FlowRackForm } from './forms/FlowRackForm'
import { BancadaForm } from './forms/BancadaForm'
import { EsteiraForm } from './forms/EsteiraForm'

export function EquipmentMatrix({
  equipments,
  onAdd,
  onRemove,
}: {
  equipments: any[]
  onAdd: (eq: any) => void
  onRemove: (idx: number) => void
}) {
  const [type, setType] = useState('cart')

  return (
    <div className="space-y-6">
      {equipments.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6 animate-fade-in-up">
          {equipments.map((eq: any, i: number) => (
            <Card key={i} className="border-l-4 border-l-[#d62828] shadow-sm">
              <CardHeader className="p-4 pb-2 flex flex-row justify-between items-start">
                <CardTitle className="text-sm font-bold text-[#1e4b8f]">{eq.type}</CardTitle>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => onRemove(i)}
                  className="h-6 w-6 text-destructive hover:bg-destructive/10"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </CardHeader>
              <CardContent className="p-4 pt-0">
                <p className="text-xs text-muted-foreground break-all">
                  {JSON.stringify(eq.data).substring(0, 70)}...
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <Card className="border-t-4 border-t-[#d62828] shadow-sm">
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2 text-[#d62828]">
            <Wrench className="w-5 h-5" /> Matriz de Engenharia
          </CardTitle>
          <CardDescription>
            Configure os requisitos técnicos para adicionar ao conjunto do orçamento.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="w-full md:w-1/3">
            <Select value={type} onValueChange={setType}>
              <SelectTrigger>
                <SelectValue placeholder="Tipo de Equipamento" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="cart">Carrinho (Cart)</SelectItem>
                <SelectItem value="flowrack">Flow Rack</SelectItem>
                <SelectItem value="bancada">Bancada / Estante</SelectItem>
                <SelectItem value="esteira">Esteira</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="bg-slate-50 p-4 md:p-6 rounded-lg border">
            {type === 'cart' && (
              <CartForm onAdd={(d: any) => onAdd({ type: 'Carrinho', data: d })} />
            )}
            {type === 'flowrack' && (
              <FlowRackForm onAdd={(d: any) => onAdd({ type: 'Flow Rack', data: d })} />
            )}
            {type === 'bancada' && (
              <BancadaForm onAdd={(d: any) => onAdd({ type: 'Bancada / Estante', data: d })} />
            )}
            {type === 'esteira' && (
              <EsteiraForm onAdd={(d: any) => onAdd({ type: 'Esteira', data: d })} />
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
