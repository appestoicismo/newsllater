# 📧 Newsletter Generator - AppAutoHipnose

Sistema completo para geração de newsletters terapêuticas de alta qualidade usando IA Claude da Anthropic.

## 📋 Sobre o Projeto

O **Newsletter Generator** foi criado especificamente para Alex Dantas, criador da comunidade **AppAutoHipnose**, para automatizar e otimizar a criação de newsletters semanais terapêuticas que mantêm a comunidade engajada e entregam valor real.

### Funcionalidades Principais

✅ **Criação Inteligente de Newsletters**
- Wizard intuitivo em 5 etapas
- Upload de materiais de conhecimento (PDF, DOCX, TXT, MD)
- Processamento automático de arquivos
- Geração de copy profissional usando Claude AI

✅ **Gerenciamento de Públicos-Alvo**
- Salvar públicos reutilizáveis
- Editar e deletar públicos
- Estatísticas de uso

✅ **Histórico Completo**
- Visualizar todas newsletters criadas
- Busca e filtros avançados
- Exportação em TXT
- Duplicação de newsletters

✅ **Interface Profissional**
- Design moderno com Tailwind CSS
- Responsiva e intuitiva
- Animações suaves
- Feedback visual claro

## 🛠️ Stack Tecnológica

### Backend
- **Node.js** - Runtime JavaScript
- **Express** - Framework web
- **SQLite** - Banco de dados
- **Better-SQLite3** - Driver SQLite
- **Multer** - Upload de arquivos
- **PDF-Parse** - Processamento de PDFs
- **Mammoth** - Processamento de DOCX
- **Anthropic Claude API** - Geração de conteúdo IA

### Frontend
- **React 18** - Biblioteca UI
- **Vite** - Build tool
- **React Router** - Roteamento
- **Zustand** - Gerenciamento de estado
- **Tailwind CSS** - Estilização
- **Lucide React** - Ícones

## 📦 Instalação

### Pré-requisitos

