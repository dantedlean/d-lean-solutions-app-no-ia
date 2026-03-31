import { BookOpen, Layers, Settings2 } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

export default function TechnicalCatalog() {
  return (
    <div className="space-y-6 animate-fade-in-up">
      <div>
        <h2 className="text-3xl font-bold tracking-tight text-primary">Catálogo Técnico</h2>
        <p className="text-muted-foreground">
          Consulte especificações, limites de carga e regras estruturais.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card className="hover:border-primary transition-colors cursor-pointer group">
          <CardHeader>
            <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
              <Settings2 className="w-6 h-6 text-primary" />
            </div>
            <CardTitle>Rodízios Industriais</CardTitle>
            <CardDescription>
              Especificações técnicas e capacidades de carga estática/dinâmica.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Clique para acessar o manual D-Lean completo.
            </p>
          </CardContent>
        </Card>

        <Card className="hover:border-primary transition-colors cursor-pointer group">
          <CardHeader>
            <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
              <Layers className="w-6 h-6 text-primary" />
            </div>
            <CardTitle>Sistemas Lean Pipe</CardTitle>
            <CardDescription>
              Tabelas de deflexão e juntas recomendadas para cada aplicação.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Clique para acessar tabelas de engenharia.
            </p>
          </CardContent>
        </Card>

        <Card className="hover:border-primary transition-colors cursor-pointer group">
          <CardHeader>
            <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
              <BookOpen className="w-6 h-6 text-primary" />
            </div>
            <CardTitle>Manuais de Montagem</CardTitle>
            <CardDescription>Guias visuais e regras de projeto estrutural seguro.</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">Acesse a biblioteca de vídeos e PDFs.</p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
