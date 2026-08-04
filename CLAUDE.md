# Gruppu — regras do projeto

Site institucional da Gruppu, publicado em `gruppu.com.br` via Vercel (projeto `gruppu-workshop`), a partir deste repositório (`randrison/Gruppu-workshop`, branch principal `main`).

## Regras obrigatórias

1. **Manter a identidade visual da Gruppu.** Cores, tipografia, logotipo e tom visual do site atual são a referência — não trocar por padrões genéricos.
2. **Sempre verificar desktop e mobile** antes de considerar qualquer página pronta. O site é acessado majoritariamente por mobile (tráfego de anúncios/redes sociais), então mobile não é opcional.
3. **Criar uma branch nova para cada alteração.** Nunca commitar direto em `main`. Nome sugerido: `feature/nome-da-alteracao`.
4. **Rodar o build (ou abrir localmente) e conferir visualmente antes de apresentar o resultado.** Hoje o site é HTML estático puro (sem framework/build step) — validar abrindo o arquivo/preview e checando que renderiza sem erros no console.
5. **Nunca publicar diretamente sem aprovação.** Alterações vão sempre via branch + Pull Request. O merge para `main` (que dispara o deploy de produção na Vercel) só acontece com aprovação explícita do usuário.
6. **Preservar o que já existe em produção:**
   - Domínio `gruppu.com.br` e configuração de DNS/Vercel
   - Formulário de captação de lead (`#leadForm`) e seu fluxo de redirecionamento para o grupo do WhatsApp
   - Facebook Pixel instalado (`fbq`, ID `1002113512276303`) — não remover nem duplicar
   - Qualquer SEO já configurado (títulos, meta tags) — hoje o site tem pouquíssima metadata de SEO; ao mexer nisso, é para **melhorar**, nunca remover o que existe

## Estrutura atual

- `index.html` — página única, sem framework, contém a landing page de captação de leads atual
- Novas páginas (ex: `/blog`, páginas institucionais) exigem decidir estrutura (HTML estático simples vs. introduzir um framework) — não assumir uma abordagem sem alinhar antes
