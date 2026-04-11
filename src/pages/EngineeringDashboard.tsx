import { useEffect, useState, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Textarea } from '@/components/ui/textarea'
import { Input } from '@/components/ui/input'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogTrigger,
  DialogClose,
} from '@/components/ui/dialog'
import {
  Loader2,
  CheckCircle,
  AlertTriangle,
  Clock,
  UserPlus,
  Save,
  AlertCircle,
  Wand2,
  Paperclip,
  UploadCloud,
  ArrowLeft,
  UserCircle,
  CalendarDays,
} from 'lucide-react'
import { useToast } from '@/hooks/use-toast'
import { cn } from '@/lib/utils'
import { useAuth } from '@/hooks/use-auth'
import { formatDistanceToNow, format } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import { EquipmentList } from '@/components/engineering/EquipmentList'
import { AttachmentList } from '@/components/engineering/AttachmentList'
import { supabase } from '@/lib/supabase/client'
import { GanttChart } from '@/components/engineering/GanttChart'

const formatCompanyName = (task: any) => {
  const company = task.quotes?.data?.client || task.quotes?.data?.company
  let name =
    company?.nome_fantasia ||
    company?.razao_social ||
    company?.razaoSocial ||
    task.quotes?.client_name
  if (!name) return 'Cliente Desconhecido'

  let cleanName = name
    .replace(/\b(LTDA|S\.A\.|S\/A|ME|EPP|EI|EIRELI|-)\b/gi, '')
    .replace(/[.,]/g, '')
    .trim()
  const parts = cleanName.split(/[\s-]+/)
  cleanName = parts[0]

  const city = company?.municipio || company?.cidade
  if (city) {
    const formattedCity = city.charAt(0).toUpperCase() + city.slice(1).toLowerCase()
    return `${cleanName} - ${formattedCity}`
  }
  return cleanName
}

