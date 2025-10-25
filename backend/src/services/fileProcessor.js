import fs from 'fs/promises';
import pdfParse from 'pdf-parse';
import mammoth from 'mammoth';

/**
 * Extrai texto de arquivo baseado no tipo
 * @param {string} filePath - Caminho do arquivo
 * @param {string} fileType - Tipo do arquivo (pdf, docx, txt, md)
 * @returns {Promise<string>} - Texto extraído
 */
export async function extractTextFromFile(filePath, fileType) {
  try {
    switch (fileType.toLowerCase()) {
      case 'pdf':
        return await extractFromPDF(filePath);

      case 'docx':
        return await extractFromDOCX(filePath);

      case 'txt':
      case 'md':
        return await extractFromText(filePath);

      default:
        throw new Error(`Tipo de arquivo não suportado: ${fileType}`);
    }
  } catch (error) {
    console.error(`Erro ao processar arquivo ${filePath}:`, error);
    throw new Error(`Falha ao processar arquivo: ${error.message}`);
  }
}

/**
 * Extrai texto de arquivo PDF
 */
async function extractFromPDF(filePath) {
  const dataBuffer = await fs.readFile(filePath);
  const data = await pdfParse(dataBuffer);
  return cleanText(data.text);
}

/**
 * Extrai texto de arquivo DOCX
 */
async function extractFromDOCX(filePath) {
  const buffer = await fs.readFile(filePath);
  const result = await mammoth.extractRawText({ buffer });
  return cleanText(result.value);
}

/**
 * Extrai texto de arquivo TXT ou MD
 */
async function extractFromText(filePath) {
  const content = await fs.readFile(filePath, 'utf-8');
  return cleanText(content);
}

/**
 * Limpa e normaliza o texto extraído
 */
function cleanText(text) {
  return text
    .replace(/\r\n/g, '\n') // Normalizar quebras de linha
    .replace(/\n{3,}/g, '\n\n') // Remover múltiplas quebras de linha
    .replace(/\t/g, ' ') // Substituir tabs por espaços
    .replace(/ {2,}/g, ' ') // Remover múltiplos espaços
    .trim();
}

/**
 * Valida se o arquivo é de um tipo aceito
 */
export function isValidFileType(mimetype, filename) {
  const validTypes = [
    'application/pdf',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'text/plain',
    'text/markdown'
  ];

  const validExtensions = ['.pdf', '.docx', '.txt', '.md'];
  const extension = filename.toLowerCase().substring(filename.lastIndexOf('.'));

  return validTypes.includes(mimetype) || validExtensions.includes(extension);
}

/**
 * Obtém o tipo de arquivo a partir da extensão
 */
export function getFileType(filename) {
  const extension = filename.toLowerCase().substring(filename.lastIndexOf('.') + 1);

  const typeMap = {
    'pdf': 'pdf',
    'docx': 'docx',
    'txt': 'txt',
    'md': 'md'
  };

  return typeMap[extension] || 'unknown';
}
