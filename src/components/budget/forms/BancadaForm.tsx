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

export function BancadaForm({ method, onAdd }: { method: string; onAdd: (data: any) => void }) {
  const [data, setData] = useState<any>({ base: 'niveladores', materialTampo: 'mdf' })
  const update = (k: string, v: any) => setData((p: any) => ({ ...p, [k]: v }))

  const casterMm = parseFloat(data.diametroRodizio || '0') * 25.4
  const height = parseFloat(data.alturaBase || '0')
  const isError = data.base === 'rodizios' && casterMm > 0 && height > 0 && height < casterMm + 20

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>Dimensões Externas (C x L x A)</Label>
          <Input placeholder="mm" onChange={(e) => update('dimensoes', e.target.value)} />
        </div>
        <div className="space-y-2">
          <Label>Altura do Tampo Principal (mm)</Label>
          <Input type="number" onChange={(e) => update('alturaTampo', e.target.value)} />
        </div>
        <div className="space-y-2">
          <Label>Carga por Tampo/Prateleira (kg)</Label>
          <Input type="number" onChange={(e) => update('cargaTampo', e.target.value)} />
        </div>
        <div className="space-y-2">
          <Label>Nº de Níveis (para Estante)</Label>
          <Input type="number" onChange={(e) => update('nNiveis', e.target.value)} />
        </div>

        <div className="space-y-2">
          <Label>Material do Tampo</Label>
          <Select value={data.materialTampo} onValueChange={(v) => update('materialTampo', v)}>
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

        {data.materialTampo === 'recoberto' && (
          <div className="space-y-2 animate-fade-in">
            <Label>Tipo de Recobrimento</Label>
            <Select onValueChange={(v) => update('tipoRecobrimento', v)}>
              <SelectTrigger>
                <SelectValue placeholder="Selecione" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="eva">EVA</SelectItem>
                <SelectItem value="inox">Inox</SelectItem>
                <SelectItem value="borracha">Borracha</SelectItem>
                <SelectItem value="outro">Outro</SelectItem>
              </SelectContent>
            </Select>
          </div>
        )}

        <div className="space-y-2">
          <Label>Cor do Tampo</Label>
          <Input onChange={(e) => update('corTampo', e.target.value)} />
        </div>
      </div>

      <div className="border p-4 rounded-md bg-slate-50">
        <h4 className="font-semibold text-sm text-[#1e4b8f] mb-4">Acessórios</h4>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="space-y-2">
            <Label>Gavetas</Label>
            <Select onValueChange={(v) => update('gavetas', v)}>
              <SelectTrigger>
                <SelectValue placeholder="Não" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="sim">Sim</SelectItem>
                <SelectItem value="nao">Não</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label>Iluminação</Label>
            <Select onValueChange={(v) => update('iluminacao', v)}>
              <SelectTrigger>
                <SelectValue placeholder="Não" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="sim">Sim</SelectItem>
                <SelectItem value="nao">Não</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label>Tomadas</Label>
            <Select onValueChange={(v) => update('tomadas', v)}>
              <SelectTrigger>
                <SelectValue placeholder="Não" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="sim">Sim</SelectItem>
                <SelectItem value="nao">Não</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label>Painel Ferr.</Label>
            <Select onValueChange={(v) => update('painel', v)}>
              <SelectTrigger>
                <SelectValue placeholder="Não" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="sim">Sim</SelectItem>
                <SelectItem value="nao">Não</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      <div className="space-y-2">
        <Label>Base da Estrutura</Label>
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

      {data.base === 'rodizios' && (
        <div className="animate-fade-in-up">
          <div className="space-y-2 mb-4">
            <Label>Altura Máxima (Base ao Solo) mm</Label>
            <Input type="number" onChange={(e) => update('alturaBase', e.target.value)} />
          </div>
          <CasterSection data={data} update={update} baseHeight={data.alturaBase} />
        </div>
      )}

      <FinishingSection method={method} data={data} update={update} />
      <Button
        onClick={() => onAdd(data)}
        disabled={isError || !data.dimensoes}
        className="w-full bg-[#1e4b8f] hover:bg-[#1e4b8f]/90 mt-6"
      >
        <Plus className="w-4 h-4 mr-2" /> Adicionar Bancada/Estante ao Conjunto
      </Button>
    </div>
  )
}
