require('dotenv').config();
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const bcrypt = require('bcryptjs');
const { Pool } = require('pg');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 5000;

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false
});

app.use(cors());
app.use(bodyParser.json({ limit: '10mb' }));
app.use(bodyParser.urlencoded({ extended: true, limit: '10mb' }));

app.use((req, res, next) => {
  res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
  res.setHeader('Pragma', 'no-cache');
  res.setHeader('Expires', '0');
  next();
});

async function initDatabase() {
  try {
    await pool.query(`
      CREATE TABLE IF NOT EXISTS custom_agents (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        avatar TEXT,
        description TEXT,
        provider TEXT,
        model TEXT,
        system_prompt TEXT,
        temperature DECIMAL(3,2) DEFAULT 0.7,
        max_tokens INTEGER DEFAULT 2000,
        knowledge TEXT,
        product TEXT,
        accessible_plans TEXT[],
        category TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        is_active BOOLEAN DEFAULT true
      )
    `);

    await pool.query(`
      CREATE TABLE IF NOT EXISTS custom_agents_api_keys (
        id SERIAL PRIMARY KEY,
        provider TEXT NOT NULL UNIQUE,
        api_key TEXT NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    await pool.query(`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        email TEXT NOT NULL UNIQUE,
        password TEXT NOT NULL,
        name TEXT,
        subscription_level TEXT DEFAULT 'basic',
        role TEXT DEFAULT 'member',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    const userCheck = await pool.query('SELECT COUNT(*) FROM users');
    if (parseInt(userCheck.rows[0].count) === 0) {
      const users = [
        { email: 'explorer@nexialista.com', password: 'explorer123', name: 'Explorer User', level: 'basic', role: 'member' },
        { email: 'master@nexialista.com', password: 'master123', name: 'Master User', level: 'premium', role: 'member' },
        { email: 'infinity@nexialista.com', password: 'infinity123', name: 'Infinity User', level: 'vip', role: 'member' },
        { email: 'demo@nexialista.com', password: 'demo123', name: 'Demo User', level: 'premium', role: 'member' },
        { email: 'basic@nexialista.com', password: 'basic123', name: 'Basic User', level: 'basic', role: 'member' },
        { email: 'premium@nexialista.com', password: 'premium123', name: 'Premium User', level: 'premium', role: 'member' },
        { email: 'vip@nexialista.com', password: 'vip123', name: 'VIP User', level: 'vip', role: 'member' },
        { email: 'admin@nexialista.com', password: 'admin123', name: 'Admin User', level: 'vip', role: 'admin' },
        { email: 'yuan@apxconsultoria.com', password: 'yuan123', name: 'Yuan', level: 'vip', role: 'founder' }
      ];

      for (const user of users) {
        const hashedPassword = await bcrypt.hash(user.password, 10);
        await pool.query(
          'INSERT INTO users (email, password, name, subscription_level, role) VALUES ($1, $2, $3, $4, $5)',
          [user.email, hashedPassword, user.name, user.level, user.role]
        );
      }
      console.log('✅ Usuários padrão criados com senhas seguras');
    }

    // Tabela de progresso do método Prospera-IA (sequential unlock)
    await pool.query(`
      CREATE TABLE IF NOT EXISTS prospera_agent_progress (
        id SERIAL PRIMARY KEY,
        user_email TEXT NOT NULL,
        agent_id TEXT NOT NULL,
        status TEXT NOT NULL CHECK (status IN ('locked', 'unlocked', 'completed')),
        unlocked_at TIMESTAMP,
        completed_at TIMESTAMP,
        prerequisite_agent_id TEXT,
        report_snapshot JSONB,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        UNIQUE(user_email, agent_id)
      )
    `);

    // Índices para melhor performance
    await pool.query(`
      CREATE INDEX IF NOT EXISTS idx_prospera_progress_user 
      ON prospera_agent_progress(user_email)
    `);
    
    await pool.query(`
      CREATE INDEX IF NOT EXISTS idx_prospera_progress_agent 
      ON prospera_agent_progress(agent_id)
    `);

    console.log('✅ Banco de dados inicializado com sucesso');
  } catch (error) {
    console.error('❌ Erro ao inicializar banco de dados:', error);
  }
}

const ALLOWED_AGENT_FIELDS = [
  'name', 'avatar', 'description', 'provider', 'model', 
  'system_prompt', 'temperature', 'max_tokens', 'knowledge',
  'product', 'accessible_plans', 'category', 'is_active'
];

app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Email e senha são obrigatórios' });
    }

    const result = await pool.query(
      'SELECT * FROM users WHERE email = $1',
      [email.toLowerCase()]
    );

    if (result.rows.length === 0) {
      return res.status(401).json({ error: 'Email ou senha incorretos' });
    }

    const user = result.rows[0];
    const passwordMatch = await bcrypt.compare(password, user.password);

    if (!passwordMatch) {
      return res.status(401).json({ error: 'Email ou senha incorretos' });
    }

    res.json({
      email: user.email,
      name: user.name,
      subscription_level: user.subscription_level,
      role: user.role
    });
  } catch (error) {
    console.error('Erro ao fazer login:', error);
    res.status(500).json({ error: 'Erro ao processar login' });
  }
});

