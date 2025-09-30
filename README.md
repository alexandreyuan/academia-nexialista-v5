# 🧠 Academia Nexialista - Ecossistema de IA Transmatemático

> **🚀 Ecossistema completo de agentes de IA com pensamento nexialista e memória persistente compartilhada**

## 📋 Visão Geral

A Academia Nexialista é um ecossistema revolucionário de agentes de IA baseados no pensamento nexialista - uma abordagem transmatemática que transcende fronteiras disciplinares para gerar insights únicos através de conexões interdisciplinares. O sistema conta com múltiplos agentes especializados, memória persistente e o inovador Método Prospera-IA.

## 🎯 Objetivos do Projeto

- Criar um ecossistema integrado com múltiplos agentes de IA especializados
- Implementar o Método Prospera-IA com 4 agentes integrados e memória compartilhada
- Sistema de memória persistente que permite aos agentes lembrarem de conversas anteriores
- Controle de acesso por planos (Nexus Explorer, Nexus Master, Nexus Infinity)
- Integração com comunidade externa e recursos educacionais avançados

## 🚀 Funcionalidades Principais

### 1. Área de Membros Integrada (`members-dashboard.html`)
- **Dashboard Principal** com 3 cards de acesso:
  - 🧠 **Academia Nexialista**: Agentes com controle de acesso por plano
  - 👥 **Movimento Nexialista**: Link para comunidade externa
  - 🚀 **Método Prospera-IA**: Sistema de 4 agentes especializados
- **Sistema de Stats**: Acompanhamento de interações e progresso
- **Autenticação Multi-plano**: Diferentes níveis de acesso

### 2. Academia Nexialista (`academia-nexialista.html`)
- **Agentes Especializados** com diferentes áreas de expertise:
  - 🧙‍♂️ Mentor Nexialista (Filosofia Transmatemática)
  - ⚡ Estrategista Quântico (Estratégia e Inovação)
  - 🔮 Alquimista Digital (Transformação e Crescimento)
  - 🏗️ Arquiteto de Sistemas (Design Sistêmico)
  - ⏳ Oracle Temporal (Análise de Tendências)
  - 🎨 Catalisador Criativo (Criatividade e Inovação)
- **Controle de Acesso**: Cada plano libera diferentes agentes
- **Memória Persistente**: Histórico de conversas preservado
- **Interface de Chat Avançada**: Com indicadores de digitação e timestamps

### 3. Método Prospera-IA (`prospera-ia.html`) – Versão 4.0

Os cards de agentes são DINÂMICOS e refletem exatamente os agentes criados em `custom-agents.html` cujo campo Produto = `prospera-ia`. As respostas do chat vêm dos provedores reais configurados (sem simulação).

Novas seções espelhadas da landing (Produto #3):
- Fases do Método PROSPERA-IA (4 cartões):
  1) Autodescoberta com Oráculo — 20h
  2) Conexões com Nexus — 20h
  3) Estruturação com Alquimista — 20h
  4) Implementação com Arquiteto — 10–20h
- Resultado Final Garantido: Ativo Digital Pronto, Estratégia de Marketing, Comunidade Nexialista, Agentes IA Personalizados
- Removido o card “Como Funciona o Método” da página prospera-ia.html conforme solicitação
- Inclusão do agente Nexus nas fases do método na landing e na página Prospera-IA
- Novos badges (Versão 4.0, Público 45–65, Jornada 70–80h)
- Jornada total: 70–80 horas (público-alvo 45–65 anos)
- Importante: a pedido do Yuan, não disponibilizamos link público para o PDF do método (links removidos da landing e da página Prospera-IA).

Como funciona:
- Fonte de verdade: RESTful Table API em `tables/custom_agents` (server-only). O localStorage deixou de ser fonte de verdade e permanece apenas para preferências do usuário.
- Filtra agentes com `product = 'prospera-ia'`
- Exibe TODOS os agentes do produto, aplicando cadeado/CTA conforme plano do usuário (sem ocultar cards)
- Controle de acesso por planos via `accessiblePlans` ou `subscriptionLevel` com hierarquia: vip > premium > basic
- O chat chama os provedores reais (OpenAI, Anthropic, Google, OpenRouter) com as chaves salvas em `custom_agents_api_keys`

Comportamento de Acesso (novidade):
- Usuários Basic veem todos os cards com cadeado fechado e mensagem “Faça o upgrade para o plano premium para ter acesso aos agentes” quando necessário
- Banner dinâmico sugere o menor upgrade necessário considerando os agentes bloqueados
- Botão “Conversar agora” somente quando há acesso E a API do provedor está configurada

