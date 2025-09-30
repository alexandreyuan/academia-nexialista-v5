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
    document.getElementById('agent-form-title').textContent = 'Criar Novo Agente';
    document.getElementById('agent-name').value = '';
    document.getElementById('agent-role').value = '';
    document.getElementById('agent-description').value = '';
    document.getElementById('agent-personality').value = '';
    document.getElementById('agent-model').value = 'gpt-4';
    document.getElementById('agent-modal').classList.remove('hidden');
}

function editAgent(id) {
    const agent = agents.find(a => a.id === id);
    if (!agent) return;
    
    editingAgentId = id;
    document.getElementById('agent-form-title').textContent = 'Editar Agente';
    document.getElementById('agent-name').value = agent.name || '';
    document.getElementById('agent-role').value = agent.role || '';
    document.getElementById('agent-description').value = agent.description || '';
    document.getElementById('agent-personality').value = agent.personality || '';
    document.getElementById('agent-model').value = agent.model || 'gpt-4';
    document.getElementById('agent-modal').classList.remove('hidden');
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
    const agentData = {
        name: document.getElementById('agent-name').value,
        role: document.getElementById('agent-role').value,
        description: document.getElementById('agent-description').value,
        personality: document.getElementById('agent-personality').value,
        model: document.getElementById('agent-model').value
    };
    
    if (!agentData.name || !agentData.role) {
        showToast('Nome e papel são obrigatórios', 'error');
        return;
    }
    
    try {
        let response;
        if (editingAgentId) {
            response = await fetch(buildApiUrl(`tables/custom_agents/${editingAgentId}`), {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(agentData)
            });
        } else {
            response = await fetch(buildApiUrl('tables/custom_agents'), {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(agentData)
            });
        }
        
        if (response.ok) {
            showToast(editingAgentId ? 'Agente atualizado!' : 'Agente criado!', 'success');
            closeAgentModal();
            await loadAgents();
        } else {
            showToast('Erro ao salvar agente', 'error');
        }
    } catch (error) {
        console.error('Erro:', error);
        showToast('Erro ao conectar com servidor', 'error');
    }
}

function closeAgentModal() {
    document.getElementById('agent-modal').classList.add('hidden');
    editingAgentId = null;
}

function showApiSettings() {
    document.getElementById('api-settings-modal').classList.remove('hidden');
}

function closeApiSettings() {
    document.getElementById('api-settings-modal').classList.add('hidden');
}

async function saveApiSettings() {
    const apiKey = document.getElementById('openai-api-key').value;
    
    if (!apiKey) {
        showToast('API Key é obrigatória', 'error');
        return;
    }
    
    try {
        const response = await fetch(buildApiUrl('tables/custom_agents_api_keys'), {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ 
                provider: 'openai',
                api_key: apiKey 
            })
        });
        
        if (response.ok) {
            showToast('API Key salva com sucesso!', 'success');
            closeApiSettings();
        } else {
            showToast('Erro ao salvar API Key', 'error');
        }
    } catch (error) {
        console.error('Erro:', error);
        showToast('Erro ao conectar com servidor', 'error');
    }
}
