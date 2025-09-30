# 🏗️ **Arquitetura Nexialista Implementada**

## 🎯 **Visão Geral**

Sistema hierárquico de **3 níveis** com produtos organizados por **assinatura** e **agentes classificados** por produto e nível de acesso.

---

## 👥 **FLUXO DE USUÁRIOS**

### 🚀 **1. LEADS (index.html)**
- **Objetivo**: Landing page para conversão
- **CTA Principal**: Cadastro como membro
- **Link Admin**: Redireciona para `admin-auth.html`

### 🎓 **2. MEMBROS (members.html)**
- **Sistema de Login**: Email + Senha
- **Dashboard por Assinatura**:
  - 🔰 **Básico**: Acesso ao Prospera-IA (4 agentes)
  - 💎 **Premium**: Prospera-IA + Academia Nexialista (8 agentes)
  - 🌟 **VIP**: Todos os produtos (agentes ilimitados)

### 🛡️ **3. ADMINS (admin-auth.html → custom-agents.html)**
- **Emails Autorizados**: 
  - `yuan@apxconsultoria.com` (Fundador)
  - `admin@nexialista.com` (Admin Geral)
- **Funcionalidades**: Criação e gestão de agentes com classificação

---

## 🏢 **ESTRUTURA DE PRODUTOS**

### 📈 **PROSPERA-IA** (Sistema de Prosperidade)
```
🔰 BÁSICO:
├── 🔮 Oráculo Nexialista (Análise de oportunidades)

💎 PREMIUM:
├── 🔮 Oráculo Nexialista
├── 🔗 Nexus Estratégico (Conexões e estratégias)
└── ⚗️ Alquimista Digital (Transformação de ideias)

🌟 VIP:
├── Todos do Premium +
└── 🏗️ Arquiteto da Prosperidade (Sistemas sustentáveis)
```

### 🎓 **ACADEMIA NEXIALISTA** (Desenvolvimento de Habilidades)
```
💎 PREMIUM:
├── 👨‍🏫 Mentor Nexialista (Guia de desenvolvimento)
└── 🧭 Explorador de Trilhas (Navegação educacional)

🌟 VIP:
├── Todos do Premium +
└── 🔬 Sintetizador de Conhecimento (Integração multidisciplinar)
```

### 🌍 **MOVIMENTO NEXIALISTA** (Comunidade Global)
```
🌟 VIP (Exclusivo):
├── 🤝 Conector da Comunidade (Facilitação de conexões)
└── ⚡ Catalisador do Movimento (Impulso a projetos)
```

---

## 🔐 **SISTEMA DE AUTENTICAÇÃO**

### 📊 **Hierarquia de Permissões**
1. **Administradores** → Acesso total (criação/edição de agentes)
2. **Membros VIP** → Todos os produtos e agentes
3. **Membros Premium** → Prospera-IA + Academia
4. **Membros Básico** → Apenas Prospera-IA limitado
5. **Leads** → Apenas landing page

### 🔑 **Credenciais de Teste**

#### 👥 **Membros**
```
Básico:    basic@nexialista.com    / basic123
Premium:   premium@nexialista.com  / premium123  
VIP:       vip@nexialista.com      / vip123
Demo:      demo@nexialista.com     / demo123 (Premium)
```

#### 🛡️ **Administradores**
```
Fundador:  yuan@apxconsultoria.com / nexialista2024
Admin:     admin@nexialista.com    / admin123
```

---

## 🎨 **CLASSIFICAÇÃO DE AGENTES**

### 📋 **Campos Obrigatórios (Admin)**
1. **Produto** → prospera-ia | academia-nexialista | movimento-nexialista
2. **Nível Mínimo** → basic | premium | vip
3. **Categoria** → Análise & Visão, Estratégia, Transformação, etc.

### 🏷️ **Sistema de Badges**
- **Produto**: 📈 Prospera-IA, 🎓 Academia, 🌍 Movimento
- **Assinatura**: 🔰 Básico, 💎 Premium, 🌟 VIP
- **Provedor IA**: OpenAI, Anthropic, Google, OpenRouter

---

## 🔄 **FLUXOS IMPLEMENTADOS**

### 🎯 **Jornada do Lead**
```
index.html → Cadastro → members.html (com assinatura específica)
```

### 🔐 **Acesso Admin**
```
index.html → "Agentes IA" → admin-auth.html → custom-agents.html
```

### 🎓 **Experiência do Membro**
```
members.html → Dashboard por assinatura → Agentes disponíveis por nível
```

---

## 📁 **ARQUIVOS PRINCIPAIS**

### 🔑 **Autenticação e Controle**
- `js/auth-system.js` → Sistema completo de autenticação
- `admin-auth.html` → Login administrativo
- `custom-agents.html` → Editor de agentes (admin only)

### 👥 **Interface do Usuário**
- `index.html` → Landing page
- `members.html` → Dashboard de membros
- `js/members.js` → Lógica da área de membros

### 📊 **Dados e Estruturas**
```javascript
// Produtos e seus agentes
PRODUCTS = {
    'prospera-ia': { agents: {...}, requiredLevels: ['basic', 'premium', 'vip'] },
    'academia-nexialista': { agents: {...}, requiredLevels: ['premium', 'vip'] },
    'movimento-nexialista': { agents: {...}, requiredLevels: ['vip'] }
}

// Níveis de assinatura
SUBSCRIPTION_LEVELS = {
    basic: { maxAgents: 4, products: ['prospera-ia'] },
    premium: { maxAgents: 8, products: ['prospera-ia', 'academia-nexialista'] },
    vip: { maxAgents: 999, products: ['all'] }
}
```

---

## 🧠 **PRINCÍPIOS NEXIALISTAS APLICADOS**

### 🔄 **Hierarquia Natural**
Como na natureza, o sistema segue uma **hierarquia orgânica** onde cada nível tem suas **capacidades específicas** e **acesso progressivo**.

### 🌊 **Fluidez de Acesso**
Sistema **transmitemático** onde usuários podem **evoluir** entre níveis, desbloqueando novos produtos e agentes.

### ⚖️ **Equilíbrio de Valor**
Cada assinatura oferece **valor proporcional**, com **upgrades naturais** que incentivam crescimento.

### 🎯 **Simplicidade Elegante**
Interface **intuitiva** que esconde a **complexidade técnica** por trás de uma experiência **fluida**.

---

## 🚀 **PRÓXIMOS PASSOS**

### ⚡ **Implementações Pendentes**
1. **Dashboard dinâmico** de produtos na área de membros
2. **Templates específicos** por produto
3. **Controle de acesso granular** baseado em assinatura
4. **Analytics** de uso por produto/assinatura

### 🎯 **Evolução Futura**
1. **Sistema de pagamento** integrado
2. **Upgrade/downgrade** automático de assinatura
3. **Marketplace** de agentes entre membros VIP
4. **IA assistente** para criação de agentes

---

**🎯 STATUS**: Arquitetura principal implementada e operacional
**🧠 FILOSOFIA**: Sistema que **cresce organicamente** com o usuário
**✨ RESULTADO**: Plataforma nexialista que conecta **produtos**, **pessoas** e **possibilidades**