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
    fechamento: 'aberto',
  })
  const update = (k: string, v: any) => setData((p: any) => ({ ...p, [k]: v }))

  const casterMm = parseFloat(data.diametroRodizio || '0') * 25.4
  const height = parseFloat(data.alturaBase || '0')
  const isError = casterMm > 0 && height > 0 && height < casterMm + 20

  const formatDimensions = (val: string) => {
    const rawDigits = (val || '').replace(/\D/g, '').substring(0, 12)
    let display = ''
    for (let i = 0; i < rawDigits.length; i++) {
      if (i > 0 && i % 4 === 0) display += ' x '
      display += rawDigits[i]
    }
    return display
  }

  const dimensoesDisplay = formatDimensions(data.dimensoes)
  const shadowTemplate = '0000 x 0000 x 0000 mm'
  const shadowSuffix = shadowTemplate.substring(dimensoesDisplay.length)

  return (
    <div className="space-y-8 animate-fade-in">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="space-y-2 md:col-span-2">
          <Label>Dimensões Externas Úteis (C x L x A)</Label>
          <div className="relative w-full">
            <div className="absolute inset-0 flex items-center px-3 text-base md:text-sm pointer-events-none font-mono text-muted-foreground z-0">
              <span className="opacity-0">{dimensoesDisplay}</span>
              <span className="opacity-40">{shadowSuffix}</span>
            </div>
            <Input
              className="relative z-10 bg-transparent font-mono placeholder:text-transparent"
              value={dimensoesDisplay}
              onChange={(e) => update('dimensoes', formatDimensions(e.target.value))}
              placeholder="0000 x 0000 x 0000 mm"
            />
          </div>
        </div>
        <div className="space-y-2">
          <Label>Capacidade de Carga Total (kg)</Label>
          <Input
            type="number"
            placeholder="Ex: 500"
            onChange={(e) => update('carga', e.target.value)}
          />
        </div>
        <div className="space-y-2">
          <Label>Peso Estimado do Produto (kg/unidade)</Label>
          <Input
            type="number"
            placeholder="Ex: 15"
            onChange={(e) => update('pesoProduto', e.target.value)}
          />
        </div>
        <div className="space-y-2">
          <Label>Nº de Prateleiras / Níveis</Label>
          <Input
            type="number"
            placeholder="Ex: 3"
            onChange={(e) => update('nNiveis', e.target.value)}
          />
        </div>
        <div className="space-y-2">
          <Label>Material das Prateleiras</Label>
          <Select onValueChange={(v) => update('materialPrateleira', v)}>
            <SelectTrigger>
              <SelectValue placeholder="Selecione" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="aco">Aço Lisa</SelectItem>
              <SelectItem value="mdf">MDF / Compensado</SelectItem>
              <SelectItem value="aramado">Tela Aramada</SelectItem>
              <SelectItem value="tubular">Apoio Tubular</SelectItem>
              <SelectItem value="rolete">Trilho de Rolete</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="border p-5 rounded-xl bg-slate-50/50 shadow-sm border-slate-200">
        <h4 className="font-bold text-sm text-[#1e4b8f] mb-4 uppercase tracking-wider">
          Acessórios de Movimentação e Estrutura
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="space-y-2">
            <Label>Sistema de Tração</Label>
            <Select value={data.tracao} onValueChange={(v) => update('tracao', v)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="manual">Empurre Manual</SelectItem>
                <SelectItem value="reboque">Reboque Mecânico (Trem)</SelectItem>
                <SelectItem value="agv">AGV / Robô</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {(data.tracao === 'reboque' || data.tracao === 'agv') && (
            <div className="space-y-2 animate-fade-in md:col-span-2">
              <Label>Sistema de Engate (Cambão)</Label>
              <Select onValueChange={(v) => update('sistemaEngate', v)}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione o engate" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="pino_mola">Pino e Mola (Padrão)</SelectItem>
                  <SelectItem value="automatico">Engate Automático / Olhal</SelectItem>
                  <SelectItem value="bola">Engate Bola (Automotivo)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          )}

          {data.tracao === 'reboque' && (
            <div className="md:col-span-3 grid grid-cols-3 gap-4 bg-white p-4 rounded border border-slate-200 animate-fade-in">
              <div className="space-y-1">
                <Label className="text-xs font-bold text-slate-500">Nº Máx Carrinhos no Trem</Label>
                <Input type="number" onChange={(e) => update('nCarrinhos', e.target.value)} />
              </div>
              <div className="space-y-1">
                <Label className="text-xs font-bold text-slate-500">
                  Raio de Curva Corredor (mm)
                </Label>
                <Input type="number" onChange={(e) => update('raioCurva', e.target.value)} />
              </div>
              <div className="space-y-1">
                <Label className="text-xs font-bold text-slate-500">
                  Espaço Livre Carrinhos (mm)
                </Label>
                <Input type="number" onChange={(e) => update('espacamento', e.target.value)} />
              </div>
            </div>
          )}

          <div className="space-y-2">
            <Label>Puxador Ergonômico</Label>
            <Select value={data.puxador} onValueChange={(v) => update('puxador', v)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="sim">Sim (Tubular)</SelectItem>
                <SelectItem value="alca">Sim (Alça estampada)</SelectItem>
                <SelectItem value="nao">Não</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Freio Estacionário (Adicional)</Label>
            <Select value={data.freio} onValueChange={(v) => update('freio', v)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="pedal">Sim (Freio de Pedal/Floor Lock)</SelectItem>
                <SelectItem value="manual">Sim (Alavanca Manual)</SelectItem>
                <SelectItem value="nao">Não (Apenas nos rodízios)</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Fechamento Lateral</Label>
            <Select value={data.fechamento} onValueChange={(v) => update('fechamento', v)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="aberto">Aberto (Sem fechamento)</SelectItem>
                <SelectItem value="tela">Tela Aramada</SelectItem>
                <SelectItem value="chapa">Chapa Fechada</SelectItem>
                <SelectItem value="lona">Cortina de Lona/PVC</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Bumper (Proteção contra Impacto)</Label>
            <Select onValueChange={(v) => update('bumper', v)}>
              <SelectTrigger>
                <SelectValue placeholder="Não" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="borracha_cantos">Borracha nos Cantos</SelectItem>
                <SelectItem value="borracha_perimetro">Borracha em todo Perímetro</SelectItem>
                <SelectItem value="roldana">Rolete Bumper nos cantos</SelectItem>
                <SelectItem value="nao">Não</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Condição do Piso na Rota</Label>
            <Select value={data.tipoPiso} onValueChange={(v) => update('tipoPiso', v)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="bruto">Bruto / Irregular (Concreto)</SelectItem>
                <SelectItem value="liso">Liso (Polido)</SelectItem>
                <SelectItem value="epoxi">Epóxi (Limpo/Sensível)</SelectItem>
                <SelectItem value="asfalto">Asfalto / Externo</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <div className="space-y-2 md:w-1/3">
          <Label>Altura Máxima da Base ao Solo (mm)</Label>
          <Input
            type="number"
            placeholder="Espaço livre sob o carrinho"
            value={data.alturaBase || ''}
            onChange={(e) => update('alturaBase', e.target.value)}
          />
        </div>
        <CasterSection data={data} update={update} baseHeight={data.alturaBase} />
      </div>

      <FinishingSection method={method} data={data} update={update} />

      <Button
        onClick={() => onAdd(data)}
        disabled={isError || !data.dimensoes}
        className="w-full bg-[#1e4b8f] hover:bg-[#1e4b8f]/90 mt-8 h-12 text-md font-semibold"
      >
        <Plus className="w-5 h-5 mr-2" /> Adicionar Carrinho / Rota de Movimentação
      </Button>
    </div>
  )
}
