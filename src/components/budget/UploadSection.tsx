import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { UploadCloud } from 'lucide-react'
import { useState } from 'react'

export function UploadSection({ onFiles }: { onFiles: (files: File[]) => void }) {
  const [dragActive, setDragActive] = useState(false)

  return (
    <Card>
      <CardHeader>
        <CardTitle>Arquivos de Referência</CardTitle>
      </CardHeader>
      <CardContent>
        <div
          className={`border-2 border-dashed rounded-lg p-8 flex flex-col items-center justify-center text-center transition-colors ${dragActive ? 'border-blue-500 bg-blue-50' : 'border-slate-300'}`}
          onDragOver={(e) => {
            e.preventDefault()
            setDragActive(true)
          }}
          onDragLeave={() => setDragActive(false)}
          onDrop={(e) => {
            e.preventDefault()
            setDragActive(false)
            if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
              onFiles(Array.from(e.dataTransfer.files))
            }
          }}
        >
          <UploadCloud className="w-10 h-10 text-muted-foreground mb-4" />
          <p className="text-sm font-medium">Arraste e solte arquivos aqui</p>
          <p className="text-xs text-muted-foreground mb-4">PNG, JPG, PDF até 10MB</p>
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              const input = document.createElement('input')
              input.type = 'file'
              input.multiple = true
              input.onchange = (e: any) => {
                if (e.target.files && e.target.files.length > 0) {
                  onFiles(Array.from(e.target.files))
                }
              }
              input.click()
            }}
          >
            Selecionar Arquivos
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
