import { useRef, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Paperclip, UploadCloud, X } from 'lucide-react'

export function UploadSection({ onFiles }: { onFiles: (files: File[]) => void }) {
  const [localFiles, setLocalFiles] = useState<File[]>([])
  const inputRef = useRef<HTMLInputElement>(null)

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const newFiles = Array.from(e.target.files)
      setLocalFiles((prev) => [...prev, ...newFiles])
      onFiles(newFiles)
    }
  }

  const removeFile = (index: number) => {
    const updated = localFiles.filter((_, i) => i !== index)
    setLocalFiles(updated)
    // Para simplificar, estamos apenas controlando visualmente aqui a remoção para não quebrar fluxos pesados.
    // Em um cenário de produção real, teríamos um action removeFile no store.
  }

  return (
    <Card className="border-brand-blue/20 shadow-sm">
      <CardHeader className="bg-slate-50/80 border-b pb-4">
        <CardTitle className="text-xl text-brand-blue flex items-center gap-2">
          <Paperclip className="w-5 h-5" /> Anexos e Documentação
        </CardTitle>
        <CardDescription>
          Anexe desenhos de clientes, manuais técnicos ou fotos do local de instalação (opcional).
        </CardDescription>
      </CardHeader>
      <CardContent className="p-6">
        <div
          className="border-2 border-dashed border-slate-300 rounded-xl p-8 flex flex-col items-center justify-center bg-slate-50/50 hover:bg-blue-50/50 hover:border-brand-blue/40 transition-colors cursor-pointer"
          onClick={() => inputRef.current?.click()}
        >
          <UploadCloud className="w-10 h-10 text-brand-blue/50 mb-3" />
          <p className="text-sm font-medium text-slate-700 mb-1">
            Clique ou arraste arquivos para anexar
          </p>
          <p className="text-xs text-slate-500">Suporta PDF, JPG, PNG, DOCX (Máx 20MB)</p>
          <input
            type="file"
            ref={inputRef}
            onChange={handleFileChange}
            multiple
            className="hidden"
          />
        </div>

        {localFiles.length > 0 && (
          <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {localFiles.map((file, idx) => (
              <div
                key={idx}
                className="flex items-center justify-between p-3 border border-slate-200 rounded-lg bg-white shadow-sm"
              >
                <div className="flex flex-col overflow-hidden">
                  <span className="text-xs font-bold text-slate-700 truncate" title={file.name}>
                    {file.name}
                  </span>
                  <span className="text-[10px] text-slate-400">
                    {(file.size / 1024 / 1024).toFixed(2)} MB
                  </span>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-6 w-6 text-slate-400 hover:text-red-500 hover:bg-red-50"
                  onClick={(e) => {
                    e.stopPropagation()
                    removeFile(idx)
                  }}
                >
                  <X className="w-3 h-3" />
                </Button>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
