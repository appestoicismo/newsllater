import Database from 'better-sqlite3';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Configuração do banco de dados
const dbPath = process.env.DATABASE_PATH || path.join(__dirname, '../../database.sqlite');
const db = new Database(dbPath);

// Habilitar foreign keys
db.pragma('foreign_keys = ON');

/**
 * Inicializa o schema do banco de dados
 */
export function initializeDatabase() {
  // Tabela de públicos-alvo
  db.exec(`
    CREATE TABLE IF NOT EXISTS audiences (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      description TEXT NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      usage_count INTEGER DEFAULT 0
    )
  `);

  // Tabela de newsletters
  db.exec(`
    CREATE TABLE IF NOT EXISTS newsletters (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      audience_id INTEGER,
      audience_description TEXT NOT NULL,
      pain_point TEXT NOT NULL,
      additional_context TEXT,
      generated_content TEXT NOT NULL,
      framework_extracted TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (audience_id) REFERENCES audiences(id) ON DELETE SET NULL
    )
  `);

  // Tabela de arquivos fonte
  db.exec(`
    CREATE TABLE IF NOT EXISTS source_files (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      newsletter_id INTEGER NOT NULL,
      file_name TEXT NOT NULL,
      file_type TEXT NOT NULL,
      file_content TEXT NOT NULL,
      uploaded_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (newsletter_id) REFERENCES newsletters(id) ON DELETE CASCADE
    )
  `);

  // Tabela de configurações
  db.exec(`
    CREATE TABLE IF NOT EXISTS settings (
      key TEXT PRIMARY KEY,
      value TEXT NOT NULL
    )
  `);

  // Criar índices para melhor performance
  db.exec(`
    CREATE INDEX IF NOT EXISTS idx_newsletters_created_at ON newsletters(created_at DESC);
    CREATE INDEX IF NOT EXISTS idx_newsletters_audience_id ON newsletters(audience_id);
    CREATE INDEX IF NOT EXISTS idx_source_files_newsletter_id ON source_files(newsletter_id);
  `);

  // Inserir configurações padrão se não existirem
  const settingsStmt = db.prepare('INSERT OR IGNORE INTO settings (key, value) VALUES (?, ?)');
  settingsStmt.run('signature_name', 'Alex Dantas');
  settingsStmt.run('default_tone', 'equilibrado');
  settingsStmt.run('anthropic_api_key', '');

  console.log('✅ Database initialized successfully');
}

export default db;
