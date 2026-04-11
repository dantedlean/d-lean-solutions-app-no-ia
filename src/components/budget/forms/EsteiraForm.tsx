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
    <div className="space-y-8 animate-fade-in">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="space-y-2 md:col-span-2">
          <Label>Dimensões Totais do Transportador (C x L x A) mm</Label>
          <Input
            placeholder="Ex: 3000 x 600 x 900"
            onChange={(e) => update('dimensoes', e.target.value)}
          />
        </div>
        <div className="space-y-2">
          <Label>Largura Útil de Transporte (mm)</Label>
          <Input
            type="number"
            placeholder="Ex: 500"
            onChange={(e) => update('larguraUtil', e.target.value)}
          />
        </div>
        <div className="space-y-2">
          <Label>Carga Total na Linha (kg)</Label>
          <Input
            type="number"
            placeholder="Ex: 1000"
            onChange={(e) => update('cargaTotal', e.target.value)}
          />
        </div>
        <div className="space-y-2">
          <Label>Carga Pontual (kg / metro ou pallet)</Label>
          <Input
            type="number"
            placeholder="Ex: 200"
            onChange={(e) => update('cargaPontual', e.target.value)}
          />
        </div>
        <div className="space-y-2">
          <Label>Nº de Níveis de Transporte</Label>
          <Input
            type="number"
            placeholder="Ex: 1"
            onChange={(e) => update('nNiveis', e.target.value)}
          />
        </div>
      </div>

      <div className="border p-5 rounded-xl bg-slate-50/50 shadow-sm border-slate-200">
        <h4 className="font-bold text-sm text-[#1e4b8f] mb-4 uppercase tracking-wider">
          Mecânica de Transporte
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="space-y-2">
            <Label>Tipo de Elemento Transportador</Label>
            <Select
              defaultValue={data.transportador}
              onValueChange={(v) => update('transportador', v)}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="rolos">Rolos Livres (Gravidade/Empurre)</SelectItem>
                <SelectItem value="trilhos">Trilho de Roletes (Flow Rack)</SelectItem>
                <SelectItem value="correia">Correia / Lona (Plana)</SelectItem>
                <SelectItem value="modular">Plástico Modular (Intralox)</SelectItem>
                <SelectItem value="esferas">Mesa de Esferas Transferidoras</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {(data.transportador === 'rolos' || data.transportador === 'trilhos') && (
            <div className="space-y-2 animate-fade-in">
              <Label>Passo dos Rolos (Pitch) mm</Label>
              <Input
                type="number"
                placeholder="Ex: 50, 75, 100"
                onChange={(e) => update('passoRolos', e.target.value)}
              />
            </div>
          )}

          <div className="space-y-2">
            <Label>Material do Elemento (Rolete/Correia)</Label>
            <Select onValueChange={(v) => update('materialTransportador', v)}>
              <SelectTrigger>
                <SelectValue placeholder="Selecione" />
              </SelectTrigger>
              <SelectContent>
                {data.transportador === 'rolos' || data.transportador === 'trilhos' ? (
                  <>
                    <SelectItem value="pvc">Rolete de PVC</SelectItem>
                    <SelectItem value="aco_carbono">Rolete de Aço Carbono</SelectItem>
                    <SelectItem value="inox">Rolete de Inox</SelectItem>
                    <SelectItem value="aluminio">Rolete de Alumínio</SelectItem>
                  </>
                ) : (
                  <>
                    <SelectItem value="pvc">Correia PVC (Verde/Preta)</SelectItem>
                    <SelectItem value="pu">Correia PU (Alimentos)</SelectItem>
                    <SelectItem value="acetal">Plástico Acetal / PP</SelectItem>
                  </>
                )}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Guias Laterais (Contenção)</Label>
            <Select onValueChange={(v) => update('guiasLaterais', v)}>
              <SelectTrigger>
                <SelectValue placeholder="Nenhuma" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="fixa_chapa">Guia Fixa em Chapa</SelectItem>
                <SelectItem value="fixa_tubo">Guia Fixa em Tubo</SelectItem>
                <SelectItem value="ajustavel">Guia Ajustável (Manípulo)</SelectItem>
                <SelectItem value="nao">Nenhuma</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Rolete / Placa de Freio (Gravidade)</Label>
            <Select onValueChange={(v) => update('roleteFreio', v)}>
              <SelectTrigger>
                <SelectValue placeholder="Não" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="sim">Sim (Controle de velocidade)</SelectItem>
                <SelectItem value="nao">Não</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Ajuste de Altura / Inclinação</Label>
            <Select onValueChange={(v) => update('ajuste', v)}>
              <SelectTrigger>
                <SelectValue placeholder="Selecione" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="fixo">Fixo (Sem regulagem)</SelectItem>
                <SelectItem value="sapatas">Ajuste Fino (+/- 50mm por Sapatas)</SelectItem>
                <SelectItem value="telescopico">Pés Telescópicos (Grande variação)</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Conectividade (Módulos)</Label>
            <Select defaultValue={data.modulo} onValueChange={(v) => update('modulo', v)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="individual">Módulo Individual Standalone</SelectItem>
                <SelectItem value="conectado">Parte de Linha Conectada</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {data.modulo === 'conectado' && (
            <div className="space-y-2 animate-fade-in">
              <Label>Tipo de Travas / Engate entre Módulos</Label>
              <Select onValueChange={(v) => update('travas', v)}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="gancho">Ganchos Rápidos</SelectItem>
                  <SelectItem value="parafusado">Placa Parafusada (Fixo)</SelectItem>
                  <SelectItem value="nao">Apenas Encostado</SelectItem>
                </SelectContent>
              </Select>
            </div>
          )}
        </div>
      </div>

      <div className="border p-5 rounded-xl bg-slate-50/50 shadow-sm border-slate-200">
        <h4 className="font-bold text-sm text-[#1e4b8f] mb-4 uppercase tracking-wider">
          Base da Estrutura
        </h4>
        <div className="space-y-4">
          <div className="space-y-2 md:w-1/3">
            <Label>Tipo de Apoio ao Solo</Label>
            <Select defaultValue={data.base} onValueChange={(v) => update('base', v)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="niveladores">Pés Niveladores (Sapatas)</SelectItem>
                <SelectItem value="fixo">Sapata de Fixação (Chumbador)</SelectItem>
                <SelectItem value="rodizios">Rodízios (Móvel)</SelectItem>
                <SelectItem value="misto">Misto (Nivelador + Rodízio)</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {(data.base === 'rodizios' || data.base === 'misto') && (
            <div className="animate-fade-in-up">
              <div className="space-y-2 mb-4 md:w-1/3">
                <Label>Altura da Base (Chão ao Chassi) mm</Label>
                <Input type="number" onChange={(e) => update('alturaBase', e.target.value)} />
              </div>
              <CasterSection data={data} update={update} baseHeight={data.alturaBase} />
            </div>
          )}
        </div>
      </div>

      <FinishingSection method={method} data={data} update={update} />
      <Button
        onClick={() => onAdd(data)}
        disabled={isError || !data.dimensoes}
        className="w-full bg-[#1e4b8f] hover:bg-[#1e4b8f]/90 mt-8 h-12 text-md font-semibold"
      >
        <Plus className="w-5 h-5 mr-2" /> Adicionar Esteira / Transportador
      </Button>
    </div>
  )
}
