import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { FileImage, FileText, Sparkles } from 'lucide-react'

const Dropzone = ({ title, icon: Icon, highlight = false, onUpload }: any) => (
  <div
    className={`relative flex flex-col items-center justify-center p-6 border-2 border-dashed rounded-xl transition-colors cursor-pointer group ${highlight ? 'border-[#1e4b8f] bg-[#1e4b8f]/5' : 'border-muted-foreground/25 hover:bg-muted/50'}`}
  >
    <input
      type="file"
      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
      onChange={onUpload}
    />
    <Icon
      className={`w-8 h-8 mb-3 ${highlight ? 'text-[#1e4b8f]' : 'text-muted-foreground group-hover:text-primary'}`}
    />
    <p className={`text-sm font-medium text-center ${highlight ? 'text-[#1e4b8f]' : ''}`}>
      {title}
    </p>
    <p className="text-xs text-muted-foreground mt-1 text-center">Clique ou arraste o arquivo</p>
  </div>
)

export function UploadSection({ onFiles }: { onFiles: (files: File[]) => void }) {
  const handleUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.length) {
      onFiles([e.target.files[0] as unknown as File])
    }
  }

  return (
    <Card className="shadow-sm">
      <CardHeader>
        <CardTitle className="text-lg text-[#1e4b8f]">Gestão de Documentos</CardTitle>
        <CardDescription>
          Anexe referências visuais e técnicas para a engenharia e IA.
        </CardDescription>
      </CardHeader>
      <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Dropzone title="Fotos do Local/Processo" icon={FileImage} />
        <Dropzone title="Documentos Técnicos" icon={FileText} />
        <Dropzone
          title="Croqui Principal (Base para IA)"
          icon={Sparkles}
          highlight
          onUpload={handleUpload}
        />
      </CardContent>
    </Card>
  )
}
