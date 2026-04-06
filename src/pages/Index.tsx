import React, { useState, useEffect } from 'react';

interface FormData {
  equipamento: string;
  metodo_construcao: string;
  dimensoes_externas: string;
  altura_tampo_principal: string;
  carga: string; // Nome do campo corrigido para 'carga' conforme seu formulário
  material_tampo: string;
  cor_predominante: string;
  tipo_tubo?: string;
  espessura_tubo?: string;
  diametro_rodizio?: string;
  material_nucleo_rodizio?: string;
  revestimento_rodizio?: string;
  niveladores?: boolean;
  gavetas?: boolean;
  iluminacao?: boolean;
  tomadas?: boolean;
  painel_ferr?: boolean;
}

const Index: React.FC = () => {
  const [formData, setFormData] = useState<FormData>({
    equipamento: 'Bancada',
    metodo_construcao: 'Soldado',
    dimensoes_externas: '1000x600x900',
    altura_tampo_principal: '900',
    carga: '100',
    material_tampo: 'MDF',
    cor_predominante: '9002',
    niveladores: true,
    gavetas: false,
    iluminacao: false,
    tomadas: false,
    painel_ferr: false,
  });

  const [consultorPrompt, setConsultorPrompt] = useState<string>('');
  const [imagePrompt, setImagePrompt] = useState<string>('');

  useEffect(() => {
    // Mapeamento para tradução técnica (DNA D-Lean)
    const equipmentMap: Record<string, string> = {
      'Bancada': 'Industrial Workbench',
      'Carrinho': 'Industrial Trolley',
      'Flow Rack': 'Gravity Flow Rack',
      'Estante': 'Industrial Shelving Unit',
      'Carrinho (Cart)': 'Industrial Cart',
    };

    const methodMap: Record<string, string> = {
      'Soldado': 'Heavy-duty welded steel structure',
      'Lean Pipe (Modular)': 'Lean modular pipe and joint system',
      'Híbrido': 'Hybrid structure: welded steel base with modular pipe upper frame',
    };

    const materialTampoMap: Record<string, string> = {
      'MDF': 'MDF top',
      'Inox': 'Stainless steel top',
      'Borracha': 'Rubber mat top',
    };

    // Construção do prompt para o Consultor IA (Análise Técnica)
    const consultorAiPrompt = `Você é um Engenheiro de Vendas da D-Lean. Analise se um ${formData.equipamento} de ${formData.dimensoes_externas} com 1 níveis suporta ${formData.carga}kg usando tubos de ${formData.espessura_tubo || 'padrão'}. Seja específico e técnico, não genérico.`;
    setConsultorPrompt(consultorAiPrompt);

    // Construção do prompt para a Geração de Imagem (Nano Banana) em INGLÊS
    const enEquipment = equipmentMap[formData.equipamento] || 'Industrial Equipment';
    const enMethod = methodMap[formData.metodo_construcao] || '';
    const enMaterialTampo = materialTampoMap[formData.material_tampo] || '';
    const enTipoTubo = formData.tipo_tubo ? `${formData.tipo_tubo} steel pipes` : '';

    let imagePromptParts: string[] = [
      `Studio photo of a SINGLE isolated ${enEquipment}`,
      enMethod,
      enMaterialTampo,
      enTipoTubo,
      `dimensions ${formData.dimensoes_externas}mm`,
      `RAL ${formData.cor_predominante} powder coating`,
    ];

    if (formData.diametro_rodizio) {
      imagePromptParts.push(`${formData.diametro_rodizio} inch casters`);
    }
    if (formData.niveladores) {
      imagePromptParts.push('with leveling feet');
    }
    if (formData.gavetas) {
      imagePromptParts.push('with integrated drawers');
    }
    if (formData.iluminacao) {
      imagePromptParts.push('with integrated LED lighting');
    }

    imagePromptParts.push('Professional technical catalog lighting, solid neutral grey background, isometric view, 8k resolution, photorealistic industrial render. NO factory background, NO robots, NO people.');

    const finalImagePrompt = imagePromptParts.filter(part => part !== '').join(', ');
    setImagePrompt(finalImagePrompt);

  }, [formData]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    const checked = (e.target as HTMLInputElement).checked;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  return (
    <div style={{ padding: '20px', fontFamily: 'sans-serif' }}>
      <h1>Matriz de Configuração D-Lean</h1>
      
      <div style={{ display: 'grid', gap: '15px', marginBottom: '30px' }}>
        <div>
          <label>1. Selecione o Equipamento: </label>
          <select name="equipamento" value={formData.equipamento} onChange={handleChange}>
            <option value="Bancada">Bancada</option>
            <option value="Carrinho">Carrinho</option>
            <option value="Flow Rack">Flow Rack</option>
            <option value="Estante">Estante</option>
          </select>
        </div>
        <div>
          <label>2. Método de Construção: </label>
          <select name="metodo_construcao" value={formData.metodo_construcao} onChange={handleChange}>
            <option value="Soldado">Soldado</option>
            <option value="Lean Pipe (Modular)">Lean Pipe (Modular)</option>
            <option value="Híbrido">Híbrido</option>
          </select>
        </div>
        <div>
          <label>3. Dimensões Externas: </label>
          <input type="text" name="dimensoes_externas" value={formData.dimensoes_externas} onChange={handleChange} />
        </div>
        <div>
          <label>4. Carga (kg): </label>
          <input type="text" name="carga" value={formData.carga} onChange={handleChange} />
        </div>
        <div>
          <label>5. Material do Tampo: </label>
          <select name="material_tampo" value={formData.material_tampo} onChange={handleChange}>
            <option value="MDF">MDF</option>
            <option value="Inox">Inox</option>
            <option value="Borracha">Borracha</option>
          </select>
        </div>
        <div>
          <label>6. Cor Predominante (RAL): </label>
          <input type="text" name="cor_predominante" value={formData.cor_predominante} onChange={handleChange} />
        </div>
      </div>

      <div style={{ backgroundColor: '#f0f0f0', padding: '15px', borderRadius: '8px' }}>
        <h2>--- Análise Pré-Venda (IA) ---</h2>
        <p><strong>[ANÁLISE DO ENGENHEIRO DE VENDAS D-LEAN]</strong></p>
        <p><em>System Prompt: "{consultorPrompt}"</em></p>
        <p>Equipamento: {formData.equipamento} ({formData.metodo_construcao})</p>
        <p>Dimensões: {formData.dimensoes_externas} | Carga Solicitada: {formData.carga}kg</p>
        <p><strong>Status:</strong> Análise técnica em tempo real baseada nos dados do formulário.</p>
      </div>

      <div style={{ marginTop: '30px', border: '1px solid #ccc', padding: '15px' }}>
        <h2>IA Visual Concept (Preview)</h2>
        <p>Prompt de Geração (Enviado para Nano Banana):</p>
        <textarea 
          style={{ width: '100%', height: '100px', backgroundColor: '#e9ecef' }} 
          value={imagePrompt} 
          readOnly 
        />
        <button style={{ marginTop: '10px', padding: '10px 20px', backgroundColor: '#007bff', color: 'white', border: 'none', borderRadius: '5px' }}>
          Gerar Imagem Realista
        </button>
      </div>
    </div>
  );
};

export default Index;
