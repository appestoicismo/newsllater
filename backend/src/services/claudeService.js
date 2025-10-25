import fetch from 'node-fetch';

/**
 * Serviço para integração com API Claude da Anthropic
 */
class ClaudeService {
  constructor(apiKey) {
    this.apiKey = apiKey;
    this.baseURL = 'https://api.anthropic.com/v1/messages';
    this.model = 'claude-sonnet-4-20250514';
  }

  /**
   * Gera newsletter usando Claude API
   */
  async generateNewsletter(audienceDescription, painPoint, additionalContext, sourceMaterials) {
    const prompt = this.buildPrompt(audienceDescription, painPoint, additionalContext, sourceMaterials);

    try {
      const response = await fetch(this.baseURL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': this.apiKey,
          'anthropic-version': '2023-06-01'
        },
        body: JSON.stringify({
          model: this.model,
          max_tokens: 4000,
          temperature: 0.7,
          messages: [{
            role: 'user',
            content: prompt
          }]
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(`Claude API Error: ${errorData.error?.message || response.statusText}`);
      }

      const data = await response.json();
      return data.content[0].text;
    } catch (error) {
      console.error('Erro ao chamar Claude API:', error);
      throw new Error(`Falha ao gerar newsletter: ${error.message}`);
    }
  }

  /**
   * Constrói o prompt completo para Claude
   */
  buildPrompt(audienceDescription, painPoint, additionalContext, sourceMaterials) {
    return `Você é o Cérebro da Comunidade AppAutoHipnose, especializado em criar newsletters terapêuticas de alta qualidade.

Sua missão é gerar uma newsletter que:
1. Use copywriting profissional para manter alta retenção
2. Crie um framework/método prático baseado nos materiais fornecidos
3. Entregue valor real e resolva a dor específica mencionada
4. Seja aplicável imediatamente pelo leitor
5. Gere antecipação para a próxima edição

═══════════════════════════════════════════════════════════

PÚBLICO-ALVO:
${audienceDescription}

DOR ESPECÍFICA DESTA SEMANA:
${painPoint}

${additionalContext ? `CONTEXTO ADICIONAL:\n${additionalContext}\n\n` : ''}MATERIAIS DE CONHECIMENTO:
${sourceMaterials}

═══════════════════════════════════════════════════════════

A newsletter DEVE seguir esta estrutura em 4 blocos:

BLOCO 1: TÍTULO IMPACTANTE
- Criar um título curto, direto e emocionalmente poderoso
- Deve gerar curiosidade e promessa de alívio imediato
- Exemplos de formato:
  - "Pare de [fazer X]. Faça [Y] por 7 dias."
  - "A verdade que ninguém te conta sobre [dor]"
  - "Como [resultado desejado] em [tempo curto] sem [método tradicional]"

BLOCO 2: O QUE ESTÁ ACONTECENDO COM VOCÊ
- Explicação empática e profunda da dor
- Use linguagem que remove culpa e vergonha
- Explique o "porquê" psicológico/neurológico da dor
- A pessoa deve sentir: "você me entende perfeitamente"
- Incluir validação emocional: "Isso não é frescura, é assim que seu sistema funciona"
- Tamanho: 3-4 parágrafos densos

BLOCO 3: FRAMEWORK PRÁTICO (O MÉTODO)
- Criar um protocolo passo a passo baseado nos materiais fornecidos
- Dar um NOME ao método (ex: "Técnica dos 3 Respiros Âncora", "Protocolo de Desativação Mental")
- Dividir em passos numerados (idealmente 3-5 passos)
- Cada passo deve ter:
  - Instrução clara e específica
  - Exemplo prático de aplicação
  - Tempo estimado (se aplicável)
- Incluir quando/onde aplicar o método
- Tamanho: 4-6 parágrafos

BLOCO 4: PRÓXIMOS PASSOS E GANCHO
- Resumo do que foi entregue nesta edição
- Resultado esperado se aplicar o método
- Gancho para próxima newsletter (criar antecipação)
- Call-to-action suave: "Teste isso por 3 dias e me conte nos comentários"
- Tamanho: 2-3 parágrafos

ASSINATURA:
Alex Dantas
Criador do AppAutoHipnose

═══════════════════════════════════════════════════════════

DIRETRIZES DE TOM E ESTILO:
- Usar "você" (sempre singular, nunca plural)
- Tom: próximo, acolhedor, sem ser infantil
- Evitar jargões técnicos desnecessários
- Explicar conceitos complexos com metáforas simples
- NUNCA culpar ou invalidar o leitor
- Focar em micro-vitórias alcançáveis
- Usar storytelling quando relevante
- Parágrafos curtos (máximo 4-5 linhas)
- Incluir espaçamento visual (quebras de linha estratégicas)

REGRAS DE SEGURANÇA:
- Não prometer cura instantânea ou milagrosa
- Não fazer diagnósticos médicos
- Não incentivar abandono de tratamento profissional
- Avisar sobre segurança em práticas de hipnose (fazer sentado, não dirigir, etc)
- Não incentivar confrontos agressivos ou exposição traumática pesada

═══════════════════════════════════════════════════════════

OUTPUT ESPERADO:
Gere APENAS a newsletter completa, formatada e pronta para publicação.
Não inclua meta-comentários, explicações ou observações antes ou depois do conteúdo.
Comece direto com o TÍTULO e termine com a ASSINATURA.`;
  }

  /**
   * Extrai framework do conteúdo gerado (simplificado)
   */
  extractFramework(newsletterContent) {
    // Tenta encontrar a seção do framework (BLOCO 3)
    const lines = newsletterContent.split('\n');
    const frameworkLines = [];
    let inFramework = false;

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i].toLowerCase();

      // Detectar início do framework (procurar por palavras-chave)
      if (line.includes('técnica') || line.includes('protocolo') || line.includes('método') ||
          line.includes('passo 1') || line.includes('etapa 1')) {
        inFramework = true;
      }

      // Detectar fim do framework
      if (inFramework && (line.includes('resumindo') || line.includes('próxima') ||
          line.includes('semana que vem') || line.includes('alex dantas'))) {
        break;
      }

      if (inFramework) {
        frameworkLines.push(lines[i]);
      }
    }

    return frameworkLines.length > 0 ? frameworkLines.join('\n').trim() : 'Framework extraído do conteúdo principal';
  }
}

export default ClaudeService;
