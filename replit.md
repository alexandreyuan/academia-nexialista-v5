# Academia Nexialista V2

## Visão Geral
Plataforma web full stack de agentes de IA com pensamento nexialista. Sistema completo com backend Node.js/Express, banco de dados PostgreSQL e frontend HTML/CSS/JS.

## Arquitetura
- **Backend**: Node.js/Express na porta 5000
- **Banco de Dados**: PostgreSQL (Replit)
- **Frontend**: HTML5, CSS3, JavaScript Vanilla
- **APIs**: REST API para CRUD de agentes

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
└── public/                  # Arquivos estáticos (futuro)
```

## Endpoints API
- `GET /tables/custom_agents` - Lista agentes
- `GET /tables/custom_agents/:id` - Busca agente
- `POST /tables/custom_agents` - Cria agente
- `PATCH /tables/custom_agents/:id` - Atualiza agente
- `DELETE /tables/custom_agents/:id` - Deleta agente

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

## Status
- ✅ Backend configurado
- ✅ Banco de dados criado
- ✅ Frontend importado
- 🔄 Em testes
