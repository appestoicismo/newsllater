import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, FileText } from 'lucide-react';
import useStore from '../store/useStore';
import { newslettersAPI } from '../services/api';
import NewsletterCard from '../components/NewsletterCard';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorMessage from '../components/ErrorMessage';
import EmptyState from '../components/EmptyState';
import { debounce } from '../utils/helpers';

/**
 * Página de Histórico Completo
 */
function History() {
  const navigate = useNavigate();
  const { newsletters, setNewsletters, audiences } = useStore();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({
    search: '',
    audience_id: '',
  });
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 20,
    total: 0,
    totalPages: 0,
  });

  useEffect(() => {
    loadNewsletters();
  }, [filters, pagination.page]);

  const loadNewsletters = async () => {
    try {
      setLoading(true);
      const params = {
        page: pagination.page,
        limit: pagination.limit,
        ...filters,
      };

      // Remover filtros vazios
      Object.keys(params).forEach(key => {
        if (!params[key]) delete params[key];
      });

      const response = await newslettersAPI.list(params);
      setNewsletters(response.data);
      setPagination(prev => ({ ...prev, ...response.pagination }));
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = debounce((value) => {
    setFilters(prev => ({ ...prev, search: value }));
    setPagination(prev => ({ ...prev, page: 1 }));
  }, 500);

  const handleView = (newsletter) => {
    navigate(`/newsletter/${newsletter.id}`);
  };

  const handleDuplicate = (newsletter) => {
    navigate('/create', { state: { duplicateFrom: newsletter } });
  };

  const handleDelete = async (newsletter) => {
    if (!confirm('Tem certeza que deseja deletar esta newsletter?')) return;

    try {
      await newslettersAPI.delete(newsletter.id);
      loadNewsletters();
    } catch (err) {
      setError(err.message);
    }
  };

  const handlePageChange = (newPage) => {
    setPagination(prev => ({ ...prev, page: newPage }));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="animate-fadeIn">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Histórico Completo</h1>
        <p className="text-gray-600 mt-1">
          Visualize e gerencie todas as newsletters criadas
        </p>
      </div>

      {/* Filtros */}
      <div className="card mb-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="label">Buscar</label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Buscar por dor ou público-alvo..."
                onChange={(e) => handleSearch(e.target.value)}
                className="input-field pl-10"
              />
            </div>
          </div>

          <div>
            <label className="label">Filtrar por Público</label>
            <select
              value={filters.audience_id}
              onChange={(e) => {
                setFilters(prev => ({ ...prev, audience_id: e.target.value }));
                setPagination(prev => ({ ...prev, page: 1 }));
              }}
              className="input-field"
            >
              <option value="">Todos os públicos</option>
              {audiences.map((audience) => (
                <option key={audience.id} value={audience.id}>
                  {audience.name}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      <ErrorMessage message={error} onDismiss={() => setError(null)} />

      {/* Lista de newsletters */}
      {loading ? (
        <LoadingSpinner message="Carregando newsletters..." />
      ) : newsletters.length === 0 ? (
        <div className="card">
          <EmptyState
            icon={FileText}
            title="Nenhuma newsletter encontrada"
            description={
              filters.search || filters.audience_id
                ? 'Tente ajustar os filtros de busca.'
                : 'Você ainda não criou nenhuma newsletter.'
            }
          />
        </div>
      ) : (
        <>
          <div className="mb-4 text-sm text-gray-600">
            Mostrando {newsletters.length} de {pagination.total} newsletter(s)
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            {newsletters.map((newsletter) => (
              <NewsletterCard
                key={newsletter.id}
                newsletter={newsletter}
                onView={handleView}
                onDuplicate={handleDuplicate}
                onDelete={handleDelete}
              />
            ))}
          </div>

          {/* Paginação */}
          {pagination.totalPages > 1 && (
            <div className="flex items-center justify-center gap-2">
              <button
                onClick={() => handlePageChange(pagination.page - 1)}
                disabled={pagination.page === 1}
                className="btn-secondary disabled:opacity-50"
              >
                Anterior
              </button>

              <span className="text-sm text-gray-600 mx-4">
                Página {pagination.page} de {pagination.totalPages}
              </span>

              <button
                onClick={() => handlePageChange(pagination.page + 1)}
                disabled={pagination.page === pagination.totalPages}
                className="btn-secondary disabled:opacity-50"
              >
                Próxima
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}

export default History;