- **Node.js** 18+ instalado
- **npm** ou **yarn**
- **Chave API da Anthropic** ([obter aqui](https://console.anthropic.com/))

### Passo 1: Clonar o Repositório

```bash
git clone <URL_DO_REPOSITORIO>
cd newsllater
```

### Passo 2: Instalar Dependências

#### Backend
```bash
cd backend
npm install
```

#### Frontend
```bash
cd ../frontend
npm install
```

### Passo 3: Configurar Variáveis de Ambiente

Edite o arquivo `backend/.env`:

```env
PORT=3001
NODE_ENV=development
ANTHROPIC_API_KEY=sua_chave_api_aqui
DATABASE_PATH=./database.sqlite
MAX_FILE_SIZE=10485760
UPLOAD_DIR=./uploads
```

> **Nota:** Você também pode configurar a API Key pela interface do aplicativo em **Configurações**.

## 🚀 Executando o Projeto

### Desenvolvimento

Abra **dois terminais** separados:

**Terminal 1 - Backend:**
```bash
cd backend
npm run dev
```

O backend estará rodando em: `http://localhost:3001`

**Terminal 2 - Frontend:**
```bash
cd frontend
npm run dev
```

O frontend estará rodando em: `http://localhost:3000`

### Produção

#### Backend:
```bash
cd backend
npm start
```

#### Frontend:
```bash
cd frontend
npm run build
npm run preview
```

## 📖 Como Usar

### 1️⃣ Configuração Inicial

1. Acesse `http://localhost:3000`
2. Vá em **Configurações** (menu lateral)
3. Insira sua **API Key da Anthropic**
4. Configure seu nome de assinatura (padrão: Alex Dantas)
5. Escolha o tom padrão das newsletters
6. Clique em **Salvar Configurações**

### 2️⃣ Criar Primeira Newsletter

1. Clique em **"Criar Nova Newsletter"** no Dashboard
2. **Etapa 1 - Público-Alvo:**
   - Escolha um público salvo OU
   - Crie um novo descrevendo detalhadamente
   - Marque "Salvar este público" para reutilizar depois
3. **Etapa 2 - Dor da Semana:**
   - Descreva a dor emocional específica
   - Adicione contexto adicional (opcional)
4. **Etapa 3 - Upload de Fontes:**
   - Faça upload de PDFs, DOCXs, TXTs ou MDs
   - OU cole texto diretamente
5. **Etapa 4 - Aguarde:** O sistema irá gerar a newsletter (30-60s)
6. **Etapa 5 - Resultado:**
   - Revise a newsletter gerada
   - Copie, edite ou regenere se necessário
   - Clique em **Salvar e Concluir**

### 3️⃣ Gerenciar Públicos

- Acesse **Públicos Salvos** no menu
- Crie, edite ou delete públicos
- Use públicos salvos para agilizar criação de newsletters

### 4️⃣ Visualizar Histórico

- Acesse **Histórico** no menu
- Busque por palavras-chave
- Filtre por público-alvo
- Visualize, duplique ou exporte newsletters antigas

## 🎯 Estrutura das Newsletters Geradas

Cada newsletter segue uma estrutura otimizada em 4 blocos:

**BLOCO 1: TÍTULO IMPACTANTE**
- Curto, direto e emocionalmente poderoso
- Gera curiosidade e promessa de alívio

**BLOCO 2: O QUE ESTÁ ACONTECENDO COM VOCÊ**
- Explicação empática da dor
- Validação emocional
- Contexto psicológico/neurológico

**BLOCO 3: FRAMEWORK PRÁTICO**
- Protocolo passo a passo
- Nome do método criado
- Instruções claras e aplicáveis
- Exemplos práticos

**BLOCO 4: PRÓXIMOS PASSOS E GANCHO**
- Resumo do conteúdo
- Resultado esperado
- Antecipação para próxima newsletter
- Call-to-action suave

## 📁 Estrutura de Pastas

```
newsletter-generator/
├── backend/
│   ├── src/
│   │   ├── controllers/      # Lógica de negócio
│   │   ├── database/          # Schema e configuração do DB
│   │   ├── middleware/        # Middleware (upload, etc)
│   │   ├── routes/            # Rotas da API
│   │   ├── services/          # Serviços (Claude, processamento)
│   │   └── server.js          # Servidor principal
│   ├── uploads/               # Arquivos temporários
│   ├── .env                   # Variáveis de ambiente
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── components/        # Componentes reutilizáveis
│   │   ├── pages/             # Páginas principais
│   │   │   └── create/        # Etapas do wizard
│   │   ├── services/          # API client
│   │   ├── store/             # Gerenciamento de estado
│   │   ├── utils/             # Funções auxiliares
│   │   ├── App.jsx            # Componente principal
│   │   └── main.jsx           # Entry point
│   ├── index.html
│   └── package.json
└── README.md
```

## 🗄️ Banco de Dados

O sistema usa **SQLite** com as seguintes tabelas:

- **audiences** - Públicos-alvo salvos
- **newsletters** - Newsletters criadas
- **source_files** - Arquivos fonte das newsletters
- **settings** - Configurações do sistema

## 🔐 Segurança

- API Key armazenada em variáveis de ambiente
- Validação de tipos de arquivo
- Limite de tamanho de upload (10MB)
- Sanitização de inputs
- Foreign keys habilitadas no SQLite

## 💰 Custos

- Cada newsletter custa aproximadamente **$0.10 - $0.30 USD**
- Você é cobrado diretamente pela Anthropic
- O aplicativo não cobra nada além do uso da API

## 🐛 Solução de Problemas

### Erro: "API Key não configurada"
- Vá em Configurações e insira sua chave API da Anthropic

### Erro ao processar arquivo
- Verifique se o arquivo é PDF, DOCX, TXT ou MD
- Verifique se o arquivo não está corrompido
- Tamanho máximo: 10MB

### Newsletter não gera
- Verifique sua conexão com internet
- Confirme que a API Key está correta
- Verifique se há créditos na sua conta Anthropic

### Banco de dados corrompido
```bash
cd backend
rm database.sqlite
npm start  # Criará novo banco automaticamente
```

## 📝 Exemplos de Uso

### Exemplo de Público-Alvo
```
Mulheres entre 35-50 anos com insônia crônica que já tentaram
remédios naturais como chás e melatonina, mas ainda acordam
frequentemente durante a noite com pensamentos ansiosos sobre
trabalho e família. Geralmente profissionais que trabalham em
período integral e têm filhos.
```

### Exemplo de Dor da Semana
```
Acordar às 3h da manhã e não conseguir voltar a dormir,
entrando em loop de pensamentos sobre tudo que precisa
fazer no dia seguinte, resultando em cansaço extremo e
irritabilidade durante o dia.
```

## 🤝 Contribuindo

Este é um projeto privado para uso da comunidade AppAutoHipnose.

## 📄 Licença

Uso privado - Alex Dantas / AppAutoHipnose

## 👨‍💻 Autor

**Alex Dantas**
Criador do AppAutoHipnose
Especialista em Hipnose Terapêutica

---

## 🆘 Suporte

Para dúvidas ou problemas, entre em contato com o desenvolvedor do sistema.

---

**Versão:** 1.0.0
**Última atualização:** Outubro 2025
