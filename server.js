require('dotenv').config();
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
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
      await pool.query(`
        INSERT INTO users (email, password, name, subscription_level, role) VALUES
        ('explorer@nexialista.com', 'explorer123', 'Explorer User', 'basic', 'member'),
        ('master@nexialista.com', 'master123', 'Master User', 'premium', 'member'),
        ('infinity@nexialista.com', 'infinity123', 'Infinity User', 'vip', 'member'),
        ('demo@nexialista.com', 'demo123', 'Demo User', 'premium', 'member'),
        ('basic@nexialista.com', 'basic123', 'Basic User', 'basic', 'member'),
        ('premium@nexialista.com', 'premium123', 'Premium User', 'premium', 'member'),
        ('vip@nexialista.com', 'vip123', 'VIP User', 'vip', 'member'),
        ('admin@nexialista.com', 'admin123', 'Admin User', 'vip', 'admin'),
        ('yuan@apxconsultoria.com', 'yuan123', 'Yuan', 'vip', 'founder')
      `);
      console.log('✅ Usuários padrão criados com sucesso');
    }

    console.log('✅ Banco de dados inicializado com sucesso');
  } catch (error) {
    console.error('❌ Erro ao inicializar banco de dados:', error);
  }
}

app.get('/api/tables/custom_agents', async (req, res) => {
  try {
    const limit = req.query.limit || 1000;
    const result = await pool.query(
      'SELECT * FROM custom_agents WHERE is_active = true ORDER BY created_at DESC LIMIT $1',
      [limit]
    );
    res.json(result.rows);
  } catch (error) {
    console.error('Erro ao buscar agentes:', error);
    res.status(500).json({ error: error.message });
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
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/tables/custom_agents', async (req, res) => {
  try {
    const {
      id, name, avatar, description, provider, model,
      system_prompt, temperature, max_tokens, knowledge,
      product, accessible_plans, category
    } = req.body;

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
    res.status(500).json({ error: error.message });
  }
});

app.patch('/api/tables/custom_agents/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const updateFields = [];
    const values = [];
    let paramCount = 1;

    Object.keys(req.body).forEach(key => {
      if (key !== 'id') {
        updateFields.push(`${key} = $${paramCount}`);
        values.push(req.body[key]);
        paramCount++;
      }
    });

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
    res.status(500).json({ error: error.message });
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
    res.status(500).json({ error: error.message });
  }
});

app.get('/tables/custom_agents', async (req, res) => {
  try {
    const limit = req.query.limit || 1000;
    const result = await pool.query(
      'SELECT * FROM custom_agents WHERE is_active = true ORDER BY created_at DESC LIMIT $1',
      [limit]
    );
    res.json(result.rows);
  } catch (error) {
    console.error('Erro ao buscar agentes:', error);
    res.status(500).json({ error: error.message });
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
    res.status(500).json({ error: error.message });
  }
});

app.post('/tables/custom_agents', async (req, res) => {
  try {
    const {
      id, name, avatar, description, provider, model,
      system_prompt, temperature, max_tokens, knowledge,
      product, accessible_plans, category
    } = req.body;

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
    res.status(500).json({ error: error.message });
  }
});

app.patch('/tables/custom_agents/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const updateFields = [];
    const values = [];
    let paramCount = 1;

    Object.keys(req.body).forEach(key => {
      if (key !== 'id') {
        updateFields.push(`${key} = $${paramCount}`);
        values.push(req.body[key]);
        paramCount++;
      }
    });

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
    res.status(500).json({ error: error.message });
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
    res.status(500).json({ error: error.message });
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
