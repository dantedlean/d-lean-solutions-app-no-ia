import { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import {
  AlertTriangle,
  UploadCloud,
  FileImage,
  PenTool,
  Sparkles,
  Building2,
  User,
  Phone,
  CheckCircle2,
} from 'lucide-react'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Switch } from '@/components/ui/switch'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Separator } from '@/components/ui/separator'
import { useToast } from '@/hooks/use-toast'
import { cn } from '@/lib/utils'

const formSchema = z.object({
  // Client Identification
  cnpj: z.string().min(14, 'CNPJ inválido'),
  razaoSocial: z.string().min(3, 'Razão social é obrigatória'),
  contato: z.string().min(2, 'Nome do contato é obrigatório'),
  whatsapp: z.string().min(10, 'WhatsApp inválido'),

  // Technical Configuration
  projectType: z.enum(['carts', 'modular']),
  baseHeight: z.coerce.number().min(10, 'Altura deve ser maior que 10'),
  casterDiameter: z.coerce.number().min(50, 'Diâmetro mínimo 50mm').optional(),

  // Cart Specifics
  mechanicalTraction: z.boolean().default(false),
  handle: z.boolean().default(false),
  brake: z.boolean().default(false),
})

type FormValues = z.infer<typeof formSchema>

export default function NewBudget() {
  const { toast } = useToast()
  const [criticalAlert, setCriticalAlert] = useState(false)
  const [isUploading, setIsUploading] = useState(false)

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      projectType: 'carts',
      mechanicalTraction: false,
      handle: false,
      brake: false,
      baseHeight: 1000,
      casterDiameter: 100,
      cnpj: '',
      razaoSocial: '',
      contato: '',
      whatsapp: '',
    },
  })

  const { watch } = form
  const projectType = watch('projectType')
  const baseHeight = watch('baseHeight')
  const casterDiameter = watch('casterDiameter')

  // Engineering Validation Engine
  useEffect(() => {
    if (projectType === 'carts' && baseHeight && casterDiameter) {
      // Dummy critical rule: Height to Caster ratio > 15 is dangerous (tipping hazard)
      const ratio = baseHeight / casterDiameter
      if (ratio > 15) {
        setCriticalAlert(true)
      } else {
        setCriticalAlert(false)
      }
    } else {
      setCriticalAlert(false)
    }
  }, [baseHeight, casterDiameter, projectType])

  function onSubmit(data: FormValues) {
    if (criticalAlert) {
      toast({
        variant: 'destructive',
        title: 'Atenção Requerida',
        description:
          'Não é possível salvar com medidas críticas não resolvidas. Acione a engenharia.',
      })
      return
    }

    console.log(data)
    toast({
      title: 'Orçamento Rascunho Salvo!',
      description: 'As informações foram integradas ao banco de dados com sucesso.',
    })
  }

  const simulateUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setIsUploading(true)
      setTimeout(() => {
        setIsUploading(false)
        toast({
          title: 'Arquivo anexado',
          description: `${e.target.files![0].name} carregado com sucesso.`,
        })
      }, 1500)
    }
  }

  return (
    <div className="max-w-5xl mx-auto space-y-8 animate-fade-in-up pb-12">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold tracking-tight text-primary">Novo Orçamento Técnico</h2>
          <p className="text-muted-foreground">
            Configuração unificada de Briefing e Especificação
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" className="text-primary border-primary hover:bg-primary/10">
            Salvar Rascunho
          </Button>
          <Button onClick={form.handleSubmit(onSubmit)} className="bg-primary hover:bg-primary/90">
            Finalizar Briefing
          </Button>
        </div>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          {/* Section 1: Client Info */}
          <Card className="shadow-sm border-t-4 border-t-secondary">
            <CardHeader className="pb-4">
              <CardTitle className="text-lg flex items-center gap-2">
                <Building2 className="w-5 h-5 text-primary" /> Identificação do Cliente
              </CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="cnpj"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>CNPJ</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="00.000.000/0000-00"
                        {...field}
                        className="focus-visible:ring-primary"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="razaoSocial"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Razão Social</FormLabel>
                    <FormControl>
                      <Input placeholder="Indústria Exemplo Ltda" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="contato"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center gap-2">
                      <User className="w-4 h-4" /> Contato
                    </FormLabel>
                    <FormControl>
                      <Input placeholder="Nome do responsável" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="whatsapp"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center gap-2">
                      <Phone className="w-4 h-4" /> WhatsApp
                    </FormLabel>
                    <FormControl>
                      <Input placeholder="(00) 00000-0000" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>

          {/* Section 2: Technical Config */}
          <Card className="shadow-sm border-t-4 border-t-primary relative overflow-hidden">
            <CardHeader className="pb-4">
              <CardTitle className="text-lg flex items-center gap-2">
                <PenTool className="w-5 h-5 text-primary" /> Configuração Técnica
              </CardTitle>
              <CardDescription>
                Defina as regras estruturais e de engenharia do projeto.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <FormField
                control={form.control}
                name="projectType"
                render={({ field }) => (
                  <FormItem className="space-y-3">
                    <FormLabel>Tipo de Projeto</FormLabel>
                    <FormControl>
                      <RadioGroup
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                        className="flex flex-col sm:flex-row space-y-1 sm:space-y-0 sm:space-x-4"
                      >
                        <FormItem className="flex items-center space-x-3 space-y-0 border rounded-lg p-4 cursor-pointer hover:bg-muted/50 flex-1 transition-colors has-[:checked]:border-primary has-[:checked]:bg-primary/5">
                          <FormControl>
                            <RadioGroupItem value="carts" />
                          </FormControl>
                          <FormLabel className="font-medium cursor-pointer flex-1">
                            Carrinhos Industriais
                          </FormLabel>
                        </FormItem>
                        <FormItem className="flex items-center space-x-3 space-y-0 border rounded-lg p-4 cursor-pointer hover:bg-muted/50 flex-1 transition-colors has-[:checked]:border-primary has-[:checked]:bg-primary/5">
                          <FormControl>
                            <RadioGroupItem value="modular" />
                          </FormControl>
                          <FormLabel className="font-medium cursor-pointer flex-1">
                            Estrutura Modular (Lean Pipe)
                          </FormLabel>
                        </FormItem>
                      </RadioGroup>
                    </FormControl>
                  </FormItem>
                )}
              />

              {projectType === 'modular' && (
                <Alert className="bg-blue-50 text-blue-800 border-blue-200">
                  <CheckCircle2 className="h-4 w-4 text-blue-600" />
                  <AlertTitle>Regra Aplicada</AlertTitle>
                  <AlertDescription>
                    Sistema operando sob regras exclusivas para tubo "Lean Pipe" (Revestido ou
                    Inox). Materiais em alumínio desabilitados para esta categoria.
                  </AlertDescription>
                </Alert>
              )}

              <Separator />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-4">
                  <h4 className="font-medium text-sm text-muted-foreground uppercase tracking-wider">
                    Medidas Principais (mm)
                  </h4>
                  <FormField
                    control={form.control}
                    name="baseHeight"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Altura Total da Base (A)</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            {...field}
                            className={cn(
                              'transition-colors',
                              criticalAlert && 'border-destructive ring-destructive',
                            )}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  {projectType === 'carts' && (
                    <FormField
                      control={form.control}
                      name="casterDiameter"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Diâmetro do Rodízio</FormLabel>
                          <FormControl>
                            <Input
                              type="number"
                              {...field}
                              className={cn(
                                'transition-colors',
                                criticalAlert && 'border-destructive ring-destructive',
                              )}
                            />
                          </FormControl>
                          <FormDescription>
                            Rodízios industriais padrão aplicados automaticamente.
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  )}
                </div>

                {projectType === 'carts' && (
                  <div className="space-y-4 animate-fade-in">
                    <h4 className="font-medium text-sm text-muted-foreground uppercase tracking-wider">
                      Acessórios do Carrinho
                    </h4>
                    <FormField
                      control={form.control}
                      name="mechanicalTraction"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4 shadow-sm">
                          <div className="space-y-0.5">
                            <FormLabel className="text-base">Tração Mecânica</FormLabel>
                            <FormDescription>
                              Preparação para rebocador AGV/Logístico
                            </FormDescription>
                          </div>
                          <FormControl>
                            <Switch checked={field.value} onCheckedChange={field.onChange} />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                    <div className="grid grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="handle"
                        render={({ field }) => (
                          <FormItem
                            className="flex flex-col items-center justify-center rounded-lg border p-4 shadow-sm text-center gap-2 cursor-pointer hover:bg-muted/30 transition-colors"
                            onClick={() => field.onChange(!field.value)}
                          >
                            <FormLabel className="text-sm cursor-pointer mb-0">
                              Puxador Ergonômico
                            </FormLabel>
                            <FormControl>
                              <Switch checked={field.value} onCheckedChange={field.onChange} />
                            </FormControl>
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="brake"
                        render={({ field }) => (
                          <FormItem
                            className="flex flex-col items-center justify-center rounded-lg border p-4 shadow-sm text-center gap-2 cursor-pointer hover:bg-muted/30 transition-colors"
                            onClick={() => field.onChange(!field.value)}
                          >
                            <FormLabel className="text-sm cursor-pointer mb-0">
                              Freio de Estacionamento
                            </FormLabel>
                            <FormControl>
                              <Switch checked={field.value} onCheckedChange={field.onChange} />
                            </FormControl>
                          </FormItem>
                        )}
                      />
                    </div>
                  </div>
                )}
              </div>

              {/* REAL-TIME VALIDATION ENGINE ALERT */}
              {criticalAlert && (
                <Alert
                  variant="destructive"
                  className="animate-shake border-2 bg-red-50 dark:bg-red-950 mt-6"
                >
                  <AlertTriangle className="h-5 w-5" />
                  <AlertTitle className="text-lg font-bold">Medida Crítica Detectada!</AlertTitle>
                  <AlertDescription className="text-sm mt-2 font-medium">
                    A relação entre a Altura da Base ({baseHeight}mm) e o Diâmetro do Rodízio (
                    {casterDiameter}mm) viola a margem de segurança contra tombamento estabelecida
                    pela engenharia (Razão &gt; 15).
                    <br />
                    <br />
                    Ação necessária: Aumentar diâmetro do rodízio ou reduzir altura.
                  </AlertDescription>
                </Alert>
              )}
            </CardContent>
          </Card>

          {/* Section 3: Media & Docs */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <Card className="shadow-sm">
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <FileImage className="w-5 h-5 text-primary" /> Documentação do Local
                </CardTitle>
                <CardDescription>Fotos da operação, obstáculos ou referências.</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="border-2 border-dashed border-muted-foreground/25 rounded-xl p-8 flex flex-col items-center justify-center text-center hover:bg-muted/50 transition-colors cursor-pointer group relative">
                  <input
                    type="file"
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    multiple
                    onChange={simulateUpload}
                  />
                  <UploadCloud className="w-10 h-10 text-muted-foreground mb-4 group-hover:text-primary transition-colors" />
                  <p className="text-sm font-medium mb-1">Arraste fotos ou clique aqui</p>
                  <p className="text-xs text-muted-foreground">JPG, PNG ou PDF até 10MB</p>
                  {isUploading && (
                    <p className="text-xs text-primary mt-4 font-bold animate-pulse">
                      Enviando arquivos...
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>

            <Card className="shadow-sm border-2 border-primary/20 relative overflow-hidden group">
              <div className="absolute inset-0 bg-blueprint opacity-50 z-0 animate-blueprint-pan"></div>
              <CardHeader className="relative z-10 bg-background/80 backdrop-blur-sm border-b">
                <CardTitle className="text-lg flex items-center gap-2 text-primary">
                  <PenTool className="w-5 h-5" /> Croqui Principal
                </CardTitle>
                <CardDescription>Desenho base para interpretação da IA.</CardDescription>
              </CardHeader>
              <CardContent className="relative z-10 p-6 bg-background/50 backdrop-blur-sm h-[200px] flex items-center justify-center">
                <div className="border border-primary/30 bg-background/80 rounded-lg p-6 flex flex-col items-center justify-center text-center shadow-sm w-full h-full relative">
                  <input
                    type="file"
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    onChange={simulateUpload}
                  />
                  <FileImage className="w-8 h-8 text-primary mb-2" />
                  <p className="text-sm font-semibold text-primary">Upload do Desenho Técnico</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    Essencial para conceito visual
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Section 4: AI Concept (Placeholder) */}
          <Card className="shadow-md bg-gradient-to-br from-slate-900 to-primary text-white overflow-hidden relative">
            <div className="absolute top-0 right-0 p-8 opacity-10">
              <Sparkles className="w-48 h-48" />
            </div>
            <CardHeader className="relative z-10">
              <CardTitle className="text-xl flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-yellow-400" /> IA Visual Concept (Preview)
              </CardTitle>
              <CardDescription className="text-slate-300">
                Geração automática de imagem 3D conceitual baseada nos parâmetros do croqui e
                medidas inseridas.
              </CardDescription>
            </CardHeader>
            <CardContent className="relative z-10">
              <div className="bg-black/30 backdrop-blur-md rounded-xl p-8 flex flex-col items-center justify-center border border-white/10 min-h-[300px]">
                <div className="animate-pulse flex flex-col items-center">
                  <div className="w-16 h-16 border-4 border-yellow-400 border-t-transparent rounded-full animate-spin mb-4"></div>
                  <p className="font-medium text-lg">Aguardando dados completos...</p>
                  <p className="text-sm text-slate-300 mt-2 text-center max-w-sm">
                    Preencha as medidas críticas e faça o upload do croqui para ativar a
                    renderização conceitual em tempo real.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </form>
      </Form>
    </div>
  )
}