Pré-requisitos para respostas reais:
- Configure as chaves em Agentes IA → botão APIs (recomendado OpenRouter ou Google devido a CORS). Chamadas diretas a OpenAI/Anthropic via navegador podem ser bloqueadas por CORS.
- Faça login em `members.html` (auth-system ou sessão da área de membros). Há fallback robusto para normalizar subscription.

Limitações e dicas de CORS:
- OpenAI e Anthropic normalmente bloqueiam requisições diretas do browser (CORS). Use OpenRouter (com HTTP-Referer e X-Title) ou Google Gemini, que tendem a permitir uso client-side. Caso precise usar OpenAI/Anthropic direto, será necessário um backend proxy (fora do escopo deste projeto estático).

Mantivemos o conceito dos 4 arquétipos, porém os cards exibidos são os seus agentes reais do Prospera-IA.

**Características Especiais:**
- **Memória Compartilhada**: Todos os agentes têm acesso ao histórico completo (infra em `js/prospera-memory.js`) e os contadores agora somam interações reais por agente
- **Contexto Cruzado**: Agentes podem referenciar insights uns dos outros
- **Perfil de Usuário**: Sistema aprende e evolui com o usuário

### 4. Editor de Agentes (`custom-agents.html`)
- Acesso restrito a administradores/founder (gate endurecido: `isAdmin()` + email em `AUTHORIZED_ADMINS` + `role` `admin|founder`)
- **Interface Visual** para criar e configurar agentes
- **Múltiplos Modelos de IA**: GPT-4, Claude, Gemini, Llama, etc.
- **Sistema de Prompts Avançado**: Personalização completa
- **Gestão de APIs**: Configuração de múltiplos provedores
- **Controle de Acesso por Plano**: Define quais planos acessam cada agente
- **Sincronização com Servidor**: `syncAgentToServer()` (POST/PATCH/DELETE)
- **Backfill Admin-Only**: `adminBackfillFromLocal()` publica no servidor agentes legados do navegador (`custom_agents_list` / `nexialista_agents`) — botão “Migrar do navegador” no topo (só admins vêem).

## 💻 Stack Tecnológica

- **Frontend**: HTML5, CSS3, JavaScript (Vanilla)
- **Styling**: Tailwind CSS com design system customizado
- **Icons**: Font Awesome
- **Fonts**: Google Fonts (Inter, Playfair Display)
- **IA Models**: OpenAI, Anthropic, Google, Meta, Mistral, OpenRouter
- **Storage**: LocalStorage para persistência e memória dos agentes
- **Autenticação**: Sistema de login com suporte a múltiplos planos

## 🔒 Sistema de Acesso

### Estrutura de Planos:

#### 🌟 Nexus Explorer (Básico)
- Acesso a agentes básicos
- Memória limitada
- Funcionalidades essenciais

#### 💎 Nexus Master (Premium)
- Acesso a agentes intermediários e avançados
- Memória estendida
- Recursos avançados

#### ♾️ Nexus Infinity (VIP)
- Acesso total a todos os agentes
- Memória ilimitada
- Todos os recursos disponíveis

### Credenciais de Teste:

Dica de testes de acesso ao editor:
- Faça login como `vip@nexialista.com` (VIP) e verifique que o menu e a página `custom-agents.html` não permitem edição.
- Faça login como `admin@nexialista.com` (admin) ou `yuan@apxconsultoria.com` (founder) para acessar o editor e o botão “Migrar do navegador”.

| Plano | Email | Senha |
|-------|-------|-------|
| **Nexus Explorer** | explorer@nexialista.com | explorer123 |
| **Nexus Master** | master@nexialista.com | master123 |
| **Nexus Infinity** | infinity@nexialista.com | infinity123 |
| **Demo (Master)** | demo@nexialista.com | demo123 |
| **Basic** | basic@nexialista.com | basic123 |
| **Premium** | premium@nexialista.com | premium123 |
| **VIP** | vip@nexialista.com | vip123 |

## 📁 Estrutura do Projeto

