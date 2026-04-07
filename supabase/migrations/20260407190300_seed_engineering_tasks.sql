DO $$
DECLARE
  mock_quote_id_1 uuid := gen_random_uuid();
  mock_quote_id_2 uuid := gen_random_uuid();
BEGIN
  -- Insert into quotes
  INSERT INTO public.quotes (id, order_number, client_name, client_cnpj, status, data)
  VALUES (
    mock_quote_id_1,
    '#ORC-2024-101',
    'Indústrias Acme LTDA',
    '12.345.678/0001-90',
    'analise',
    '{"company": {"razao_social": "Indústrias Acme LTDA", "municipio": "São Paulo"}, "equipments": [{"type": "esteira_transportadora", "name": "Esteira de Roletes Livres", "data": {"width": "800mm", "height": "900mm", "length": "5000mm", "material": "Aço Carbono Galvanizado", "description": "Esteira para transporte de caixas pesadas no setor de expedição com guias laterais.", "construction_method": "Estrutura parafusada com roletes em aço zincado"}}], "files": [{"name": "Drawing_01.pdf", "size": 2500000, "type": "application/pdf"}], "aiJustification": "", "aiComments": ""}'::jsonb
  ) ON CONFLICT (id) DO NOTHING;

  INSERT INTO public.quotes (id, order_number, client_name, client_cnpj, status, data)
  VALUES (
    mock_quote_id_2,
    '#ORC-2024-102',
    'TechMecânica S/A',
    '98.765.432/0001-10',
    'revisao_solicitada',
    '{"company": {"razao_social": "TechMecânica S/A", "municipio": "Campinas"}, "equipments": [{"type": "bancada_montagem", "name": "Bancada Ergonômica", "data": {"width": "1500mm", "height": "850-1050mm (Ajustável)", "length": "750mm", "material": "Perfil de Alumínio Estrutural", "description": "Bancada para montagem de componentes eletrônicos finos com sistema antistático.", "construction_method": "Montagem modular com conectores rápidos"}}], "files": [{"name": "Specs_V2.docx", "size": 1100000, "type": "application/vnd.openxmlformats-officedocument.wordprocessingml.document"}], "aiJustification": "", "aiComments": ""}'::jsonb
  ) ON CONFLICT (id) DO NOTHING;

  -- Insert into quote_engineering_status
  INSERT INTO public.quote_engineering_status (id, quote_id, status, priority, engineer_notes, deadline)
  VALUES (
    gen_random_uuid(),
    mock_quote_id_1,
    'analise',
    'alta',
    '',
    NOW() + INTERVAL '1 day'
  ) ON CONFLICT (quote_id) DO NOTHING;

  INSERT INTO public.quote_engineering_status (id, quote_id, status, priority, engineer_notes, deadline)
  VALUES (
    gen_random_uuid(),
    mock_quote_id_2,
    'revisao_solicitada',
    'normal',
    'Verificar layout do cliente.',
    NOW() - INTERVAL '12 hours'
  ) ON CONFLICT (quote_id) DO NOTHING;
END $$;
