import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Sparkles } from 'lucide-react'

export function AiConceptPreview({
  equipments,
  hasCroqui,
}: {
  equipments: any[]
  hasCroqui: boolean
}) {
  const isReady = equipments.length > 0 && hasCroqui

  return (
    <Card className="shadow-md bg-gradient-to-br from-[#122c54] to-[#1e4b8f] text-white overflow-hidden relative border-0">
      <div className="absolute top-0 right-0 p-8 opacity-10">
        <Sparkles className="w-48 h-48" />
      </div>
      <CardHeader className="relative z-10">
        <CardTitle className="text-xl flex items-center gap-2 text-white">
          <Sparkles className="w-5 h-5 text-yellow-400" /> IA Visual Concept (Preview)
        </CardTitle>
        <CardDescription className="text-slate-300">
          Geração automática de imagem 3D baseada no Croqui e parâmetros de engenharia definidos.
        </CardDescription>
      </CardHeader>
      <CardContent className="relative z-10">
        <div className="bg-black/30 backdrop-blur-md rounded-xl p-8 flex flex-col items-center justify-center border border-white/10 min-h-[300px]">
          {isReady ? (
            <div className="flex flex-col items-center animate-fade-in">
              <div className="relative w-full max-w-md aspect-video rounded-lg overflow-hidden border-2 border-yellow-400/50 shadow-[0_0_30px_rgba(250,204,21,0.2)]">
                <img
                  src="https://img.usecurling.com/p/800/450?q=industrial%20cart&dpr=2&color=blue"
                  alt="AI Render"
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-2 right-2 bg-black/60 px-2 py-1 rounded text-[10px] font-mono text-yellow-400 border border-yellow-400/30 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-yellow-400 animate-pulse"></span>
                  GERADO POR NANO BANANA PRO
                </div>
              </div>
              <p className="text-sm text-slate-300 mt-4 text-center">
                Conceito gerado com sucesso. A engenharia refinará os detalhes dimensionais no
                projeto final.
              </p>
            </div>
          ) : (
            <div className="animate-pulse flex flex-col items-center">
              <div className="w-16 h-16 border-4 border-yellow-400 border-t-transparent rounded-full animate-spin mb-4"></div>
              <p className="font-medium text-lg text-center">
                Aguardando matriz de dados e Croqui...
              </p>
              <p className="text-sm text-slate-300 mt-2 text-center max-w-sm">
                Adicione equipamentos ao conjunto e faça o upload do Croqui Principal para ativar a
                renderização conceitual em tempo real.
              </p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
