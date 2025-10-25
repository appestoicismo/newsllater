/**
 * Funções utilitárias
 */

/**
 * Formata data para exibição
 */
export function formatDate(dateString) {
  if (!dateString) return '';

  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now - date;
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  // Se foi hoje
  if (diffDays === 0) {
    return 'Hoje';
  }

  // Se foi ontem
  if (diffDays === 1) {
    return 'Ontem';
  }

  // Se foi nos últimos 7 dias
  if (diffDays < 7) {
    return `${diffDays} dias atrás`;
  }

  // Formato padrão
  return date.toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  });
}

/**
 * Formata tamanho de arquivo
 */
export function formatFileSize(bytes) {
  if (bytes === 0) return '0 Bytes';

  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
}

/**
 * Trunca texto
 */
export function truncateText(text, maxLength) {
  if (!text || text.length <= maxLength) return text;
  return text.substring(0, maxLength) + '...';
}

/**
 * Copia texto para área de transferência
 */
export async function copyToClipboard(text) {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch (err) {
    console.error('Erro ao copiar:', err);
    return false;
  }
}

/**
 * Valida tipo de arquivo
 */
export function isValidFileType(file) {
  const validTypes = [
    'application/pdf',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'text/plain',
    'text/markdown'
  ];

  const validExtensions = ['.pdf', '.docx', '.txt', '.md'];
  const extension = file.name.toLowerCase().substring(file.name.lastIndexOf('.'));

  return validTypes.includes(file.type) || validExtensions.includes(extension);
}

/**
 * Extrai primeiras linhas de texto
 */
export function getFirstLines(text, numLines = 3) {
  if (!text) return '';

  const lines = text.split('\n').filter(line => line.trim() !== '');
  return lines.slice(0, numLines).join('\n');
}

/**
 * Debounce function
 */
export function debounce(func, wait) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

/**
 * Valida se string está vazia
 */
export function isEmpty(str) {
  return !str || str.trim().length === 0;
}
