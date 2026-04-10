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

    if (action === 'consult_cnpj') {
      const { cnpj } = payload;
      const cleanCnpj = cnpj.replace(/\D/g, '');
      
      const brasilApiRes = await fetch(`https://brasilapi.com.br/api/cnpj/v1/${cleanCnpj}`);
      let companyData = null;
      if (brasilApiRes.ok) {
        companyData = await brasilApiRes.json();
      }

      // Mocking Maxiprod check & register
      const isRegistered = Math.random() > 0.5; 
      
      return new Response(JSON.stringify({
        success: true,
        company: companyData ? {
          razao_social: companyData.razao_social,
          uf: companyData.uf,
          municipio: companyData.municipio,
        } : null,
        maxiprod: {
          status: isRegistered ? 'existing' : 'new_registered',
          message: isRegistered ? 'Empresa já cadastrada no CRM do Maxiprod.' : 'Nova empresa! Cadastrada no Maxiprod e visita registrada com sucesso.'
        }
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }

    if (action === 'create_task') {
      const { orderNumber, quoteId } = payload;
      
      const supabaseUrl = Deno.env.get('SUPABASE_URL') || '';
      const supabaseAnonKey = Deno.env.get('SUPABASE_ANON_KEY') || '';
      const authHeader = req.headers.get('Authorization');
      
      const supabase = createClient(supabaseUrl, supabaseAnonKey, {
        global: { headers: { Authorization: authHeader || '' } }
      });

      let actualQuoteId = quoteId;
      
      if (!actualQuoteId && orderNumber) {
        const { data: quote } = await supabase
          .from('quotes')
          .select('id')
          .eq('order_number', orderNumber)
          .maybeSingle();
          
        if (quote) {
          actualQuoteId = quote.id;
        }
      }

      // Circuito fechado de engenharia no Supabase (Sem ClickUp)
      if (actualQuoteId) {
        const { error: insertError } = await supabase
          .from('quote_engineering_status')
          .upsert({
            quote_id: actualQuoteId,
            status: 'engenharia',
            priority: 'normal'
          }, { onConflict: 'quote_id' });
          
        if (insertError) {
          console.error('Erro ao inserir status de engenharia:', insertError);
        } else {
          // Simulando o envio de notificação por e-mail para a engenharia
          console.log(`[Email Mock] Enviando e-mail para engenharia@dlean.com.br sobre o orçamento ${orderNumber}...`);
          console.log(`[Email Mock] Link para o briefing: https://dlean.com.br/engenharia`);
        }
      }

      return new Response(JSON.stringify({
        success: true,
        quote_id: actualQuoteId
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
