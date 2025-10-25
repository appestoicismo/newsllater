import db from '../database/schema.js';
import ClaudeService from '../services/claudeService.js';
import { extractTextFromFile, getFileType } from '../services/fileProcessor.js';
import fs from 'fs/promises';

/**
 * Controller para gerenciamento de newsletters
 */

// Gerar nova newsletter
export async function generateNewsletter(req, res) {
  const uploadedFiles = [];

  try {
    const {
      audience_id,
      audience_description,
      pain_point,
      additional_context,
      source_text
    } = req.body;

    // Validações
    if (!pain_point) {
      return res.status(400).json({
        error: 'Dor da semana é obrigatória'
      });
    }

    let finalAudienceDescription = audience_description;

    // Se forneceu audience_id, buscar a descrição
    if (audience_id) {
      const audience = db.prepare('SELECT * FROM audiences WHERE id = ?').get(audience_id);

      if (!audience) {
        return res.status(404).json({
          error: 'Público-alvo não encontrado'
        });
      }

      finalAudienceDescription = audience.description;

      // Incrementar contador de uso
      db.prepare('UPDATE audiences SET usage_count = usage_count + 1 WHERE id = ?').run(audience_id);
    }

    if (!finalAudienceDescription) {
      return res.status(400).json({
        error: 'Descrição do público-alvo é obrigatória'
      });
    }

    // Processar materiais de conhecimento
    let sourceMaterials = '';

    // Processar arquivos enviados
    if (req.files && req.files.length > 0) {
      const fileContents = [];

      for (const file of req.files) {
        uploadedFiles.push(file.path);
        const fileType = getFileType(file.originalname);
        const content = await extractTextFromFile(file.path, fileType);
        fileContents.push(`[Arquivo: ${file.originalname}]\n${content}\n`);
      }

      sourceMaterials = fileContents.join('\n---\n\n');
    }

    // Adicionar texto colado diretamente
    if (source_text) {
      sourceMaterials += `\n\n[Texto fornecido diretamente]\n${source_text}`;
    }

    if (!sourceMaterials.trim()) {
      return res.status(400).json({
        error: 'É necessário fornecer materiais de conhecimento (arquivos ou texto)'
      });
    }

    // Buscar API key das configurações
    const apiKeySetting = db.prepare('SELECT value FROM settings WHERE key = ?').get('anthropic_api_key');

    if (!apiKeySetting || !apiKeySetting.value) {
      return res.status(400).json({
        error: 'API Key da Anthropic não configurada. Configure em Configurações.'
      });
    }

    // Gerar newsletter usando Claude
    const claudeService = new ClaudeService(apiKeySetting.value);
    const generatedContent = await claudeService.generateNewsletter(
      finalAudienceDescription,
      pain_point,
      additional_context || '',
      sourceMaterials
    );

    // Extrair framework
    const frameworkExtracted = claudeService.extractFramework(generatedContent);

    // Salvar newsletter no banco
    const newsletterStmt = db.prepare(`
      INSERT INTO newsletters
      (audience_id, audience_description, pain_point, additional_context, generated_content, framework_extracted)
      VALUES (?, ?, ?, ?, ?, ?)
    `);

    const result = newsletterStmt.run(
      audience_id || null,
      finalAudienceDescription,
      pain_point,
      additional_context || null,
      generatedContent,
      frameworkExtracted
    );

    const newsletterId = result.lastInsertRowid;

    // Salvar informações dos arquivos fonte
    if (req.files && req.files.length > 0) {
      const fileStmt = db.prepare(`
        INSERT INTO source_files (newsletter_id, file_name, file_type, file_content)
        VALUES (?, ?, ?, ?)
      `);

      for (const file of req.files) {
        const fileType = getFileType(file.originalname);
        const content = await extractTextFromFile(file.path, fileType);
        fileStmt.run(newsletterId, file.originalname, fileType, content);
      }
    }

    // Limpar arquivos temporários
    for (const filePath of uploadedFiles) {
      await fs.unlink(filePath).catch(err => console.error('Erro ao deletar arquivo:', err));
    }

    // Buscar newsletter completa
    const newsletter = db.prepare('SELECT * FROM newsletters WHERE id = ?').get(newsletterId);

    res.status(201).json({
      success: true,
      data: newsletter
    });

  } catch (error) {
    console.error('Erro ao gerar newsletter:', error);

    // Limpar arquivos em caso de erro
    for (const filePath of uploadedFiles) {
      await fs.unlink(filePath).catch(err => console.error('Erro ao deletar arquivo:', err));
    }

    res.status(500).json({
      error: error.message || 'Erro ao gerar newsletter'
    });
  }
}