app.get('/api/tables/custom_agents', async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 1000;
    const result = await pool.query(
      'SELECT * FROM custom_agents WHERE is_active = true ORDER BY created_at DESC LIMIT $1',
      [limit]
    );
    res.json(result.rows);
  } catch (error) {
    console.error('Erro ao buscar agentes:', error);
    res.status(500).json({ error: 'Erro ao buscar agentes' });
  }
});

app.get('/api/tables/custom_agents/:id', async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT * FROM custom_agents WHERE id = $1',
      [req.params.id]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Agente não encontrado' });
    }
    res.json(result.rows[0]);
  } catch (error) {
    console.error('Erro ao buscar agente:', error);
    res.status(500).json({ error: 'Erro ao buscar agente' });
  }
});

app.post('/api/tables/custom_agents', async (req, res) => {
  try {
    const {
      id, name, avatar, description, provider, model,
      system_prompt, temperature, max_tokens, knowledge,
      product, accessible_plans, category
    } = req.body;

    if (!id || !name) {
      return res.status(400).json({ error: 'ID e nome são obrigatórios' });
    }

    const result = await pool.query(
      `INSERT INTO custom_agents 
       (id, name, avatar, description, provider, model, system_prompt, 
        temperature, max_tokens, knowledge, product, accessible_plans, category)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13)
       RETURNING *`,
      [id, name, avatar, description, provider, model, system_prompt,
       temperature || 0.7, max_tokens || 2000, knowledge,
       product, accessible_plans, category]
    );

    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error('Erro ao criar agente:', error);
    if (error.code === '23505') {
      return res.status(409).json({ error: 'Agente com este ID já existe' });
    }
    res.status(500).json({ error: 'Erro ao criar agente' });
  }
});

app.patch('/api/tables/custom_agents/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const updateFields = [];
    const values = [];
    let paramCount = 1;

    Object.keys(req.body).forEach(key => {
      if (ALLOWED_AGENT_FIELDS.includes(key)) {
        updateFields.push(`${key} = $${paramCount}`);
        values.push(req.body[key]);
        paramCount++;
      }
    });

    if (updateFields.length === 0) {
      return res.status(400).json({ error: 'Nenhum campo válido para atualizar' });
    }

    updateFields.push(`updated_at = CURRENT_TIMESTAMP`);
    values.push(id);

    const query = `
      UPDATE custom_agents 
      SET ${updateFields.join(', ')}
      WHERE id = $${paramCount}
      RETURNING *
    `;

    const result = await pool.query(query, values);
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Agente não encontrado' });
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error('Erro ao atualizar agente:', error);
    res.status(500).json({ error: 'Erro ao atualizar agente' });
  }
});

app.delete('/api/tables/custom_agents/:id', async (req, res) => {
  try {
    const result = await pool.query(
      'DELETE FROM custom_agents WHERE id = $1 RETURNING *',
      [req.params.id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Agente não encontrado' });
    }

    res.json({ message: 'Agente excluído com sucesso', agent: result.rows[0] });
  } catch (error) {
    console.error('Erro ao excluir agente:', error);
    res.status(500).json({ error: 'Erro ao excluir agente' });
  }
});

app.get('/tables/custom_agents', async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 1000;
    const result = await pool.query(
      'SELECT * FROM custom_agents WHERE is_active = true ORDER BY created_at DESC LIMIT $1',
      [limit]
    );
    res.json(result.rows);
  } catch (error) {
    console.error('Erro ao buscar agentes:', error);
    res.status(500).json({ error: 'Erro ao buscar agentes' });
  }
});

