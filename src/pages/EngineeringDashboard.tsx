import { useEffect, useState, useMemo } from 'react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  Loader2,
  CheckCircle,
  AlertTriangle,
  Clock,
  UserPlus,
  Save,
  AlertCircle,
  MessageSquare,
} from 'lucide-react'
import { useToast } from '@/hooks/use-toast'
import { cn } from '@/lib/utils'
import { useAuth } from '@/hooks/use-auth'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Textarea } from '@/components/ui/textarea'
import { formatDistanceToNow, format } from 'date-fns'
import { Wand2, Package, Paperclip, FileText } from 'lucide-react'
import { ptBR } from 'date-fns/locale'
import { EquipmentList } from '@/components/engineering/EquipmentList'
import { AttachmentList } from '@/components/engineering/AttachmentList'
import { supabase } from '@/lib/supabase/client'

const MOCK_TASKS = [
  {
    id: 'task-1',
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(), // 2 hours ago
    status: 'analise',
    priority: 'alta',
    assigned_to: null,
    engineer_notes: '',
    start_date: null,
    deadline: new Date(Date.now() + 1000 * 60 * 60 * 24).toISOString(), // +1 day
    quotes: {
      order_number: '#ORC-2024-101',
      client_name: 'Indústrias Acme LTDA',
      data: {
        company: { razao_social: 'Indústrias Acme LTDA', municipio: 'São Paulo' },
        equipments: [
          {
            type: 'esteira_transportadora',
            name: 'Esteira de Roletes Livres',
            data: {
              width: '800mm',
              height: '900mm',
              length: '5000mm',
              material: 'Aço Carbono Galvanizado',
              description:
                'Esteira para transporte de caixas pesadas no setor de expedição com guias laterais.',
              construction_method: 'Estrutura parafusada com roletes em aço zincado',
            },
          },
        ],
        files: [
          { name: 'Drawing_01.pdf', size: 2500000, type: 'application/pdf' },
          {
            name: 'Specs_V2.docx',
            size: 850000,
            type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
          },
          { name: 'Site_Photo.jpg', size: 1200000, type: 'image/jpeg' },
        ],
        aiJustification: '',
        aiComments: '',
      },
    },
  },
  {
    id: 'task-2',
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 48).toISOString(), // 2 days ago
    status: 'revisao_solicitada',
    priority: 'normal',
    assigned_to: 'user-1',
    engineer_notes: 'Verificar layout do cliente.',
    start_date: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(),
    deadline: new Date(Date.now() - 1000 * 60 * 60 * 12).toISOString(), // Overdue
    quotes: {
      order_number: '#ORC-2024-102',
      client_name: 'TechMecânica S/A',
      data: {
        company: { razao_social: 'TechMecânica S/A', municipio: 'Campinas' },
        equipments: [
          {
            type: 'bancada_montagem',
            name: 'Bancada Ergonômica',
            data: {
              width: '1500mm',
              height: '850-1050mm (Ajustável)',
              length: '750mm',
              material: 'Perfil de Alumínio Estrutural',
              description:
                'Bancada para montagem de componentes eletrônicos finos com sistema antistático.',
              construction_method: 'Montagem modular com conectores rápidos',
            },
          },
        ],
        files: [
          { name: 'Drawing_01.pdf', size: 4500000, type: 'application/pdf' },
          { name: 'Specs_V2.docx', size: 1100000, type: 'application/pdf' },
          { name: 'Site_Photo.jpg', size: 500000, type: 'application/jpeg' },
        ],
        aiJustification: '',
        aiComments: '',
      },
    },
  },
]

const formatCompanyName = (task: any) => {
  const company = task.quotes?.data?.company
  let name = company?.nome_fantasia || company?.razao_social || task.quotes?.client_name
  if (!name) return 'Cliente Desconhecido'

  let cleanName = name
    .replace(/\b(LTDA|S\.A\.|S\/A|ME|EPP|EI|EIRELI|-)\b/gi, '')
    .replace(/[.,]/g, '')
    .trim()
  const parts = cleanName.split(/[\s-]+/)
  cleanName = parts[0]

  const city = company?.municipio || task.quotes?.data?.customer?.city
  if (city) {
    const formattedCity = city.charAt(0).toUpperCase() + city.slice(1).toLowerCase()
    return `${cleanName} - ${formattedCity}`
  }
  return cleanName
}

