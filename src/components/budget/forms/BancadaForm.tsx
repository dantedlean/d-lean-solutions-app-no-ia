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
  const [data, setData] = useState<any>({
    base: 'niveladores',
    materialTampo: 'mdf',
    espessuraTampo: '15',
    esd: 'nao',
  })

  const update = (k: string, v: any) => setData((p: any) => ({ ...p, [k]: v }))

  const casterMm = parseFloat(data.diametroRodizio || '0') * 25.4
  const height = parseFloat(data.alturaBase || '0')
  const isError = data.base === 'rodizios' && casterMm > 0 && height > 0 && height < casterMm + 20

  return (
    <div className="space-y-8 animate-fade-in">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="space-y-2 md:col-span-2">
          <Label>Dimensões Externas Totais (C x L x A) mm</Label>
          <Input
            placeholder="Ex: 1200 x 800 x 2000"
            onChange={(e) => update('dimensoes', e.target.value)}
          />
        </div>
        <div className="space-y-2">
          <Label>Altura do Tampo de Trabalho (mm)</Label>
          <Input
            type="number"
            placeholder="Ex: 900"
            onChange={(e) => update('alturaTampo', e.target.value)}
          />
        </div>
        <div className="space-y-2">
          <Label>Carga por Tampo/Prateleira (kg)</Label>
          <Input
            type="number"
            placeholder="Ex: 150"
            onChange={(e) => update('cargaTampo', e.target.value)}
          />
        </div>
        <div className="space-y-2">
          <Label>Carga Total Distribuída (kg)</Label>
          <Input
            type="number"
            placeholder="Ex: 300"
            onChange={(e) => update('cargaTotal', e.target.value)}
          />
        </div>
        <div className="space-y-2">
          <Label>Nº de Níveis/Prateleiras Acima do Tampo</Label>
          <Input
            type="number"
            placeholder="Ex: 2"
            onChange={(e) => update('nNiveisSuperiores', e.target.value)}
          />
        </div>
        <div className="space-y-2">
          <Label>Nº de Níveis/Prateleiras Abaixo do Tampo</Label>
          <Input
            type="number"
            placeholder="Ex: 1"
            onChange={(e) => update('nNiveisInferiores', e.target.value)}
          />
        </div>
      </div>

      <div className="border p-5 rounded-xl bg-slate-50/50 shadow-sm border-slate-200">
        <h4 className="font-bold text-sm text-[#1e4b8f] mb-4 uppercase tracking-wider">
          Especificações do Tampo
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="space-y-2">
            <Label>Material Base do Tampo</Label>
            <Select
              defaultValue={data.materialTampo}
              onValueChange={(v) => update('materialTampo', v)}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="aco">Aço Carbono</SelectItem>
                <SelectItem value="inox">Aço Inox</SelectItem>
                <SelectItem value="mdf">MDF / MDP</SelectItem>
                <SelectItem value="compensado">Compensado</SelectItem>
                <SelectItem value="plastico">Plástico / PEAD</SelectItem>
                <SelectItem value="recoberto">Material Recoberto</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Espessura do Tampo (mm)</Label>
            <Input
              type="number"
              placeholder="Ex: 15, 18, 25"
              value={data.espessuraTampo || ''}
              onChange={(e) => update('espessuraTampo', e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label>Necessita Proteção ESD?</Label>
            <Select defaultValue={data.esd} onValueChange={(v) => update('esd', v)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="sim">Sim (Manta Antiestática)</SelectItem>
                <SelectItem value="nao">Não</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {data.materialTampo === 'recoberto' && (
            <div className="space-y-2 animate-fade-in md:col-span-2">
              <Label>Tipo de Recobrimento do Tampo</Label>
              <Select onValueChange={(v) => update('tipoRecobrimento', v)}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione o revestimento" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="eva">Manta de EVA</SelectItem>
                  <SelectItem value="inox">Chapa de Inox sobreposta</SelectItem>
                  <SelectItem value="borracha">Borracha Moeda/Lisa</SelectItem>
                  <SelectItem value="pvc">Chapa de PVC</SelectItem>
                  <SelectItem value="outro">Outro</SelectItem>
                </SelectContent>
              </Select>
            </div>
          )}

          <div className="space-y-2">
            <Label>Cor do Tampo</Label>
            <Input
              placeholder="Ex: Branco, Madeira"
              onChange={(e) => update('corTampo', e.target.value)}
            />
          </div>
        </div>
      </div>

      <div className="border p-5 rounded-xl bg-slate-50/50 shadow-sm border-slate-200">
        <h4 className="font-bold text-sm text-[#1e4b8f] mb-4 uppercase tracking-wider">
          Acessórios e Ergonomia
        </h4>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="space-y-2">
            <Label>Gavetas (Qtd)</Label>
            <Input
              type="number"
              placeholder="0"
              onChange={(e) => update('gavetas', e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label>Iluminação LED</Label>
            <Select onValueChange={(v) => update('iluminacao', v)}>
              <SelectTrigger>
                <SelectValue placeholder="Nenhuma" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="calha_simples">Calha LED Simples</SelectItem>
                <SelectItem value="calha_dupla">Calha LED Dupla</SelectItem>
                <SelectItem value="pendente">Pendente</SelectItem>
                <SelectItem value="nao">Nenhuma</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label>Régua de Tomadas</Label>
            <Select onValueChange={(v) => update('tomadas', v)}>
              <SelectTrigger>
                <SelectValue placeholder="Não" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="4_posicoes">4 Posições</SelectItem>
                <SelectItem value="6_posicoes">6 Posições</SelectItem>
                <SelectItem value="8_posicoes">8 Posições</SelectItem>
                <SelectItem value="nao">Não</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label>Painel de Ferramentas</Label>
            <Select onValueChange={(v) => update('painel', v)}>
              <SelectTrigger>
                <SelectValue placeholder="Não" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="chapa_perfurada">Chapa Perfurada</SelectItem>
                <SelectItem value="eucatex">Eucatex Perfurado</SelectItem>
                <SelectItem value="nao">Não</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label>Suporte para Monitor</Label>
            <Select onValueChange={(v) => update('suporteMonitor', v)}>
              <SelectTrigger>
                <SelectValue placeholder="Não" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="articulado">Braço Articulado</SelectItem>
                <SelectItem value="fixo">Suporte Fixo</SelectItem>
                <SelectItem value="nao">Não</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label>Suporte Teclado/Mouse</Label>
            <Select onValueChange={(v) => update('suporteTeclado', v)}>
              <SelectTrigger>
                <SelectValue placeholder="Não" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="retratil">Bandeja Retrátil</SelectItem>
                <SelectItem value="fixo">Bandeja Fixa</SelectItem>
                <SelectItem value="nao">Não</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label>Apoio de Pés</Label>
            <Select onValueChange={(v) => update('apoioPes', v)}>
              <SelectTrigger>
                <SelectValue placeholder="Não" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="tubular">Tubo Estrutural</SelectItem>
                <SelectItem value="chapa_inclinada">Chapa Inclinada</SelectItem>
                <SelectItem value="ergonomico">Ergonômico Avulso</SelectItem>
                <SelectItem value="nao">Não</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label>Porta Copos/Squeeze</Label>
            <Select onValueChange={(v) => update('portaCopos', v)}>
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
                <SelectItem value="rodizios">Rodízios</SelectItem>
                <SelectItem value="misto">Misto (Nivelador + Rodízio)</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {(data.base === 'rodizios' || data.base === 'misto') && (
            <div className="animate-fade-in-up">
              <div className="space-y-2 mb-4 md:w-1/3">
                <Label>Distância da Base ao Solo (mm)</Label>
                <Input
                  type="number"
                  placeholder="Ex: 150"
                  onChange={(e) => update('alturaBase', e.target.value)}
                />
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
        <Plus className="w-5 h-5 mr-2" /> Adicionar Bancada / Estante de Trabalho
      </Button>
    </div>
  )
}
