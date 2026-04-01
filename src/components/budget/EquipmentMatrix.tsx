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
import { Label } from '@/components/ui/label'
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
  const [equipment, setEquipment] = useState('')
  const [method, setMethod] = useState('')

  const handleAdd = (type: string, data: any) => {
    onAdd({ type, data: { ...data, method } })
    setEquipment('')
    setMethod('')
  }

  return (
    <div className="space-y-6">
      {equipments.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6 animate-fade-in-up">
          {equipments.map((eq: any, i: number) => (
            <Card
              key={i}
              className="border-l-4 border-l-[#d62828] shadow-sm relative overflow-hidden"
            >
              <CardHeader className="p-4 pb-2 flex flex-row justify-between items-start">
                <div>
                  <CardTitle className="text-sm font-bold text-[#1e4b8f]">{eq.type}</CardTitle>
                  <p className="text-[10px] uppercase text-muted-foreground font-semibold mt-1">
                    {eq.data.method}
                  </p>
                </div>
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
                <p
                  className="text-xs text-muted-foreground truncate"
                  title={JSON.stringify(eq.data)}
                >
                  {eq.data.dimensoes ? `Dim: ${eq.data.dimensoes}` : 'Ver detalhes...'}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <Card className="border-t-4 border-t-[#d62828] shadow-sm">
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2 text-[#d62828]">
            <Wrench className="w-5 h-5" /> Matriz de Lógica de Navegação
          </CardTitle>
          <CardDescription>
            Siga os gatilhos para configurar as especificações técnicas de forma precisa.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label>1. Selecione o Equipamento</Label>
              <Select
                value={equipment}
                onValueChange={(v) => {
                  setEquipment(v)
                  setMethod('')
                }}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Escolha um equipamento..." />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="cart">Carrinho (Cart)</SelectItem>
                  <SelectItem value="flowrack">Flow Rack</SelectItem>
                  <SelectItem value="bancada">Bancada / Estante</SelectItem>
                  <SelectItem value="esteira">Esteira</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {equipment && (
              <div className="space-y-2 animate-fade-in-up">
                <Label>2. Método de Construção</Label>
                <Select value={method} onValueChange={setMethod}>
                  <SelectTrigger>
                    <SelectValue placeholder="Escolha o método..." />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="lean">Lean Pipe (Modular)</SelectItem>
                    <SelectItem value="soldado">Soldado</SelectItem>
                    <SelectItem value="hibrido">Híbrido</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            )}
          </div>

          {equipment && method && (
            <div className="mt-8 pt-6 border-t animate-fade-in-up">
              <h3 className="font-semibold text-lg text-[#1e4b8f] mb-4">
                3. Especificações Técnicas
              </h3>
              <div className="bg-slate-50 p-4 md:p-6 rounded-xl border">
                {equipment === 'cart' && (
                  <CartForm method={method} onAdd={(d: any) => handleAdd('Carrinho', d)} />
                )}
                {equipment === 'flowrack' && (
                  <FlowRackForm method={method} onAdd={(d: any) => handleAdd('Flow Rack', d)} />
                )}
                {equipment === 'bancada' && (
                  <BancadaForm
                    method={method}
                    onAdd={(d: any) => handleAdd('Bancada/Estante', d)}
                  />
                )}
                {equipment === 'esteira' && (
                  <EsteiraForm method={method} onAdd={(d: any) => handleAdd('Esteira', d)} />
                )}
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
