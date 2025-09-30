// Prospera Memory Management System

window.ProsperaMemory = {
    initialized: false,
    
    init: function() {
        this.initialized = true;
        console.log('Prospera Memory initialized');
    },
    
    loadAgents: async function() {
        try {
            const response = await fetch(buildApiUrl('tables/custom_agents'));
            if (response.ok) {
                const data = await response.json();
                return data.data || [];
            }
            console.warn('Falha ao carregar agentes do servidor');
            return [];
        } catch (error) {
            console.error('Erro ao carregar agentes:', error);
            return [];
        }
    },
    
    saveAgent: async function(agent) {
        try {
            const response = await fetch(buildApiUrl('tables/custom_agents'), {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(agent)
            });
            
            if (response.ok) {
                return await response.json();
            }
            throw new Error('Falha ao salvar agente');
        } catch (error) {
            console.error('Erro ao salvar agente:', error);
            throw error;
        }
    },
    
    updateAgent: async function(id, agent) {
        try {
            const response = await fetch(buildApiUrl(`tables/custom_agents/${id}`), {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(agent)
            });
            
            if (response.ok) {
                return await response.json();
            }
            throw new Error('Falha ao atualizar agente');
        } catch (error) {
            console.error('Erro ao atualizar agente:', error);
            throw error;
        }
    },
    
    deleteAgent: async function(id) {
        try {
            const response = await fetch(buildApiUrl(`tables/custom_agents/${id}`), {
                method: 'DELETE'
            });
            
            if (response.ok) {
                return true;
            }
            throw new Error('Falha ao deletar agente');
        } catch (error) {
            console.error('Erro ao deletar agente:', error);
            throw error;
        }
    }
};

if (!window.ProsperaMemory.initialized) {
    window.ProsperaMemory.init();
}
