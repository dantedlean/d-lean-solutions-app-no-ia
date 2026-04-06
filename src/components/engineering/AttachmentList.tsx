import { Paperclip, FileText, Download } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useToast } from '@/hooks/use-toast'

export function AttachmentList({ files }: { files: any[] }) {
  const { toast } = useToast()

  const handleDownload = (file: any) => {
    const downloadUrl = file.url || file.path || file.link || file.fileUrl || file.preview
    if (downloadUrl) {
      window.open(downloadUrl, '_blank')
    } else {
      toast({
        title: 'Download indisponível',
        description: 'Este arquivo não possui um link direto para download no momento.',
        variant: 'destructive',
      })
    }
  }

  return (
    <div>
      <h3 className="text-xl font-bold text-slate-900 mb-4 flex items-center">
        <Paperclip className="w-6 h-6 mr-2 text-blue-600" />
        Arquivos e Anexos
      </h3>

      {files?.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {files.map((file: any, idx: number) => (
            <div
              key={idx}
              className="flex items-center justify-between p-4 border rounded-xl bg-white shadow-sm hover:shadow-md hover:border-blue-200 transition-all group"
            >
              <div className="flex items-center overflow-hidden mr-3">
                <div className="p-2 bg-blue-50 text-blue-600 rounded-lg mr-3 group-hover:bg-blue-100 transition-colors">
                  <FileText className="w-6 h-6" />
                </div>
                <div className="truncate">
                  <p
                    className="text-sm font-bold text-slate-700 truncate"
                    title={file.name || file.fileName || file.title}
                  >
                    {file.name || file.fileName || file.title || `Anexo ${idx + 1}`}
                  </p>
                  {file.size && (
                    <p className="text-xs text-slate-500 font-mono mt-0.5">
                      {(file.size / 1024 / 1024).toFixed(2)} MB
                    </p>
                  )}
                </div>
              </div>
              <Button
                size="icon"
                variant="outline"
                onClick={() => handleDownload(file)}
                className="text-blue-600 border-blue-200 hover:text-blue-800 hover:bg-blue-50 flex-shrink-0"
                title="Baixar arquivo"
              >
                <Download className="w-4 h-4" />
              </Button>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-white p-8 border border-dashed rounded-xl text-center shadow-sm">
          <Paperclip className="w-10 h-10 text-slate-300 mx-auto mb-3" />
          <p className="text-slate-500 font-medium">Nenhum arquivo anexado a esta cotação.</p>
          <p className="text-sm text-slate-400 mt-1">Os anexos do cliente aparecerão aqui.</p>
        </div>
      )}
    </div>
  )
}
