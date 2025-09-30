// Custom Agents Management
let agents = [];
let editingAgentId = null;

// Load agents on page load
document.addEventListener('DOMContentLoaded', async function() {
    await loadAgents();
});

async function loadAgents() {
    try {
        const response = await fetch(buildApiUrl('tables/custom_agents'));
        console.log('loadAgents - Status:', response.status);
        
        if (response.ok) {
            const data = await response.json();
            console.log('loadAgents - Dados recebidos:', data);
            
            // O servidor retorna um array direto, não { data: [...] }
            agents = Array.isArray(data) ? data : [];
            console.log('loadAgents - Agentes carregados:', agents.length);
            
            renderAgents();
        } else {
            console.error('Erro ao carregar agentes');
            showToast('Erro ao carregar agentes', 'error');
        }
    } catch (error) {
        console.error('Erro:', error);
        showToast('Erro ao conectar com servidor', 'error');
    }
}

function renderAgents() {
    const grid = document.getElementById('agents-grid');
    const emptyState = document.getElementById('empty-state');
    
    if (!agents || agents.length === 0) {
        grid.innerHTML = '';
        if (emptyState) emptyState.classList.remove('hidden');
        return;
    }
    
    if (emptyState) emptyState.classList.add('hidden');
    
    grid.innerHTML = agents.map(agent => `
        <div class="bg-nexus-power border border-gold-experience/30 rounded-lg p-6 hover:border-gold-experience/60 transition-all">
            <div class="flex items-start justify-between mb-4">
                <div>
                    <h3 class="text-xl font-semibold text-gold-experience mb-2">${agent.name || 'Sem nome'}</h3>
                    <p class="text-digital-clarity/70 text-sm">${agent.provider || 'openai'} / ${agent.model || 'GPT-4'}</p>
                </div>
                <span class="px-3 py-1 bg-gold-experience/20 text-gold-experience text-xs rounded-full">
                    Custom
                </span>
            </div>
            <p class="text-digital-clarity/80 text-sm mb-4 line-clamp-3">${agent.description || 'Sem descrição'}</p>
            <div class="flex items-center justify-between pt-4 border-t border-gold-experience/20">
                <button onclick="testAgentById('${agent.id}')" class="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm rounded-lg transition-colors flex items-center space-x-2">
                    <i class="fas fa-play"></i>
                    <span>Testar</span>
                </button>
                <div class="flex space-x-3">
                    <button onclick="editAgent('${agent.id}')" class="text-gold-experience hover:text-gold-legacy transition-colors p-2" title="Editar">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button onclick="deleteAgent('${agent.id}')" class="text-red-400 hover:text-red-500 transition-colors p-2" title="Excluir">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            </div>
        </div>
    `).join('');
}

function createNewAgent() {
    editingAgentId = null;
    const titleEl = document.getElementById('modal-title');
    if (titleEl) titleEl.textContent = 'Criar Novo Agente';
    
    const nameEl = document.getElementById('agent-name');
    if (nameEl) nameEl.value = '';
    
    const descEl = document.getElementById('agent-description');
    if (descEl) descEl.value = '';
    
    const promptEl = document.getElementById('agent-system-prompt');
    if (promptEl) promptEl.value = '';
    
    const modelEl = document.getElementById('agent-model');
    if (modelEl) modelEl.value = 'gpt-4';
    
    const modalEl = document.getElementById('agent-modal');
    if (modalEl) modalEl.classList.remove('hidden');
}

function editAgent(id) {
    const agent = agents.find(a => a.id === id);
    if (!agent) return;
    
    editingAgentId = id;
    const titleEl = document.getElementById('modal-title');
    if (titleEl) titleEl.textContent = 'Editar Agente';
    
    const nameEl = document.getElementById('agent-name');
    if (nameEl) nameEl.value = agent.name || '';
    
    const descEl = document.getElementById('agent-description');
    if (descEl) descEl.value = agent.description || '';
    
    const promptEl = document.getElementById('agent-system-prompt');
    if (promptEl) promptEl.value = agent.system_prompt || '';
    
    const modelEl = document.getElementById('agent-model');
    if (modelEl) modelEl.value = agent.model || 'gpt-4';
    
    const modalEl = document.getElementById('agent-modal');
    if (modalEl) modalEl.classList.remove('hidden');
}

