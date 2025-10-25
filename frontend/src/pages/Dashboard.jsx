import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, FileText } from 'lucide-react';
import useStore from '../store/useStore';
import { newslettersAPI } from '../services/api';
import NewsletterCard from '../components/NewsletterCard';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorMessage from '../components/ErrorMessage';
import EmptyState from '../components/EmptyState';

/**
 * Página Dashboard - Tela principal
 */
function Dashboard() {
  const navigate = useNavigate();
  const { newsletters, setNewsletters } = useStore();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadNewsletters();
  }, []);

  const loadNewsletters = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await newslettersAPI.list({ limit: 10 });
      setNewsletters(response.data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleView = (newsletter) => {
    navigate(`/newsletter/${newsletter.id}`);
  };

  const handleDuplicate = (newsletter) => {
    // Preencher wizard com dados da newsletter
    navigate('/create', { state: { duplicateFrom: newsletter } });
  };

  const handleDelete = async (newsletter) => {
    if (!confirm('Tem certeza que deseja deletar esta newsletter?')) return;

    try {
      await newslettersAPI.delete(newsletter.id);
      setNewsletters(newsletters.filter(n => n.id !== newsletter.id));
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="animate-fadeIn">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-600 mt-1">
            Gerencie suas newsletters terapêuticas
          </p>
        </div>
        <button
          onClick={() => navigate('/create')}
          className="btn-primary flex items-center gap-2 px-6 py-3 text-lg"
        >
          <Plus className="w-5 h-5" />
          Criar Nova Newsletter
        </button>
      </div>

      <ErrorMessage message={error} onDismiss={() => setError(null)} />

      {/* Conteúdo */}
      {loading ? (
        <LoadingSpinner message="Carregando newsletters..." />
      ) : newsletters.length === 0 ? (
        <div className="card">
          <EmptyState
            icon={FileText}
            title="Nenhuma newsletter criada ainda"
            description="Comece criando sua primeira newsletter terapêutica para a comunidade AppAutoHipnose."
            action={
              <button
                onClick={() => navigate('/create')}
                className="btn-primary"
              >
                <Plus className="w-4 h-4 inline mr-2" />
                Criar Primeira Newsletter
              </button>
            }
          />
        </div>
      ) : (
        <>
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            Últimas Newsletters
          </h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
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
        </>
      )}
    </div>
  );
}

export default Dashboard;
