import { useState } from 'react'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Button } from '@/components/ui/button'
import { Plus } from 'lucide-react'

export function FlowRackForm({ onAdd }: { onAdd: (data: any) => void }) {
  const [data, setData] = useState({
    dimensoes: '',
    níveis: '',
    trilho: 'pvc',
    base: 'niveladores',
    acabamento: 'revestido',
  })
  const update = (k: string, v: any) => setData((p) => ({ ...p, [k]: v }))

  return (
    <div className="space-y-4 animate-fade-in">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>Dimensões Externas</Label>
          <Input onChange={(e) => update('dimensoes', e.target.value)} />
        </div>
        <div className="space-y-2">
          <Label>N° de Níveis</Label>
          <Input type="number" onChange={(e) => update('níveis', e.target.value)} />
        </div>

        <div className="space-y-2">
          <Label>Tipo de Trilho</Label>
          <Select value={data.trilho} onValueChange={(v) => update('trilho', v)}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="pvc">Roletes (PVC)</SelectItem>
              <SelectItem value="aco">Roletes (Aço)</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label>Base</Label>
          <Select value={data.base} onValueChange={(v) => update('base', v)}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="niveladores">Niveladores</SelectItem>
              <SelectItem value="fixo">Fixo ao Piso</SelectItem>
              <SelectItem value="rodizios">Rodízios</SelectItem>
              <SelectItem value="misto">Misto</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label>Acabamento (Lean Pipe)</Label>
          <Select value={data.acabamento} onValueChange={(v) => update('acabamento', v)}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="revestido">Tubo Revestido</SelectItem>
              <SelectItem value="inox">Tubo Inox</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      <Button
        onClick={() => onAdd(data)}
        disabled={!data.dimensoes}
        className="w-full bg-[#1e4b8f] hover:bg-[#1e4b8f]/90 text-white"
      >
        <Plus className="w-4 h-4 mr-2" /> Adicionar Flow Rack ao Conjunto
      </Button>
    </div>
  )
}