async function deleteAgent(id) {
    if (!confirm('Tem certeza que deseja excluir este agente?')) return;
    
    try {
        const response = await fetch(buildApiUrl(`tables/custom_agents/${id}`), {
            method: 'DELETE'
        });
        
        if (response.ok) {
            showToast('Agente excluído com sucesso!', 'success');
            await loadAgents();
        } else {
            showToast('Erro ao excluir agente', 'error');
        }
    } catch (error) {
        console.error('Erro:', error);
        showToast('Erro ao conectar com servidor', 'error');
    }
}

async function saveAgent() {
    const name = document.getElementById('agent-name').value;
    const description = document.getElementById('agent-description').value;
    const system_prompt = document.getElementById('agent-system-prompt').value;
    const model = document.getElementById('agent-model').value;
    const provider = document.getElementById('agent-provider')?.value || 'openai';
    
    if (!name) {
        showToast('Nome é obrigatório', 'error');
        return;
    }
    
    // Generate ID from name if creating new agent
    const agentData = {
        name,
        description,
        system_prompt,
        model,
        provider,
        avatar: '🤖',
        temperature: 0.7,
        max_tokens: 2000,
        knowledge: '',
        product: 'academia-nexialista',
        accessible_plans: ['basic', 'premium', 'vip', 'admin'],
        category: 'custom'
    };
    
    // Add ID for new agents
    if (!editingAgentId) {
        agentData.id = name.toLowerCase()
            .replace(/[^a-z0-9]+/g, '-')
            .replace(/^-+|-+$/g, '') + '-' + Date.now();
    }
    
    console.log('Salvando agente:', editingAgentId ? 'EDIÇÃO' : 'NOVO', agentData);
    
    try {
        let response;
        const url = editingAgentId 
            ? buildApiUrl(`tables/custom_agents/${editingAgentId}`)
            : buildApiUrl('tables/custom_agents');
        
        console.log('URL:', url, 'Method:', editingAgentId ? 'PATCH' : 'POST');
        
        if (editingAgentId) {
            response = await fetch(url, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(agentData)
            });
        } else {
            response = await fetch(url, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(agentData)
            });
        }
        
        const data = await response.json();
        console.log('Resposta:', response.status, data);
        
        if (response.ok) {
            showToast(editingAgentId ? 'Agente atualizado!' : 'Agente criado com sucesso!', 'success');
            closeAgentModal();
            await loadAgents();
        } else {
            showToast(`Erro: ${data.error || 'Erro ao salvar agente'}`, 'error');
        }
    } catch (error) {
        console.error('Erro ao salvar agente:', error);
        showToast('Erro ao conectar com servidor', 'error');
    }
}

function closeAgentModal() {
    const modalEl = document.getElementById('agent-modal');
    if (modalEl) modalEl.classList.add('hidden');
    editingAgentId = null;
}

async function showApiSettings() {
    const modalEl = document.getElementById('api-modal');
    if (modalEl) modalEl.classList.remove('hidden');
    
    // Load saved API keys
    await loadApiKeys();
}

async function loadApiKeys() {
    try {
        const url = buildApiUrl('tables/custom_agents_api_keys');
        console.log('Carregando API keys de:', url);
        
        const response = await fetch(url);
        console.log('Status da resposta:', response.status);
        
        if (response.ok) {
            const keys = await response.json();
            console.log('Chaves carregadas:', keys.length, 'keys');
            
            // Clear all fields first
            document.getElementById('openai-key').value = '';
            document.getElementById('groq-key').value = '';
            document.getElementById('google-key').value = '';
            document.getElementById('openrouter-key').value = '';
            
            // Populate fields with saved keys
            keys.forEach(keyData => {
                const provider = keyData.provider;
                const apiKey = keyData.api_key;
                console.log('Carregando chave para:', provider);
                
                if (provider === 'openai') {
                    document.getElementById('openai-key').value = apiKey;
                } else if (provider === 'groq') {
                    document.getElementById('groq-key').value = apiKey;
                } else if (provider === 'google') {
                    document.getElementById('google-key').value = apiKey;
                } else if (provider === 'openrouter') {
                    document.getElementById('openrouter-key').value = apiKey;
                }
            });
            
            console.log('API keys carregadas com sucesso!');
        } else {
            console.error('Erro ao carregar keys, status:', response.status);
        }
    } catch (error) {
        console.error('Erro ao carregar API keys:', error);
    }
}

