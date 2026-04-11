import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Building2, MapPin } from 'lucide-react'

export function ClientInfoForm({ onChange }: { onChange: (data: any) => void }) {
  const [formData, setFormData] = useState({
    cnpj: '',
    razaoSocial: '',
    cidade: '',
    estado: '',
  })

  // Atualizamos o store apenas via user interaction, não durante render (evita loop infinito)
  const handleChange = (field: string, value: string) => {
    const newFormData = { ...formData, [field]: value }
    setFormData(newFormData)
    onChange(newFormData)
  }

  return (
    <Card className="border-brand-blue/20 shadow-sm">
      <CardHeader className="bg-slate-50/80 border-b pb-4">
        <CardTitle className="text-xl text-brand-blue flex items-center gap-2">
          <Building2 className="w-5 h-5" />
          Dados do Cliente
        </CardTitle>
        <CardDescription>
          Informações básicas para registro e vínculo do orçamento ao cliente.
        </CardDescription>
      </CardHeader>
      <CardContent className="p-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="space-y-2 lg:col-span-1">
          <Label className="text-xs font-bold text-slate-500 uppercase">CNPJ</Label>
          <Input
            value={formData.cnpj}
            onChange={(e) => handleChange('cnpj', e.target.value)}
            placeholder="00.000.000/0000-00"
            className="h-10"
          />
        </div>
        <div className="space-y-2 lg:col-span-3">
          <Label className="text-xs font-bold text-slate-500 uppercase">Razão Social</Label>
          <Input
            value={formData.razaoSocial}
            onChange={(e) => handleChange('razaoSocial', e.target.value)}
            placeholder="Indústrias Acme S/A"
            className="h-10"
          />
        </div>
        <div className="space-y-2 lg:col-span-2">
          <Label className="text-xs font-bold text-slate-500 uppercase flex items-center gap-1">
            <MapPin className="w-3 h-3" /> Cidade
          </Label>
          <Input
            value={formData.cidade}
            onChange={(e) => handleChange('cidade', e.target.value)}
            placeholder="São Paulo"
            className="h-10"
          />
        </div>
        <div className="space-y-2 lg:col-span-2">
          <Label className="text-xs font-bold text-slate-500 uppercase">Estado (UF)</Label>
          <Input
            value={formData.estado}
            onChange={(e) => handleChange('estado', e.target.value)}
            placeholder="SP"
            className="h-10 uppercase"
            maxLength={2}
          />
        </div>
      </CardContent>
    </Card>
  )
}
