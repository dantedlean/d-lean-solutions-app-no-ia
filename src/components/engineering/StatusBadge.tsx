import { Badge } from '@/components/ui/badge'

export function StatusBadge({ status }: { status: string | null }) {
  if (!status) return <Badge variant="secondary">Pendente</Badge>

  const s = status.toLowerCase()
  if (s === 'engenharia') {
    return (
      <Badge variant="default" className="bg-blue-600">
        Engenharia
      </Badge>
    )
  }

  if (s === 'concluído' || s === 'concluido') {
    return (
      <Badge variant="default" className="bg-green-600">
        Concluído
      </Badge>
    )
  }

  return (
    <Badge variant="secondary" className="capitalize">
      {status}
    </Badge>
  )
}
