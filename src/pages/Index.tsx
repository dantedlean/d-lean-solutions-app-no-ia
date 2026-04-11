import { useMemo, useState } from 'react'
import { ClientInfoForm } from '@/components/budget/ClientInfoForm'
import { EquipmentMatrix } from '@/components/budget/EquipmentMatrix'
import { UploadSection } from '@/components/budget/UploadSection'
import { AiConceptPreview } from '@/components/budget/AiConceptPreview'
import { SellerTrackingDashboard } from '@/components/budget/SellerTrackingDashboard'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Save, Loader2, Building2, UserCircle, LogOut } from 'lucide-react'
import { useToast } from '@/hooks/use-toast'
import { useBudgetStore, budgetActions } from '@/stores/useBudgetStore'
import { useAuth } from '@/hooks/use-auth'
import { supabase } from '@/lib/supabase/client'
import { useNavigate } from 'react-router-dom'

export default function Index() {
  const { toast } = useToast()
  const { user, signOut } = useAuth()
  const navigate = useNavigate()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [activeTab, setActiveTab] = useState('new')

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
  } = useBudgetStore()

  const orderNumber = useMemo(() => {
    const year = new Date().getFullYear()
    const seq = Math.floor(Math.random() * 900) + 100
    return `#ORC-${year}-${seq}`
  }, [])

  const isAdmin = user?.user_metadata?.role === 'admin'
  const isEng = user?.user_metadata?.role === 'engenharia'

  const handleSignOut = async () => {
    await signOut()
    navigate('/')
  }

  const handleReviewQuote = (quote: any) => {
    budgetActions.reset()
    if (quote.data?.client) budgetActions.setClient(quote.data.client)
    if (quote.data?.equipments) {
      quote.data.equipments.forEach((eq: any) => budgetActions.addEquipment(eq))
    }
    if (quote.data?.aiPrompt) budgetActions.setAiPrompt(quote.data.aiPrompt)
    if (quote.data?.aiImage) budgetActions.setAiImage(quote.data.aiImage)
    if (quote.data?.aiJustification) budgetActions.setAiJustification(quote.data.aiJustification)
    if (quote.data?.aiComments) budgetActions.setAiComments(quote.data.aiComments)

    budgetActions.setQuoteId(quote.id)
    budgetActions.setQuoteStatus(quote.status)
    budgetActions.setIsReviewing(true)
    setActiveTab('new')
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const handleConsolidate = async () => {
    if (!user) {
      toast({ title: 'Atenção', description: 'Você precisa estar logado.', variant: 'destructive' })
      return
    }

    setIsSubmitting(true)
    try {
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

      await supabase.functions.invoke('maxiprod-sync', {
        body: {
          action: 'sync_quote',
          payload: { quote_id: quote.id, order_number: orderNumber, client },
        },
      })

      await supabase.from('quote_engineering_status').insert({
        quote_id: quote.id,
        status: 'analise',
        priority: 'normal',
      })

      budgetActions.reset()
      setActiveTab('tracking')
      window.scrollTo({ top: 0, behavior: 'smooth' })

      toast({
        title: 'Orçamento Enviado!',
        description: `O pedido ${orderNumber} foi enviado para a Engenharia. Acompanhe no painel.`,
      })
    } catch (e: any) {
      console.error(e)
      toast({ title: 'Erro', description: e.message || 'Falha ao salvar', variant: 'destructive' })
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
        .eq('id', quoteId)

      if (error) throw error

      await supabase
        .from('quote_engineering_status')
        .update({ status: 'analise' })
        .eq('quote_id', quoteId)

      await supabase.functions.invoke('maxiprod-sync', {
        body: { action: 'update_quote', payload: { quote_id: quoteId, order_number: orderNumber } },
      })

      budgetActions.reset()
      setActiveTab('tracking')
      window.scrollTo({ top: 0, behavior: 'smooth' })

      toast({
        title: 'Orçamento Atualizado!',
        description: 'Revisões salvas e devolvidas para Engenharia.',
      })
    } catch (e: any) {
      console.error(e)
      toast({ title: 'Erro ao atualizar', description: e.message, variant: 'destructive' })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="max-w-6xl mx-auto space-y-6 pb-24 animate-fade-in-up">
      {/* Top Navigation Bar */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-4 mb-6 flex flex-col md:flex-row justify-between items-center gap-4">
        <div className="flex items-center gap-4">
          <img
            src="https://img.usecurling.com/i?q=industry&shape=fill&color=blue"
            alt="D-Lean"
            className="h-10 object-contain"
          />
          <div className="h-8 w-px bg-slate-200 mx-2 hidden md:block"></div>
          <div className="flex items-center gap-3">
            <Avatar className="h-10 w-10 border shadow-sm">
              <AvatarFallback className="bg-brand-blue text-white">
                <UserCircle className="w-6 h-6" />
              </AvatarFallback>
            </Avatar>
            <div>
              <h3 className="font-bold text-slate-800 text-sm">{user?.email?.split('@')[0]}</h3>
              <Badge variant="secondary" className="text-[10px] px-1 py-0 h-4 capitalize">
                {user?.user_metadata?.role || 'vendedor'}
              </Badge>
            </div>
          </div>
        </div>

        <div className="flex flex-wrap justify-center gap-2">
          {(isAdmin || isEng) && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => navigate('/engineering')}
              className="text-brand-blue border-brand-blue hover:bg-blue-50"
            >
              <Building2 className="w-4 h-4 mr-2" /> Aba da Engenharia
            </Button>
          )}
          {isAdmin && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => navigate('/admin')}
              className="text-slate-600 hover:text-slate-900"
            >
              Painel Admin
            </Button>
          )}
          <Button
            variant="ghost"
            size="sm"
            onClick={handleSignOut}
            className="text-red-500 hover:text-red-600 hover:bg-red-50"
          >
            <LogOut className="w-4 h-4 mr-2" /> Sair
          </Button>
        </div>
      </div>

      <div className="border-b-4 border-brand-orange pb-4">
        <h2 className="text-3xl font-bold text-brand-blue">Painel do Vendedor</h2>
        <p className="text-muted-foreground mt-1">Gestão de Orçamentos Técnicos e Acompanhamento</p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-2 max-w-md mx-auto mb-8 bg-slate-100 p-1.5 rounded-xl border shadow-inner">
          <TabsTrigger
            value="new"
            className="data-[state=active]:bg-white data-[state=active]:text-brand-blue data-[state=active]:shadow-sm rounded-lg font-bold py-2"
          >
            Novo Orçamento
          </TabsTrigger>
          <TabsTrigger
            value="tracking"
            className="data-[state=active]:bg-white data-[state=active]:text-brand-blue data-[state=active]:shadow-sm rounded-lg font-bold py-2"
          >
            Meus Pedidos
          </TabsTrigger>
        </TabsList>

        <TabsContent value="new" className="space-y-6 animate-fade-in-up mt-0">
          <div className="flex items-center justify-end">
            <div className="text-right">
              <p className="text-xs text-muted-foreground">Nº do Orçamento em Edição</p>
              <p className="font-mono font-bold text-lg md:text-xl text-brand-orange">
                {quoteId ? `EDIÇÃO - ${orderNumber}` : orderNumber}
              </p>
            </div>
          </div>

          <ClientInfoForm onChange={budgetActions.setClient} />

          <EquipmentMatrix
            equipments={equipments}
            onAdd={budgetActions.addEquipment}
            onRemove={budgetActions.removeEquipment}
            onUpdate={budgetActions.updateEquipment}
          />

          <UploadSection onFiles={budgetActions.addFiles} />

          <div id="ai-concept-preview">
            <AiConceptPreview
              equipments={equipments}
              files={files}
              prompt={aiPrompt}
              setPrompt={budgetActions.setAiPrompt}
              aiImage={aiImage}
              setAiImage={budgetActions.setAiImage}
              aiImageStatus={aiImageStatus}
              setAiImageStatus={budgetActions.setAiImageStatus}
            />
          </div>
        </TabsContent>

        <TabsContent value="tracking" className="animate-fade-in-up mt-0">
          <SellerTrackingDashboard onReview={handleReviewQuote} />
        </TabsContent>
      </Tabs>

      {activeTab === 'new' && (
        <div className="fixed bottom-0 left-0 right-0 p-3 md:p-4 bg-background border-t flex flex-wrap justify-end gap-2 md:gap-4 z-50 shadow-[0_-4px_20px_rgba(0,0,0,0.05)] md:left-[var(--sidebar-width)] transition-[left] items-center">
          {isReviewing && (
            <Button
              variant="ghost"
              onClick={() => {
                budgetActions.reset()
                setActiveTab('tracking')
              }}
              className="mr-auto text-slate-500"
            >
              Cancelar Edição
            </Button>
          )}
          <Button
            size="lg"
            onClick={quoteId && isReviewing ? handleUpdate : handleConsolidate}
            className="bg-brand-blue hover:bg-brand-blue/90 text-white shadow-sm h-12 px-8"
            disabled={isSubmitting || (equipments.length === 0 && !aiImage)}
          >
            {isSubmitting ? (
              <Loader2 className="mr-2 h-5 w-5 animate-spin" />
            ) : (
              <Save className="mr-2 h-5 w-5" />
            )}
            {isSubmitting
              ? 'Enviando...'
              : quoteId && isReviewing
                ? 'Atualizar e Devolver'
                : 'Enviar para Engenharia'}
          </Button>
        </div>
      )}
    </div>
  )
}
