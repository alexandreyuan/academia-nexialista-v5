# Academia Nexialista - AI Agents Platform

## Overview

Academia Nexialista is a sophisticated multi-tenant AI agents platform that enables users to interact with customizable AI agents across different subscription tiers. The system features a complete authentication flow, subscription-based access control, and integration with multiple AI providers (OpenAI, Google, Anthropic, OpenRouter, Perplexity, Together AI).

The platform follows a "Nexialista" philosophy - a transmathematical thinking approach that transcends disciplinary boundaries. It offers three main products:

1. **Academia Nexialista** - Specialized AI agents for learning and development
2. **Prospera-IA Method** - A structured 4-phase methodology for digital transformation (70h program)
3. **Custom Agents Platform** - Advanced agent creation and management system

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture

**Tech Stack:**
- Vanilla JavaScript (ES6+)
- Tailwind CSS for styling
- Font Awesome for icons
- No frontend framework dependencies

**Key Pages:**
- `index.html` - Marketing landing page
- `members.html` - Member login and dashboard
- `members-dashboard.html` - Main member area with product access
- `academia-nexialista.html` - AI agents interface with chat
- `prospera-ia.html` - Prospera-IA method interface (dynamically loads agents from custom-agents)
- `custom-agents.html` - Admin agent creation/management (requires admin authentication)
- `admin-auth.html` - Administrative authentication

**Design Patterns:**
- Mobile-first responsive design with Tailwind breakpoints (sm, md, lg, xl)
- Component-based modal system for chat interfaces
- State management via localStorage for persistence
- Event-driven architecture for real-time chat interactions

### Authentication & Authorization

**Three-tier access system:**

1. **Leads** (index.html) - Public access, conversion funnel
2. **Members** (members.html, members-dashboard.html) - Authenticated users with subscription-based access:
   - Basic (🔰): Limited agent access
   - Premium (💎): Extended agent access  
   - VIP (🌟): Full agent access
3. **Admins** (admin-auth.html, custom-agents.html) - Privileged users for system management

**Authorized admin emails:**
- `yuan@apxconsultoria.com` (Founder)
- `admin@nexialista.com` (General Admin)
- `yuan@nexialista.com` (Founder alternate)

**Authentication mechanism:**
- Email/password login stored in localStorage
- Session-based verification using `auth-system.js`
- Role-based access control (RBAC) for admin features
- Hardened admin gate with explicit email whitelist validation

**Demo accounts:**
- Basic: `test@nexialista.com` / `demo123`
- Premium: `demo@nexialista.com` / `demo123`
- VIP: `yuan@nexialista.com` / `nexialista2024`

### AI Agent System

**Agent Architecture:**
- Each agent has: name, description, avatar (FontAwesome icon), category, subscription level, AI provider, model, temperature, max tokens, system prompt, knowledge base
- Agents are stored in a `ai_agents` table using RESTful Table API
- Chat interface provides real-time interaction with AI providers
- System prompts define agent personality and behavior
- Knowledge bases provide specialized context (Markdown format)

**Supported AI Providers (80+ models):**
- **OpenAI**: GPT-4o, GPT-4 Turbo, GPT-3.5, O1 reasoning models
- **Google**: Gemini 2.5 Pro, Gemini 2.0 Flash, Gemini 1.5 variants, LearnLM
- **Anthropic**: Claude 3.5 Sonnet/Haiku, Claude 3 Opus/Sonnet/Haiku, Claude 4 series
- **OpenRouter**: Meta Llama, Mistral, DeepSeek, Qwen, specialized models
- **Perplexity**: Sonar online/chat models
- **Together AI**: Llama 3, Mixtral, Qwen variants

**Chat Flow:**
1. User selects agent from dashboard
2. Modal opens with chat interface
3. User sends message
4. System constructs API request with system prompt + user message
5. Response streamed back and displayed
6. Conversation history maintained in session

### Data Persistence

**Storage Strategy:**
- **localStorage**: User sessions, authentication tokens, API keys, temporary agent configurations
- **RESTful Table API**: Persistent storage for AI agents, user data, conversation history

