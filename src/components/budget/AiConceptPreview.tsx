import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { useEffect } from 'react'
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
  useEffect(() => {
    if (!equipments || equipments.length === 0) return

    const eq = equipments[0]
    const data = eq.data || {}

    let eqTypeEn = 'Industrial equipment'
    const typeLower = (eq.type || '').toLowerCase()
    if (typeLower.includes('bancada')) eqTypeEn = 'Industrial Workbench'
    else if (typeLower.includes('carrinho')) eqTypeEn = 'Industrial Trolley/Cart'
    else if (typeLower.includes('flow rack')) eqTypeEn = 'Gravity Flow Rack'
    else if (eq.type) eqTypeEn = eq.type

    let methodEn = 'steel structure'
    const methodLower = (eq.method || data.method || '').toLowerCase()
    if (methodLower === 'soldado') methodEn = 'Heavy-duty welded steel structure'
    else if (methodLower === 'lean' || methodLower === 'modular')
      methodEn = 'Lean modular pipe and joint system'
    else if (methodLower === 'hibrido' || methodLower === 'híbrido')
      methodEn = 'Hybrid structure: welded steel base with modular pipe upper frame'

    const dimensoes = data.dimensoes_externas || data.dimensoes || eq.dimensoes || 'Standard'

    let materialTopEn = 'Standard'
    const tampoLower = (data.tampo || '').toLowerCase()
    if (tampoLower.includes('mdf')) materialTopEn = 'MDF'
    else if (tampoLower.includes('borracha')) materialTopEn = 'Rubber mat'
    else if (tampoLower.includes('inox')) materialTopEn = 'Stainless steel'
    else if (data.tampo) materialTopEn = data.tampo

    const cor = data.corRal || data.corTubo || 'Blue'
    const carga =
      data.carga_tampo ||
      data.cargaTotal ||
      data.carga ||
      data.peso ||
      eq.cargaTotal ||
      eq.carga ||
      '100'

    let generatedPrompt = `Studio photo of a SINGLE isolated ${eqTypeEn}, ${methodEn}, dimensions ${dimensoes}mm, ${materialTopEn} top, RAL ${cor} powder coating (Load capacity: ${carga}kg). Professional technical catalog lighting, solid neutral grey background, isometric view, 8k resolution, photorealistic industrial render. NO factory background, NO robots, NO people.`

    generatedPrompt = generatedPrompt.replace(/aluminum/gi, 'steel').replace(/alumínio/gi, 'steel')

    setPrompt(generatedPrompt)
  }, [JSON.stringify(equipments), setPrompt])

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