function closeApiModal() {
    const modalEl = document.getElementById('api-modal');
    if (modalEl) modalEl.classList.add('hidden');
}

async function saveApiSettings() {
    const apiKeys = [
        { provider: 'openai', key: document.getElementById('openai-key').value },
        { provider: 'groq', key: document.getElementById('groq-key').value },
        { provider: 'google', key: document.getElementById('google-key').value },
        { provider: 'openrouter', key: document.getElementById('openrouter-key').value }
    ];
    
    console.log('Salvando API Keys:', apiKeys.map(k => ({ provider: k.provider, hasKey: !!k.key })));
    
    // Filter out empty keys
    const keysToSave = apiKeys.filter(item => item.key && item.key.trim() !== '');
    
    if (keysToSave.length === 0) {
        showToast('Adicione pelo menos uma API Key', 'error');
        return;
    }
    
    try {
        let savedCount = 0;
        let errors = [];
        
        for (const item of keysToSave) {
            const url = buildApiUrl('tables/custom_agents_api_keys');
            console.log('POST para:', url, 'Provider:', item.provider);
            
            const response = await fetch(url, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ 
                    provider: item.provider,
                    api_key: item.key 
                })
            });
            
            const data = await response.json();
            console.log('Resposta:', response.status, data);
            
            if (response.ok) {
                savedCount++;
            } else {
                errors.push(`${item.provider}: ${data.error || 'Erro desconhecido'}`);
            }
        }
        
        if (savedCount > 0) {
            showToast(`${savedCount} API Key(s) salva(s) com sucesso!`, 'success');
            closeApiModal();
        } else {
            showToast('Erro ao salvar API Keys: ' + errors.join(', '), 'error');
        }
    } catch (error) {
        console.error('Erro ao salvar:', error);
        showToast('Erro ao conectar com servidor', 'error');
    }
}

// Update model options based on selected provider
function updateModelOptions() {
    const providerSelect = document.getElementById('agent-provider');
    const modelSelect = document.getElementById('agent-model');
    
    if (!providerSelect || !modelSelect) return;
    
    const provider = providerSelect.value;
    
    const modelsByProvider = {
        google: [
            { value: 'gemini-2.5-pro', label: 'Gemini 2.5 Pro' },
            { value: 'gemini-2.5-flash', label: 'Gemini 2.5 Flash' },
            { value: 'gemini-2.5-flash-lite', label: 'Gemini 2.5 Flash-Lite' },
            { value: 'gemini-nano', label: 'Gemini Nano' }
        ],
        openai: [
            { value: 'gpt-5', label: 'GPT-5' },
            { value: 'gpt-5-mini', label: 'GPT-5 mini' },
            { value: 'gpt-5-nano', label: 'GPT-5 nano' },
            { value: 'o4-mini-deep-research', label: 'o4-mini-deep-research' }
        ],
        openrouter: [
            { value: 'anthropic/claude-4-sonnet-20250522', label: 'Claude 4 Sonnet' },
            { value: 'anthropic/claude-3.7-sonnet', label: 'Claude 3.7 Sonnet' },
            { value: 'google/gemini-2.5-flash', label: 'Gemini 2.5 Flash' },
            { value: 'google/gemini-2.5-pro', label: 'Gemini 2.5 Pro' },
            { value: 'openai/gpt-4.1', label: 'GPT-4.1' },
            { value: 'openai/gpt-4.1-mini-2025-04-14', label: 'GPT-4.1 Mini' },
            { value: 'openai/gpt-5-mini', label: 'GPT-5 Mini' },
            { value: 'meta-llama/llama-4-maverick', label: 'Llama 4 Maverick (400B)' },
            { value: 'meta-llama/llama-4-scout', label: 'Llama 4 Scout (109B)' },
            { value: 'deepseek/deepseek-r1:free', label: 'DeepSeek R1 (free)' },
            { value: 'google/gemini-2.0-flash-exp:free', label: 'Gemini 2.0 Flash (free)' }
        ],
        groq: [
            { value: 'llama-3.3-70b', label: 'Llama 3.3 70B' },
            { value: 'llama-3.1-8b', label: 'Llama 3.1 8B' },
            { value: 'mixtral-8x7b', label: 'Mixtral 8x7B' }
        ]
    };
    
    // Clear current options
    modelSelect.innerHTML = '';
    
    if (!provider) {
        modelSelect.innerHTML = '<option value="">Primeiro selecione um provedor</option>';
        return;
    }
    
    const models = modelsByProvider[provider] || [];
    
    if (models.length === 0) {
        modelSelect.innerHTML = '<option value="">Nenhum modelo disponível</option>';
        return;
    }
    
    // Add default option
    const defaultOption = document.createElement('option');
    defaultOption.value = '';
    defaultOption.textContent = 'Selecione um modelo...';
    modelSelect.appendChild(defaultOption);
    
    // Add provider models
    models.forEach(model => {
        const option = document.createElement('option');
        option.value = model.value;
        option.textContent = model.label;
        modelSelect.appendChild(option);
    });
}

