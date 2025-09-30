// Prospera Memory Management System - Memória Persistente e Compartilhada

window.ProsperaMemory = {
    initialized: false,
    
    init: function() {
        this.initialized = true;
        console.log('✅ Prospera Memory System: Memória compartilhada inicializada');
    },
    
    // ==================== AGENT MANAGEMENT ====================
    
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
    },
    
    // ==================== SHARED MEMORY - CONVERSATION HISTORY ====================
    
    /**
     * Salva uma interação (mensagem do usuário ou resposta do agente)
     * @param {string} userEmail - Email do usuário
     * @param {string} agentId - ID do agente
     * @param {string} agentName - Nome do agente
     * @param {string} messageType - 'user' ou 'assistant'
     * @param {string} messageContent - Conteúdo da mensagem
     * @param {string} product - Produto (prospera-ia, academia-nexialista)
     * @param {object} metadata - Metadados adicionais (opcional)
     */
    saveInteraction: async function(userEmail, agentId, agentName, messageType, messageContent, product = null, metadata = {}) {
        try {
            const response = await fetch(buildApiUrl('api/conversations'), {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    user_email: userEmail,
                    agent_id: agentId,
                    agent_name: agentName,
                    message_type: messageType,
                    message_content: messageContent,
                    product: product,
                    metadata: metadata
                })
            });
            
            if (response.ok) {
                return await response.json();
            }
            console.warn('Falha ao salvar interação');
            return null;
        } catch (error) {
            console.error('Erro ao salvar interação:', error);
            return null;
        }
    },
    
    /**
     * Carrega o histórico completo de conversas do usuário
     * @param {string} userEmail - Email do usuário
     * @param {number} limit - Número máximo de mensagens (padrão: 100)
     */
    loadAllConversations: async function(userEmail, limit = 100) {
        try {
            const response = await fetch(buildApiUrl(`api/conversations/${encodeURIComponent(userEmail)}?limit=${limit}`));
            if (response.ok) {
                return await response.json();
            }
            console.warn('Falha ao carregar conversas');
            return [];
        } catch (error) {
            console.error('Erro ao carregar conversas:', error);
            return [];
        }
    },
    
    /**
     * Carrega o histórico de conversas com um agente específico
     * @param {string} userEmail - Email do usuário
     * @param {string} agentId - ID do agente
     * @param {number} limit - Número máximo de mensagens (padrão: 50)
     */
    loadAgentConversation: async function(userEmail, agentId, limit = 50) {
        try {
            const response = await fetch(buildApiUrl(`api/conversations/${encodeURIComponent(userEmail)}/${encodeURIComponent(agentId)}?limit=${limit}`));
            if (response.ok) {
                return await response.json();
            }
            console.warn('Falha ao carregar conversa do agente');
            return [];
        } catch (error) {
            console.error('Erro ao carregar conversa do agente:', error);
            return [];
        }
    },
    
    /**
     * Carrega contexto compartilhado recente (todas as interações recentes de todos os agentes)
     * @param {string} userEmail - Email do usuário
     * @param {string} product - Filtrar por produto (opcional)
     * @param {number} limit - Número de interações recentes (padrão: 20)
     */
    loadSharedContext: async function(userEmail, product = null, limit = 20) {
        try {
            let url = `api/shared-context/${encodeURIComponent(userEmail)}?limit=${limit}`;
            if (product) {
                url += `&product=${encodeURIComponent(product)}`;
            }
            
            const response = await fetch(buildApiUrl(url));
            if (response.ok) {
                return await response.json();
            }
            console.warn('Falha ao carregar contexto compartilhado');
            return [];
        } catch (error) {
            console.error('Erro ao carregar contexto compartilhado:', error);
            return [];
        }
    },
    
    /**
     * Constrói um prompt formatado com o contexto compartilhado para incluir no prompt do sistema
     * @param {Array} conversations - Array de conversas do contexto compartilhado
     * @param {number} maxMessages - Máximo de mensagens a incluir (padrão: 10)
     */
    buildContextPrompt: function(conversations, maxMessages = 10) {
        if (!conversations || conversations.length === 0) {
            return '';
        }
        
        const recentConversations = conversations.slice(0, maxMessages);
        const grouped = {};
        
        // Agrupar por agente
        recentConversations.forEach(conv => {
            const agentName = conv.agent_name || 'Agente';
            if (!grouped[agentName]) {
                grouped[agentName] = [];
            }
            grouped[agentName].push(conv);
        });
        
        let contextPrompt = '\n\n=== CONTEXTO COMPARTILHADO - HISTÓRICO DE INTERAÇÕES ===\n';
        contextPrompt += 'Você tem acesso ao histórico completo de todas as conversas anteriores do usuário com outros agentes.\n';
        contextPrompt += 'Use este contexto para personalizar suas respostas e manter continuidade na jornada.\n\n';
        
        Object.keys(grouped).forEach(agentName => {
            contextPrompt += `--- Interações com ${agentName} ---\n`;
            grouped[agentName].reverse().forEach(conv => {
                const timestamp = new Date(conv.created_at).toLocaleDateString('pt-BR');
                if (conv.message_type === 'user') {
                    contextPrompt += `Usuário (${timestamp}): ${conv.message_content}\n`;
                } else {
                    contextPrompt += `${agentName}: ${conv.message_content.substring(0, 200)}${conv.message_content.length > 200 ? '...' : ''}\n`;
                }
            });
            contextPrompt += '\n';
        });
        
        contextPrompt += '=== FIM DO CONTEXTO COMPARTILHADO ===\n\n';
        return contextPrompt;
    },
    
    /**
     * Obter estatísticas de uso por agente
     * @param {string} userEmail - Email do usuário
     */
    getAgentStats: async function(userEmail) {
        try {
            const conversations = await this.loadAllConversations(userEmail, 1000);
            const stats = {};
            
            conversations.forEach(conv => {
                const agentName = conv.agent_name || 'Desconhecido';
                if (!stats[agentName]) {
                    stats[agentName] = { messages: 0, lastInteraction: null };
                }
                stats[agentName].messages++;
                if (!stats[agentName].lastInteraction || new Date(conv.created_at) > new Date(stats[agentName].lastInteraction)) {
                    stats[agentName].lastInteraction = conv.created_at;
                }
            });
            
            return stats;
        } catch (error) {
            console.error('Erro ao obter estatísticas:', error);
            return {};
        }
    }
};

if (!window.ProsperaMemory.initialized) {
    window.ProsperaMemory.init();
}
