const express = require('express');
const cors = require('cors');

const app = express();
const PORT = 3001;

app.use(cors());

app.get('/api/empresa', (req, res) => {
  res.json({
    nome: 'Smarty Entregas',
    descricao: 'Painel simples da empresa',
    endereco: 'Guarapuava - PR',
    telefone: '(42) 99999-9999',
    email: 'contato@smarty.com',
    status: 'Ativa',
    colaboradores: 25,
    entregasMes: 1200
  });
});

app.listen(PORT, () => {
  console.log(`Backend rodando em http://localhost:${PORT}`);
});