app.get('/tables/custom_agents/:id', async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT * FROM custom_agents WHERE id = $1',
      [req.params.id]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Agente não encontrado' });
    }
    res.json(result.rows[0]);
  } catch (error) {
    console.error('Erro ao buscar agente:', error);
    res.status(500).json({ error: 'Erro ao buscar agente' });
  }
});

app.post('/tables/custom_agents', async (req, res) => {
  try {
    const {
      id, name, avatar, description, provider, model,
      system_prompt, temperature, max_tokens, knowledge,
      product, accessible_plans, category
    } = req.body;

    if (!id || !name) {
      return res.status(400).json({ error: 'ID e nome são obrigatórios' });
    }

    const result = await pool.query(
      `INSERT INTO custom_agents 
       (id, name, avatar, description, provider, model, system_prompt, 
        temperature, max_tokens, knowledge, product, accessible_plans, category)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13)
       RETURNING *`,
      [id, name, avatar, description, provider, model, system_prompt,
       temperature || 0.7, max_tokens || 2000, knowledge,
       product, accessible_plans, category]
    );

    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error('Erro ao criar agente:', error);
    if (error.code === '23505') {
      return res.status(409).json({ error: 'Agente com este ID já existe' });
    }
    res.status(500).json({ error: 'Erro ao criar agente' });
  }
});

app.patch('/tables/custom_agents/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const updateFields = [];
    const values = [];
    let paramCount = 1;

    Object.keys(req.body).forEach(key => {
      if (ALLOWED_AGENT_FIELDS.includes(key)) {
        updateFields.push(`${key} = $${paramCount}`);
        values.push(req.body[key]);
        paramCount++;
      }
    });

    if (updateFields.length === 0) {
      return res.status(400).json({ error: 'Nenhum campo válido para atualizar' });
    }

    updateFields.push(`updated_at = CURRENT_TIMESTAMP`);
    values.push(id);

    const query = `
      UPDATE custom_agents 
      SET ${updateFields.join(', ')}
      WHERE id = $${paramCount}
      RETURNING *
    `;

    const result = await pool.query(query, values);
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Agente não encontrado' });
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error('Erro ao atualizar agente:', error);
    res.status(500).json({ error: 'Erro ao atualizar agente' });
  }
});

app.delete('/tables/custom_agents/:id', async (req, res) => {
  try {
    const result = await pool.query(
      'DELETE FROM custom_agents WHERE id = $1 RETURNING *',
      [req.params.id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Agente não encontrado' });
    }

    res.json({ message: 'Agente excluído com sucesso', agent: result.rows[0] });
  } catch (error) {
    console.error('Erro ao excluir agente:', error);
    res.status(500).json({ error: 'Erro ao excluir agente' });
  }
});

// API Keys endpoints
app.get('/tables/custom_agents_api_keys', async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT * FROM custom_agents_api_keys ORDER BY provider'
    );
    res.json(result.rows);
  } catch (error) {
    console.error('Erro ao buscar API keys:', error);
    res.status(500).json({ error: 'Erro ao buscar API keys' });
  }
});

app.post('/tables/custom_agents_api_keys', async (req, res) => {
  try {
    const { provider, api_key } = req.body;

    if (!provider || !api_key) {
      return res.status(400).json({ error: 'Provider e API key são obrigatórios' });
    }

    // Use UPSERT to insert or update if provider already exists
    const result = await pool.query(
      `INSERT INTO custom_agents_api_keys (provider, api_key, updated_at)
       VALUES ($1, $2, CURRENT_TIMESTAMP)
       ON CONFLICT (provider) 
       DO UPDATE SET api_key = $2, updated_at = CURRENT_TIMESTAMP
       RETURNING *`,
      [provider, api_key]
    );

    res.json(result.rows[0]);
  } catch (error) {
    console.error('Erro ao salvar API key:', error);
    res.status(500).json({ error: 'Erro ao salvar API key' });
  }
});

