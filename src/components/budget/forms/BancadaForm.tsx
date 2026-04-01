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
import { Checkbox } from '@/components/ui/checkbox'
import { Plus } from 'lucide-react'

export function BancadaForm({ onAdd }: { onAdd: (data: any) => void }) {
  const [data, setData] = useState({
    dimensoes: '',
    material: 'mdf',
    base: 'niveladores',
    acabamento: 'revestido',
    gavetas: false,
    iluminacao: false,
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
          <Label>Material do Tampo</Label>
          <Select value={data.material} onValueChange={(v) => update('material', v)}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="aco">Aço</SelectItem>
              <SelectItem value="inox">Inox</SelectItem>
              <SelectItem value="mdf">MDF</SelectItem>
              <SelectItem value="plastico">Plástico</SelectItem>
              <SelectItem value="recoberto">Recoberto</SelectItem>
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

        <div className="space-y-3 col-span-1 md:col-span-2">
          <Label>Acessórios</Label>
          <div className="flex gap-6">
            <div className="flex items-center space-x-2">
              <Checkbox
                id="gav"
                checked={data.gavetas}
                onCheckedChange={(v) => update('gavetas', v)}
              />
              <Label htmlFor="gav">Gavetas</Label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox
                id="ilu"
                checked={data.iluminacao}
                onCheckedChange={(v) => update('iluminacao', v)}
              />
              <Label htmlFor="ilu">Iluminação</Label>
            </div>
          </div>
        </div>
      </div>
      <Button
        onClick={() => onAdd(data)}
        disabled={!data.dimensoes}
        className="w-full bg-[#1e4b8f] hover:bg-[#1e4b8f]/90 text-white"
      >
        <Plus className="w-4 h-4 mr-2" /> Adicionar Bancada ao Conjunto
      </Button>
    </div>
  )
}