// Listar newsletters com filtros e paginação
export function listNewsletters(req, res) {
  try {
    const {
      page = 1,
      limit = 10,
      audience_id,
      search
    } = req.query;

    const offset = (parseInt(page) - 1) * parseInt(limit);

    let query = `
      SELECT
        n.*,
        a.name as audience_name
      FROM newsletters n
      LEFT JOIN audiences a ON n.audience_id = a.id
      WHERE 1=1
    `;

    const params = [];

    if (audience_id) {
      query += ' AND n.audience_id = ?';
      params.push(audience_id);
    }

    if (search) {
      query += ' AND (n.pain_point LIKE ? OR n.audience_description LIKE ?)';
      params.push(`%${search}%`, `%${search}%`);
    }

    query += ' ORDER BY n.created_at DESC LIMIT ? OFFSET ?';
    params.push(parseInt(limit), offset);

    const newsletters = db.prepare(query).all(...params);

    // Contar total
    let countQuery = 'SELECT COUNT(*) as total FROM newsletters WHERE 1=1';
    const countParams = [];

    if (audience_id) {
      countQuery += ' AND audience_id = ?';
      countParams.push(audience_id);
    }

    if (search) {
      countQuery += ' AND (pain_point LIKE ? OR audience_description LIKE ?)';
      countParams.push(`%${search}%`, `%${search}%`);
    }

    const { total } = db.prepare(countQuery).get(...countParams);

    res.json({
      success: true,
      data: newsletters,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        totalPages: Math.ceil(total / parseInt(limit))
      }
    });
  } catch (error) {
    console.error('Erro ao listar newsletters:', error);
    res.status(500).json({
      error: 'Erro ao listar newsletters'
    });
  }
}

// Buscar newsletter específica
export function getNewsletter(req, res) {
  try {
    const { id } = req.params;

    const newsletter = db.prepare(`
      SELECT
        n.*,
        a.name as audience_name
      FROM newsletters n
      LEFT JOIN audiences a ON n.audience_id = a.id
      WHERE n.id = ?
    `).get(id);

    if (!newsletter) {
      return res.status(404).json({
        error: 'Newsletter não encontrada'
      });
    }

    // Buscar arquivos fonte
    const sourceFiles = db.prepare(`
      SELECT id, file_name, file_type, uploaded_at
      FROM source_files
      WHERE newsletter_id = ?
    `).all(id);

    res.json({
      success: true,
      data: {
        ...newsletter,
        source_files: sourceFiles
      }
    });
  } catch (error) {
    console.error('Erro ao buscar newsletter:', error);
    res.status(500).json({
      error: 'Erro ao buscar newsletter'
    });
  }
}

// Atualizar newsletter (edição manual)
export function updateNewsletter(req, res) {
  try {
    const { id } = req.params;
    const { generated_content, framework_extracted } = req.body;

    if (!generated_content) {
      return res.status(400).json({
        error: 'Conteúdo é obrigatório'
      });
    }

    const stmt = db.prepare(`
      UPDATE newsletters
      SET generated_content = ?, framework_extracted = ?, updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `);

    const result = stmt.run(generated_content, framework_extracted || null, id);

    if (result.changes === 0) {
      return res.status(404).json({
        error: 'Newsletter não encontrada'
      });
    }

    const newsletter = db.prepare('SELECT * FROM newsletters WHERE id = ?').get(id);

    res.json({
      success: true,
      data: newsletter
    });
  } catch (error) {
    console.error('Erro ao atualizar newsletter:', error);
    res.status(500).json({
      error: 'Erro ao atualizar newsletter'
    });
  }
}

// Deletar newsletter
export function deleteNewsletter(req, res) {
  try {
    const { id } = req.params;

    const stmt = db.prepare('DELETE FROM newsletters WHERE id = ?');
    const result = stmt.run(id);

    if (result.changes === 0) {
      return res.status(404).json({
        error: 'Newsletter não encontrada'
      });
    }

    res.json({
      success: true,
      message: 'Newsletter deletada com sucesso'
    });
  } catch (error) {
    console.error('Erro ao deletar newsletter:', error);
    res.status(500).json({
      error: 'Erro ao deletar newsletter'
    });
  }
}
