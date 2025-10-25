const API_BASE_URL = '/api';

/**
 * Função auxiliar para fazer requisições HTTP
 */
async function fetchAPI(endpoint, options = {}) {
  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
    ...options,
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error || 'Erro na requisição');
  }

  return data;
}

/**
 * API de Públicos-Alvo
 */
export const audiencesAPI = {
  list: () => fetchAPI('/audiences'),

  get: (id) => fetchAPI(`/audiences/${id}`),

  create: (audience) => fetchAPI('/audiences', {
    method: 'POST',
    body: JSON.stringify(audience),
  }),

  update: (id, audience) => fetchAPI(`/audiences/${id}`, {
    method: 'PUT',
    body: JSON.stringify(audience),
  }),

  delete: (id) => fetchAPI(`/audiences/${id}`, {
    method: 'DELETE',
  }),
};

/**
 * API de Newsletters
 */
export const newslettersAPI = {
  list: (params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    return fetchAPI(`/newsletters${queryString ? `?${queryString}` : ''}`);
  },

  get: (id) => fetchAPI(`/newsletters/${id}`),

  generate: async (formData) => {
    const response = await fetch(`${API_BASE_URL}/newsletters/generate`, {
      method: 'POST',
      body: formData, // FormData não precisa de Content-Type
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || 'Erro ao gerar newsletter');
    }

    return data;
  },

  update: (id, newsletter) => fetchAPI(`/newsletters/${id}`, {
    method: 'PUT',
    body: JSON.stringify(newsletter),
  }),

  delete: (id) => fetchAPI(`/newsletters/${id}`, {
    method: 'DELETE',
  }),
};

/**
 * API de Configurações
 */
export const settingsAPI = {
  get: () => fetchAPI('/settings'),

  update: (settings) => fetchAPI('/settings', {
    method: 'POST',
    body: JSON.stringify(settings),
  }),

  updateSingle: (key, value) => fetchAPI('/settings/single', {
    method: 'POST',
    body: JSON.stringify({ key, value }),
  }),
};

/**
 * API de Health Check
 */
export const healthAPI = {
  check: () => fetchAPI('/health'),
};
