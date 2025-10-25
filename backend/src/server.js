import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { initializeDatabase } from './database/schema.js';

// Importar rotas
import audiencesRouter from './routes/audiences.js';
import newslettersRouter from './routes/newsletters.js';
import settingsRouter from './routes/settings.js';

// Configuração de variáveis de ambiente
dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Inicializar banco de dados
initializeDatabase();

// Criar aplicação Express
const app = express();
const PORT = process.env.PORT || 3001;

// Middlewares
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Logging de requisições em desenvolvimento
if (process.env.NODE_ENV === 'development') {
  app.use((req, res, next) => {
    console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
    next();
  });
}

// Rotas da API
app.use('/api/audiences', audiencesRouter);
app.use('/api/newsletters', newslettersRouter);
app.use('/api/settings', settingsRouter);

// Rota de health check
app.get('/api/health', (req, res) => {
  res.json({
    success: true,
    message: 'Newsletter Generator API está funcionando!',
    timestamp: new Date().toISOString()
  });
});

// Tratamento de rotas não encontradas
app.use((req, res) => {
  res.status(404).json({
    error: 'Rota não encontrada'
  });
});

// Tratamento global de erros
app.use((err, req, res, next) => {
  console.error('Erro não tratado:', err);

  res.status(err.status || 500).json({
    error: err.message || 'Erro interno do servidor'
  });
});

// Iniciar servidor
app.listen(PORT, () => {
  console.log('═══════════════════════════════════════════════════════════');
  console.log('  📧 Newsletter Generator - AppAutoHipnose');
  console.log('═══════════════════════════════════════════════════════════');
  console.log(`  ✅ Servidor rodando na porta ${PORT}`);
  console.log(`  🌐 URL: http://localhost:${PORT}`);
  console.log(`  📊 Ambiente: ${process.env.NODE_ENV || 'development'}`);
  console.log('═══════════════════════════════════════════════════════════');
});

export default app;
