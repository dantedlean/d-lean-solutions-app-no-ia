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

export function EsteiraForm({ onAdd }: { onAdd: (data: any) => void }) {
  const [data, setData] = useState({
    dimensoes: '',
    tipo: 'rolos',
    material: 'pvc',
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
          <Label>Tipo de Transportador</Label>
          <Select value={data.tipo} onValueChange={(v) => update('tipo', v)}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="rolos">Rolos Livres</SelectItem>
              <SelectItem value="trilhos">Trilhos</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label>Material (Rolos/Trilhos)</Label>
          <Select value={data.material} onValueChange={(v) => update('material', v)}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="pvc">PVC</SelectItem>
              <SelectItem value="aco">Aço</SelectItem>
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
        <Plus className="w-4 h-4 mr-2" /> Adicionar Esteira ao Conjunto
      </Button>
    </div>
  )
}
