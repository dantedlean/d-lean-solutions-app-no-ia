import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase/client'
import { Card } from '@/components/ui/card'
import { HardHat } from 'lucide-react'
import { ScrollArea } from '@/components/ui/scroll-area'
import { useToast } from '@/hooks/use-toast'
import { ProjectList } from '@/components/engineering/ProjectList'
import { ProjectHeader } from '@/components/engineering/ProjectHeader'
import { EquipmentList } from '@/components/engineering/EquipmentList'
import { AttachmentList } from '@/components/engineering/AttachmentList'

export default function EngineeringDashboard() {
  const [quotes, setQuotes] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedQuote, setSelectedQuote] = useState<any>(null)
  const { toast } = useToast()

  useEffect(() => {
    fetchQuotes()
  }, [])

  const fetchQuotes = async () => {
    try {
      const { data, error } = await supabase
        .from('quotes')
        .select(`*, quote_engineering_status (*)`)
        .order('created_at', { ascending: false })

      if (error) throw error
      setQuotes(data || [])
    } catch (error) {
      console.error('Error fetching quotes:', error)
      toast({
        title: 'Erro ao carregar',
        description: 'Não foi possível carregar a lista de projetos.',
        variant: 'destructive',
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="container mx-auto py-8 animate-fade-in-up px-4 max-w-7xl">
      <div className="flex items-center gap-3 mb-8">
        <div className="p-3 bg-blue-100 text-blue-700 rounded-lg">
          <HardHat className="w-8 h-8" />
        </div>
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Painel de Engenharia</h1>
          <p className="text-slate-500">
            Acesso completo às especificações técnicas e arquivos das cotações
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <ProjectList
          quotes={quotes}
          loading={loading}
          selectedQuote={selectedQuote}
          onSelectQuote={setSelectedQuote}
        />

        <Card className="md:col-span-2 h-[calc(100vh-200px)] flex flex-col overflow-hidden">
          {selectedQuote ? (
            <ScrollArea className="flex-1 h-full bg-slate-50/50">
              <div className="p-6 md:p-8 space-y-8">
                <ProjectHeader quote={selectedQuote} />
                <EquipmentList
                  equipments={
                    selectedQuote.data?.equipments ||
                    selectedQuote.data?.items ||
                    (selectedQuote.data?.equipment ? [selectedQuote.data.equipment] : [])
                  }
                />
                <AttachmentList
                  files={
                    selectedQuote.data?.files ||
                    selectedQuote.data?.attachments ||
                    selectedQuote.data?.anexos ||
                    []
                  }
                />
              </div>
            </ScrollArea>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center text-slate-400 p-8 bg-slate-50/50">
              <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center shadow-sm border border-slate-100 mb-6">
                <HardHat className="w-12 h-12 text-blue-200" />
              </div>
              <h3 className="text-xl font-bold text-slate-700 mb-2">Selecione um projeto</h3>
              <p className="text-slate-500 text-center max-w-sm">
                Clique em uma cotação na lista lateral para visualizar todas as especificações
                técnicas e arquivos anexados.
              </p>
            </div>
          )}
        </Card>
      </div>
    </div>
  )
}