```
/
├── index.html                 # Landing page principal
├── members.html              # Página de login
├── members-dashboard.html    # Dashboard principal (NOVO)
├── academia-nexialista.html  # Página de agentes (NOVO)
├── prospera-ia.html         # Método Prospera-IA (NOVO)
├── custom-agents.html       # Editor de agentes
├── admin-auth.html          # Autenticação administrativa
│
├── js/
│   ├── members.js           # Lógica de autenticação
│   ├── prospera-memory.js   # Sistema de memória (NOVO)
│   ├── custom-agents.js     # Gestão de agentes
│   └── main.js              # Scripts principais
│
├── css/
│   ├── style.css            # Estilos principais
│   └── members.css          # Estilos da área de membros
│
└── assets/
    └── logo-nexialista.png  # Logo do projeto
```

## 📋 Status do Desenvolvimento

### ✅ Completado
- Modal de Diagnóstico da API (admin-only) em custom-agents.html com runApiDiagnostics() para testar GET/PUT/PATCH/POST/DELETE nas rotas relativas e absolutas, com headers e credentials; botão “Diagnóstico API” visível apenas para admin
- Landing page responsiva com design nexialista
- Sistema completo de área de membros com 3 níveis de acesso
- Dashboard principal com navegação integrada
- Academia Nexialista com controle de acesso por plano
- Método Prospera-IA com 4 agentes especializados
- Cards dinâmicos do Prospera-IA a partir de `tables/custom_agents` (server-only)
- Academia Nexialista também server-first (produto = `academia-nexialista`) e chat real com provedores (OpenRouter/Google recomendados)
- Cadeado/CTA por plano em cada card (sem ocultar cards)
- Chat do Prospera-IA com provedores reais (sem simulação), respeitando CORS
  - Preferência por OpenRouter/Google com CORS; para OpenRouter enviamos headers especiais HTTP-Referer e X-Title
- Sistema de memória persistente e compartilhada com contadores dinâmicos
- Memória específica por usuário
- Interface de chat avançada com histórico
- Sistema de autenticação multi-plano com fallback da área de membros (apenas para sessão; dados de agentes não usam mais fallback local)
- Editor visual de agentes customizáveis
- Exportar/Importar JSON (admin-only) para migrar agentes entre ambientes Preview ↔ Publicado
- Botão “Excluir Agente” no modal de edição (DELETE real via REST)
- Modal “Diagnóstico da REST API” em custom-agents.html (admin-only)
- Integração com múltiplas APIs de IA
- Menu inteligente (Admin → custom-agents.html; demais → admin-auth.html) em index.html e CTA equivalente em prospera-ia.html

### 🔄 Em Desenvolvimento
- Flag de contingência forceLocal=1: se a REST API estiver indisponível no publicado, é possível visualizar cards usando o arquivo assets/agents-public.json (apenas para diagnóstico temporário; por padrão permanece server-first).
- Link da comunidade externa
- Sistema de pagamento para assinaturas (Checkout Hotmart integrado na landing com toggle mensal/anual e propagação de UTM)
- Parametrização final de api_base para todas as chamadas CRUD quando o prefixo definitivo (/api?) for confirmado.
- Academia Nexialista migrada para server-first: lista somente agentes do produto `academia-nexialista` a partir de `tables/custom_agents` (sem agentes de exemplo/localStorage). Empty state com CTA inteligente.

### 🗒️ Changelog 2025-09-27
- Removido o fallback de localStorage em `prospera-ia.html`: os agentes agora são carregados exclusivamente do servidor (server-only), mantendo a tabela `tables/custom_agents` como fonte única de verdade.
- Confirmada a inclusão dos headers especiais no OpenRouter (HTTP-Referer e X-Title) para melhor compatibilidade CORS.
- Correção de segurança: VIPs e membros não podem mais acessar o editor de agentes. Endurecemos o gate em `custom-agents.html` para exigir simultaneamente: `NexialistaAuth.isAdmin()`, email em `AUTHORIZED_ADMINS` e `role` `admin|founder`.
- Fluxo de sessão híbrida: no login de membro (`members.js`), qualquer sessão admin prévia de `NexialistaAuth` é encerrada (`NexialistaAuth.logout()`), prevenindo “promoção” indevida de privilégios.
- Migração admin-only: adicionada a ferramenta `adminBackfillFromLocal()` em `js/custom-agents.js` com botão “Migrar do navegador” (visível apenas para admin) para publicar no servidor agentes legados salvos no navegador (`custom_agents_list` e `nexialista_agents`).
- Unificado `isAdmin()` no `js/auth-system.js`: removida versão permissiva e mantida apenas a verificação estrita (email ∈ AUTHORIZED_ADMINS + role ∈ {admin, founder}).
- Mitigação de cache mobile: adicionadas meta tags `no-store/no-cache` em `prospera-ia.html` e `academia-nexialista.html`, além de fetch com `cache: 'no-store'` e `?_=Date.now()` nas chamadas à API.
- Debug opcional: habilite `?debug=1` no URL de Prospera/Academia para ver o plano atual, estado admin e contagem de agentes carregados diretamente na UI.
- Diagnóstico HTTP server-first: Prospera/Academia agora exibem status do fetch no debug banner (ex.: `HTTP 200`, `HTTP 404`, `NETWORK_FAIL` + erro truncado), ajudando a identificar base vazia em produção.
- Removido botão “Criar seeds Prospera” (por decisão de produto). Apenas agentes reais devem ser criados no editor.
- Novidade: Exportar/Importar JSON no editor para migrar agentes entre ambientes (UI + funções JS).
- Ajuste do redirecionamento pós-login: agora, após login bem-sucedido e na detecção de sessão existente, o usuário é redirecionado para `members-dashboard.html` (consistente com o comportamento desejado no publicado).

