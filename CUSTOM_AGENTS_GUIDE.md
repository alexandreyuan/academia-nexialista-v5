# 🤖 Guia Completo - Plataforma de Agentes IA Customizáveis

## 🎯 Visão Geral

A **Plataforma de Agentes IA Customizáveis** da Academia Nexialista é um sistema completo que permite criar, configurar e usar agentes de IA personalizados, similar aos GPTs do ChatGPT, mas com **múltiplos provedores** de IA.

### ✨ **Características Principais**
- **🔗 Múltiplos Provedores**: OpenAI, Anthropic, Google, OpenRouter
- **🎨 Personalização Total**: System prompts, personalidade, conhecimento
- **💬 Chat Real**: Comunicação direta com APIs dos provedores
- **📚 Templates Prontos**: 6 templates predefinidos para começar rapidamente
- **🔐 Segurança**: Gerenciamento seguro de chaves API no localStorage
- **📱 Responsivo**: Interface mobile-first moderna

---

## 🚀 Como Usar

### 1. **Acesso à Plataforma**
```
URL: custom-agents.html
Navegação: Página Inicial → Agentes IA
```

### 2. **Primeira Configuração**

#### 📡 **Configurar APIs**
1. Clique em **"APIs"** no menu superior
2. Insira suas chaves de API dos provedores desejados:
   - **OpenAI**: `sk-...` (GPT-4, GPT-3.5)
   - **Anthropic**: `sk-ant-...` (Claude 3.5, Claude 3)
   - **Google**: `AIza...` (Gemini 1.5 Pro, Gemini Flash)
   - **OpenRouter**: `sk-or-...` (Múltiplos modelos)
3. Clique em **"Testar Conexões"** para validar
4. **Salve as configurações**

#### 🤖 **Criar Primeiro Agente**
1. Clique em **"Novo Agente"**
2. **Escolha um template** ou crie do zero
3. **Configure o agente**:
   - Nome e descrição
   - Avatar/ícone
   - Provedor e modelo de IA
   - System prompt (personalidade)
   - Configurações avançadas
4. **Teste o agente** antes de salvar
5. **Salve o agente**

---

## 🎨 Templates Predefinidos

### 📊 **Especialista em Marketing**
- **Provedor**: OpenAI (GPT-4o)
- **Personalidade**: Entusiasta, criativo, focado em resultados
- **Especialidades**: Marketing digital, growth, conteúdo
- **Temperatura**: 0.7 (balanceado)

### 💻 **Mentor de Programação**
- **Provedor**: Anthropic (Claude 3.5 Sonnet)
- **Personalidade**: Didático, paciente, experiente
- **Especialidades**: Múltiplas linguagens, arquitetura, boas práticas
- **Temperatura**: 0.6 (mais preciso)

### ✍️ **Escritor Criativo**
- **Provedor**: Google (Gemini 1.5 Pro)
- **Personalidade**: Imaginativo, envolvente, literário
- **Especialidades**: Storytelling, narrativas, conteúdo criativo
- **Temperatura**: 0.9 (mais criativo)

### 📈 **Analista de Negócios**
- **Provedor**: OpenAI (GPT-4 Turbo)
- **Personalidade**: Analítico, orientado por dados, estratégico
- **Especialidades**: Estratégia empresarial, análise de mercado
- **Temperatura**: 0.5 (mais preciso)

### 🏥 **Consultor de Saúde**
- **Provedor**: Anthropic (Claude 3 Sonnet)
- **Personalidade**: Cuidadoso, empático, educativo
- **Especialidades**: Bem-estar, prevenção, estilo de vida
- **Temperatura**: 0.4 (muito preciso)
- **Nota**: Sempre enfatiza que não substitui consulta médica

### 🗣️ **Professor de Idiomas**
- **Provedor**: OpenRouter (GPT-4o)
- **Personalidade**: Paciente, encorajador, didático
- **Especialidades**: Ensino de línguas, gramática, conversação
- **Temperatura**: 0.6 (balanceado)

