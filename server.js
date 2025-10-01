
const express = require('express');
const path = require('path');
const app = express();
const PORT = process.env.PORT || 5000;

// Servir arquivos estáticos
app.use(express.static(path.join(__dirname, '.')));

// Rota principal
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// Iniciar servidor
app.listen(PORT, '0.0.0.0', () => {
    console.log(`🚀 Servidor rodando na porta ${PORT}`);
    console.log(`📱 Acesse: http://localhost:${PORT}`);
});