export default function EngineeringDashboard() {
  const [tasks, setTasks] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [notes, setNotes] = useState<Record<string, string>>({})
  const [filter, setFilter] = useState<'all' | 'mine'>('all')
  const [aiDrafts, setAiDrafts] = useState<
    Record<string, { justification: string; comments: string }>
  >({})
  const [isGeneratingAi, setIsGeneratingAi] = useState<string | null>(null)

  const { toast } = useToast()
  const { user } = useAuth()
  const navigate = useNavigate()

  const fetchTasks = async () => {
    setLoading(true)
    try {
      const { data, error } = await supabase
        .from('quote_engineering_status')
        .select(`*, quotes (*)`)
        .order('created_at', { ascending: false })

      if (error) throw error

      setTasks(data || [])

      const initialNotes: Record<string, string> = {}
      const initialDrafts: Record<string, { justification: string; comments: string }> = {}

      data?.forEach((task: any) => {
        initialNotes[task.id] = task.engineer_notes || ''
        initialDrafts[task.id] = {
          justification: task.quotes?.data?.aiJustification || '',
          comments: task.quotes?.data?.aiComments || '',
        }
      })

      setNotes(initialNotes)
      setAiDrafts(initialDrafts)
    } catch (error: any) {
      console.error(error)
      toast({
        title: 'Erro ao carregar',
        description: 'Não foi possível carregar a fila.',
        variant: 'destructive',
      })
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchTasks()
  }, [])

  const updateDates = async (id: string, startDate: string, deadline: string) => {
    try {
      await supabase
        .from('quote_engineering_status')
        .update({ start_date: startDate || null, deadline: deadline || null })
        .eq('id', id)
      setTasks(
        tasks.map((t) => (t.id === id ? { ...t, start_date: startDate, deadline: deadline } : t)),
      )
      toast({ title: 'Datas Atualizadas', description: 'Cronograma atualizado com sucesso.' })
    } catch (e: any) {
      toast({ title: 'Erro', description: e.message, variant: 'destructive' })
    }
  }

  const concludeTask = async (task: any) => {
    try {
      await supabase
        .from('quote_engineering_status')
        .update({ status: 'concluido' })
        .eq('id', task.id)
      await supabase.from('quotes').update({ status: 'concluido' }).eq('id', task.quote_id)
      setTasks(tasks.map((t) => (t.id === task.id ? { ...t, status: 'concluido' } : t)))
      toast({
        title: 'Concluído',
        description: 'Projeto e proposta enviados ao vendedor com sucesso!',
      })
    } catch (e: any) {
      toast({ title: 'Erro', description: e.message, variant: 'destructive' })
    }
  }

  const requestInformation = async (task: any, message: string) => {
    try {
      await supabase
        .from('quote_engineering_status')
        .update({ status: 'revisao_solicitada', engineer_notes: message })
        .eq('id', task.id)
      await supabase.from('quotes').update({ status: 'revisao_solicitada' }).eq('id', task.quote_id)
      setTasks(
        tasks.map((t) =>
          t.id === task.id ? { ...t, status: 'revisao_solicitada', engineer_notes: message } : t,
        ),
      )
      toast({
        title: 'Solicitação Enviada',
        description: 'Pedido de informações enviado ao vendedor.',
      })
    } catch (e: any) {
      toast({ title: 'Erro', description: e.message, variant: 'destructive' })
    }
  }

  const handleUploadEngineerFiles = async (task: any, e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (!files || files.length === 0) return

    const newFiles = Array.from(files).map((f) => ({
      name: f.name,
      size: f.size,
      type: f.type,
      url: URL.createObjectURL(f),
    }))

    const currentData = task.quotes?.data || {}
    const engineer_files = currentData.engineer_files || []
    const newData = { ...currentData, engineer_files: [...engineer_files, ...newFiles] }

    try {
      await supabase.from('quotes').update({ data: newData }).eq('id', task.quotes.id)
      setTasks(
        tasks.map((t) => (t.id === task.id ? { ...t, quotes: { ...t.quotes, data: newData } } : t)),
      )
      toast({ title: 'Arquivo Anexado', description: 'Pronto para ser visualizado pelo vendedor.' })
    } catch (err: any) {
      toast({ title: 'Erro', description: err.message, variant: 'destructive' })
    }
  }

  const assignToMe = async (id: string) => {
    if (!user) return
    try {
      await supabase.from('quote_engineering_status').update({ assigned_to: user.id }).eq('id', id)
      setTasks(tasks.map((t) => (t.id === id ? { ...t, assigned_to: user.id } : t)))
      toast({ title: 'Atribuído', description: 'Tarefa atribuída a você.' })
    } catch (e: any) {
      toast({ title: 'Erro', description: e.message, variant: 'destructive' })
    }
  }

  const saveNotes = async (id: string) => {
    try {
      await supabase
        .from('quote_engineering_status')
        .update({ engineer_notes: notes[id] })
        .eq('id', id)
      setTasks(tasks.map((t) => (t.id === id ? { ...t, engineer_notes: notes[id] } : t)))
      toast({ title: 'Notas Salvas', description: 'As notas da engenharia foram atualizadas.' })
    } catch (e: any) {
      toast({ title: 'Erro', description: e.message, variant: 'destructive' })
    }
  }

  const handleGenerateAiText = async (task: any) => {
    setIsGeneratingAi(task.id)
    setTimeout(() => {
      setAiDrafts((prev) => ({
        ...prev,
        [task.id]: {
          ...prev[task.id],
          justification:
            'Equipamento dimensionado estruturalmente com margem de segurança adequada segundo as normas vigentes.',
          comments: 'Pronto para avanço.',
        },
      }))
      toast({ title: 'Gerado via IA', description: 'Textos técnicos criados.' })
      setIsGeneratingAi(null)
    }, 1200)
  }

  const handleIncorporateToBudget = async (task: any) => {
    try {
      const drafts = aiDrafts[task.id]
      if (!drafts) return
      const newData = {
        ...task.quotes?.data,
        aiJustification: drafts.justification,
        aiComments: drafts.comments,
      }
      await supabase.from('quotes').update({ data: newData }).eq('id', task.quotes.id)
      toast({
        title: 'Incorporado',
        description: 'Textos técnicos adicionados ao orçamento oficial.',
      })
    } catch (e: any) {
      toast({ title: 'Erro', description: e.message, variant: 'destructive' })
    }
  }

  const filteredTasks = useMemo(() => {
    let list = tasks
    if (filter === 'mine' && user) list = list.filter((t) => t.assigned_to === user.id)
    return list
  }, [tasks, filter, user])

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-brand-blue" />
      </div>
    )
  }

  return (
    <div className="max-w-6xl mx-auto space-y-6 animate-fade-in-up pb-12 mt-4 px-4 sm:px-0">
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-4 mb-6 flex flex-col md:flex-row justify-between items-center gap-4">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate('/')}
            className="text-slate-500 hover:bg-slate-100"
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div className="h-8 w-px bg-slate-200"></div>
          <h1 className="font-bold text-xl text-brand-blue flex items-center gap-2">
            <Wand2 className="w-5 h-5" /> Aba da Engenharia de Vendas
          </h1>
        </div>
        <div className="flex items-center gap-3">
          <Badge
            variant="outline"
            className="bg-green-50 text-green-700 border-green-200 font-medium"
          >
            <span className="w-2 h-2 rounded-full bg-green-500 mr-2 animate-pulse" /> Sincronizado
          </Badge>
          <Avatar className="h-9 w-9 border shadow-sm bg-brand-blue text-white flex items-center justify-center">
            <UserCircle className="w-5 h-5" />
          </Avatar>
        </div>
      </div>

      <Tabs defaultValue="queue" className="w-full">
        <TabsList className="mb-4">
          <TabsTrigger value="queue">Fila de Tarefas</TabsTrigger>
          <TabsTrigger value="gantt">Agenda (Gantt)</TabsTrigger>
        </TabsList>

        <TabsContent value="gantt">
          <GanttChart tasks={filteredTasks} />
        </TabsContent>

        <TabsContent value="queue" className="space-y-4">
          <div className="flex gap-2 mb-4 bg-slate-50 p-1.5 rounded-lg border inline-flex shadow-sm">
            <Button
              variant={filter === 'all' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setFilter('all')}
              className={cn(
                'h-8 px-4',
                filter === 'all' ? 'bg-white text-brand-blue shadow-sm border' : 'text-slate-500',
              )}
            >
              Todos os Pedidos
            </Button>
            <Button
              variant={filter === 'mine' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setFilter('mine')}
              className={cn(
                'h-8 px-4',
                filter === 'mine' ? 'bg-white text-brand-blue shadow-sm border' : 'text-slate-500',
              )}
            >
              Meus Atendimentos
            </Button>
          </div>

          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {filteredTasks.map((task) => {
              const isOverdue =
                task.deadline && new Date(task.deadline) < new Date() && task.status !== 'concluido'
              return (
                <Card
                  key={task.id}
                  className={cn(
                    'flex flex-col border-t-4 transition-shadow hover:shadow-md',
                    isOverdue ? 'border-t-red-500 ring-1 ring-red-500/20' : 'border-t-brand-blue',
                  )}
                >
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between mb-2">
                      <Badge
                        variant="outline"
                        className="font-mono font-bold bg-blue-50 text-brand-blue border-blue-200"
                      >
                        {task.quotes?.order_number || 'Sem número'}
                      </Badge>
                      <span className="text-[10px] font-semibold text-slate-500 flex items-center bg-slate-100 px-1.5 py-0.5 rounded">
                        <Clock className="w-3 h-3 mr-1" />
                        {formatDistanceToNow(new Date(task.created_at), { locale: ptBR })} atrás
                      </span>
                    </div>
                    <CardTitle className="text-lg truncate">{formatCompanyName(task)}</CardTitle>
                    <CardDescription>
                      Prioridade:{' '}
                      {task.priority === 'alta' ? (
                        <span className="text-red-500 font-bold">Alta</span>
                      ) : (
                        'Normal'
                      )}
                    </CardDescription>
                  </CardHeader>

                  <CardContent className="flex-1 flex flex-col gap-4">
                    <div className="text-sm space-y-3 bg-slate-50/50 p-3 rounded-md border flex-1">
                      <div className="flex justify-between items-center pb-2 border-b border-slate-100">
                        <p className="text-xs">
                          <strong className="text-slate-600">Status:</strong>{' '}
                          <span className="capitalize font-medium">
                            {task.status.replace('_', ' ')}
                          </span>
                        </p>
                        {!task.assigned_to ? (
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-6 text-[10px] font-semibold text-brand-blue px-2 bg-blue-50 border border-blue-100 hover:bg-blue-100"
                            onClick={() => assignToMe(task.id)}
                          >
                            <UserPlus className="w-3 h-3 mr-1" /> Assumir
                          </Button>
                        ) : (
                          <span className="text-[10px] font-semibold bg-brand-blue/10 text-brand-blue px-2 py-0.5 rounded border border-brand-blue/20">
                            Atribuído a Mim
                          </span>
                        )}
                      </div>

                      {/* Cronograma (Início e Fim) */}
                      <div className="flex gap-2 mb-3 mt-2">
                        <div className="flex-1">
                          <label className="text-[10px] font-bold text-slate-500 uppercase mb-1 flex items-center gap-1">
                            <CalendarDays className="w-3 h-3" /> Início
                          </label>
                          <Input
                            type="date"
                            className="h-8 text-xs px-2"
                            value={task.start_date?.split('T')[0] || ''}
                            onChange={(e) => updateDates(task.id, e.target.value, task.deadline)}
                          />
                        </div>
                        <div className="flex-1">
                          <label className="text-[10px] font-bold text-slate-500 uppercase mb-1 flex items-center gap-1">
                            <CalendarDays className="w-3 h-3" /> Término
                          </label>
                          <Input
                            type="date"
                            className="h-8 text-xs px-2"
                            value={task.deadline?.split('T')[0] || ''}
                            onChange={(e) => updateDates(task.id, task.start_date, e.target.value)}
                          />
                        </div>
                      </div>

                      {(task.quotes?.data?.equipments?.length > 0 ||
                        task.quotes?.data?.files?.length > 0) && (
                        <div className="pt-2 animate-fade-in space-y-4">
                          {task.quotes?.data?.equipments?.length > 0 && (
                            <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-sm">
                              <EquipmentList equipments={task.quotes.data.equipments} />
                            </div>
                          )}
                          {task.quotes?.data?.files?.length > 0 && (
                            <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-sm">
                              <AttachmentList files={task.quotes.data.files} />
                            </div>
                          )}
                        </div>
                      )}

                      <div className="pt-4 border-t border-slate-200 mt-2">
                        <div className="flex items-center justify-between mb-2">
                          <label className="text-[10px] font-bold text-slate-500 uppercase flex items-center gap-1">
                            <Paperclip className="w-3 h-3" /> Arquivos p/ Vendedor
                          </label>
                          <div>
                            <input
                              type="file"
                              multiple
                              className="hidden"
                              id={`upload-${task.id}`}
                              onChange={(e) => handleUploadEngineerFiles(task, e)}
                            />
                            <Button
                              variant="outline"
                              size="sm"
                              className="h-6 text-[10px] px-2"
                              onClick={() => document.getElementById(`upload-${task.id}`)?.click()}
                            >
                              <UploadCloud className="w-3 h-3 mr-1" /> Anexar
                            </Button>
                          </div>
                        </div>
                        {task.quotes?.data?.engineer_files?.length > 0 && (
                          <div className="space-y-2 mt-2">
                            {task.quotes.data.engineer_files.map((f: any, idx: number) => (
                              <div
                                key={idx}
                                className="flex justify-between p-2 bg-white border rounded text-xs"
                              >
                                <span className="truncate font-medium">{f.name}</span>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>

                      <div className="pt-3 border-t border-slate-200">
                        <label className="text-[10px] font-bold text-slate-500 uppercase mb-1.5 block">
                          Notas (Internas Eng.)
                        </label>
                        <Textarea
                          className="text-xs min-h-[50px] bg-white"
                          placeholder="Observações..."
                          value={notes[task.id] || ''}
                          onChange={(e) => setNotes({ ...notes, [task.id]: e.target.value })}
                        />
                        <Button
                          variant="default"
                          size="sm"
                          className="h-6 mt-2 text-[10px] bg-slate-800"
                          onClick={() => saveNotes(task.id)}
                          disabled={notes[task.id] === task.engineer_notes}
                        >
                          Salvar Notas
                        </Button>
                      </div>

                      <div className="pt-4 border-t border-slate-200">
                        <div className="flex justify-between mb-2">
                          <label className="text-[10px] font-bold text-brand-blue uppercase flex items-center gap-1">
                            <Wand2 className="w-3 h-3" /> Texto IA (Proposta)
                          </label>
                          <Button
                            variant="outline"
                            size="sm"
                            className="h-6 text-[10px] px-2"
                            onClick={() => handleGenerateAiText(task)}
                            disabled={isGeneratingAi === task.id}
                          >
                            {isGeneratingAi === task.id ? (
                              <Loader2 className="w-3 h-3 mr-1 animate-spin" />
                            ) : (
                              <Wand2 className="w-3 h-3 mr-1" />
                            )}{' '}
                            Gerar
                          </Button>
                        </div>
                        <div className="space-y-2">
                          <Textarea
                            className="text-xs min-h-[50px] bg-blue-50/30"
                            placeholder="Justificativa..."
                            value={aiDrafts[task.id]?.justification || ''}
                            onChange={(e) =>
                              setAiDrafts((p) => ({
                                ...p,
                                [task.id]: { ...p[task.id], justification: e.target.value },
                              }))
                            }
                          />
                          <Button
                            size="sm"
                            className="w-full h-7 text-[10px]"
                            onClick={() => handleIncorporateToBudget(task)}
                          >
                            Validar e Incluir no Orçamento
                          </Button>
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-col gap-2 pt-1 mt-auto">
                      <div className="flex gap-2">
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button
                              size="sm"
                              variant="outline"
                              className="flex-1 text-amber-600 border-amber-200 font-bold bg-amber-50/30 hover:bg-amber-50"
                              disabled={task.status === 'revisao_solicitada'}
                            >
                              <AlertTriangle className="w-4 h-4 mr-1" /> Pedir Info ao Vendedor
                            </Button>
                          </DialogTrigger>
                          <DialogContent>
                            <DialogHeader>
                              <DialogTitle>Solicitar Informações</DialogTitle>
                              <DialogDescription>
                                Detalhe ao vendedor o que está faltando para prosseguir com o
                                projeto.
                              </DialogDescription>
                            </DialogHeader>
                            <Textarea
                              placeholder="Faltou informar a carga máxima..."
                              value={notes[task.id] || ''}
                              onChange={(e) => setNotes({ ...notes, [task.id]: e.target.value })}
                              className="min-h-[100px]"
                            />
                            <DialogFooter>
                              <DialogClose asChild>
                                <Button variant="outline">Cancelar</Button>
                              </DialogClose>
                              <DialogClose asChild>
                                <Button
                                  onClick={() => requestInformation(task, notes[task.id] || '')}
                                >
                                  Enviar Pedido
                                </Button>
                              </DialogClose>
                            </DialogFooter>
                          </DialogContent>
                        </Dialog>
                      </div>
                      <Button
                        size="sm"
                        className="w-full bg-green-600 hover:bg-green-700 text-white font-bold h-10"
                        onClick={() => concludeTask(task)}
                        disabled={task.status === 'concluido'}
                      >
                        <CheckCircle className="w-4 h-4 mr-2" /> Finalizar e Enviar Proposta
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              )
            })}
            {filteredTasks.length === 0 && (
              <div className="col-span-full text-center py-12 text-slate-500 border rounded-xl bg-slate-50/50">
                <p className="font-medium">Fila vazia.</p>
              </div>
            )}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
