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
import { CasterSection, FinishingSection } from './SharedSections'

export function CartForm({ method, onAdd }: { method: string; onAdd: (data: any) => void }) {
  const [data, setData] = useState<any>({
    tracao: 'manual',
    puxador: 'nao',
    freio: 'nao',
    tipoPiso: 'liso',
  })
  const update = (k: string, v: any) => setData((p: any) => ({ ...p, [k]: v }))

  const casterMm = parseFloat(data.diametroRodizio || '0') * 25.4
  const height = parseFloat(data.alturaBase || '0')
  const isError = casterMm > 0 && height > 0 && height < casterMm + 20

  return (
    <div className="space-y-4 animate-fade-in">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="space-y-2">
          <Label>Dimensões Externas</Label>
          <Input
            placeholder="0000 x 0000 x 0000 mm"
            onChange={(e) => update('dimensoes', e.target.value)}
          />
        </div>
        <div className="space-y-2">
          <Label>Peso do Produto (kg)</Label>
          <Input type="number" onChange={(e) => update('peso', e.target.value)} />
        </div>
        <div className="space-y-2">
          <Label>Carga Total (kg)</Label>
          <Input type="number" onChange={(e) => update('carga', e.target.value)} />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>Tração</Label>
          <Select value={data.tracao} onValueChange={(v) => update('tracao', v)}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="manual">Manual</SelectItem>
              <SelectItem value="reboque">Reboque Mecânico</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {data.tracao === 'reboque' && (
          <div className="grid grid-cols-3 gap-2 bg-slate-100 p-2 rounded animate-fade-in">
            <div className="space-y-1">
              <Label className="text-xs">Nº Carrinhos</Label>
              <Input type="number" onChange={(e) => update('nCarrinhos', e.target.value)} />
            </div>
            <div className="space-y-1">
              <Label className="text-xs">Raio (mm)</Label>
              <Input type="number" onChange={(e) => update('raioCurva', e.target.value)} />
            </div>
            <div className="space-y-1">
              <Label className="text-xs">Espaço (mm)</Label>
              <Input type="number" onChange={(e) => update('espacamento', e.target.value)} />
            </div>
          </div>
        )}

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label>Puxador</Label>
            <Select value={data.puxador} onValueChange={(v) => update('puxador', v)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="sim">Sim</SelectItem>
                <SelectItem value="nao">Não</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label>Freio Manual</Label>
            <Select value={data.freio} onValueChange={(v) => update('freio', v)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="sim">Sim</SelectItem>
                <SelectItem value="nao">Não</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="space-y-2">
          <Label>Tipo de Piso</Label>
          <Select value={data.tipoPiso} onValueChange={(v) => update('tipoPiso', v)}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="bruto">Bruto (Cimento)</SelectItem>
              <SelectItem value="liso">Liso (Polido)</SelectItem>
              <SelectItem value="epoxi">Epóxi</SelectItem>
              <SelectItem value="outro">Outro</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label>Altura Máxima (Base ao Solo) mm</Label>
          <Input
            type="number"
            placeholder="Ex: 150"
            value={data.alturaBase || ''}
            onChange={(e) => update('alturaBase', e.target.value)}
          />
        </div>
      </div>

      <CasterSection data={data} update={update} baseHeight={data.alturaBase} />
      <FinishingSection method={method} data={data} update={update} />

      <Button
        onClick={() => onAdd(data)}
        disabled={isError || !data.dimensoes}
        className="w-full bg-[#1e4b8f] hover:bg-[#1e4b8f]/90 mt-6"
      >
        <Plus className="w-4 h-4 mr-2" /> Adicionar Carrinho ao Conjunto
      </Button>
    </div>
  )
}
