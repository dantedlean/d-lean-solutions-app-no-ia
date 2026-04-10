import { useMemo, useState } from 'react'
import { ClientInfoForm } from '@/components/budget/ClientInfoForm'
import { EquipmentMatrix } from '@/components/budget/EquipmentMatrix'
import { UploadSection } from '@/components/budget/UploadSection'
import { AiConceptPreview } from '@/components/budget/AiConceptPreview'
import { QuoteTimeline } from '@/components/budget/QuoteTimeline'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Save, Wand2, CheckCircle2, Loader2 } from 'lucide-react'
import { useToast } from '@/hooks/use-toast'
import { useBudgetStore } from '@/stores/useBudgetStore'
import { useAuth } from '@/hooks/use-auth'
import { supabase } from '@/lib/supabase/client'

export default function Index() {
  const { toast } = useToast()
  const { user } = useAuth()
  const [isSubmitting, setIsSubmitting] = useState(false)

  const {
    client,
    equipments,
    files,
    aiPrompt,
    aiImage,
    aiImageStatus,
    quoteId,
    quoteStatus,
    engineeringDeadline,
    isReviewing,
    aiJustification,
    aiComments,
    setClient,
    addEquipment,
    removeEquipment,
    updateEquipment,
    addFiles,
    setAiPrompt,
    setAiImage,
    setAiImageStatus,
    setQuoteId,
    setQuoteStatus,
    setEngineeringDeadline,
    setIsReviewing,
    reset,
  } = useBudgetStore()

  const orderNumber = useMemo(() => {
    const year = new Date().getFullYear()
    const seq = Math.floor(Math.random() * 900) + 100
    return `#ORC-${year}-${seq}`
  }, [])

  const handleConsolidate = async () => {
    if (!user) {
      toast({
        title: 'Atenção',
        description: 'Você precisa estar logado para salvar o orçamento.',
        variant: 'destructive',
      })
      return
    }

    setIsSubmitting(true)
    try {
      // 1. Salvar no Supabase
      const { data: quote, error: quoteError } = await supabase
        .from('quotes')
        .insert({
          user_id: user.id,
          order_number: orderNumber,
          client_cnpj: client.cnpj || null,
          client_name: client.razaoSocial || null,
          status: 'engenharia',
          data: {
            client,
            equipments,
            files: files.map((f) => ({ name: f.name, size: f.size, type: f.type })),
            aiPrompt,
            aiImage,
            aiJustification,
            aiComments,
          },
        })
        .select()
        .single()

      if (quoteError) throw quoteError

      // 2. Sincronizar com Maxiprod via Edge Function
      const { data: maxiprodData, error: maxiprodError } = await supabase.functions.invoke(
        'maxiprod-sync',
        {
          body: {
            action: 'sync_quote',
            payload: { quote_id: quote.id, order_number: orderNumber, client },
          },
        },
      )

      if (maxiprodError) {
        console.error('Erro na sincronização com Maxiprod:', maxiprodError)
        toast({
          title: 'Aviso',
          description: 'Orçamento salvo, mas houve falha ao sincronizar com o Maxiprod.',
          variant: 'destructive',
        })
      }

      // 3. Criar tarefa na engenharia
      const { error: engError } = await supabase.from('quote_engineering_status').insert({
        quote_id: quote.id,
        status: 'analise',
        priority: 'normal',
      })

      if (engError) console.error('Erro ao criar status de eng:', engError)

      setQuoteId(quote.id)
      setQuoteStatus('engenharia')
      setEngineeringDeadline(null)

      toast({
        title: 'Orçamento Finalizado e Sincronizado!',
        description: `Enviado para Engenharia e ERP Maxiprod (${maxiprodData?.maxiprod_id || 'Pendente'}).`,
      })
    } catch (e: any) {
      console.error(e)
      toast({
        title: 'Erro ao finalizar',
        description: e.message || 'Falha ao salvar o orçamento',
        variant: 'destructive',
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleUpdate = async () => {
    if (!quoteId) return

    setIsSubmitting(true)
    try {
      const { error } = await supabase
        .from('quotes')
        .update({
          data: {
            client,
            equipments,
            files: files.map((f) => ({ name: f.name, size: f.size, type: f.type })),
            aiPrompt,
            aiImage,
            aiJustification,
            aiComments,
          },
        })
        .eq('id', quoteId)

      if (error) throw error

      // Atualizar no Maxiprod
      await supabase.functions.invoke('maxiprod-sync', {
        body: { action: 'update_quote', payload: { quote_id: quoteId, order_number: orderNumber } },
      })

      setIsReviewing(false)

      toast({
        title: 'Orçamento Atualizado!',
        description: 'As revisões foram salvas com sucesso e sincronizadas com Maxiprod.',
      })
      window.scrollTo({ top: 0, behavior: 'smooth' })
    } catch (e: any) {
      console.error(e)
      toast({
        title: 'Erro ao atualizar',
        description: e.message || 'Falha ao atualizar o orçamento.',
        variant: 'destructive',
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  if (quoteId && !isReviewing) {
    return (
      <div className="max-w-4xl mx-auto space-y-6 pb-20 animate-fade-in-up mt-8">
        <div className="text-center p-8 bg-white rounded-xl shadow-sm border border-slate-200">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-green-50 mb-6">
            <CheckCircle2 className="w-12 h-12 text-green-500" />
          </div>
          <h2 className="text-3xl font-bold text-brand-blue mb-2">
            Orçamento {orderNumber} Finalizado
          </h2>
          <p className="text-muted-foreground mb-8 text-lg">
            O projeto foi sincronizado com o ERP Maxiprod e enviado com sucesso para a Fila de
            Engenharia Interna.
          </p>

          <div className="bg-slate-50 p-6 rounded-xl border mb-8 overflow-hidden shadow-inner">
            <QuoteTimeline status={quoteStatus} deadline={engineeringDeadline} />
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button
              onClick={() => {
                setIsReviewing(true)
              }}
              size="lg"
              variant="outline"
              className="h-12 px-8 font-semibold border-brand-blue text-brand-blue hover:bg-brand-blue/10 w-full sm:w-auto"
            >
              Revisar Orçamento
            </Button>
            <Button
              onClick={() => {
                reset()
                window.scrollTo({ top: 0, behavior: 'smooth' })
              }}
              size="lg"
              className="bg-brand-blue hover:bg-brand-blue/90 font-semibold h-12 px-8 w-full sm:w-auto"
            >
              Iniciar Novo Orçamento
            </Button>
          </div>
          <div className="mt-6 flex flex-col sm:flex-row items-center justify-center gap-2">
            <Button
              variant="link"
              onClick={() => window.open('/engineering', '_blank')}
              className="text-muted-foreground hover:text-brand-blue"
            >
              Acessar Painel de Engenharia &rarr;
            </Button>
            <Button
              variant="link"
              onClick={() => window.open('/admin', '_blank')}
              className="text-muted-foreground hover:text-brand-blue"
            >
              Acessar Painel Administrador &rarr;
            </Button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-5xl mx-auto space-y-6 pb-20 animate-fade-in-up">
      <div className="flex justify-between items-center mb-2 relative">
        <div className="w-24"></div>
        <img
          src="https://img.usecurling.com/i?q=industry&shape=fill&color=blue"
          alt="D-Lean Solutions"
          className="h-16 object-contain"
        />
        <div className="w-24 flex justify-end">
          <Button
            variant="outline"
            size="sm"
            onClick={() => window.open('/admin', '_blank')}
            className="text-xs text-brand-blue border-brand-blue hover:bg-blue-50"
          >
            Painel Admin
          </Button>
        </div>
      </div>

      <div className="flex items-center justify-between bg-white p-4 md:p-6 rounded-xl shadow-sm border">
        <div className="flex items-center gap-4">
          <Avatar className="h-12 w-12 border shadow-sm">
            <AvatarImage src="https://img.usecurling.com/ppl/thumbnail?gender=male&seed=1" />
            <AvatarFallback>VD</AvatarFallback>
          </Avatar>
          <div>
            <h3 className="font-bold text-brand-blue">Dante D-Lean</h3>
            <p className="text-xs text-muted-foreground">Consultor Técnico D-Lean</p>
          </div>
        </div>
        <div className="text-right">
          <p className="text-xs text-muted-foreground">Nº do Pedido</p>
          <p className="font-mono font-bold text-lg md:text-xl text-brand-orange">{orderNumber}</p>
        </div>
      </div>

      <div className="border-b-4 border-brand-orange pb-4">
        <h2 className="text-3xl font-bold text-brand-blue">Novo Orçamento / Briefing</h2>
        <p className="text-muted-foreground mt-1">&nbsp;Acelerando a proposta</p>
      </div>

      {isReviewing && (aiJustification || aiComments) && (
        <div className="bg-blue-50 border border-blue-200 p-6 rounded-xl space-y-4 animate-fade-in shadow-sm">
          <h3 className="text-lg font-bold text-brand-blue flex items-center gap-2">
            <Wand2 className="w-5 h-5" /> Retorno da Engenharia (IA)
          </h3>
          {aiJustification && (
            <div>
              <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">
                Justificativa Técnica
              </p>
              <div className="text-sm text-slate-700 bg-white p-3 rounded border border-blue-100 whitespace-pre-wrap">
                {aiJustification}
              </div>
            </div>
          )}
          {aiComments && (
            <div>
              <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">
                Comentários Adicionais
              </p>
              <div className="text-sm text-slate-700 bg-white p-3 rounded border border-blue-100 whitespace-pre-wrap">
                {aiComments}
              </div>
            </div>
          )}
        </div>
      )}

      <ClientInfoForm onChange={setClient} />

      <EquipmentMatrix
        equipments={equipments}
        onAdd={addEquipment}
        onRemove={removeEquipment}
        onUpdate={updateEquipment}
      />

      <UploadSection onFiles={addFiles} />

      <div id="ai-concept-preview">
        <AiConceptPreview
          equipments={equipments}
          files={files}
          prompt={aiPrompt}
          setPrompt={setAiPrompt}
          aiImage={aiImage}
          setAiImage={setAiImage}
          aiImageStatus={aiImageStatus}
          setAiImageStatus={setAiImageStatus}
        />
      </div>

      <div className="fixed bottom-0 left-0 right-0 p-3 md:p-4 bg-background border-t flex flex-wrap justify-end gap-2 md:gap-4 z-50 shadow-[0_-4px_20px_rgba(0,0,0,0.05)] md:left-[var(--sidebar-width)] transition-[left] items-center">
        <div id="action-buttons-portal" className="flex items-center"></div>

        <Button
          size="lg"
          onClick={quoteId && isReviewing ? handleUpdate : handleConsolidate}
          className="bg-brand-blue hover:bg-brand-blue/90 text-white shadow-sm"
          disabled={isSubmitting || (equipments.length === 0 && !aiImage)}
        >
          {isSubmitting ? (
            <Loader2 className="mr-2 h-5 w-5 animate-spin" />
          ) : (
            <Save className="mr-2 h-5 w-5 hidden sm:inline-block" />
          )}
          {isSubmitting
            ? 'Salvando...'
            : quoteId && isReviewing
              ? 'Atualizar Orçamento'
              : 'Finalizar Orçamento'}
        </Button>
      </div>
    </div>
  )
}