**AI Agents Table Schema:**
```javascript
{
  id: "text",                    // Unique identifier
  name: "text",                  // Display name
  description: "text",           // Specialization
  avatar: "text",                // FontAwesome icon class
  category: "text",              // Domain category
  subscription_level: "text",    // basic|premium|vip
  product: "text",               // academia-nexialista|prospera-ia
  is_active: "bool",             // Active status
  ai_provider: "text",           // openai|google|anthropic|etc
  model_preference: "text",      // Specific model
  temperature: "number",         // 0-2 creativity control
  max_tokens: "number",          // Response length
  prompt: "rich_text",           // System prompt (Markdown)
  knowledge_base: "rich_text"    // Knowledge context (Markdown)
}
```

**API Integration Pattern:**
- API keys stored securely in localStorage (user-managed)
- Direct client-side calls to AI provider APIs
- Error handling with graceful degradation
- Test mode with simulated responses for development

### Product-Specific Architecture

**Prospera-IA Method (prospera-ia.html):**
- Dynamic agent loading from custom-agents where `product = 'prospera-ia'`
- 4-phase structured methodology (70h total):
  1. Autodiscovery with Oracle (20h)
  2. Connections with Nexus (20h) 
  3. Structuring with Alchemist (20h)
  4. Implementation with Architect (10-20h)
- Real AI provider responses (no simulations)
- Phase progress tracking
- Guaranteed deliverables: Digital Asset, Marketing Strategy, Nexialist Community, Custom AI Agents

**Custom Agents Platform (custom-agents.html):**
- Complete CRUD operations for agent management
- Template system with 6 pre-configured agents
- Multi-provider support with dynamic model selection
- Real-time testing interface before saving
- Markdown editor for prompts and knowledge bases
- Agent categorization by product and subscription level

## External Dependencies

### AI Service Providers

**OpenAI API:**
- Endpoint: `https://api.openai.com/v1/chat/completions`
- Authentication: Bearer token (API key)
- Models: GPT-4o, GPT-4 Turbo, O1, GPT-3.5 variants
- Used for: General conversation, reasoning tasks

**Google Gemini API:**
- Endpoint: `https://generativelanguage.googleapis.com/v1beta/models/{model}:generateContent`
- Authentication: API key parameter
- Models: Gemini 2.5 Pro, Gemini 2.0, Gemini 1.5 variants
- Used for: Multimodal tasks, creative generation

**Anthropic API:**
- Endpoint: `https://api.anthropic.com/v1/messages`
- Authentication: x-api-key header
- Models: Claude 3.5, Claude 3, Claude 4 series
- Used for: Complex reasoning, ethical analysis

**OpenRouter API:**
- Endpoint: `https://openrouter.ai/api/v1/chat/completions`
- Authentication: Bearer token
- Models: 28+ models from various providers
- Used for: Access to diverse model ecosystem

**Perplexity API:**
- Models: Llama 3.1 Sonar (online/chat variants)
- Used for: Real-time information retrieval

**Together AI:**
- Models: Llama 3, Mixtral, Qwen variants
- Used for: Cost-effective inference

### CDN & External Libraries

**Tailwind CSS:**
- CDN: `https://cdn.tailwindcss.com`
- Purpose: Utility-first styling framework
- Custom theme with Nexialista color palette

**Font Awesome:**
- CDN: `https://cdn.jsdelivr.net/npm/@fortawesome/fontawesome-free@6.4.0/css/all.min.css`
- Purpose: Icon library for UI elements

**Google Fonts:**
- Families: Inter (sans-serif), Playfair Display (serif)
- Purpose: Typography system

### Database & Storage

**RESTful Table API:**
- Purpose: Persistent storage for agents and user data
- Operations: CREATE, READ, UPDATE, DELETE
- Used for: ai_agents table, user sessions

**localStorage:**
- Purpose: Client-side persistence
- Stores: Authentication tokens, API keys, user preferences, session data
- Limitations: 5-10MB per domain, client-side only

### Third-Party Integrations

**External Community Link:**
- Movimento Nexialista: Links to external community platform
- Purpose: Member engagement and networking

**Note:** The platform is designed to work with or without a PostgreSQL database. The current implementation uses the RESTful Table API, but the architecture supports Drizzle ORM integration if PostgreSQL is added later.