---

## ⚙️ Configurações Avançadas

### 🌡️ **Temperatura (0.0 - 1.0)**
- **0.0 - 0.3**: Muito preciso e determinístico
- **0.4 - 0.6**: Balanceado, boas para tarefas analíticas
- **0.7 - 0.8**: Criativo mas controlado
- **0.9 - 1.0**: Muito criativo e variado

### 📏 **Max Tokens**
- **100-500**: Respostas curtas e concisas
- **500-1000**: Respostas médias (padrão)
- **1000-2000**: Respostas longas e detalhadas
- **2000+**: Respostas muito extensas (cuidado com custos)

### 📚 **Base de Conhecimento**
- Campo opcional para informações específicas
- Contexto adicional que o agente deve conhecer
- Exemplos: dados da empresa, procedimentos específicos, regulamentações

---

## 🔌 Provedores de IA Suportados

### 🟢 **OpenAI**
```
Endpoint: https://api.openai.com/v1/chat/completions
Modelos: GPT-4o, GPT-4o Mini, GPT-4 Turbo, GPT-4, GPT-3.5 Turbo
Chave: sk-...
```

### 🟠 **Anthropic**
```
Endpoint: https://api.anthropic.com/v1/messages
Modelos: Claude 3.5 Sonnet, Claude 3 Opus, Claude 3 Sonnet, Claude 3 Haiku
Chave: sk-ant-...
```

### 🔵 **Google**
```
Endpoint: https://generativelanguage.googleapis.com/v1beta/models/{model}:generateContent
Modelos: Gemini 1.5 Pro, Gemini 1.5 Flash, Gemini Pro
Chave: AIza...
```

### 🟣 **OpenRouter**
```
Endpoint: https://openrouter.ai/api/v1/chat/completions
Modelos: GPT-4o, Claude 3.5, Gemini 1.5, Llama 3.1, Mistral Large
Chave: sk-or-...
```

---

## 💬 Sistema de Chat

### 🎯 **Funcionalidades**
- **Chat em tempo real** com APIs reais
- **Histórico de conversa** mantido durante a sessão
- **Contexto preservado** entre mensagens
- **Indicador de digitação** durante processamento
- **Tratamento de erros** robusto

### ⌨️ **Controles**
- **Enter**: Enviar mensagem
- **Shift + Enter**: Nova linha
- **Botão enviar**: Alternativa ao Enter

### 🔄 **Fluxo de Processamento**
1. Usuário digita mensagem
2. Sistema constrói contexto completo:
   - System prompt do agente
   - Base de conhecimento (se configurada)
   - Histórico recente da conversa
   - Nova mensagem do usuário
3. Chama API do provedor configurado
4. Processa resposta e exibe no chat
5. Atualiza histórico da conversa

---

## 🛡️ Segurança e Privacidade

### 🔐 **Chaves de API**
- Armazenadas localmente no navegador (localStorage)
- **Não são enviadas para servidores da Academia Nexialista**
- Comunicação direta com provedores de IA
- Usuário tem controle total das chaves

### 💾 **Dados dos Agentes**
- Configurações salvas localmente (localStorage)
- **Não há sincronização em nuvem** (por enquanto)
- Dados permanecem no dispositivo do usuário
- Backup manual recomendado para configurações importantes

### 🔒 **Comunicação**
- **HTTPS obrigatório** para todas as APIs
- Cabeçalhos de segurança apropriados
- Tratamento seguro de erros (sem exposição de chaves)

---

## 🧪 Testes e Validação

### ✅ **Teste de APIs**
```javascript
// Função: testApiConnections()
// O que faz: Testa todas as chaves configuradas
// Retorna: Status de cada provedor (✅/❌)
```

### 🔬 **Teste de Agente**
```javascript
// Função: testAgent()
// O que faz: Envia mensagem de teste para o agente
// Mensagem padrão: "Olá! Por favor, se apresente brevemente..."
// Verifica: Configuração, API key, resposta do modelo
```

---

## 📊 Arquitetura Técnica

