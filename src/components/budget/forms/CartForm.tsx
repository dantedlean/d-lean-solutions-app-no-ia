import { useState } from 'react'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Button } from '@/components/ui/button'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { AlertTriangle, Plus } from 'lucide-react'

export function CartForm({ onAdd }: { onAdd: (data: any) => void }) {
  const [data, setData] = useState({
    dimensoes: '',
    alturaBase: '',
    rodizio: '4',
    tracao: 'manual',
    reboqueQtd: '',
    reboqueRaio: '',
    reboqueEspacamento: '',
    puxador: false,
    freio: false,
    acabamento: 'revestido',
  })

  const update = (k: string, v: any) => setData((p) => ({ ...p, [k]: v }))

  const casterMm = parseInt(data.rodizio) * 25.4
  const altura = parseFloat(data.alturaBase)
  const isCritical = altura > 0 && altura <= casterMm

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="space-y-2">
          <Label>Dimensões Externas (C x L x A)</Label>
          <Input
            placeholder="1000 x 800 x 900 mm"
            onChange={(e) => update('dimensoes', e.target.value)}
          />
        </div>
        <div className="space-y-2">
          <Label>Diâmetro do Rodízio</Label>
          <Select value={data.rodizio} onValueChange={(v) => update('rodizio', v)}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {['2', '3', '4', '5', '6', '8', '10'].map((n) => (
                <SelectItem key={n} value={n}>
                  {n}"
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <p className="text-[10px] text-muted-foreground">Base automática (sem input).</p>
        </div>
        <div className="space-y-2">
          <Label>Altura Máxima (Base ao Solo) mm</Label>
          <Input
            type="number"
            placeholder="Ex: 150"
            onChange={(e) => update('alturaBase', e.target.value)}
            className={isCritical ? 'border-red-500' : ''}
          />
        </div>
      </div>

      {isCritical && (
        <Alert variant="destructive" className="bg-[#d62828]/10 border-[#d62828] text-[#d62828]">
          <AlertTriangle className="h-4 w-4" />
          <AlertTitle>Medida Crítica Detectada!</AlertTitle>
          <AlertDescription>
            A Altura Máxima da Base ({data.alturaBase}mm) não pode ser menor ou igual ao diâmetro do
            rodízio ({casterMm.toFixed(1)}mm).
          </AlertDescription>
        </Alert>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-4 border rounded-lg bg-white">
        <div className="space-y-4">
          <Label>Tração</Label>
          <RadioGroup
            value={data.tracao}
            onValueChange={(v) => update('tracao', v)}
            className="flex gap-4"
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="manual" id="t-m" />
              <Label htmlFor="t-m">Manual</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="reboque" id="t-r" />
              <Label htmlFor="t-r">Reboque Mecânico</Label>
            </div>
          </RadioGroup>

          {data.tracao === 'reboque' && (
            <div className="grid grid-cols-3 gap-2 p-3 bg-slate-50 rounded border animate-fade-in">
              <div className="space-y-1">
                <Label className="text-xs">N° Carrinhos</Label>
                <Input type="number" onChange={(e) => update('reboqueQtd', e.target.value)} />
              </div>
              <div className="space-y-1">
                <Label className="text-xs">Raio Curva</Label>
                <Input placeholder="mm" onChange={(e) => update('reboqueRaio', e.target.value)} />
              </div>
              <div className="space-y-1">
                <Label className="text-xs">Espaçamento</Label>
                <Input
                  placeholder="mm"
                  onChange={(e) => update('reboqueEspacamento', e.target.value)}
                />
              </div>
            </div>
          )}
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <Label>Puxador Ergonômico</Label>
            <Switch checked={data.puxador} onCheckedChange={(v) => update('puxador', v)} />
          </div>
          <div className="flex items-center justify-between">
            <Label>Freio</Label>
            <Switch checked={data.freio} onCheckedChange={(v) => update('freio', v)} />
          </div>

          <div className="space-y-2 pt-2 border-t">
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
      </div>

      <Button
        onClick={() => onAdd(data)}
        disabled={isCritical || !data.dimensoes}
        className="w-full bg-[#1e4b8f] hover:bg-[#1e4b8f]/90"
      >
        <Plus className="w-4 h-4 mr-2" /> Adicionar Carrinho ao Conjunto
      </Button>
    </div>
  )
}
