import { useEffect, useRef } from 'react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Loader2, Wand2, Image as ImageIcon, Sparkles } from 'lucide-react'
import { supabase } from '@/lib/supabase/client'
import { useToast } from '@/hooks/use-toast'

interface AiConceptPreviewProps {
  equipments: any[]
  files: File[]
  prompt: string
  setPrompt: (p: string) => void
  aiImage: string | null
  setAiImage: (img: string | null) => void
  aiImageStatus: 'idle' | 'generating' | 'success' | 'error'
  setAiImageStatus: (s: 'idle' | 'generating' | 'success' | 'error') => void
}

export function AiConceptPreview({
  equipments,
  prompt,
  setPrompt,
  aiImage,
  setAiImage,
  aiImageStatus,
  setAiImageStatus,
}: AiConceptPreviewProps) {
  const { toast } = useToast()
  const prevEqCount = useRef(equipments.length)

  // Atualizar prompt de forma segura, sem causar loops infinitos
  useEffect(() => {
    if (equipments.length > 0 && equipments.length !== prevEqCount.current) {
      prevEqCount.current = equipments.length
      const types = equipments.map((e) => e.type).join(', ')
      const suggestion = `Equipamento industrial 3D realístico: ${types}`
      if (!prompt) {
        setPrompt(suggestion)
      }
    }
  }, [equipments.length, prompt, setPrompt])

  const handleGenerateImage = async () => {
    if (!prompt) return
    setAiImageStatus('generating')

    try {
      const { data, error } = await supabase.functions.invoke('adapta-ai', {
        body: { action: 'generate_image', prompt, equipments },
      })

      if (error) throw error

      if (data?.imageUrl) {
        setAiImage(data.imageUrl)
        setAiImageStatus('success')
        toast({ title: 'Sucesso', description: 'Imagem conceito gerada pela IA.' })
      } else {
        throw new Error('Nenhuma imagem retornada')
      }
    } catch (e: any) {
      console.error(e)
      setAiImageStatus('error')
      toast({
        title: 'Falha na IA',
        description: 'Não foi possível gerar a imagem no momento.',
        variant: 'destructive',
      })
    }
  }

  return (
    <Card className="border-brand-blue/20 shadow-sm">
      <CardHeader className="bg-slate-50/80 border-b pb-4">
        <CardTitle className="text-xl text-brand-blue flex items-center gap-2">
          <Wand2 className="w-5 h-5" /> Adapta AI - Geração de Conceito
        </CardTitle>
        <CardDescription>
          Crie uma referência visual do projeto utilizando a Inteligência Artificial para enriquecer
          a documentação enviada para engenharia.
        </CardDescription>
      </CardHeader>
      <CardContent className="p-6 space-y-6">
        <div className="flex gap-2">
          <Input
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="Descreva o equipamento (Ex: Bancada industrial em alumínio com prateleiras...)"
            className="h-10"
          />
          <Button
            onClick={handleGenerateImage}
            disabled={!prompt || aiImageStatus === 'generating'}
            className="bg-indigo-600 hover:bg-indigo-700 text-white h-10 px-6"
          >
            {aiImageStatus === 'generating' ? (
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            ) : (
              <Sparkles className="w-4 h-4 mr-2" />
            )}
            Gerar Conceito
          </Button>
        </div>

        {aiImageStatus === 'generating' && (
          <div className="flex flex-col items-center justify-center py-12 border-2 border-dashed border-slate-200 rounded-xl bg-slate-50">
            <Loader2 className="w-8 h-8 animate-spin text-indigo-500 mb-4" />
            <p className="text-slate-600 font-medium">
              A IA está renderizando o seu equipamento...
            </p>
            <p className="text-xs text-slate-400 mt-1">Isso pode levar alguns segundos.</p>
          </div>
        )}

        {aiImageStatus === 'success' && aiImage && (
          <div className="rounded-xl overflow-hidden border border-slate-200 shadow-sm relative group">
            <img
              src={aiImage}
              alt="Conceito Gerado pela IA"
              className="w-full h-auto object-cover max-h-[400px]"
            />
            <div className="absolute top-2 right-2 bg-black/60 text-white px-2 py-1 rounded text-[10px] font-bold uppercase backdrop-blur-sm">
              Gerado por IA
            </div>
            <Button
              variant="secondary"
              size="sm"
              className="absolute bottom-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity"
              onClick={() => {
                setAiImage(null)
                setAiImageStatus('idle')
              }}
            >
              Descartar Imagem
            </Button>
          </div>
        )}

        {aiImageStatus === 'idle' && !aiImage && (
          <div className="flex flex-col items-center justify-center py-12 border-2 border-dashed border-slate-200 rounded-xl bg-slate-50/50">
            <ImageIcon className="w-10 h-10 text-slate-300 mb-2" />
            <p className="text-sm text-slate-500 font-medium">Nenhum conceito gerado ainda.</p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
