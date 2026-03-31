import { Link } from 'react-router-dom'
import { Plus, TrendingUp, Clock, CheckCircle2, AlertCircle } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart'
import { Area, AreaChart, ResponsiveContainer, XAxis, YAxis } from 'recharts'
import { useCountUp } from '@/hooks/use-count-up'

const chartData = [
  { month: 'Jan', quotes: 45 },
  { month: 'Fev', quotes: 52 },
  { month: 'Mar', quotes: 48 },
  { month: 'Abr', quotes: 61 },
  { month: 'Mai', quotes: 59 },
  { month: 'Jun', quotes: 85 },
  { month: 'Jul', quotes: 124 },
]

const recentActivity = [
  {
    id: 'ORC-2026-001',
    client: 'Industrias Romi',
    type: 'Carrinho de Movimentação',
    value: 'R$ 14.500',
    status: 'Aprovado',
    date: 'Hoje',
  },
  {
    id: 'ORC-2026-002',
    client: 'Embraer',
    type: 'Estrutura Lean Pipe',
    value: 'R$ 8.200',
    status: 'Em Análise Eng.',
    date: 'Ontem',
  },
  {
    id: 'ORC-2026-003',
    client: 'WEG Equipamentos',
    type: 'Carrinho Kitting',
    value: 'R$ 22.100',
    status: 'Rascunho',
    date: '28 Mar',
  },
  {
    id: 'ORC-2026-004',
    client: 'Marcopolo',
    type: 'Estação de Trabalho',
    value: 'R$ 6.800',
    status: 'Enviado',
    date: '27 Mar',
  },
  {
    id: 'ORC-2026-005',
    client: 'Toyota do Brasil',
    type: 'Carrinho AGV',
    value: 'R$ 45.000',
    status: 'Aprovado',
    date: '25 Mar',
  },
]

export default function Index() {
  const quotesCount = useCountUp(124)
  const hitRateCount = useCountUp(68)
  const pendingCount = useCountUp(12)

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'Aprovado':
        return (
          <Badge variant="default" className="bg-green-600 hover:bg-green-700">
            <CheckCircle2 className="w-3 h-3 mr-1" /> Aprovado
          </Badge>
        )
      case 'Em Análise Eng.':
        return (
          <Badge variant="destructive" className="bg-red-500 hover:bg-red-600">
            <AlertCircle className="w-3 h-3 mr-1" /> Eng. Requerida
          </Badge>
        )
      case 'Enviado':
        return (
          <Badge variant="secondary" className="text-blue-700 bg-blue-100 hover:bg-blue-200">
            Enviado
          </Badge>
        )
      default:
        return (
          <Badge variant="outline" className="text-muted-foreground">
            <Clock className="w-3 h-3 mr-1" /> Rascunho
          </Badge>
        )
    }
  }

  return (
    <div className="space-y-6 animate-fade-in-up">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-primary">Dashboard de Vendas</h2>
          <p className="text-muted-foreground">
            Bem-vindo de volta! Aqui está o resumo das suas operações.
          </p>
        </div>
        <Button asChild size="lg" className="w-full sm:w-auto shadow-md">
          <Link to="/new-budget">
            <Plus className="mr-2 h-5 w-5" /> Novo Orçamento
          </Link>
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card className="shadow-sm border-t-4 border-t-primary">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Orçamentos Gerados</CardTitle>
            <FilePlus2 className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{quotesCount}</div>
            <p className="text-xs text-muted-foreground mt-1 flex items-center text-green-600">
              <TrendingUp className="h-3 w-3 mr-1" /> +20.1% em relação ao mês anterior
            </p>
          </CardContent>
        </Card>
        <Card className="shadow-sm border-t-4 border-t-green-500">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Hit Rate (Conversão)</CardTitle>
            <TrendingUp className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{hitRateCount}%</div>
            <p className="text-xs text-muted-foreground mt-1">Meta trimestral: 65%</p>
          </CardContent>
        </Card>
        <Card className="shadow-sm border-t-4 border-t-destructive">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Aguardando Engenharia</CardTitle>
            <AlertCircle className="h-4 w-4 text-destructive" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-destructive">{pendingCount}</div>
            <p className="text-xs text-muted-foreground mt-1 text-destructive/80">
              2 projetos com prazo vencendo
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-7 lg:grid-cols-8">
        <Card className="md:col-span-4 lg:col-span-5 shadow-sm">
          <CardHeader>
            <CardTitle>Evolução de Orçamentos</CardTitle>
            <CardDescription>Volume de propostas geradas nos últimos meses.</CardDescription>
          </CardHeader>
          <CardContent className="pl-0">
            <ChartContainer
              config={{
                quotes: {
                  label: 'Orçamentos',
                  color: 'hsl(var(--primary))',
                },
              }}
              className="h-[300px] w-full"
            >
              <AreaChart data={chartData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorQuotes" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="var(--color-quotes)" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="var(--color-quotes)" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <XAxis dataKey="month" tickLine={false} axisLine={false} tickMargin={8} />
                <YAxis tickLine={false} axisLine={false} tickMargin={8} />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Area
                  type="monotone"
                  dataKey="quotes"
                  stroke="var(--color-quotes)"
                  fillOpacity={1}
                  fill="url(#colorQuotes)"
                  strokeWidth={2}
                />
              </AreaChart>
            </ChartContainer>
          </CardContent>
        </Card>

        <Card className="md:col-span-3 lg:col-span-3 shadow-sm flex flex-col">
          <CardHeader>
            <CardTitle>Atividade Recente</CardTitle>
            <CardDescription>Últimos projetos trabalhados.</CardDescription>
          </CardHeader>
          <CardContent className="flex-1 overflow-auto">
            <div className="space-y-4">
              {recentActivity.slice(0, 4).map((activity) => (
                <div
                  key={activity.id}
                  className="flex items-start justify-between border-b pb-4 last:border-0 last:pb-0"
                >
                  <div className="space-y-1">
                    <p className="text-sm font-medium leading-none">{activity.client}</p>
                    <p className="text-xs text-muted-foreground">{activity.type}</p>
                    <div className="mt-1">{getStatusBadge(activity.status)}</div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium">{activity.value}</p>
                    <p className="text-xs text-muted-foreground">{activity.date}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="shadow-sm">
        <CardHeader>
          <CardTitle>Todos os Projetos Recentes</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Código</TableHead>
                <TableHead>Cliente</TableHead>
                <TableHead className="hidden md:table-cell">Tipo</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Valor Estimado</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {recentActivity.map((activity) => (
                <TableRow key={activity.id}>
                  <TableCell className="font-medium">{activity.id}</TableCell>
                  <TableCell>{activity.client}</TableCell>
                  <TableCell className="hidden md:table-cell">{activity.type}</TableCell>
                  <TableCell>{getStatusBadge(activity.status)}</TableCell>
                  <TableCell className="text-right">{activity.value}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}
