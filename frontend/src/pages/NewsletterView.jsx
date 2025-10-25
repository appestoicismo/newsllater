import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Copy, Download, Edit, Trash2 } from 'lucide-react';
import { newslettersAPI } from '../services/api';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorMessage from '../components/ErrorMessage';
import SuccessMessage from '../components/SuccessMessage';
import { formatDate, copyToClipboard } from '../utils/helpers';

/**
 * Página de visualização de newsletter individual
 */
function NewsletterView() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [newsletter, setNewsletter] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [activeTab, setActiveTab] = useState('content');

  useEffect(() => {
    loadNewsletter();
  }, [id]);

  const loadNewsletter = async () => {
    try {
      setLoading(true);
      const response = await newslettersAPI.get(id);
      setNewsletter(response.data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = async () => {
    const copied = await copyToClipboard(newsletter.generated_content);
    if (copied) {
      setSuccess('Newsletter copiada para área de transferência!');
    } else {
      setError('Erro ao copiar newsletter');
    }
  };

  const handleDownload = () => {
    const element = document.createElement('a');
    const file = new Blob([newsletter.generated_content], { type: 'text/plain' });
    element.href = URL.createObjectURL(file);
    element.download = `newsletter-${newsletter.id}.txt`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
    setSuccess('Newsletter exportada com sucesso!');
  };

  const handleDelete = async () => {
    if (!confirm('Tem certeza que deseja deletar esta newsletter?')) return;

    try {
      await newslettersAPI.delete(id);
      navigate('/', { state: { message: 'Newsletter deletada com sucesso' } });
    } catch (err) {
      setError(err.message);
    }
  };

  if (loading) {
    return <LoadingSpinner message="Carregando newsletter..." />;
  }

  if (error && !newsletter) {
    return (
      <div>
        <button
          onClick={() => navigate('/')}
          className="flex items-center text-gray-600 hover:text-gray-900 mb-4"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Voltar
        </button>
        <ErrorMessage message={error} />
      </div>
    );
  }

  if (!newsletter) {
    return null;
  }

  const tabs = [
    { id: 'content', label: 'Conteúdo' },
    { id: 'details', label: 'Detalhes' },
    { id: 'files', label: `Arquivos (${newsletter.source_files?.length || 0})` },
  ];

  return (
    <div className="max-w-5xl mx-auto animate-fadeIn">
      {/* Header */}
      <div className="mb-6">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center text-gray-600 hover:text-gray-900 mb-4"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Voltar
        </button>

        <div className="flex items-start justify-between">
          <div className="flex-1">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              {newsletter.pain_point}
            </h1>
            <div className="flex items-center gap-4 text-sm text-gray-600">
              <span>{formatDate(newsletter.created_at)}</span>
              {newsletter.audience_name && (
                <>
                  <span>•</span>
                  <span className="text-primary-600">{newsletter.audience_name}</span>
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      <ErrorMessage message={error} onDismiss={() => setError(null)} />
      <SuccessMessage message={success} onDismiss={() => setSuccess(null)} />

      {/* Ações */}
      <div className="flex gap-3 mb-6">
        <button onClick={handleCopy} className="btn-primary flex items-center gap-2">
          <Copy className="w-4 h-4" />
          Copiar
        </button>
        <button onClick={handleDownload} className="btn-secondary flex items-center gap-2">
          <Download className="w-4 h-4" />
          Exportar TXT
        </button>
        <button
          onClick={() => navigate('/create', { state: { duplicateFrom: newsletter } })}
          className="btn-secondary flex items-center gap-2"
        >
          <Edit className="w-4 h-4" />
          Duplicar
        </button>
        <button
          onClick={handleDelete}
          className="btn-danger flex items-center gap-2 ml-auto"
        >
          <Trash2 className="w-4 h-4" />
          Deletar
        </button>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200 mb-6">
        <div className="flex gap-4">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`pb-3 px-2 font-medium border-b-2 transition-colors ${
                activeTab === tab.id
                  ? 'border-primary-600 text-primary-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Conteúdo */}
      <div className="card">
        {activeTab === 'content' && (
          <div className="prose max-w-none">
            <pre className="whitespace-pre-wrap font-serif text-gray-800 leading-relaxed">
              {newsletter.generated_content}
            </pre>
          </div>
        )}

        {activeTab === 'details' && (
          <div className="space-y-6">
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">Público-Alvo</h3>
              <p className="text-gray-700">{newsletter.audience_description}</p>
            </div>

            <div>
              <h3 className="font-semibold text-gray-900 mb-2">Dor Específica</h3>
              <p className="text-gray-700">{newsletter.pain_point}</p>
            </div>

            {newsletter.additional_context && (
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">Contexto Adicional</h3>
                <p className="text-gray-700">{newsletter.additional_context}</p>
              </div>
            )}

            {newsletter.framework_extracted && (
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">Framework Extraído</h3>
                <pre className="whitespace-pre-wrap text-gray-700 bg-gray-50 p-4 rounded-lg">
                  {newsletter.framework_extracted}
                </pre>
              </div>
            )}

            <div className="grid grid-cols-2 gap-4 pt-4 border-t border-gray-200">
              <div>
                <p className="text-sm text-gray-600">Criada em</p>
                <p className="font-medium text-gray-900">
                  {new Date(newsletter.created_at).toLocaleString('pt-BR')}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Última atualização</p>
                <p className="font-medium text-gray-900">
                  {new Date(newsletter.updated_at).toLocaleString('pt-BR')}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Total de caracteres</p>
                <p className="font-medium text-gray-900">
                  {newsletter.generated_content.length.toLocaleString()}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Total de palavras</p>
                <p className="font-medium text-gray-900">
                  {newsletter.generated_content.split(/\s+/).length.toLocaleString()}
                </p>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'files' && (
          <div>
            {newsletter.source_files && newsletter.source_files.length > 0 ? (
              <div className="space-y-3">
                {newsletter.source_files.map((file) => (
                  <div
                    key={file.id}
                    className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-200"
                  >
                    <div>
                      <p className="font-medium text-gray-900">{file.file_name}</p>
                      <p className="text-sm text-gray-500">
                        Tipo: {file.file_type.toUpperCase()} • Enviado em {formatDate(file.uploaded_at)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-600 text-center py-8">
                Nenhum arquivo foi enviado para esta newsletter.
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default NewsletterView;
