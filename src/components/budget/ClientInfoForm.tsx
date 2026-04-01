import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { useToast } from '@/hooks/use-toast'
import { Building2 } from 'lucide-react'

export function ClientInfoForm({ onChange }: { onChange: (data: any) => void }) {
  const [cnpj, setCnpj] = useState('')
  const [razao, setRazao] = useState('')
  const [uf, setUf] = useState('')
  const { toast } = useToast()

  const handleCnpjChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let v = e.target.value.replace(/\D/g, '')
    v = v.replace(/^(\d{2})(\d)/, '$1.$2')
    v = v.replace(/^(\d{2})\.(\d{3})(\d)/, '$1.$2.$3')
    v = v.replace(/\.(\d{3})(\d)/, '.$1/$2')
    v = v.replace(/(\d{4})(\d)/, '$1-$2')
    setCnpj(v)

    if (v.length === 18) {
      toast({ title: 'Consultando API...' })
      setTimeout(() => {
        setRazao('Indústrias Exemplo S/A')
        setUf('SP')
        toast({ title: 'Dados carregados com sucesso!' })
        onChange({ cnpj: v, razaoSocial: 'Indústrias Exemplo S/A', uf: 'SP' })
      }, 800)
    } else {
      onChange({ cnpj: v, razaoSocial: razao, uf })
    }
  }

  return (
    <Card className="border-t-4 border-t-[#1e4b8f] shadow-sm">
      <CardHeader>
        <CardTitle className="text-lg flex items-center gap-2 text-[#1e4b8f]">
          <Building2 className="w-5 h-5" /> Identificação do Cliente
        </CardTitle>
      </CardHeader>
      <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="space-y-2">
          <Label>CNPJ</Label>
          <Input
            placeholder="00.000.000/0000-00"
            maxLength={18}
            value={cnpj}
            onChange={handleCnpjChange}
          />
        </div>
        <div className="space-y-2">
          <Label>Razão Social</Label>
          <Input
            value={razao}
            onChange={(e) => {
              setRazao(e.target.value)
              onChange({ cnpj, razaoSocial: e.target.value, uf })
            }}
          />
        </div>
        <div className="space-y-2">
          <Label>Estado (UF)</Label>
          <Select
            value={uf}
            onValueChange={(v) => {
              setUf(v)
              onChange({ cnpj, razaoSocial: razao, uf: v })
            }}
          >
            <SelectTrigger>
              <SelectValue placeholder="Selecione..." />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="SP">São Paulo</SelectItem>
              <SelectItem value="RJ">Rio de Janeiro</SelectItem>
              <SelectItem value="MG">Minas Gerais</SelectItem>
              <SelectItem value="RS">Rio Grande do Sul</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </CardContent>
    </Card>
  )
}
