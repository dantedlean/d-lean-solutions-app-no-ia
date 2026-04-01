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

export function EsteiraForm({ method, onAdd }: { method: string; onAdd: (data: any) => void }) {
  const [data, setData] = useState<any>({
    base: 'niveladores',
    transportador: 'rolos',
    modulo: 'individual',
  })
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
          <Label>Carga Total (kg)</Label>
          <Input type="number" onChange={(e) => update('cargaTotal', e.target.value)} />
        </div>
        <div className="space-y-2">
          <Label>Carga Pontual (kg)</Label>
          <Input type="number" onChange={(e) => update('cargaPontual', e.target.value)} />
        </div>
        <div className="space-y-2">
          <Label>Nº de Níveis</Label>
          <Input type="number" onChange={(e) => update('nNiveis', e.target.value)} />
        </div>

        <div className="space-y-2">
          <Label>Tipo de Transportador</Label>
          <Select value={data.transportador} onValueChange={(v) => update('transportador', v)}>
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
          <Label>Material</Label>
          <Select onValueChange={(v) => update('material', v)}>
            <SelectTrigger>
              <SelectValue placeholder="Selecione" />
            </SelectTrigger>
            <SelectContent>
              {data.transportador === 'rolos' ? (
                <>
                  <SelectItem value="pvc">PVC</SelectItem>
                  <SelectItem value="aco">Aço</SelectItem>
                </>
              ) : (
                <>
                  <SelectItem value="aluminio">Alumínio</SelectItem>
                  <SelectItem value="aco">Aço</SelectItem>
                  <SelectItem value="importado">Importado</SelectItem>
                </>
              )}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label>Ajuste Altura/Inclinação</Label>
          <Select onValueChange={(v) => update('ajuste', v)}>
            <SelectTrigger>
              <SelectValue placeholder="Selecione" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="fixo">Fixo</SelectItem>
              <SelectItem value="ajustavel">Ajustável</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label>Módulo</Label>
          <Select value={data.modulo} onValueChange={(v) => update('modulo', v)}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="individual">Individual</SelectItem>
              <SelectItem value="conectado">Conectado</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {data.modulo === 'conectado' && (
          <div className="space-y-2 animate-fade-in">
            <Label>Tipo de Travas</Label>
            <Select onValueChange={(v) => update('travas', v)}>
              <SelectTrigger>
                <SelectValue placeholder="Selecione" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="sim">Sim</SelectItem>
                <SelectItem value="nao">Não</SelectItem>
              </SelectContent>
            </Select>
          </div>
        )}
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
        <Plus className="w-4 h-4 mr-2" /> Adicionar Esteira ao Conjunto
      </Button>
    </div>
  )
}
