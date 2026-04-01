import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { AlertTriangle } from 'lucide-react'

export function FinishingSection({ method, data, update }: any) {
  if (method === 'lean') {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 border p-4 rounded-md bg-white mt-4">
        <h4 className="font-semibold text-sm text-[#1e4b8f] col-span-full">Acabamento (Modular)</h4>
        <div className="space-y-2">
          <Label>Tipo de Tubo (Lean Pipe)</Label>
          <Select value={data.tipoTubo} onValueChange={(v) => update('tipoTubo', v)}>
            <SelectTrigger>
              <SelectValue placeholder="Selecione..." />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="revestido">Revestido</SelectItem>
              <SelectItem value="inox">Inox</SelectItem>
            </SelectContent>
          </Select>
        </div>
        {data.tipoTubo === 'revestido' && (
          <div className="space-y-2 animate-fade-in">
            <Label>Cor do Tubo</Label>
            <Select value={data.corTubo} onValueChange={(v) => update('corTubo', v)}>
              <SelectTrigger>
                <SelectValue placeholder="Selecione..." />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="azul">Azul</SelectItem>
                <SelectItem value="preto">Preto</SelectItem>
                <SelectItem value="cinza">Cinza</SelectItem>
                <SelectItem value="verde">Verde</SelectItem>
                <SelectItem value="outro">Outro</SelectItem>
              </SelectContent>
            </Select>
          </div>
        )}
      </div>
    )
  }
  if (method === 'soldado') {
    return (
      <div className="space-y-2 border p-4 rounded-md bg-white mt-4">
        <h4 className="font-semibold text-sm text-[#1e4b8f]">Acabamento (Soldado)</h4>
        <Label>Cor Predominante (RAL)</Label>
        <Input
          placeholder="Ex: RAL 7035"
          value={data.corRal || ''}
          onChange={(e) => update('corRal', e.target.value)}
        />
      </div>
    )
  }
  if (method === 'hibrido') {
    return (
      <div className="space-y-2 border p-4 rounded-md bg-white mt-4">
        <h4 className="font-semibold text-sm text-[#1e4b8f]">Acabamento (Híbrido)</h4>
        <Label>Observações de Construção</Label>
        <Textarea
          placeholder="Descreva detalhadamente o que será soldado e o que será modular..."
          value={data.obsHibrido || ''}
          onChange={(e) => update('obsHibrido', e.target.value)}
        />
      </div>
    )
  }
  return null
}

export function CasterSection({ data, update, baseHeight }: any) {
  const casterMm = data.diametroRodizio ? parseFloat(data.diametroRodizio) * 25.4 : 0
  const height = parseFloat(baseHeight || '0')
  const isError = casterMm > 0 && height > 0 && height < casterMm + 20

  return (
    <div className="space-y-4 border p-4 rounded-md bg-white mt-4 animate-fade-in-up">
      <h4 className="font-semibold text-sm text-[#1e4b8f]">Especificações de Rodízios</h4>
      {isError && (
        <Alert variant="destructive" className="bg-[#d62828]/10 border-[#d62828] text-[#d62828]">
          <AlertTriangle className="h-4 w-4" />
          <AlertTitle>ERRO DE ENGENHARIA</AlertTitle>
          <AlertDescription>Altura insuficiente para o rodízio selecionado.</AlertDescription>
        </Alert>
      )}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="space-y-2">
          <Label>Diâmetro</Label>
          <Select value={data.diametroRodizio} onValueChange={(v) => update('diametroRodizio', v)}>
            <SelectTrigger className={isError ? 'border-red-500 bg-red-50' : ''}>
              <SelectValue placeholder="Selecione..." />
            </SelectTrigger>
            <SelectContent>
              {['2', '3', '4', '5', '6', '8', '10'].map((n) => (
                <SelectItem key={n} value={n}>
                  {n}"
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label>Material do Núcleo</Label>
          <Select value={data.nucleoRodizio} onValueChange={(v) => update('nucleoRodizio', v)}>
            <SelectTrigger>
              <SelectValue placeholder="Selecione..." />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="pvc">PVC</SelectItem>
              <SelectItem value="ferro">Ferro</SelectItem>
              <SelectItem value="nylon">Nylon</SelectItem>
              <SelectItem value="aluminio">Alumínio</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label>Revestimento</Label>
          <Select
            value={data.revestimentoRodizio}
            onValueChange={(v) => update('revestimentoRodizio', v)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Selecione..." />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="pvc">PVC</SelectItem>
              <SelectItem value="pu">PU (Poliuretano)</SelectItem>
              <SelectItem value="gel">Gel</SelectItem>
              <SelectItem value="borracha">Borracha</SelectItem>
              <SelectItem value="pneumatico">Pneumático</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label>Fixação</Label>
          <Select value={data.fixacaoRodizio} onValueChange={(v) => update('fixacaoRodizio', v)}>
            <SelectTrigger>
              <SelectValue placeholder="Selecione..." />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="placa">Placa</SelectItem>
              <SelectItem value="espiga_roscada">Espiga Roscada</SelectItem>
              <SelectItem value="espiga_expansor">Espiga com Expansor</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label>Qtd. Fixos</Label>
          <Input
            type="number"
            placeholder="Ex: 2"
            value={data.qtdFixos || ''}
            onChange={(e) => update('qtdFixos', e.target.value)}
          />
        </div>
        <div className="space-y-2">
          <Label>Qtd. Giratórios</Label>
          <Input
            type="number"
            placeholder="Ex: 2"
            value={data.qtdGiratorios || ''}
            onChange={(e) => update('qtdGiratorios', e.target.value)}
          />
        </div>
        <div className="space-y-2 md:col-span-3">
          <Label>Freio (Giratórios)</Label>
          <Select value={data.freioRodizio} onValueChange={(v) => update('freioRodizio', v)}>
            <SelectTrigger>
              <SelectValue placeholder="Selecione..." />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="com_freio">Com Freio</SelectItem>
              <SelectItem value="sem_freio">Sem Freio</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  )
}