// Test API connections
async function testApiConnections() {
    const providers = [
        { name: 'OpenAI', id: 'openai', key: document.getElementById('openai-key').value, endpoint: 'https://api.openai.com/v1/models', headers: (key) => ({ 'Authorization': `Bearer ${key}` }) },
        { name: 'Groq', id: 'groq', key: document.getElementById('groq-key').value, endpoint: 'https://api.groq.com/openai/v1/models', headers: (key) => ({ 'Authorization': `Bearer ${key}` }) },
        { name: 'Google', id: 'google', key: document.getElementById('google-key').value, endpoint: (key) => `https://generativelanguage.googleapis.com/v1beta/models?key=${key}`, headers: () => ({}) },
        { name: 'OpenRouter', id: 'openrouter', key: document.getElementById('openrouter-key').value, endpoint: 'https://openrouter.ai/api/v1/models', headers: (key) => ({ 'Authorization': `Bearer ${key}` }) }
    ];
    
    let results = [];
    let testedCount = 0;
    
    for (const provider of providers) {
        if (!provider.key || provider.key.trim() === '') {
            results.push(`${provider.name}: ⚠️ Sem chave configurada`);
            continue;
        }
        
        testedCount++;
        
        try {
            const endpoint = typeof provider.endpoint === 'function' ? provider.endpoint(provider.key) : provider.endpoint;
            const headers = provider.headers(provider.key);
            
            const response = await fetch(endpoint, {
                method: 'GET',
                headers: headers
            });
            
            if (response.ok) {
                results.push(`${provider.name}: ✅ Conexão OK`);
            } else {
                const errorText = await response.text();
                results.push(`${provider.name}: ❌ Erro ${response.status}`);
                console.error(`${provider.name} error:`, errorText);
            }
        } catch (error) {
            results.push(`${provider.name}: ❌ Falha na conexão`);
            console.error(`${provider.name} exception:`, error);
        }
    }
    
    if (testedCount === 0) {
        showToast('Configure ao menos uma chave de API para testar', 'error');
        return;
    }
    
    // Show results
    const message = results.join('\n');
    alert(`🔌 Resultado dos Testes:\n\n${message}`);
    
    const allSuccess = results.every(r => r.includes('✅') || r.includes('⚠️'));
    if (allSuccess && testedCount > 0) {
        showToast('Todas as conexões testadas estão funcionando!', 'success');
    }
}

// Test agent by opening it in a new window
function testAgentById(agentId) {
    const agent = agents.find(a => a.id === agentId);
    if (!agent) {
        showToast('Agente não encontrado', 'error');
        return;
    }
    
    console.log('Testando agente:', agent);
    
    // Abrir página de chat com o agente em nova aba
    // Salvar o agente no sessionStorage para a página de chat usar
    sessionStorage.setItem('testAgent', JSON.stringify(agent));
    
    // Abrir em nova aba
    const chatUrl = 'academia-nexialista.html?agent=' + encodeURIComponent(agentId);
    window.open(chatUrl, '_blank');
    
    showToast(`Abrindo ${agent.name} para teste...`, 'success');
}
