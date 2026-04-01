import { useState } from 'react'
import { ClientInfoForm } from '@/components/budget/ClientInfoForm'
import { EquipmentMatrix } from '@/components/budget/EquipmentMatrix'
import { UploadSection } from '@/components/budget/UploadSection'
import { AiConceptPreview } from '@/components/budget/AiConceptPreview'
import { Button } from '@/components/ui/button'
import { Save } from 'lucide-react'
import { useToast } from '@/hooks/use-toast'

interface BudgetData {
  client: any
  equipments: any[]
  files: File[]
}

export default function Index() {
  const { toast } = useToast()
  const [budgetData, setBudgetData] = useState<BudgetData>({
    client: {},
    equipments: [],
    files: [],
  })

  const handleConsolidate = () => {
    toast({
      title: 'Orçamento Consolidado!',
      description: 'Dados salvos no CRM e fluxo de engenharia iniciado.',
    })
    console.log('Saving budget structure:', budgetData)
  }

  return (
    <div className="max-w-5xl mx-auto space-y-8 pb-20 animate-fade-in-up">
      <div className="border-b-4 border-[#d62828] pb-4">
        <h2 className="text-3xl font-bold text-[#1e4b8f]">Novo Orçamento / Briefing</h2>
        <p className="text-muted-foreground mt-1">
          Preencha os dados abaixo para gerar a estrutura de engenharia em formato de "Conjunto" e
          acionar a IA de conceito.
        </p>
      </div>

      <ClientInfoForm onChange={(data) => setBudgetData((p) => ({ ...p, client: data }))} />

      <EquipmentMatrix
        equipments={budgetData.equipments}
        onAdd={(eq) => setBudgetData((p) => ({ ...p, equipments: [...p.equipments, eq] }))}
        onRemove={(idx) =>
          setBudgetData((p) => ({ ...p, equipments: p.equipments.filter((_, i) => i !== idx) }))
        }
      />

      <UploadSection onFiles={(f) => setBudgetData((p) => ({ ...p, files: f }))} />

      <AiConceptPreview
        equipments={budgetData.equipments}
        hasCroqui={budgetData.files.length > 0}
      />

      <div className="fixed bottom-0 left-0 right-0 p-4 bg-background border-t flex justify-end gap-4 z-50 shadow-[0_-4px_20px_rgba(0,0,0,0.05)] md:left-[var(--sidebar-width)] transition-[left]">
        <Button
          size="lg"
          onClick={handleConsolidate}
          className="bg-[#1e4b8f] hover:bg-[#1e4b8f]/90 text-white"
          disabled={budgetData.equipments.length === 0}
        >
          <Save className="mr-2 h-5 w-5" /> Consolidar Orçamento
        </Button>
      </div>
    </div>
  )
}
