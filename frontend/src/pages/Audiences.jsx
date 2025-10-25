import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Users, Edit2, Trash2, Play } from 'lucide-react';
import useStore from '../store/useStore';
import { audiencesAPI } from '../services/api';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorMessage from '../components/ErrorMessage';
import SuccessMessage from '../components/SuccessMessage';
import EmptyState from '../components/EmptyState';
import { formatDate } from '../utils/helpers';

/**
 * Página de Públicos Salvos
 */
function Audiences() {
  const navigate = useNavigate();
  const { audiences, setAudiences, removeAudience } = useStore();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [editingAudience, setEditingAudience] = useState(null);
  const [formData, setFormData] = useState({ name: '', description: '' });

  useEffect(() => {
    loadAudiences();
  }, []);

  const loadAudiences = async () => {
    try {
      setLoading(true);
      const response = await audiencesAPI.list();
      setAudiences(response.data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = () => {
    setEditingAudience(null);
    setFormData({ name: '', description: '' });
    setShowModal(true);
  };

  const handleEdit = (audience) => {
    setEditingAudience(audience);
    setFormData({
      name: audience.name,
      description: audience.description,
    });
    setShowModal(true);
  };

  const handleDelete = async (audience) => {
    if (!confirm(`Tem certeza que deseja deletar "${audience.name}"?`)) return;

    try {
      await audiencesAPI.delete(audience.id);
      removeAudience(audience.id);
      setSuccess('Público deletado com sucesso');
    } catch (err) {
      setError(err.message);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.name.trim() || !formData.description.trim()) {
      setError('Preencha todos os campos');
      return;
    }

    try {
      if (editingAudience) {
        const response = await audiencesAPI.update(editingAudience.id, formData);
        setSuccess('Público atualizado com sucesso');
      } else {
        await audiencesAPI.create(formData);
        setSuccess('Público criado com sucesso');
      }

      setShowModal(false);
      loadAudiences();
    } catch (err) {
      setError(err.message);
    }
  };

  const handleUseNow = (audience) => {
    navigate('/create', { state: { selectedAudience: audience } });
  };

  return (
    <div className="animate-fadeIn">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Públicos Salvos</h1>
          <p className="text-gray-600 mt-1">
            Gerencie seus públicos-alvo reutilizáveis
          </p>
        </div>
        <button onClick={handleCreate} className="btn-primary flex items-center gap-2">
          <Plus className="w-5 h-5" />
          Criar Novo Público
        </button>
      </div>

      <ErrorMessage message={error} onDismiss={() => setError(null)} />
      <SuccessMessage message={success} onDismiss={() => setSuccess(null)} />

      {/* Lista de públicos */}
      {loading ? (
        <LoadingSpinner message="Carregando públicos..." />
      ) : audiences.length === 0 ? (
        <div className="card">
          <EmptyState
            icon={Users}
            title="Nenhum público salvo"
            description="Crie públicos-alvo reutilizáveis para agilizar a criação de newsletters."
            action={
              <button onClick={handleCreate} className="btn-primary">
                <Plus className="w-4 h-4 inline mr-2" />
                Criar Primeiro Público
              </button>
            }
          />
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {audiences.map((audience) => (
            <div key={audience.id} className="card hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between mb-3">
                <h3 className="text-xl font-semibold text-gray-900">
                  {audience.name}
                </h3>
                <span className="bg-primary-100 text-primary-700 text-xs font-medium px-2.5 py-1 rounded">
                  {audience.newsletter_count || 0} newsletter(s)
                </span>
              </div>

              <p className="text-gray-700 mb-4">{audience.description}</p>

              <div className="text-sm text-gray-500 mb-4">
                Criado em {formatDate(audience.created_at)}
              </div>

              <div className="flex gap-2 pt-4 border-t border-gray-200">
                <button
                  onClick={() => handleUseNow(audience)}
                  className="flex-1 btn-primary text-sm"
                >
                  <Play className="w-4 h-4 inline mr-1" />
                  Usar Agora
                </button>
                <button
                  onClick={() => handleEdit(audience)}
                  className="btn-secondary text-sm px-3"
                  title="Editar"
                >
                  <Edit2 className="w-4 h-4" />
                </button>
                <button
                  onClick={() => handleDelete(audience)}
                  className="btn-secondary text-sm px-3 text-red-600 hover:bg-red-50"
                  title="Deletar"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal de criação/edição */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-2xl w-full p-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              {editingAudience ? 'Editar Público' : 'Criar Novo Público'}
            </h2>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="label">Nome do Público *</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Ex: Mulheres com Insônia Crônica"
                  className="input-field"
                />
              </div>

              <div>
                <label className="label">Descrição Detalhada *</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Descreva o público-alvo em detalhes: idade, gênero, problemas, contexto..."
                  rows={6}
                  className="input-field resize-none"
                />
              </div>

              <div className="flex gap-3 justify-end pt-4">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="btn-secondary"
                >
                  Cancelar
                </button>
                <button type="submit" className="btn-primary">
                  {editingAudience ? 'Salvar Alterações' : 'Criar Público'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default Audiences;
