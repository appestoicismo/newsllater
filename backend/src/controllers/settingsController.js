import db from '../database/schema.js';

/**
 * Controller para gerenciamento de configurações
 */

// Buscar todas as configurações
export function getSettings(req, res) {
  try {
    const settings = db.prepare('SELECT * FROM settings').all();

    // Converter array em objeto
    const settingsObject = settings.reduce((acc, { key, value }) => {
      acc[key] = value;
      return acc;
    }, {});

    res.json({
      success: true,
      data: settingsObject
    });
  } catch (error) {
    console.error('Erro ao buscar configurações:', error);
    res.status(500).json({
      error: 'Erro ao buscar configurações'
    });
  }
}

// Atualizar configuração
export function updateSetting(req, res) {
  try {
    const { key, value } = req.body;

    if (!key || value === undefined) {
      return res.status(400).json({
        error: 'Chave e valor são obrigatórios'
      });
    }

    const stmt = db.prepare(`
      INSERT INTO settings (key, value)
      VALUES (?, ?)
      ON CONFLICT(key) DO UPDATE SET value = excluded.value
    `);

    stmt.run(key, value);

    res.json({
      success: true,
      message: 'Configuração atualizada com sucesso'
    });
  } catch (error) {
    console.error('Erro ao atualizar configuração:', error);
    res.status(500).json({
      error: 'Erro ao atualizar configuração'
    });
  }
}

// Atualizar múltiplas configurações de uma vez
export function updateSettings(req, res) {
  try {
    const settings = req.body;

    if (!settings || typeof settings !== 'object') {
      return res.status(400).json({
        error: 'Formato inválido de configurações'
      });
    }

    const stmt = db.prepare(`
      INSERT INTO settings (key, value)
      VALUES (?, ?)
      ON CONFLICT(key) DO UPDATE SET value = excluded.value
    `);

    // Usar transação para garantir atomicidade
    const updateMany = db.transaction((settingsObj) => {
      for (const [key, value] of Object.entries(settingsObj)) {
        stmt.run(key, String(value));
      }
    });

    updateMany(settings);

    res.json({
      success: true,
      message: 'Configurações atualizadas com sucesso'
    });
  } catch (error) {
    console.error('Erro ao atualizar configurações:', error);
    res.status(500).json({
      error: 'Erro ao atualizar configurações'
    });
  }
}
