import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Wand2, Loader2, Info } from 'lucide-react'

export function AiConceptPreview({
  equipments,
  files,
  prompt,
  setPrompt,
  aiImage,
  setAiImage,
  aiImageStatus,
  setAiImageStatus,
}: any) {
  const generateImage = async () => {
    setAiImageStatus('generating')
    try {
      const res = await fetch('https://eswldmamqpvzrdhvwulc.supabase.co/functions/v1/adapta-ai', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'generate_image', prompt, equipments }),
      })
      const data = await res.json()
      if (data.imageUrl) {
        setAiImage(data.imageUrl)
        setAiImageStatus('success')
      } else {
        throw new Error('No image returned')
      }
    } catch (e) {
      setAiImageStatus('error')
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Wand2 className="w-5 h-5 text-blue-600" />
          Conceito Visual IA
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="font-medium text-slate-500">PROMPT DE GERAÇÃO (Dinâmico)</span>
          </div>
          <textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            rows={4}
            className="flex w-full rounded-md border border-slate-200 bg-slate-50 px-3 py-2 text-xs shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-slate-400 font-mono"
            placeholder="O prompt será gerado automaticamente com base nos equipamentos selecionados..."
          />
          <div className="flex items-center text-xs text-blue-600 bg-blue-50 p-2 rounded">
            <Info className="w-4 h-4 mr-2 flex-shrink-0" />
            As traduções técnicas e as variáveis de carga/dimensão são injetadas em tempo real.
          </div>
        </div>

        <div className="flex justify-end">
          <Button onClick={generateImage} disabled={!prompt || aiImageStatus === 'generating'}>
            {aiImageStatus === 'generating' ? (
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            ) : (
              <Wand2 className="w-4 h-4 mr-2" />
            )}
            Gerar Conceito Visual
          </Button>
        </div>

        {aiImage && (
          <div className="mt-6 rounded-lg overflow-hidden border">
            <img src={aiImage} alt="Conceito gerado" className="w-full object-cover" />
          </div>
        )}
      </CardContent>
    </Card>
  )
}
