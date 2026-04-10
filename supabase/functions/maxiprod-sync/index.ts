import 'jsr:@supabase/functions-js/edge-runtime.d.ts';
import { createClient } from 'jsr:@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, x-supabase-client-platform, apikey, content-type',
};

Deno.serve(async (req: Request) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const { action, payload } = await req.json();
    // Utiliza a variável de ambiente segura (secret) para conectar com a API Maxiprod
    const maxiprodToken = Deno.env.get('maxiprod');

    if (action === 'sync_quote') {
      const { quote_id, order_number, client } = payload;
      
      console.log(`Sincronizando orçamento ${order_number} com Maxiprod... Token presente: ${!!maxiprodToken}`);
      
      // Simulação de chamada à API do Maxiprod
      // Em produção, isso faria um fetch(MAXIPROD_API_URL, { headers: { Authorization: Bearer maxiprodToken } })
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      const isSuccess = true;
      
      if (isSuccess) {
        return new Response(JSON.stringify({
          success: true,
          maxiprod_id: `MP-${Math.floor(Math.random() * 100000)}`,
          status: 'integrado',
          message: 'Orçamento sincronizado com sucesso no ERP Maxiprod.'
        }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        });
      } else {
        throw new Error('Falha na API do Maxiprod.');
      }
    }
    
    if (action === 'update_quote') {
      const { quote_id, order_number } = payload;
      
      console.log(`Atualizando orçamento ${order_number} no Maxiprod...`);
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      return new Response(JSON.stringify({
        success: true,
        message: 'Orçamento atualizado com sucesso no ERP Maxiprod.'
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }

    return new Response(JSON.stringify({ error: 'Unknown action' }), {
      status: 400,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });

  } catch (error: any) {
    console.error('Edge Function Error:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  }
});
