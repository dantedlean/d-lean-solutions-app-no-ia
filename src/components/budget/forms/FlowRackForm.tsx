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
    <div className="space-y-8 animate-fade-in">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="space-y-2 md:col-span-2">
          <Label>Dimensões Totais da Estrutura (C x L x A) mm</Label>
          <Input
            placeholder="Ex: 1500 x 2000 x 2200"
            onChange={(e) => update('dimensoes', e.target.value)}
          />
        </div>
        <div className="space-y-2">
          <Label>Medida Útil Entrada/Saída Caixas (mm)</Label>
          <Input
            placeholder="Ex: 400"
            onChange={(e) => update('medidaEntradaSaida', e.target.value)}
          />
        </div>
        <div className="space-y-2">
          <Label>Nº de Níveis de Abastecimento</Label>
          <Input
            type="number"
            placeholder="Ex: 3"
            onChange={(e) => update('nNiveis', e.target.value)}
          />
        </div>
        <div className="space-y-2">
          <Label>Nº de Posições (Pistas) por Nível</Label>
          <Input
            placeholder="Ex: Nível 1: 4 pistas"
            onChange={(e) => update('nPosicoes', e.target.value)}
          />
        </div>
        <div className="space-y-2">
          <Label>Inclinação Estimada (°)</Label>
          <Input
            type="number"
            placeholder="Ex: 5"
            onChange={(e) => update('inclinacao', e.target.value)}
          />
        </div>
      </div>

      <div className="border p-5 rounded-xl bg-slate-50/50 shadow-sm border-slate-200">
        <h4 className="font-bold text-sm text-[#1e4b8f] mb-4 uppercase tracking-wider">
          Sistema de Deslizamento
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="space-y-2">
            <Label>Tipo de Trilho (Pista)</Label>
            <Select value={data.tipoTrilho} onValueChange={(v) => update('tipoTrilho', v)}>
              <SelectTrigger>
                <SelectValue placeholder="Selecione" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="pvc">Roletes de PVC (Padrão 40mm)</SelectItem>
                <SelectItem value="aco">Roletes de Aço</SelectItem>
                <SelectItem value="omni">Roletes Omnidirecionais</SelectItem>
                <SelectItem value="aluminio">Perfil Deslizante Alumínio</SelectItem>
                <SelectItem value="chapa_lisa">Chapa Lisa com Deslizante (UHMW)</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Passo dos Roletes (Pitch) mm</Label>
            <Input
              type="number"
              placeholder="Ex: 50"
              onChange={(e) => update('passoRoletes', e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label>Largura do Trilho (mm)</Label>
            <Input
              type="number"
              placeholder="Ex: 40"
              onChange={(e) => update('larguraTrilho', e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label>Separadores de Pista (Guias)</Label>
            <Select onValueChange={(v) => update('separador', v)}>
              <SelectTrigger>
                <SelectValue placeholder="Não" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="tubo">Tubo Modular (Lean)</SelectItem>
                <SelectItem value="perfil_aluminio">Perfil de Alumínio</SelectItem>
                <SelectItem value="chapa">Guia em Chapa Dobrada</SelectItem>
                <SelectItem value="nao">Não</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Aparador Frontal (Stop)</Label>
            <Select onValueChange={(v) => update('aparadorFrontal', v)}>
              <SelectTrigger>
                <SelectValue placeholder="Tubo Padrão" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="tubo">Tubo Estrutural</SelectItem>
                <SelectItem value="chapa_inclinada">
                  Chapa Dobrada Inclinada (Ergonômico)
                </SelectItem>
                <SelectItem value="chapa_reta">Chapa Dobrada Reta</SelectItem>
                <SelectItem value="bandeja">Bandeja de Coleta</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Conector Rápido (Engate Flow Rack)</Label>
            <Select onValueChange={(v) => update('conector', v)}>
              <SelectTrigger>
                <SelectValue placeholder="Não" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="sim">Sim (Para acoplamento em linha)</SelectItem>
                <SelectItem value="nao">Não</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Retorno de Embalagem Vazia</Label>
            <Select onValueChange={(v) => update('retornoVazios', v)}>
              <SelectTrigger>
                <SelectValue placeholder="Não" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="nivel_superior">Sim (Nível Superior Invertido)</SelectItem>
                <SelectItem value="nivel_inferior">Sim (Nível Inferior Invertido)</SelectItem>
                <SelectItem value="lateral">Sim (Pista Lateral Invertida)</SelectItem>
                <SelectItem value="nao">Não</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      <div className="border p-5 rounded-xl bg-slate-50/50 shadow-sm border-slate-200">
        <h4 className="font-bold text-sm text-[#1e4b8f] mb-4 uppercase tracking-wider">
          Dados do Produto/Embalagem (Carga)
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="space-y-2 md:col-span-2">
            <Label>Tipo de Embalagem / Caixa</Label>
            <Select onValueChange={(v) => update('tipoEmbalagem', v)}>
              <SelectTrigger>
                <SelectValue placeholder="Selecione a embalagem" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="klt_lego">Caixa KLT (Fundo Lego)</SelectItem>
                <SelectItem value="klt_liso">Caixa KLT (Fundo Liso)</SelectItem>
                <SelectItem value="hortifruti">Caixa Plástica Hortifruti</SelectItem>
                <SelectItem value="papelao">Caixa de Papelão</SelectItem>
                <SelectItem value="bin">Bin Plástico (Gaveteiro)</SelectItem>
                <SelectItem value="pallet">Pallet de Madeira/Plástico</SelectItem>
                <SelectItem value="peca_solta">Peça Solta Diretamente</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2 md:col-span-2">
            <Label>Medida da Embalagem (C x L x A) mm</Label>
            <Input
              placeholder="Ex: 600 x 400 x 200"
              onChange={(e) => update('medidaEmbalagem', e.target.value)}
            />
          </div>
          <div className="space-y-2 md:col-span-2">
            <Label>Peso Unitário (Caixa Cheia) kg</Label>
            <Input
              type="number"
              placeholder="Ex: 15"
              onChange={(e) => update('pesoEmbalagem', e.target.value)}
            />
          </div>
          <div className="space-y-2 md:col-span-2">
            <Label>Qtd de Caixas por Pista (Profundidade)</Label>
            <Input
              type="number"
              placeholder="Ex: 4"
              onChange={(e) => update('qtdPorPosicao', e.target.value)}
            />
          </div>
        </div>
      </div>

      <div className="border p-5 rounded-xl bg-slate-50/50 shadow-sm border-slate-200">
        <h4 className="font-bold text-sm text-[#1e4b8f] mb-4 uppercase tracking-wider">
          Base da Estrutura
        </h4>
        <div className="space-y-4">
          <div className="space-y-2 md:w-1/3">
            <Label>Tipo de Apoio ao Solo</Label>
            <Select value={data.base} onValueChange={(v) => update('base', v)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="niveladores">Pés Niveladores (Sapatas)</SelectItem>
                <SelectItem value="fixo">Sapata de Fixação (Chumbador)</SelectItem>
                <SelectItem value="rodizios">Rodízios</SelectItem>
                <SelectItem value="misto">Misto (Nivelador + Rodízio)</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {(data.base === 'rodizios' || data.base === 'misto') && (
            <div className="animate-fade-in-up">
              <div className="space-y-2 mb-4 md:w-1/3">
                <Label>Altura Máxima (Base ao Solo) mm</Label>
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
        <Plus className="w-5 h-5 mr-2" /> Adicionar Estrutura Dinâmica (Flow Rack)
      </Button>
    </div>
  )
}
