# Academia Nexialista V2

## Visão Geral
Plataforma web full stack de agentes de IA com pensamento nexialista. Sistema completo com backend Node.js/Express, banco de dados PostgreSQL e frontend HTML/CSS/JS.

## Arquitetura
- **Backend**: Node.js/Express na porta 5000
- **Banco de Dados**: PostgreSQL (Replit)
- **Frontend**: HTML5, CSS3, JavaScript Vanilla
- **APIs**: REST API para CRUD de agentes
- **Memória Compartilhada**: Sistema persistente PostgreSQL para conversas

## Estrutura do Projeto
```
/
├── server.js                  # Servidor Express principal
├── package.json              # Dependências Node.js
├── index.html                # Landing page
├── members.html              # Login
├── members-dashboard.html    # Dashboard principal
├── academia-nexialista.html  # Agentes da Academia
├── prospera-ia.html         # Método Prospera-IA
├── custom-agents.html       # Editor de agentes (admin)
├── js/
│   ├── auth-system.js       # Sistema de autenticação
│   └── prospera-memory.js   # Sistema de memória compartilhada
└── public/                  # Arquivos estáticos (futuro)
```

## Endpoints API

### Agentes
- `GET /tables/custom_agents` - Lista agentes
- `GET /tables/custom_agents/:id` - Busca agente
- `POST /tables/custom_agents` - Cria agente
- `PATCH /tables/custom_agents/:id` - Atualiza agente
- `DELETE /tables/custom_agents/:id` - Deleta agente

### Memória Compartilhada (Conversas)
- `POST /api/conversations` - Salva uma interação (mensagem usuário/agente)
- `GET /api/conversations/:user_email` - Histórico completo do usuário
- `GET /api/conversations/:user_email/:agent_id` - Histórico com agente específico
- `GET /api/shared-context/:user_email` - Contexto compartilhado recente

## Usuários de Teste
- explorer@nexialista.com / explorer123 (Basic)
- master@nexialista.com / master123 (Premium)
- infinity@nexialista.com / infinity123 (VIP)
- admin@nexialista.com / admin123 (Admin)
- yuan@apxconsultoria.com / yuan123 (Founder)

## Configuração
- Porta: 5000
- Host: 0.0.0.0
- Database: PostgreSQL (via DATABASE_URL)

## Sistema de Memória Compartilhada

O sistema implementa memória persistente PostgreSQL que permite:

1. **Histórico Persistente**: Todas as conversas são salvas no banco de dados
2. **Contexto Compartilhado**: Agentes têm acesso ao histórico de outros agentes
3. **Continuidade na Jornada**: O método Prospera-IA (Oráculo → Alquimista → Nexus → Arquiteto) mantém continuidade real
4. **Recuperação de Sessão**: Histórico é restaurado ao reabrir um agente

### Tabela agent_conversations
- `id` - ID único da mensagem (SERIAL PRIMARY KEY)
- `user_email` - Email do usuário (NOT NULL, indexado)
- `agent_id` - ID do agente (NOT NULL, indexado)
- `agent_name` - Nome do agente
- `message_type` - 'user' ou 'assistant' (NOT NULL, CHECK constraint)
- `message_content` - Conteúdo da mensagem (NOT NULL, max 50k chars)
- `product` - 'prospera-ia' ou 'academia-nexialista'
- `metadata` - Metadados JSONB (extensível)
- `created_at` - Timestamp da mensagem (NOT NULL, DEFAULT CURRENT_TIMESTAMP)

### Limitações Conhecidas
⚠️ **Segurança**: O sistema atual usa autenticação client-side. Para ambientes de produção multi-usuário, recomenda-se implementar:
- Autenticação server-side (JWT/sessions)
- Autorização nos endpoints de memória
- Rate limiting
- Criptografia de API keys no banco

## Otimizações Mobile
- ✅ **Input de Chat Otimizado**: Campo de entrada maior no mobile (py-4 vs py-2)
- ✅ **Modal Bottom-Sheet**: Chat aparece na parte inferior da tela no mobile para melhor acessibilidade
- ✅ **Texto Maior**: Tamanho de fonte aumentado no mobile (text-base vs text-sm)
- ✅ **Botões Touch-Friendly**: Área de toque aumentada para botões no mobile (px-5 py-4)
- ✅ **Responsivo Completo**: Design adapta automaticamente entre mobile e desktop

## Status
- ✅ Backend configurado
- ✅ Banco de dados criado
- ✅ Frontend importado
- ✅ Editor de agentes funcionando (temperatura, produto, planos)
- ✅ Chaves de API carregadas do banco de dados
- ✅ Botão admin para configuração de agentes (founder/admin)
- ✅ Sistema de memória compartilhada implementado
- ✅ Integração completa Prospera-IA e Academia Nexialista
- ✅ Interface mobile otimizada (01/10/2025)
- ✅ Sistema de contadores de memória migrado para PostgreSQL (01/10/2025)