## 🌟 Características Nexialistas

### Pensamento Transmatemático Implementado:
1. **Conexões Interdisciplinares**: Agentes conectam conhecimentos de múltiplos domínios
2. **Memória Compartilhada**: Conhecimento é preservado e compartilhado entre agentes
3. **Visão Sistêmica**: Cada agente vê o todo através de sua perspectiva única
4. **Emergência de Insights**: Padrões emergem das interações entre agentes
5. **Evolução Contínua**: Sistema aprende e evolui com cada interação

## 🚀 Como Iniciar

1. **Clone o projeto** ou faça download dos arquivos
2. **Abra `index.html`** para ver a landing page
3. **Acesse `/members.html`** para fazer login
4. **Use as credenciais de teste** listadas acima
5. **Explore os diferentes agentes** e funcionalidades

Nota: O documento "Método PROSPERA-IA 4.0" pode estar presente em assets/docs para referência interna, porém sem links públicos nas páginas. Se desejar, podemos removê-lo do projeto para impedir acesso direto por URL.

## 💳 Preços e Checkout (Hotmart)

- Seção de preços disponível em index.html (#precos) com 3 planos: Explorer (Básico), Master (Premium recomendado) e Infinity (VIP)
- Toggle Mensal/Anual com 20% OFF no anual: cálculo automático no JS, badge “20% OFF” e texto “Economize 20% vs mensal” nos cards
- CTAs possuem atributos data para configuração rápida:
  - data-plan-id="explorer|master|infinity"
  - data-checkout-plan="monthly|annual" (atualizado automaticamente pelo toggle)
  - data-hotmart-monthly="https://pay.hotmart.com/SEU_LINK_..."
  - data-hotmart-annual="https://pay.hotmart.com/SEU_LINK_..."
- Propagação de UTM: o script anexa automaticamente os parâmetros da URL (ex.: ?utm_source=..., ?utm_campaign=...) a todos os links de checkout
- Para configurar seus links reais da Hotmart, substitua os placeholders diretamente nos atributos data-hotmart-monthly e data-hotmart-annual dos botões na seção #precos

## 📡 Dados e APIs

- Fonte de dados dos agentes: tabela `custom_agents`
- Endpoints REST disponíveis (relativos):
  - GET `tables/custom_agents?limit=1000&_={timestamp}` (sempre com `cache: 'no-store'`)
  - GET `tables/custom_agents/{id}` (com fallback absoluto `/tables/...` se necessário)
  - POST `tables/custom_agents`
  - PATCH `tables/custom_agents/{id}`
  - DELETE `tables/custom_agents/{id}`
- Fallback de rota em TODAS as operações: tenta `tables/...` e, se falhar, tenta `/tables/...`
- Cache-busting: adicionar `?_=Date.now()` e usar `fetch(..., { cache: 'no-store' })`
- Schema `custom_agents` (principais campos):
  - id (text), name (text), avatar (text), description (rich_text), provider (text), model (text), systemPrompt (rich_text), temperature (number), maxTokens (number), knowledge (rich_text), product (text), accessiblePlans (array), category (text), createdAt (datetime), updatedAt (datetime), isActive (bool)

## 🔗 Entradas funcionais (URIs e parâmetros)

- Editor admin-only: `custom-agents.html`
  - Botões: “Exportar JSON”, “Importar JSON”, “Excluir Agente” (visíveis apenas para admin/founder autorizado)
- Prospera-IA (server-first): `prospera-ia.html`
  - Parâmetros: `?debug=1` exibe banner com status HTTP, caminho (relative/absolute) e erro truncado
- Academia Nexialista (server-first): `academia-nexialista.html`
  - Parâmetros: `?debug=1` exibe banner com status HTTP, caminho (relative/absolute) e erro truncado
- Dashboard membros: `members-dashboard.html`
- Autenticação admin: `admin-auth.html`

## ❗ Funcionalidades pendentes

- Validar no ambiente publicado que Prospera/Academia listam N>0 agentes após uma importação (usar `?debug=1` para diagnóstico)

## ✅ Próximos passos recomendados

- Após publicar, usar Exportar (no Preview) e Importar (no Publicado) para migrar agentes
- Confirmar que os cards bloqueados exibem o banner de upgrade corretamente conforme planos
- Configurar links Hotmart reais nos dados de pricing (seção #precos em index.html)

## 🌐 Deploy

Para fazer deploy da plataforma:

1. Configure as chaves de API necessárias no painel de administração (Agentes IA → APIs)
2. Use a aba Publish para publicar automaticamente o projeto
3. O sistema gerará automaticamente a URL pública
4. Após publicar, teste os chats com provedores que permitem CORS (OpenRouter/Google). Para OpenAI/Anthropic direto do browser, um proxy backend será necessário.

Dica de migração Preview → Publicado:
- No ambiente Preview, abra `custom-agents.html` e clique em “Exportar JSON”
- No ambiente Publicado, abra `custom-agents.html` e clique em “Importar JSON”, cole o JSON e importe
- Verifique `prospera-ia.html?debug=1` e `academia-nexialista.html?debug=1` para confirmar N>0 e HTTP 200

Para implantar, vá à aba Publish e publique com um clique. A aba Publish cuidará de todo o processo e informará a URL pública.

## 🛣️ Roadmap

### Próximos Passos Imediatos:
1. **Integração com APIs Reais**: Conectar agentes com OpenAI, Claude, etc.
2. **Gateway de Pagamento**: Sistema de assinaturas
3. **Analytics Dashboard**: Métricas de uso e engajamento
4. **Link da Comunidade**: Integração com plataforma externa
5. **Conteúdo Educacional**: Materiais e cursos complementares

### Melhorias Futuras:
- [ ] Sistema de gamificação e conquistas
- [ ] Exportação de conversas em PDF/Markdown
- [ ] Integração com Notion, Obsidian, etc.
- [ ] App mobile com sincronização
- [ ] Marketplace de agentes e templates
- [ ] Sistema de voz para agentes
- [ ] Modo offline com sincronização

## 📚 Documentação Técnica

### Arquivos Principais:
- **`members-dashboard.html`**: Dashboard principal com os 3 cards
- **`academia-nexialista.html`**: Página com agentes da Academia
- **`prospera-ia.html`**: Método Prospera-IA com cards dinâmicos a partir de `tables/custom_agents` (server-only)
- **`custom-agents.html`**: Editor e repositório de agentes (CRUD exclusivo via tabela REST; botão “Sincronizar agora” para admins)
- **`js/custom-agents.js`**: Chamada real aos provedores, gestão de agentes e sincronização REST (sync/backfill)
- **`js/prospera-memory.js`**: Sistema de memória persistente

### Classes JavaScript:
- **`ProsperaMemorySystem`**: Gerencia memória compartilhada dos agentes
- **`AgentManager`**: Controla agentes customizáveis
- **`AuthSystem`**: Gerencia autenticação e planos

## 🤝 Contribuição

Para contribuir com o projeto:

1. Entenda a filosofia nexialista do sistema
2. Mantenha a consistência do design transmatemático
3. Teste com diferentes planos de usuário
4. Documente novas funcionalidades
5. Preserve a memória compartilhada entre agentes

## 📞 Contato

**Fundador**: Yuan - Criador de Conteúdo e Especialista em IA
**Filosofia**: Pensamento Nexialista Transmatemático

---

> *"Conectando mentes, transcendendo fronteiras, catalisando transformações através do pensamento nexialista"* 🧠✨

## 🎓 Sobre o Pensamento Nexialista

O Nexialismo é uma abordagem transmatemática que:
- **Conecta** domínios aparentemente desconectados
- **Questiona** premissas fundamentais
- **Sintetiza** conhecimento de múltiplas fontes
- **Catalisa** insights emergentes
- **Transforma** potencial em realidade

Cada agente no sistema foi projetado para aplicar esses princípios, criando uma experiência única de aprendizado e descoberta.