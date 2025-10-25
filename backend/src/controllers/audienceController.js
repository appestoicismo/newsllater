import db from '../database/schema.js';

/**
 * Controller para gerenciamento de públicos-alvo
 */

// Criar novo público-alvo
export function createAudience(req, res) {
  try {
    const { name, description } = req.body;

    if (!name || !description) {
      return res.status(400).json({
        error: 'Nome e descrição são obrigatórios'
      });
    }

    const stmt = db.prepare(`
      INSERT INTO audiences (name, description)
      VALUES (?, ?)
    `);

    const result = stmt.run(name, description);

    const audience = db.prepare('SELECT * FROM audiences WHERE id = ?').get(result.lastInsertRowid);

    res.status(201).json({
      success: true,
      data: audience
    });
  } catch (error) {
    console.error('Erro ao criar público:', error);
    res.status(500).json({
      error: 'Erro ao criar público-alvo'
    });
  }
}

// Listar todos os públicos-alvo
export function listAudiences(req, res) {
  try {
    const audiences = db.prepare(`
      SELECT
        a.*,
        COUNT(n.id) as newsletter_count
      FROM audiences a
      LEFT JOIN newsletters n ON a.id = n.audience_id
      GROUP BY a.id
      ORDER BY a.created_at DESC
    `).all();

    res.json({
      success: true,
      data: audiences
    });
  } catch (error) {
    console.error('Erro ao listar públicos:', error);
    res.status(500).json({
      error: 'Erro ao listar públicos-alvo'
    });
  }
}

// Buscar público específico
export function getAudience(req, res) {
  try {
    const { id } = req.params;

    const audience = db.prepare(`
      SELECT
        a.*,
        COUNT(n.id) as newsletter_count
      FROM audiences a
      LEFT JOIN newsletters n ON a.id = n.audience_id
      WHERE a.id = ?
      GROUP BY a.id
    `).get(id);

    if (!audience) {
      return res.status(404).json({
        error: 'Público-alvo não encontrado'
      });
    }

    res.json({
      success: true,
      data: audience
    });
  } catch (error) {
    console.error('Erro ao buscar público:', error);
    res.status(500).json({
      error: 'Erro ao buscar público-alvo'
    });
  }
}

// Atualizar público-alvo
export function updateAudience(req, res) {
  try {
    const { id } = req.params;
    const { name, description } = req.body;

    if (!name || !description) {
      return res.status(400).json({
        error: 'Nome e descrição são obrigatórios'
      });
    }

    const stmt = db.prepare(`
      UPDATE audiences
      SET name = ?, description = ?
      WHERE id = ?
    `);

    const result = stmt.run(name, description, id);

    if (result.changes === 0) {
      return res.status(404).json({
        error: 'Público-alvo não encontrado'
      });
    }

    const audience = db.prepare('SELECT * FROM audiences WHERE id = ?').get(id);

    res.json({
      success: true,
      data: audience
    });
  } catch (error) {
    console.error('Erro ao atualizar público:', error);
    res.status(500).json({
      error: 'Erro ao atualizar público-alvo'
    });
  }
}

// Deletar público-alvo
export function deleteAudience(req, res) {
  try {
    const { id } = req.params;

    const stmt = db.prepare('DELETE FROM audiences WHERE id = ?');
    const result = stmt.run(id);

    if (result.changes === 0) {
      return res.status(404).json({
        error: 'Público-alvo não encontrado'
      });
    }

    res.json({
      success: true,
      message: 'Público-alvo deletado com sucesso'
    });
  } catch (error) {
    console.error('Erro ao deletar público:', error);
    res.status(500).json({
      error: 'Erro ao deletar público-alvo'
    });
  }
}
