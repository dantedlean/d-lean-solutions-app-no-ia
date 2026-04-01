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

export function FlowRackForm({ method, onAdd }: { method: string; onAdd: (data: any) => void }) {
  const [data, setData] = useState<any>({ base: 'niveladores', separador: 'nao', conector: 'nao' })
  const update = (k: string, v: any) => setData((p: any) => ({ ...p, [k]: v }))

  const casterMm = parseFloat(data.diametroRodizio || '0') * 25.4
  const height = parseFloat(data.alturaBase || '0')
  const isError = data.base === 'rodizios' && casterMm > 0 && height > 0 && height < casterMm + 20

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>Dimensões (C x L x A)</Label>
          <Input placeholder="mm" onChange={(e) => update('dimensoes', e.target.value)} />
        </div>
        <div className="space-y-2">
          <Label>Medida Entrada/Saída</Label>
          <Input placeholder="mm" onChange={(e) => update('medidaEntradaSaida', e.target.value)} />
        </div>
        <div className="space-y-2">
          <Label>Nº de Níveis</Label>
          <Input type="number" onChange={(e) => update('nNiveis', e.target.value)} />
        </div>
        <div className="space-y-2">
          <Label>Nº Posições por Nível</Label>
          <Input
            placeholder="Ex: Nível 1: 4"
            onChange={(e) => update('nPosicoes', e.target.value)}
          />
        </div>
        <div className="space-y-2">
          <Label>Inclinação (°)</Label>
          <Input type="number" onChange={(e) => update('inclinacao', e.target.value)} />
        </div>

        <div className="space-y-2">
          <Label>Tipo de Trilho</Label>
          <Select value={data.tipoTrilho} onValueChange={(v) => update('tipoTrilho', v)}>
            <SelectTrigger>
              <SelectValue placeholder="Selecione" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="pvc">Roletes (PVC)</SelectItem>
              <SelectItem value="aco">Roletes (Aço)</SelectItem>
              <SelectItem value="aluminio">Trilho de Alumínio</SelectItem>
              <SelectItem value="outro">Outro</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label>Largura do Trilho (mm)</Label>
          <Input type="number" onChange={(e) => update('larguraTrilho', e.target.value)} />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label>Separador</Label>
            <Select onValueChange={(v) => update('separador', v)}>
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
            <Label>Conector</Label>
            <Select onValueChange={(v) => update('conector', v)}>
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

      <div className="border p-4 rounded-md bg-slate-50">
        <h4 className="font-semibold text-sm text-[#1e4b8f] mb-4">Embalagem</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label>Tipo de Embalagem</Label>
            <Select onValueChange={(v) => update('tipoEmbalagem', v)}>
              <SelectTrigger>
                <SelectValue placeholder="Selecione" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="lego">Caixa (Fundo Lego)</SelectItem>
                <SelectItem value="liso">Caixa (Fundo Liso)</SelectItem>
                <SelectItem value="hortifruti">Hortifruti</SelectItem>
                <SelectItem value="papelao">Papelão</SelectItem>
                <SelectItem value="bin">Bin Plástico</SelectItem>
                <SelectItem value="sacaria">Sacaria</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label>Medida (C x L x A) mm</Label>
            <Input onChange={(e) => update('medidaEmbalagem', e.target.value)} />
          </div>
          <div className="space-y-2">
            <Label>Peso (kg)</Label>
            <Input type="number" onChange={(e) => update('pesoEmbalagem', e.target.value)} />
          </div>
          <div className="space-y-2">
            <Label>Qtd por Posição</Label>
            <Input type="number" onChange={(e) => update('qtdPorPosicao', e.target.value)} />
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
        <Plus className="w-4 h-4 mr-2" /> Adicionar Flow Rack ao Conjunto
      </Button>
    </div>
  )
}
