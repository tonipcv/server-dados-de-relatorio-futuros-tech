const express = require('express');
const { PrismaClient, Decimal } = require('@prisma/client');

const app = express();
const prisma = new PrismaClient();
app.use(express.json());

const PORT = 3000;

// Adicionar função de cleanup
async function cleanup() {
  await prisma.$disconnect();
  process.exit();
}

process.on('SIGINT', cleanup);
process.on('SIGTERM', cleanup);

// Adicione este código logo após criar o prisma client para testar a conexão
prisma.$connect()
  .then(() => console.log('Conectado ao banco de dados com sucesso'))
  .catch((error) => console.error('Erro ao conectar ao banco:', error));

// Rotas CRUD para o modelo `trade`

// CREATE - Criar um novo trade
app.post('/api/trades', async (req, res) => {
  const { data, ativo, direcao, percentual, alvo } = req.body;
  try {
    const trade = await prisma.trade.create({
      data: {
        data: new Date(data),
        ativo,
        direcao,
        percentual: new Decimal(percentual),
        alvo,
      },
    });
    res.json(trade);
  } catch (error) {
    res.status(400).json({ error: 'Erro ao criar o trade' });
  }
});

// READ - Listar todos os trades
app.get('/api/trades', async (req, res) => {
  try {
    const trades = await prisma.trade.findMany();
    console.log('Trades encontrados:', trades);
    res.json(trades);
  } catch (error) {
    console.error('Erro ao buscar trades:', error);
    res.status(500).json({ error: 'Erro ao buscar trades' });
  }
});

// READ by ID - Buscar um trade específico pelo ID
app.get('/api/trades/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const trade = await prisma.trade.findUnique({ where: { id: parseInt(id) } });
    if (trade) res.json(trade);
    else res.status(404).json({ error: 'Trade não encontrado' });
  } catch (error) {
    res.status(400).json({ error: 'Erro ao buscar o trade' });
  }
});

// UPDATE - Atualizar um trade pelo ID
app.put('/api/trades/:id', async (req, res) => {
  const { id } = req.params;
  const { data, ativo, direcao, percentual, alvo } = req.body;
  try {
    const trade = await prisma.trade.update({
      where: { id: parseInt(id) },
      data: {
        data: new Date(data),
        ativo,
        direcao,
        percentual: new Decimal(percentual),
        alvo,
        updatedAt: new Date(),
      },
    });
    res.json(trade);
  } catch (error) {
    res.status(400).json({ error: 'Erro ao atualizar o trade' });
  }
});

// DELETE - Excluir um trade pelo ID
app.delete('/api/trades/:id', async (req, res) => {
  const { id } = req.params;
  try {
    await prisma.trade.delete({ where: { id: parseInt(id) } });
    res.json({ message: 'Trade excluído com sucesso' });
  } catch (error) {
    res.status(400).json({ error: 'Erro ao excluir o trade' });
  }
});

// Iniciar o servidor
app.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);
});
