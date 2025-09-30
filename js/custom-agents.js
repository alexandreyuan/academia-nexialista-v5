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
    
    // Reset basic fields
    const nameEl = document.getElementById('agent-name');
    if (nameEl) nameEl.value = '';
    
    const avatarEl = document.getElementById('agent-avatar');
    if (avatarEl) avatarEl.value = 'fas fa-robot';
    
    const descEl = document.getElementById('agent-description');
    if (descEl) descEl.value = '';
    
    const promptEl = document.getElementById('agent-system-prompt');
    if (promptEl) promptEl.value = '';
    
    // Reset provider and model
    const providerEl = document.getElementById('agent-provider');
    if (providerEl) {
        providerEl.value = 'openai';
        updateModelOptions();
    }
    
    setTimeout(() => {
        const modelEl = document.getElementById('agent-model');
        if (modelEl && modelEl.options.length > 0) {
            modelEl.value = modelEl.options[0].value;
        }
    }, 50);
    
    // Reset product and category
    const productEl = document.getElementById('agent-product');
    if (productEl) productEl.value = 'academia-nexialista';
    
    const categoryEl = document.getElementById('agent-category');
    if (categoryEl) categoryEl.value = 'Personalizado';
    
    // Reset temperature
    const tempEl = document.getElementById('agent-temperature');
    const tempValueEl = document.getElementById('temperature-value');
    if (tempEl) {
        tempEl.value = 0.7;
        if (tempValueEl) tempValueEl.textContent = '0.7';
    }
    
    // Reset max tokens
    const maxTokensEl = document.getElementById('agent-max-tokens');
    if (maxTokensEl) maxTokensEl.value = 2000;
    
    // Reset knowledge
    const knowledgeEl = document.getElementById('agent-knowledge');
    if (knowledgeEl) knowledgeEl.value = '';
    
    // Reset accessible plans - select all by default
    const planCheckboxes = document.querySelectorAll('input[name="accessiblePlans"]');
    planCheckboxes.forEach(cb => {
        cb.checked = true;
    });
    
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
    
    // Set provider first
    const providerEl = document.getElementById('agent-provider');
    if (providerEl) {
        providerEl.value = agent.provider || 'openai';
        updateModelOptions(); // Update model options based on provider
    }
    
    // Then set model after options are updated
    setTimeout(() => {
        const modelEl = document.getElementById('agent-model');
        if (modelEl) modelEl.value = agent.model || '';
    }, 50);
    
    // Set temperature and update display
    const tempEl = document.getElementById('agent-temperature');
    const tempValueEl = document.getElementById('temperature-value');
    if (tempEl) {
        const temp = agent.temperature || 0.7;
        tempEl.value = temp;
        if (tempValueEl) tempValueEl.textContent = temp;
    }
    
    // Set max tokens
    const maxTokensEl = document.getElementById('agent-max-tokens');
    if (maxTokensEl) maxTokensEl.value = agent.max_tokens || 2000;
    
    // Set knowledge
    const knowledgeEl = document.getElementById('agent-knowledge');
    if (knowledgeEl) knowledgeEl.value = agent.knowledge || '';
    
    // Set avatar
    const avatarEl = document.getElementById('agent-avatar');
    if (avatarEl) avatarEl.value = agent.avatar || 'fas fa-robot';
    
    // Set product
    const productEl = document.getElementById('agent-product');
    if (productEl) productEl.value = agent.product || 'academia-nexialista';
    
    // Set category
    const categoryEl = document.getElementById('agent-category');
    if (categoryEl) categoryEl.value = agent.category || 'Personalizado';
    
    // Set accessible plans checkboxes
    const planCheckboxes = document.querySelectorAll('input[name="accessiblePlans"]');
    const agentPlans = Array.isArray(agent.accessible_plans) ? agent.accessible_plans : [];
    planCheckboxes.forEach(cb => {
        cb.checked = agentPlans.includes(cb.value);
    });
    
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
    const avatar = document.getElementById('agent-avatar')?.value || 'fas fa-robot';
    const description = document.getElementById('agent-description').value;
    const system_prompt = document.getElementById('agent-system-prompt').value;
    const model = document.getElementById('agent-model').value;
    const provider = document.getElementById('agent-provider')?.value || 'openai';
    const product = document.getElementById('agent-product')?.value || 'academia-nexialista';
    const category = document.getElementById('agent-category')?.value || 'Personalizado';
    const temperature = parseFloat(document.getElementById('agent-temperature')?.value || 0.7);
    const max_tokens = parseInt(document.getElementById('agent-max-tokens')?.value || 2000);
    const knowledge = document.getElementById('agent-knowledge')?.value || '';
    
    // Get selected accessible plans from checkboxes
    const accessible_plans = Array.from(
        document.querySelectorAll('input[name="accessiblePlans"]:checked')
    ).map(cb => cb.value);
    
    if (!name) {
        showToast('Nome é obrigatório', 'error');
        return;
    }
    
    if (accessible_plans.length === 0) {
        showToast('Selecione pelo menos um plano de acesso', 'error');
        return;
    }
    
    // Generate ID from name if creating new agent
    const agentData = {
        name,
        avatar,
        description,
        system_prompt,
        model,
        provider,
        product,
        category,
        temperature,
        max_tokens,
        knowledge,
        accessible_plans
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
            { value: 'x-ai/grok-code-fast-1', label: 'x-AI: Grok Code Fast 1' },
            { value: 'anthropic/claude-sonnet-4', label: 'Anthropic: Claude Sonnet 4' },
            { value: 'google/gemini-2.5-flash', label: 'Google: Gemini 2.5 Flash' },
            { value: 'x-ai/grok-4-fast:free', label: 'x-AI: Grok 4 Fast (free)' },
            { value: 'deepseek/deepseek-chat-v3.1:free', label: 'DeepSeek: DeepSeek V3.1 (free)' },
            { value: 'google/gemini-2.0-flash-exp:free', label: 'Google: Gemini 2.0 Flash Experimental (free)' },
            { value: 'deepseek/deepseek-chat-v3-0324', label: 'DeepSeek: DeepSeek V3 0324' },
            { value: 'google/gemini-2.5-pro', label: 'Google: Gemini 2.5 Pro' },
            { value: 'openai/gpt-4.1-mini', label: 'OpenAI: GPT-4.1 Mini' },
            { value: 'openai/gpt-5-mini', label: 'OpenAI: GPT-5 Mini' }
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

// Update subscription options info display
function updateSubscriptionOptions() {
    const productSelect = document.getElementById('agent-product');
    const infoDiv = document.getElementById('subscription-info');
    const detailsDiv = document.getElementById('subscription-details');
    
    if (!productSelect || !infoDiv || !detailsDiv) return;
    
    const product = productSelect.value;
    
    if (!product) {
        infoDiv.classList.add('hidden');
        return;
    }
    
    infoDiv.classList.remove('hidden');
    
    const productInfo = {
        'prospera-ia': {
            name: '📈 Prospera-IA',
            description: 'Método estruturado em 4 fases para transformar expertise em ativos digitais',
            agents: 'Oráculo, Nexus, Alquimista, Arquiteto'
        },
        'academia-nexialista': {
            name: '🎓 Academia Nexialista',
            description: 'Agentes educacionais e de transformação profissional',
            agents: 'Guia, Visionário, Alquimista, Catalisador, etc.'
        },
        'movimento-nexialista': {
            name: '🌍 Movimento Nexialista',
            description: 'Agentes comunitários e de engajamento',
            agents: 'Embaixador, Conector, Facilitador'
        }
    };
    
    const info = productInfo[product];
    if (info) {
        detailsDiv.innerHTML = `
            <p class="mb-2"><strong>${info.name}</strong></p>
            <p class="text-xs mb-2">${info.description}</p>
            <p class="text-xs text-gold-experience/70">Exemplos: ${info.agents}</p>
        `;
    }
}

// Plan selection helper functions
function selectAllPlans() {
    const checkboxes = document.querySelectorAll('input[name="accessiblePlans"]');
    checkboxes.forEach(cb => cb.checked = true);
}

function selectPremiumUp() {
    const checkboxes = document.querySelectorAll('input[name="accessiblePlans"]');
    checkboxes.forEach(cb => {
        cb.checked = cb.value === 'premium' || cb.value === 'vip';
    });
}

function selectVipOnly() {
    const checkboxes = document.querySelectorAll('input[name="accessiblePlans"]');
    checkboxes.forEach(cb => {
        cb.checked = cb.value === 'vip';
    });
}

function clearAllPlans() {
    const checkboxes = document.querySelectorAll('input[name="accessiblePlans"]');
    checkboxes.forEach(cb => cb.checked = false);
}
