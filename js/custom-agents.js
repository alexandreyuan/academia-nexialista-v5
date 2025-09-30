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
        if (response.ok) {
            const data = await response.json();
            agents = data.data || [];
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
                    <p class="text-digital-clarity/70 text-sm">${agent.role || 'Especialista'}</p>
                </div>
                <span class="px-3 py-1 bg-gold-experience/20 text-gold-experience text-xs rounded-full">
                    ${agent.model || 'GPT-4'}
                </span>
            </div>
            <p class="text-digital-clarity/80 text-sm mb-4 line-clamp-3">${agent.description || 'Sem descrição'}</p>
            <div class="flex items-center justify-between pt-4 border-t border-gold-experience/20">
                <span class="text-xs text-digital-clarity/50">${formatDate(agent.updated_at)}</span>
                <div class="flex space-x-2">
                    <button onclick="editAgent('${agent.id}')" class="text-gold-experience hover:text-gold-legacy transition-colors">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button onclick="deleteAgent('${agent.id}')" class="text-red-400 hover:text-red-500 transition-colors">
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
            { value: 'openrouter/quasar-alpha', label: 'Quasar Alpha' },
            { value: 'grok-code-fast-1', label: 'Grok Code Fast 1' },
            { value: 'claude-sonnet-4', label: 'Claude Sonnet 4' },
            { value: 'gemini-2.5-flash', label: 'Gemini 2.5 Flash' },
            { value: 'grok-4-fast-free', label: 'Grok 4 Fast (free)' },
            { value: 'deepseek-v3.1-free', label: 'DeepSeek V3.1 (free)' },
            { value: 'gemini-2.0-flash-experimental-free', label: 'Gemini 2.0 Flash Experimental (free)' },
            { value: 'deepseek-v3-0324', label: 'DeepSeek V3 0324' },
            { value: 'gemini-2.5-pro', label: 'Gemini 2.5 Pro' },
            { value: 'gpt-4.1-mini', label: 'GPT-4.1 Mini' },
            { value: 'gpt-5-mini', label: 'GPT-5 Mini' }
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