// Conversation Memory Endpoints
app.post('/api/conversations', async (req, res) => {
  try {
    const { user_email, agent_id, agent_name, message_type, message_content, product, metadata } = req.body;

    if (!user_email || !agent_id || !message_type || !message_content) {
      return res.status(400).json({ error: 'user_email, agent_id, message_type e message_content são obrigatórios' });
    }

    if (!['user', 'assistant'].includes(message_type)) {
      return res.status(400).json({ error: 'message_type deve ser "user" ou "assistant"' });
    }

    // Validação básica de email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(user_email)) {
      return res.status(400).json({ error: 'Formato de email inválido' });
    }

    // Limitar tamanho da mensagem
    if (message_content.length > 50000) {
      return res.status(400).json({ error: 'Mensagem muito longa (max 50000 caracteres)' });
    }

    const result = await pool.query(
      `INSERT INTO agent_conversations 
       (user_email, agent_id, agent_name, message_type, message_content, product, metadata)
       VALUES ($1, $2, $3, $4, $5, $6, $7)
       RETURNING *`,
      [user_email, agent_id, agent_name, message_type, message_content, product, metadata || {}]
    );

    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error('Erro ao salvar conversa:', error);
    res.status(500).json({ error: 'Erro ao salvar conversa' });
  }
});

app.get('/api/conversations/:user_email', async (req, res) => {
  try {
    const { user_email } = req.params;
    const limit = parseInt(req.query.limit) || 100;

    const result = await pool.query(
      `SELECT * FROM agent_conversations 
       WHERE user_email = $1 
       ORDER BY created_at DESC 
       LIMIT $2`,
      [user_email, limit]
    );

    res.json(result.rows);
  } catch (error) {
    console.error('Erro ao buscar conversas:', error);
    res.status(500).json({ error: 'Erro ao buscar conversas' });
  }
});

app.get('/api/conversations/:user_email/:agent_id', async (req, res) => {
  try {
    const { user_email, agent_id } = req.params;
    const limit = parseInt(req.query.limit) || 50;

    const result = await pool.query(
      `SELECT * FROM agent_conversations 
       WHERE user_email = $1 AND agent_id = $2 
       ORDER BY created_at ASC 
       LIMIT $3`,
      [user_email, agent_id, limit]
    );

    res.json(result.rows);
  } catch (error) {
    console.error('Erro ao buscar conversas do agente:', error);
    res.status(500).json({ error: 'Erro ao buscar conversas do agente' });
  }
});

app.get('/api/shared-context/:user_email', async (req, res) => {
  try {
    const { user_email } = req.params;
    const limit = parseInt(req.query.limit) || 20;
    const product = req.query.product;

    let query = `
      SELECT ac.*, ca.name as agent_name, ca.product 
      FROM agent_conversations ac
      LEFT JOIN custom_agents ca ON ac.agent_id = ca.id
      WHERE ac.user_email = $1
    `;
    const params = [user_email];

    if (product) {
      query += ` AND ca.product = $2`;
      params.push(product);
    }

    query += ` ORDER BY ac.created_at DESC LIMIT $${params.length + 1}`;
    params.push(limit);

    const result = await pool.query(query, params);

    res.json(result.rows);
  } catch (error) {
    console.error('Erro ao buscar contexto compartilhado:', error);
    res.status(500).json({ error: 'Erro ao buscar contexto compartilhado' });
  }
});

// Delete all conversations for a specific user
app.delete('/api/conversations/:user_email', async (req, res) => {
  try {
    const { user_email } = req.params;

    // Validação básica de email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(user_email)) {
      return res.status(400).json({ error: 'Formato de email inválido' });
    }

    const result = await pool.query(
      'DELETE FROM agent_conversations WHERE user_email = $1 RETURNING *',
      [user_email]
    );

    res.json({ 
      success: true, 
      deleted: result.rowCount,
      message: `${result.rowCount} conversas deletadas com sucesso` 
    });
  } catch (error) {
    console.error('Erro ao deletar conversas:', error);
    res.status(500).json({ error: 'Erro ao deletar conversas' });
  }
});

// ========== PROSPERA-IA PROGRESS API ==========

