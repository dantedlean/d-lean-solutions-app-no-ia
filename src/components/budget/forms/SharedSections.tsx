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
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 border p-5 rounded-xl bg-white mt-6 shadow-sm border-slate-200">
        <h4 className="font-bold text-sm text-[#1e4b8f] col-span-full uppercase tracking-wider">
          Acabamento e Estrutura (Modular)
        </h4>
        <div className="space-y-2">
          <Label>Tipo de Tubo (Lean Pipe)</Label>
          <Select defaultValue={data.tipoTubo} onValueChange={(v) => update('tipoTubo', v)}>
            <SelectTrigger>
              <SelectValue placeholder="Selecione..." />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="revestido">Revestido</SelectItem>
              <SelectItem value="inox">Inox</SelectItem>
              <SelectItem value="esd">ESD (Antiestático)</SelectItem>
              <SelectItem value="aluminio">Alumínio (Perfil/Tubo)</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label>Espessura do Tubo</Label>
          <Select
            defaultValue={data.espessuraTubo}
            onValueChange={(v) => update('espessuraTubo', v)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Selecione..." />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="0.8">0.8 mm (Carga Leve)</SelectItem>
              <SelectItem value="1.0">1.0 mm (Padrão)</SelectItem>
              <SelectItem value="1.2">1.2 mm (Carga Média)</SelectItem>
              <SelectItem value="2.0">2.0 mm (Carga Pesada)</SelectItem>
            </SelectContent>
          </Select>
        </div>
        {data.tipoTubo === 'revestido' && (
          <div className="space-y-2 animate-fade-in">
            <Label>Cor do Tubo</Label>
            <Select defaultValue={data.corTubo} onValueChange={(v) => update('corTubo', v)}>
              <SelectTrigger>
                <SelectValue placeholder="Selecione..." />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="marfim">Marfim</SelectItem>
                <SelectItem value="azul">Azul</SelectItem>
                <SelectItem value="preto">Preto</SelectItem>
                <SelectItem value="cinza">Cinza</SelectItem>
                <SelectItem value="verde">Verde</SelectItem>
                <SelectItem value="vermelho">Vermelho</SelectItem>
                <SelectItem value="amarelo">Amarelo</SelectItem>
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
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 border p-5 rounded-xl bg-white mt-6 shadow-sm border-slate-200">
        <h4 className="font-bold text-sm text-[#1e4b8f] col-span-full uppercase tracking-wider">
          Acabamento e Estrutura (Soldado)
        </h4>
        <div className="space-y-2">
          <Label>Perfil Estrutural</Label>
          <Select
            defaultValue={data.perfilSoldado}
            onValueChange={(v) => update('perfilSoldado', v)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Selecione..." />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="tubo_quadrado">Tubo Quadrado</SelectItem>
              <SelectItem value="tubo_retangular">Tubo Retangular</SelectItem>
              <SelectItem value="cantoneira">Cantoneira</SelectItem>
              <SelectItem value="viga_u">Viga U</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label>Tratamento/Pintura</Label>
          <Select
            defaultValue={data.tratamentoSoldado}
            onValueChange={(v) => update('tratamentoSoldado', v)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Selecione..." />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="epoxi">Pintura Epóxi</SelectItem>
              <SelectItem value="pu">Pintura PU</SelectItem>
              <SelectItem value="zincado">Zincado</SelectItem>
              <SelectItem value="galvanizado">Galvanizado a Fogo</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2 col-span-full">
          <Label>Cor Predominante (RAL)</Label>
          <Input
            placeholder="Ex: RAL 7035 (Cinza Claro)"
            value={data.corRal || ''}
            onChange={(e) => update('corRal', e.target.value)}
          />
        </div>
      </div>
    )
  }
  if (method === 'hibrido') {
    return (
      <div className="space-y-2 border p-5 rounded-xl bg-white mt-6 shadow-sm border-slate-200">
        <h4 className="font-bold text-sm text-[#1e4b8f] uppercase tracking-wider">
          Acabamento e Estrutura (Híbrido)
        </h4>
        <Label>Observações Detalhadas de Construção</Label>
        <Textarea
          placeholder="Descreva detalhadamente o que será soldado (ex: base) e o que será modular (ex: superestrutura)..."
          value={data.obsHibrido || ''}
          onChange={(e) => update('obsHibrido', e.target.value)}
          className="min-h-[100px]"
        />
      </div>
    )
  }
  if (method === 'aluminio') {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 border p-5 rounded-xl bg-white mt-6 shadow-sm border-slate-200">
        <h4 className="font-bold text-sm text-[#1e4b8f] col-span-full uppercase tracking-wider">
          Estrutura (Perfil de Alumínio)
        </h4>
        <div className="space-y-2">
          <Label>Linha do Perfil</Label>
          <Select
            defaultValue={data.linhaAluminio}
            onValueChange={(v) => update('linhaAluminio', v)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Selecione..." />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="linha_30">Linha 30 (30x30)</SelectItem>
              <SelectItem value="linha_40">Linha 40 (40x40)</SelectItem>
              <SelectItem value="linha_45">Linha 45 (45x45)</SelectItem>
              <SelectItem value="linha_50">Linha 50 (50x50)</SelectItem>
              <SelectItem value="pesado">Perfis Pesados (Ex: 40x80)</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label>Acabamento do Alumínio</Label>
          <Select
            defaultValue={data.acabamentoAluminio}
            onValueChange={(v) => update('acabamentoAluminio', v)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Selecione..." />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="anodizado_natural">Anodizado Natural</SelectItem>
              <SelectItem value="anodizado_preto">Anodizado Preto</SelectItem>
              <SelectItem value="pintura_epoxi">Pintura Epóxi</SelectItem>
            </SelectContent>
          </Select>
        </div>
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
    <div className="space-y-4 border p-5 rounded-xl bg-white mt-4 animate-fade-in-up shadow-sm border-slate-200">
      <h4 className="font-bold text-sm text-[#1e4b8f] flex items-center gap-2 uppercase tracking-wider">
        Especificações de Rodízios e Mobilidade
      </h4>
      {isError && (
        <Alert variant="destructive" className="bg-[#d62828]/5 border-[#d62828]/20 text-[#d62828]">
          <AlertTriangle className="h-4 w-4" />
          <AlertTitle className="font-bold">CONFLITO DE ENGENHARIA</AlertTitle>
          <AlertDescription>
            A altura da base ({height}mm) é insuficiente para acomodar um rodízio de{' '}
            {data.diametroRodizio}" (aprox. {Math.round(casterMm + 30)}mm de altura total com o
            garfo). Aumente a altura da base ou diminua o diâmetro do rodízio.
          </AlertDescription>
        </Alert>
      )}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="space-y-2">
          <Label>Diâmetro da Roda</Label>
          <Select
            defaultValue={data.diametroRodizio}
            onValueChange={(v) => update('diametroRodizio', v)}
          >
            <SelectTrigger className={isError ? 'border-red-500 bg-red-50 ring-red-500' : ''}>
              <SelectValue placeholder="Selecione..." />
            </SelectTrigger>
            <SelectContent>
              {['1.5', '2', '3', '4', '5', '6', '8', '10'].map((n) => (
                <SelectItem key={n} value={n}>
                  {n}" ({Math.round(parseFloat(n) * 25.4)}mm)
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label>Material do Núcleo</Label>
          <Select
            defaultValue={data.nucleoRodizio}
            onValueChange={(v) => update('nucleoRodizio', v)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Selecione..." />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="pvc">PVC / Plástico</SelectItem>
              <SelectItem value="ferro">Ferro Fundido</SelectItem>
              <SelectItem value="nylon">Nylon</SelectItem>
              <SelectItem value="aluminio">Alumínio</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label>Revestimento da Roda</Label>
          <Select
            defaultValue={data.revestimentoRodizio}
            onValueChange={(v) => update('revestimentoRodizio', v)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Selecione..." />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="pvc">PVC</SelectItem>
              <SelectItem value="pu">PU (Poliuretano)</SelectItem>
              <SelectItem value="gel">Silicone/Gel</SelectItem>
              <SelectItem value="borracha">Borracha Termoplástica</SelectItem>
              <SelectItem value="resina">Resina Fenólica (Alta Temp.)</SelectItem>
              <SelectItem value="pneumatico">Pneumático / Câmara</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label>Tipo de Fixação</Label>
          <Select
            defaultValue={data.fixacaoRodizio}
            onValueChange={(v) => update('fixacaoRodizio', v)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Selecione..." />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="placa">Placa (4 furos)</SelectItem>
              <SelectItem value="espiga_roscada">Espiga Roscada</SelectItem>
              <SelectItem value="espiga_expansor">Espiga com Expansor</SelectItem>
              <SelectItem value="furo_passante">Furo Passante</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label>Distribuição (Qtd. Fixos)</Label>
          <Input
            type="number"
            placeholder="Ex: 2"
            value={data.qtdFixos || ''}
            onChange={(e) => update('qtdFixos', e.target.value)}
          />
        </div>
        <div className="space-y-2">
          <Label>Distribuição (Qtd. Giratórios)</Label>
          <Input
            type="number"
            placeholder="Ex: 2"
            value={data.qtdGiratorios || ''}
            onChange={(e) => update('qtdGiratorios', e.target.value)}
          />
        </div>
        <div className="space-y-2">
          <Label>Freio (Nos Giratórios)</Label>
          <Select defaultValue={data.freioRodizio} onValueChange={(v) => update('freioRodizio', v)}>
            <SelectTrigger>
              <SelectValue placeholder="Selecione..." />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="total">Freio Total (Roda + Giro)</SelectItem>
              <SelectItem value="roda">Freio Apenas na Roda</SelectItem>
              <SelectItem value="sem_freio">Sem Freio</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2 md:col-span-2">
          <Label>Proteção do Rodízio</Label>
          <Select
            defaultValue={data.protecaoRodizio}
            onValueChange={(v) => update('protecaoRodizio', v)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Selecione..." />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="nenhuma">Nenhuma</SelectItem>
              <SelectItem value="placa_fios">Placa Guarda-Fios</SelectItem>
              <SelectItem value="calota">Calota de Proteção</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  )
}