### 🏗️ **Estrutura de Arquivos**
```
custom-agents.html      # Interface principal
js/custom-agents.js     # Lógica da aplicação
```

### 🔄 **Fluxo de Dados**
```
[Usuário] → [Interface] → [JavaScript] → [API Provider] → [Resposta] → [Chat]
```

### 💾 **Persistência Local**
```javascript
// Chaves de API
localStorage.setItem('custom_agents_api_keys', JSON.stringify(apiKeys));

// Lista de agentes
localStorage.setItem('custom_agents_list', JSON.stringify(currentAgents));
```

### 🌐 **Formato das Mensagens**
```javascript
// Estrutura padrão para todos os provedores
{
  role: 'system|user|assistant',
  content: 'mensagem...',
  timestamp: '2024-01-01T00:00:00.000Z'
}
```

---

## 🚨 Limitações e Considerações

### ⚠️ **Limitações Atuais**
- **Sem sincronização**: Dados ficam apenas no dispositivo local
- **Sem colaboração**: Agentes não podem ser compartilhados
- **Histórico temporário**: Perdido ao fechar o navegador
- **Sem rate limiting**: Usuário controla uso da API

### 💰 **Custos de API**
- **Responsabilidade do usuário**: Cada um paga suas próprias APIs
- **Modelos diferentes = custos diferentes**: GPT-4 > GPT-3.5
- **Monitoramento recomendado**: Acompanhe uso nos dashboards dos provedores

### 🔧 **Requisitos Técnicos**
- **JavaScript habilitado**
- **LocalStorage disponível**
- **Conexão HTTPS** (obrigatório para APIs)
- **Navegador moderno** (ES6+ support)

---

## 🔮 Roadmap Futuro

### 🎯 **Próximas Funcionalidades**
1. **☁️ Sincronização em nuvem** para backup de agentes
2. **🤝 Compartilhamento** de agentes entre usuários
3. **📊 Analytics** de uso e performance
4. **🔄 Versionamento** de agentes com histórico de mudanças
5. **🎨 Editor visual** de system prompts
6. **🔍 Busca avançada** por agentes e conversas
7. **📝 Templates customizáveis** pelo usuário
8. **🔐 Autenticação** com sync multi-dispositivo

### 🛠️ **Melhorias Técnicas**
1. **💾 Backup automático** de configurações
2. **🔄 Import/Export** de agentes
3. **📱 PWA** (Progressive Web App)
4. **🌙 Modo escuro/claro** personalizável
5. **🌐 Multi-idioma** (EN, ES, FR)

---

## 🆘 Solução de Problemas

### ❌ **"Erro de API Key"**
- Verifique se a chave está correta
- Teste a conexão na configuração de APIs
- Confirme se a chave tem permissões adequadas

### 🔄 **"Agente não responde"**
- Verifique conexão com internet
- Confirme se o provedor está funcionando
- Teste com modelo diferente

### 💾 **"Agentes não salvam"**
- Verifique se localStorage está habilitado
- Confirme se há espaço de armazenamento disponível
- Teste em navegador diferente/modo privado

### 🌐 **"Erro CORS"**
- Confirme que está acessando via HTTPS
- Alguns provedores podem ter restrições regionais
- Tente usar OpenRouter como alternativa

---

## 📞 Suporte e Documentação

### 🔗 **Recursos Úteis**
- **OpenAI Docs**: https://platform.openai.com/docs
- **Anthropic Docs**: https://docs.anthropic.com
- **Google AI Docs**: https://ai.google.dev/docs
- **OpenRouter Docs**: https://openrouter.ai/docs

### 💬 **Comunidade**
- Use a funcionalidade de chat dos próprios agentes para tirar dúvidas
- Crie um "Agente Suporte" especializado em ajudar com a plataforma
- Consulte a documentação dos provedores para questões específicas de API

---

**🧠 Sistema desenvolvido com pensamento nexialista - conectando múltiplas IAs em uma plataforma unificada e customizável!** ✨