// Helper function to initialize progress for a user
async function initializeProgresoProgress(userEmail, prosperaAgentIds) {
  try {
    // Check if user already has progress
    const existing = await pool.query(
      'SELECT COUNT(*) FROM prospera_agent_progress WHERE user_email = $1',
      [userEmail]
    );

    if (parseInt(existing.rows[0].count) > 0) {
      return { alreadyInitialized: true };
    }

    // Get all prospera-ia agents
    const agentsResult = await pool.query(
      `SELECT id, name FROM custom_agents 
       WHERE product = 'prospera-ia' AND is_active = true`
    );

    if (agentsResult.rows.length === 0) {
      return { error: 'No Prospera-IA agents found' };
    }

    // Helper function to normalize text (remove accents, lowercase, trim)
    const normalize = (text) => {
      return text
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '') // Remove diacritics
        .trim();
    };

    // Sort agents in the correct Prospera-IA method sequence: Oráculo → Alquimista → Nexus → Arquiteto
    const correctOrder = ['oraculo', 'alquimista', 'nexus', 'arquiteto'];
    const agents = agentsResult.rows.sort((a, b) => {
      const aName = normalize(a.name);
      const bName = normalize(b.name);
      
      // Find position in correct order based on keywords
      let posA = correctOrder.findIndex(keyword => aName.includes(keyword));
      let posB = correctOrder.findIndex(keyword => bName.includes(keyword));
      
      // If not found in correct order, place at end
      if (posA === -1) posA = 999;
      if (posB === -1) posB = 999;
      
      return posA - posB;
    });

    // Validate that each of the 4 required agents is present exactly once
    const keywordMap = {
      'oraculo': null,
      'alquimista': null,
      'nexus': null,
      'arquiteto': null
    };

    const duplicates = [];

    agents.forEach(agent => {
      const normalized = normalize(agent.name);
      for (const keyword of correctOrder) {
        if (normalized.includes(keyword)) {
          if (keywordMap[keyword]) {
            // Duplicate found
            duplicates.push({ keyword, agent: agent.name, existing: keywordMap[keyword].name });
          } else {
            keywordMap[keyword] = agent;
          }
          break; // Only match each agent to one keyword
        }
      }
    });

    // Check for duplicates
    if (duplicates.length > 0) {
      return {
        error: 'Duplicate Prospera-IA agents found',
        details: `Each agent must be unique. Duplicates: ${duplicates.map(d => `${d.keyword} (${d.agent} conflicts with ${d.existing})`).join(', ')}`
      };
    }

    // Check if all required agents were found
    const missing = Object.keys(keywordMap).filter(k => !keywordMap[k]);
    if (missing.length > 0) {
      const foundNames = Object.values(keywordMap)
        .filter(a => a)
        .map(a => a.name)
        .join(', ');
      return { 
        error: 'Missing required Prospera-IA agents', 
        details: `Missing keywords: ${missing.join(', ')}. Found: ${foundNames || 'none'}`
      };
    }

    // Build the correct sequence using ONLY the validated agents
    const orderedAgents = correctOrder.map(keyword => keywordMap[keyword]);

    // Initialize progress: first agent unlocked, others locked
    for (let i = 0; i < orderedAgents.length; i++) {
      const agent = orderedAgents[i];
      const isFirst = i === 0;
      const status = isFirst ? 'unlocked' : 'locked';
      const prerequisite = i > 0 ? orderedAgents[i - 1].id : null;

      await pool.query(
        `INSERT INTO prospera_agent_progress 
         (user_email, agent_id, status, prerequisite_agent_id, unlocked_at) 
         VALUES ($1, $2, $3, $4, $5)
         ON CONFLICT (user_email, agent_id) DO NOTHING`,
        [userEmail, agent.id, status, prerequisite, isFirst ? new Date() : null]
      );
    }

    return { initialized: true, agentCount: agents.length };
  } catch (error) {
    console.error('Error initializing prospera progress:', error);
    throw error;
  }
}

// GET /api/prospera/progress/:email - Get user's Prospera-IA progress
app.get('/api/prospera/progress/:email', async (req, res) => {
  try {
    const { email } = req.params;

    // Validação básica de email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ error: 'Formato de email inválido' });
    }

    // Check if progress exists, if not initialize it
    const checkProgress = await pool.query(
      'SELECT COUNT(*) FROM prospera_agent_progress WHERE user_email = $1',
      [email]
    );

    if (parseInt(checkProgress.rows[0].count) === 0) {
      // Initialize progress for this user
      const initResult = await initializeProgresoProgress(email);
      if (initResult.error) {
        return res.status(500).json({ error: initResult.error, details: 'Failed to initialize Prospera progress' });
      }
    }

    // Get progress with agent details
    const result = await pool.query(
      `SELECT 
        pap.*,
        ca.name as agent_name,
        ca.avatar as agent_avatar,
        ca.description as agent_description,
        ca.product as agent_product,
        ca.category as agent_category
       FROM prospera_agent_progress pap
       LEFT JOIN custom_agents ca ON pap.agent_id = ca.id
       WHERE pap.user_email = $1
       ORDER BY pap.created_at ASC`,
      [email]
    );

    res.json(result.rows);
  } catch (error) {
    console.error('Erro ao buscar progresso Prospera:', error);
    res.status(500).json({ error: 'Erro ao buscar progresso' });
  }
});