const GanttChart = ({ tasks }: { tasks: any[] }) => {
  const [viewMode, setViewMode] = useState<'day' | 'week'>('week')

  const now = new Date()
  const windowStart = new Date(now.getFullYear(), now.getMonth(), now.getDate())

  const windowEnd = new Date(windowStart)
  if (viewMode === 'day') {
    windowEnd.setDate(windowEnd.getDate() + 1)
  } else {
    windowEnd.setDate(windowEnd.getDate() + 7)
  }

  const totalMs = windowEnd.getTime() - windowStart.getTime()
  const columns = viewMode === 'day' ? 24 : 7

  const labels = Array.from({ length: columns }).map((_, i) => {
    if (viewMode === 'day') {
      return `${String(i).padStart(2, '0')}:00`
    } else {
      const d = new Date(windowStart.getTime() + i * 24 * 60 * 60 * 1000)
      return format(d, 'EEEE, dd/MM', { locale: ptBR })
    }
  })

  const getTaskStyle = (task: any) => {
    const start = task.start_date ? new Date(task.start_date) : new Date(task.created_at)
    const end = task.deadline
      ? new Date(task.deadline)
      : new Date(start.getTime() + 2 * 60 * 60 * 1000)

    let startMs = start.getTime() - windowStart.getTime()
    let endMs = end.getTime() - windowStart.getTime()

    if (endMs < 0 || startMs > totalMs) return null

    if (startMs < 0) startMs = 0
    if (endMs > totalMs) endMs = totalMs

    const left = (startMs / totalMs) * 100
    const width = ((endMs - startMs) / totalMs) * 100
    const isDelayed =
      task.deadline &&
      new Date(task.deadline).getTime() < now.getTime() &&
      task.status !== 'aprovado'

    return {
      left: `${left}%`,
      width: `${Math.max(width, 1)}%`,
      isDelayed,
      start,
      end,
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-end gap-2">
        <Button
          variant={viewMode === 'day' ? 'default' : 'outline'}
          size="sm"
          onClick={() => setViewMode('day')}
          className="h-8 shadow-sm"
        >
          Visão Diária
        </Button>
        <Button
          variant={viewMode === 'week' ? 'default' : 'outline'}
          size="sm"
          onClick={() => setViewMode('week')}
          className="h-8 shadow-sm"
        >
          Visão Semanal
        </Button>
      </div>

      <div className="relative w-full border-2 border-slate-300 rounded-lg overflow-x-auto bg-white shadow-sm">
        <div className="min-w-[1000px]">
          <div className="flex border-b-2 border-slate-300 bg-slate-100">
            <div className="w-28 shrink-0 p-3 border-r-2 border-slate-300 font-bold text-[10px] text-slate-800 flex items-center uppercase tracking-wider">
              Pedido
            </div>
            <div className="w-40 shrink-0 p-3 border-r-2 border-slate-300 font-bold text-[10px] text-slate-800 flex items-center uppercase tracking-wider">
              Cliente
            </div>
            <div className="w-32 shrink-0 p-3 border-r-2 border-slate-300 font-bold text-[10px] text-slate-800 flex items-center uppercase tracking-wider">
              Status / Eng
            </div>
            <div className="flex-1 flex relative">
              {labels.map((label, i) => (
                <div
                  key={i}
                  className="flex-1 border-r border-slate-300 last:border-r-0 text-center text-xs py-2 text-slate-700 font-semibold capitalize"
                >
                  {label}
                </div>
              ))}
              {now.getTime() >= windowStart.getTime() && now.getTime() <= windowEnd.getTime() && (
                <div
                  className="absolute top-0 bottom-0 w-0.5 bg-red-500 z-20 flex flex-col items-center"
                  style={{ left: `${((now.getTime() - windowStart.getTime()) / totalMs) * 100}%` }}
                >
                  <div className="w-3 h-3 rounded-full bg-red-500 -mt-1.5 shadow-sm" />
                </div>
              )}
            </div>
          </div>

          {tasks.map((task) => {
            const style = getTaskStyle(task)

            return (
              <div
                key={task.id}
                className="flex border-b border-slate-200 last:border-b-0 bg-white hover:bg-slate-50 transition-colors h-14"
              >
                <div className="w-28 shrink-0 p-2 border-r-2 border-slate-300 text-xs font-bold text-brand-blue flex items-center bg-slate-50/50">
                  {task.quotes?.order_number || 'Sem número'}
                </div>
                <div
                  className="w-40 shrink-0 p-2 border-r-2 border-slate-300 text-xs flex items-center truncate text-slate-700 font-medium bg-slate-50/50"
                  title={formatCompanyName(task)}
                >
                  {formatCompanyName(task)}
                </div>
                <div className="w-32 shrink-0 p-2 border-r-2 border-slate-300 text-[10px] flex flex-col justify-center gap-0.5 bg-slate-50/50">
                  <span className="font-semibold uppercase text-slate-500 truncate">
                    {task.status.replace('_', ' ')}
                  </span>
                  <span className="text-slate-400 truncate flex items-center gap-1">
                    <UserPlus className="w-3 h-3" />
                    {task.assigned_to ? 'Atribuído' : 'Ñ Atribuído'}
                  </span>
                </div>
                <div className="flex-1 relative py-1 px-1">
                  <div className="absolute inset-0 flex pointer-events-none">
                    {Array.from({ length: columns }).map((_, i) => (
                      <div key={i} className="flex-1 border-r border-slate-200 last:border-r-0" />
                    ))}
                  </div>

                  {style && (
                    <div className="relative w-full h-full z-10">
                      <div
                        className={cn(
                          'absolute h-full rounded border-2 flex flex-col justify-center px-2 text-[10px] shadow-sm overflow-hidden whitespace-nowrap transition-all hover:ring-2 hover:ring-brand-blue hover:z-30 cursor-pointer',
                          style.isDelayed
                            ? 'bg-red-50 border-red-400 text-red-900'
                            : 'bg-blue-50 border-blue-400 text-blue-900',
                        )}
                        style={{ left: style.left, width: style.width }}
                        title={`Pedido: ${task.quotes?.order_number}\nInício: ${format(style.start, 'dd/MM HH:mm')}\nFim: ${format(style.end, 'dd/MM HH:mm')}`}
                      >
                        <span className="truncate w-full font-medium text-[10px] text-center">
                          {format(style.start, 'HH:mm')} - {format(style.end, 'HH:mm')}
                        </span>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )
          })}
          {tasks.length === 0 && (
            <div className="text-center py-12 text-sm text-slate-500 bg-white font-medium">
              Nenhuma tarefa ativa para exibir no gráfico neste período.
            </div>
          )}
        </div>
      </div>
    </div>
  )
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

  const fetchTasks = async () => {
    setLoading(true)
    try {
      const { data, error } = await supabase
        .from('quote_engineering_status')
        .select(`
          *,
          quotes (*)
        `)
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
        description: 'Não foi possível carregar as tarefas.',
        variant: 'destructive',
      })
      // Fallback para mock caso não exista banco ou haja falha na rede
      setTasks(MOCK_TASKS as any[])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchTasks()
  }, [])

  const updateStatus = async (id: string, newStatus: string) => {
    try {
      const { error } = await supabase
        .from('quote_engineering_status')
        .update({ status: newStatus })
        .eq('id', id)
      if (error) throw error
      setTasks(tasks.map((t) => (t.id === id ? { ...t, status: newStatus } : t)))
      toast({
        title: 'Sucesso',
        description: `Status atualizado para ${newStatus.replace('_', ' ')}`,
      })
    } catch (e: any) {
      toast({ title: 'Erro', description: e.message, variant: 'destructive' })
    }
  }

  const assignToMe = async (id: string) => {
    if (!user) return
    try {
      const { error } = await supabase
        .from('quote_engineering_status')
        .update({ assigned_to: user.id })
        .eq('id', id)
      if (error) throw error
      setTasks(tasks.map((t) => (t.id === id ? { ...t, assigned_to: user.id } : t)))
      toast({ title: 'Sucesso', description: 'Tarefa atribuída a você.' })
    } catch (e: any) {
      toast({ title: 'Erro', description: e.message, variant: 'destructive' })
    }
  }

  const setDeadlineHours = async (id: string, hoursToAdd: number) => {
    const deadline = new Date()
    deadline.setHours(deadline.getHours() + hoursToAdd)
    const isoStr = deadline.toISOString()
    try {
      const { error } = await supabase
        .from('quote_engineering_status')
        .update({ deadline: isoStr })
        .eq('id', id)
      if (error) throw error
      setTasks(tasks.map((t) => (t.id === id ? { ...t, deadline: isoStr } : t)))
      toast({ title: 'Sucesso', description: `Prazo atualizado (+${hoursToAdd}h).` })
    } catch (e: any) {
      toast({ title: 'Erro', description: e.message, variant: 'destructive' })
    }
  }

  const updateCustomDeadline = async (id: string, dateStr: string) => {
    try {
      const { error } = await supabase
        .from('quote_engineering_status')
        .update({ deadline: dateStr })
        .eq('id', id)
      if (error) throw error
      setTasks(tasks.map((t) => (t.id === id ? { ...t, deadline: dateStr } : t)))
      toast({ title: 'Sucesso', description: 'Prazo atualizado com sucesso.' })
    } catch (e: any) {
      toast({ title: 'Erro', description: e.message, variant: 'destructive' })
    }
  }

  const updateCustomStartDate = async (id: string, dateStr: string) => {
    try {
      const { error } = await supabase
        .from('quote_engineering_status')
        .update({ start_date: dateStr })
        .eq('id', id)
      if (error) throw error
      setTasks(tasks.map((t) => (t.id === id ? { ...t, start_date: dateStr } : t)))
      toast({ title: 'Sucesso', description: 'Data de início atualizada com sucesso.' })
    } catch (e: any) {
      toast({ title: 'Erro', description: e.message, variant: 'destructive' })
    }
  }

  const formatForInput = (isoString?: string | null) => {
    if (!isoString) return ''
    const d = new Date(isoString)
    const offset = d.getTimezoneOffset() * 60000
    return new Date(d.getTime() - offset).toISOString().slice(0, 16)
  }

  const handleDateChange = (id: string, value: string) => {
    if (!value) return
    const d = new Date(value)
    updateCustomDeadline(id, d.toISOString())
  }

  const handleStartDateChange = (id: string, value: string) => {
    if (!value) return
    const d = new Date(value)
    updateCustomStartDate(id, d.toISOString())
  }

  const saveNotes = async (id: string) => {
    try {
      const { error } = await supabase
        .from('quote_engineering_status')
        .update({ engineer_notes: notes[id] })
        .eq('id', id)
      if (error) throw error
      setTasks(tasks.map((t) => (t.id === id ? { ...t, engineer_notes: notes[id] } : t)))
      toast({ title: 'Sucesso', description: 'Notas da engenharia atualizadas.' })
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
            'Com base nas especificações informadas, o equipamento atende aos requisitos dimensionais e estruturais do projeto com margem de segurança de 20%.',
          comments: 'Análise técnica simulada via IA concluída. Nenhum conflito identificado.',
        },
      }))
      toast({ title: 'Sucesso', description: 'Textos gerados pela IA com sucesso.' })
      setIsGeneratingAi(null)
    }, 1200)
  }

  const handleIncorporateToBudget = async (task: any) => {
    try {
      const drafts = aiDrafts[task.id]
      if (!drafts) return

      const currentData = task.quotes?.data || {}
      const newData = {
        ...currentData,
        aiJustification: drafts.justification,
        aiComments: drafts.comments,
      }

      const { error } = await supabase
        .from('quotes')
        .update({ data: newData })
        .eq('id', task.quotes.id)
      if (error) throw error

      toast({ title: 'Sucesso', description: 'Textos validados e incorporados ao orçamento!' })
    } catch (e: any) {
      toast({
        title: 'Erro',
        description: e.message || 'Falha ao salvar textos no orçamento',
        variant: 'destructive',
      })
    }
  }

  const isManager = true // Simplified for mock view

  const activeTasks = useMemo(() => {
    return tasks.filter((t) => t.status !== 'aprovado')
  }, [tasks])

  const filteredTasks = useMemo(() => {
    let list = tasks
    if (filter === 'mine' && user) {
      list = list.filter((t) => t.assigned_to === user.id)
    }
    return list
  }, [tasks, filter, user])

  if (loading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-brand-blue" />
      </div>
    )
  }

  return (
    <div className="max-w-6xl mx-auto space-y-6 animate-fade-in-up pb-12">
      <div className="border-b-4 border-brand-orange pb-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-3xl font-bold text-brand-blue">Dashboard de Engenharia</h2>
            <p className="text-muted-foreground mt-1">Integração Ativa (Supabase + Maxiprod)</p>
          </div>
          <div className="hidden sm:block">
            <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
              <span className="w-2 h-2 rounded-full bg-green-500 mr-2 animate-pulse" />
              Sistemas Sincronizados
            </Badge>
          </div>
        </div>
      </div>

      <Tabs defaultValue="queue" className="w-full">
        <TabsList className="mb-4">
          <TabsTrigger value="queue">Fila de Tarefas</TabsTrigger>
          {isManager && <TabsTrigger value="workload">Gestão de Carga</TabsTrigger>}
        </TabsList>

        <TabsContent value="queue" className="space-y-4">
          <div className="flex gap-2 mb-4 bg-slate-50 p-1.5 rounded-lg border inline-flex shadow-sm">
            <Button
              variant={filter === 'all' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setFilter('all')}
              className={cn(
                'h-8 px-4',
                filter === 'all'
                  ? 'bg-white text-brand-blue shadow-sm border'
                  : 'text-slate-500 hover:text-slate-800',
              )}
            >
              Todos os Orçamentos
            </Button>
            <Button
              variant={filter === 'mine' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setFilter('mine')}
              className={cn(
                'h-8 px-4',
                filter === 'mine'
                  ? 'bg-white text-brand-blue shadow-sm border'
                  : 'text-slate-500 hover:text-slate-800',
              )}
            >
              Meus Orçamentos
            </Button>
          </div>

          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {filteredTasks.map((task) => {
              const timeInQueue = formatDistanceToNow(new Date(task.created_at), {
                locale: ptBR,
                addSuffix: false,
              })
              const isOverdue =
                task.deadline && new Date(task.deadline) < new Date() && task.status !== 'aprovado'

              return (
                <Card
                  key={task.id}
                  className={cn(
                    'flex flex-col relative transition-all duration-300 border-t-4',
                    isOverdue
                      ? 'border-t-red-500 shadow-[0_0_15px_rgba(239,68,68,0.15)] ring-1 ring-red-500/20'
                      : 'border-t-brand-blue shadow-md hover:shadow-lg',
                  )}
                >
                  {isOverdue && (
                    <div className="absolute inset-0 border-[3px] border-red-500/80 rounded-xl animate-pulse pointer-events-none opacity-60" />
                  )}

                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between mb-2">
                      <Badge
                        variant="outline"
                        className={cn(
                          'font-mono font-bold',
                          task.status === 'aprovado'
                            ? 'text-green-600 border-green-200 bg-green-50'
                            : task.status === 'revisao_solicitada'
                              ? 'text-amber-600 border-amber-200 bg-amber-50'
                              : 'text-brand-blue border-blue-200 bg-blue-50',
                        )}
                      >
                        {task.quotes?.order_number || 'Sem número'}
                      </Badge>
                      <span className="text-[10px] font-semibold text-slate-500 flex items-center bg-slate-100 px-1.5 py-0.5 rounded">
                        <Clock className="w-3 h-3 mr-1" />
                        {timeInQueue}
                      </span>
                    </div>
                    <CardTitle className="text-lg flex items-center justify-between gap-2">
                      <span className="truncate" title={task.quotes?.client_name}>
                        {formatCompanyName(task)}
                      </span>
                      {isOverdue && (
                        <AlertCircle className="w-5 h-5 text-red-500 shrink-0 animate-pulse" />
                      )}
                    </CardTitle>
                    <CardDescription className="flex justify-between items-center mt-1">
                      <span className="text-xs font-medium">
                        Prioridade:{' '}
                        {task.priority === 'alta' ? (
                          <span className="text-red-500 font-bold">Alta</span>
                        ) : (
                          'Normal'
                        )}
                      </span>
                      <div className="flex flex-col items-end gap-1">
                        {task.start_date && (
                          <span className="text-[10px] px-2 py-0.5 rounded border font-semibold bg-slate-50 text-slate-600 border-slate-200">
                            Início: {format(new Date(task.start_date), 'dd/MM HH:mm')}
                          </span>
                        )}
                        {task.deadline ? (
                          <span
                            className={cn(
                              'text-[10px] px-2 py-0.5 rounded border font-semibold',
                              isOverdue
                                ? 'bg-red-100 text-red-700 border-red-200'
                                : 'bg-slate-100 text-slate-700 border-slate-200',
                            )}
                          >
                            Fim: {format(new Date(task.deadline), 'dd/MM HH:mm')}
                          </span>
                        ) : (
                          <span className="text-[10px] bg-slate-100 px-2 py-0.5 rounded border text-slate-500 italic">
                            Sem SLA
                          </span>
                        )}
                      </div>
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
                            className="h-6 text-[10px] font-semibold text-brand-blue px-2 bg-blue-50 hover:bg-blue-100 border border-blue-100"
                            onClick={() => assignToMe(task.id)}
                          >
                            <UserPlus className="w-3 h-3 mr-1" /> Assumir
                          </Button>
                        ) : (
                          <span className="text-[10px] font-semibold bg-brand-blue/10 text-brand-blue px-2 py-0.5 rounded border border-brand-blue/20">
                            Atribuído
                          </span>
                        )}
                      </div>

                      {task.status !== 'aprovado' && (
                        <div className="pt-1">
                          <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1.5 flex items-center justify-between">
                            <span>Período de Execução</span>
                          </label>
                          <div className="flex flex-col gap-2">
                            <div className="flex items-center gap-2">
                              <span className="text-[10px] font-medium text-slate-500 w-8">
                                Início:
                              </span>
                              <input
                                type="datetime-local"
                                className="text-[11px] font-medium flex-1 h-7 px-2 border border-slate-200 rounded bg-white text-slate-700 shadow-sm focus:outline-none focus:ring-1 focus:ring-brand-blue"
                                value={formatForInput(task.start_date)}
                                onChange={(e) => handleStartDateChange(task.id, e.target.value)}
                              />
                            </div>
                            <div className="flex items-center gap-2">
                              <span className="text-[10px] font-medium text-slate-500 w-8">
                                Fim:
                              </span>
                              <input
                                type="datetime-local"
                                className="text-[11px] font-medium flex-1 h-7 px-2 border border-slate-200 rounded bg-white text-slate-700 shadow-sm focus:outline-none focus:ring-1 focus:ring-brand-blue"
                                value={formatForInput(task.deadline)}
                                onChange={(e) => handleDateChange(task.id, e.target.value)}
                              />
                            </div>
                            <div className="flex gap-1 mt-1">
                              {[2, 4, 8, 24].map((hours) => (
                                <Button
                                  key={hours}
                                  variant="outline"
                                  size="sm"
                                  className="h-6 text-[10px] px-1 flex-1 font-semibold hover:bg-brand-blue hover:text-white transition-colors border-slate-200"
                                  onClick={() => setDeadlineHours(task.id, hours)}
                                >
                                  +{hours}h (Fim)
                                </Button>
                              ))}
                            </div>
                          </div>
                        </div>
                      )}

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

                      <div className="pt-3 mt-2 border-t border-slate-200/50">
                        <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1.5 block">
                          Notas da Engenharia Interna
                        </label>
                        <Textarea
                          placeholder="Adicione observações técnicas..."
                          className="text-xs min-h-[60px] resize-none focus-visible:ring-1 focus-visible:ring-brand-blue bg-white"
                          value={notes[task.id] || ''}
                          onChange={(e) => setNotes({ ...notes, [task.id]: e.target.value })}
                        />
                        <div className="flex justify-end mt-2">
                          <Button
                            variant="default"
                            size="sm"
                            className="h-6 text-[10px] px-3 bg-slate-800 hover:bg-slate-700 font-semibold shadow-sm"
                            onClick={() => saveNotes(task.id)}
                            disabled={notes[task.id] === task.engineer_notes}
                          >
                            <Save className="w-3 h-3 mr-1" /> Salvar Notas
                          </Button>
                        </div>
                      </div>

                      <div className="pt-4 border-t border-slate-200 mt-2">
                        <div className="flex items-center justify-between mb-2">
                          <label className="text-[10px] font-bold text-brand-blue uppercase tracking-wider flex items-center gap-1">
                            <Wand2 className="w-3 h-3" /> Assistente de IA (Proposta)
                          </label>
                          <Button
                            variant="outline"
                            size="sm"
                            className="h-6 text-[10px] px-2 text-brand-blue border-brand-blue/30 hover:bg-brand-blue/10"
                            onClick={() => handleGenerateAiText(task)}
                            disabled={isGeneratingAi === task.id}
                          >
                            {isGeneratingAi === task.id ? (
                              <Loader2 className="w-3 h-3 mr-1 animate-spin" />
                            ) : (
                              <Wand2 className="w-3 h-3 mr-1" />
                            )}
                            Gerar Textos
                          </Button>
                        </div>

                        <div className="space-y-3">
                          <div>
                            <span className="text-[9px] text-slate-500 uppercase font-bold mb-1 block">
                              Justificativa Técnica
                            </span>
                            <Textarea
                              className="text-xs min-h-[60px] bg-blue-50/30 border-blue-100"
                              placeholder="Gere com a IA ou digite a justificativa técnica..."
                              value={aiDrafts[task.id]?.justification || ''}
                              onChange={(e) =>
                                setAiDrafts((prev) => ({
                                  ...prev,
                                  [task.id]: { ...prev[task.id], justification: e.target.value },
                                }))
                              }
                            />
                          </div>
                          <div>
                            <span className="text-[9px] text-slate-500 uppercase font-bold mb-1 block">
                              Comentários da IA
                            </span>
                            <Textarea
                              className="text-xs min-h-[40px] bg-blue-50/30 border-blue-100"
                              placeholder="Observações adicionais geradas pela IA..."
                              value={aiDrafts[task.id]?.comments || ''}
                              onChange={(e) =>
                                setAiDrafts((prev) => ({
                                  ...prev,
                                  [task.id]: { ...prev[task.id], comments: e.target.value },
                                }))
                              }
                            />
                          </div>

                          <Button
                            size="sm"
                            className="w-full h-7 text-[10px] bg-brand-blue hover:bg-brand-blue/90"
                            onClick={() => handleIncorporateToBudget(task)}
                            disabled={
                              !aiDrafts[task.id]?.justification && !aiDrafts[task.id]?.comments
                            }
                          >
                            <CheckCircle className="w-3 h-3 mr-1" /> Validar e Incorporar
                          </Button>
                        </div>
                      </div>
                    </div>

                    <div className="flex gap-2 pt-1">
                      <Button
                        size="sm"
                        variant="outline"
                        className="flex-1 text-amber-600 hover:text-amber-700 hover:bg-amber-50 border-amber-200 font-bold bg-white shadow-sm"
                        onClick={() => updateStatus(task.id, 'revisao_solicitada')}
                        disabled={task.status === 'revisao_solicitada'}
                      >
                        <AlertTriangle className="w-4 h-4 mr-1 hidden sm:inline-block" />
                        Revisão
                      </Button>
                      <Button
                        size="sm"
                        className="flex-1 bg-green-600 hover:bg-green-700 text-white font-bold shadow-sm"
                        onClick={() => updateStatus(task.id, 'aprovado')}
                        disabled={task.status === 'aprovado'}
                      >
                        <CheckCircle className="w-4 h-4 mr-1 hidden sm:inline-block" />
                        Aprovar
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              )
            })}
            {filteredTasks.length === 0 && (
              <div className="col-span-full text-center py-12 text-muted-foreground border rounded-xl bg-slate-50/50 shadow-inner">
                <Clock className="mx-auto h-12 w-12 text-slate-300 mb-3 opacity-50" />
                <p className="font-medium">Nenhuma tarefa encontrada.</p>
              </div>
            )}
          </div>
        </TabsContent>

        {isManager && (
          <TabsContent value="workload" className="animate-fade-in-up">
            <Card className="border-t-4 border-t-brand-orange shadow-md">
              <CardHeader className="bg-slate-50/50 border-b pb-4">
                <CardTitle className="text-xl">Carga de Trabalho Ativa</CardTitle>
                <CardDescription>
                  Gráfico de Gantt simplificado mostrando prazos e gargalos nas próximas 24 horas.
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-2">
                <GanttChart tasks={activeTasks} />
              </CardContent>
            </Card>
          </TabsContent>
        )}
      </Tabs>
    </div>
  )
}