// POST /api/prospera/progress/complete - Mark agent as completed and unlock next
app.post('/api/prospera/progress/complete', async (req, res) => {
  try {
    const { user_email, agent_id, report_summary } = req.body;

    if (!user_email || !agent_id) {
      return res.status(400).json({ error: 'user_email e agent_id são obrigatórios' });
    }

    // Validação básica de email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(user_email)) {
      return res.status(400).json({ error: 'Formato de email inválido' });
    }

    // Start transaction
    const client = await pool.connect();
    try {
      await client.query('BEGIN');

      // Mark current agent as completed
      const updateResult = await client.query(
        `UPDATE prospera_agent_progress 
         SET status = 'completed', 
             completed_at = CURRENT_TIMESTAMP,
             report_snapshot = $1,
             updated_at = CURRENT_TIMESTAMP
         WHERE user_email = $2 AND agent_id = $3
         RETURNING *`,
        [report_summary ? JSON.stringify({ summary: report_summary, timestamp: new Date() }) : null, user_email, agent_id]
      );

      if (updateResult.rows.length === 0) {
        await client.query('ROLLBACK');
        return res.status(404).json({ error: 'Progress record not found' });
      }

      // Find and unlock next agent
      const nextAgent = await client.query(
        `SELECT * FROM prospera_agent_progress 
         WHERE user_email = $1 AND prerequisite_agent_id = $2 AND status = 'locked'
         LIMIT 1`,
        [user_email, agent_id]
      );

      let unlockedNext = null;
      if (nextAgent.rows.length > 0) {
        const unlockResult = await client.query(
          `UPDATE prospera_agent_progress 
           SET status = 'unlocked', 
               unlocked_at = CURRENT_TIMESTAMP,
               updated_at = CURRENT_TIMESTAMP
           WHERE id = $1
           RETURNING *`,
          [nextAgent.rows[0].id]
        );
        unlockedNext = unlockResult.rows[0];
      }

      await client.query('COMMIT');

      res.json({
        success: true,
        completed: updateResult.rows[0],
        unlockedNext: unlockedNext,
        message: unlockedNext 
          ? `Agente completado! Próximo agente desbloqueado.` 
          : `Agente completado! Você finalizou o método Prospera-IA.`
      });
    } catch (error) {
      await client.query('ROLLBACK');
      throw error;
    } finally {
      client.release();
    }
  } catch (error) {
    console.error('Erro ao completar agente:', error);
    res.status(500).json({ error: 'Erro ao completar agente' });
  }
});

// POST /api/prospera/progress/init - Manually initialize progress (admin/debug)
app.post('/api/prospera/progress/init', async (req, res) => {
  try {
    const { user_email } = req.body;

    if (!user_email) {
      return res.status(400).json({ error: 'user_email é obrigatório' });
    }

    // Validação básica de email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(user_email)) {
      return res.status(400).json({ error: 'Formato de email inválido' });
    }

    const result = await initializeProgresoProgress(user_email);
    res.json(result);
  } catch (error) {
    console.error('Erro ao inicializar progresso:', error);
    res.status(500).json({ error: 'Erro ao inicializar progresso' });
  }
});

app.use(express.static('.'));

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

app.get('*', (req, res, next) => {
  if (req.path.startsWith('/api') || req.path.startsWith('/tables')) {
    return next();
  }
  const filePath = path.join(__dirname, req.path);
  res.sendFile(filePath, (err) => {
    if (err) {
      res.sendFile(path.join(__dirname, 'index.html'));
    }
  });
});

initDatabase().then(() => {
  app.listen(PORT, '0.0.0.0', () => {
    console.log(`🚀 Servidor rodando em http://0.0.0.0:${PORT}`);
    console.log(`📊 Banco de dados conectado`);
    console.log(`✨ Academia Nexialista iniciada com sucesso!`);
  });
});
