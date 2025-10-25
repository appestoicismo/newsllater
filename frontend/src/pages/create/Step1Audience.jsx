import React, { useState, useEffect } from 'react';
import { audiencesAPI } from '../../services/api';
import useStore from '../../store/useStore';
import LoadingSpinner from '../../components/LoadingSpinner';

/**
 * Etapa 1: Seleção/Criação de Público-Alvo
 */
function Step1Audience({ onNext }) {
  const { wizardData, updateWizardData, audiences, setAudiences } = useStore();
  const [mode, setMode] = useState('select'); // 'select' ou 'create'
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadAudiences();
  }, []);

  const loadAudiences = async () => {
    try {
      const response = await audiencesAPI.list();
      setAudiences(response.data);
    } catch (err) {
      console.error('Erro ao carregar públicos:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleNext = () => {
    if (mode === 'select' && !wizardData.audience_id) {
      alert('Selecione um público-alvo');
      return;
    }

    if (mode === 'create' && !wizardData.audience_description.trim()) {
      alert('Descreva o público-alvo');
      return;
    }

    if (wizardData.saveAudience && !wizardData.audienceName.trim()) {
      alert('Digite um nome para salvar o público');
      return;
    }

    onNext();
  };

  return (
    <div className="max-w-3xl mx-auto">
      <h2 className="text-2xl font-bold text-gray-900 mb-2">
        Público-Alvo
      </h2>
      <p className="text-gray-600 mb-6">
        Escolha um público salvo ou crie um novo para esta newsletter
      </p>

      {/* Seletor de modo */}
      <div className="mb-6">
        <div className="flex gap-4">
          <button
            onClick={() => setMode('select')}
            className={`flex-1 py-3 px-4 rounded-lg border-2 font-medium transition-colors ${
              mode === 'select'
                ? 'border-primary-600 bg-primary-50 text-primary-700'
                : 'border-gray-300 text-gray-700 hover:border-gray-400'
            }`}
          >
            Escolher Público Salvo
          </button>
          <button
            onClick={() => setMode('create')}
            className={`flex-1 py-3 px-4 rounded-lg border-2 font-medium transition-colors ${
              mode === 'create'
                ? 'border-primary-600 bg-primary-50 text-primary-700'
                : 'border-gray-300 text-gray-700 hover:border-gray-400'
            }`}
          >
            Criar Novo
          </button>
        </div>
      </div>

      {/* Modo: Selecionar público existente */}
      {mode === 'select' && (
        <div>
          {loading ? (
            <LoadingSpinner size="sm" message="Carregando públicos..." />
          ) : audiences.length === 0 ? (
            <div className="card text-center">
              <p className="text-gray-600">
                Nenhum público salvo ainda. Crie um novo!
              </p>
              <button
                onClick={() => setMode('create')}
                className="btn-primary mt-4"
              >
                Criar Novo Público
              </button>
            </div>
          ) : (
            <div className="space-y-3">
              {audiences.map((audience) => (
                <div
                  key={audience.id}
                  onClick={() => updateWizardData({ audience_id: audience.id })}
                  className={`card cursor-pointer transition-all ${
                    wizardData.audience_id === audience.id
                      ? 'border-primary-600 border-2 bg-primary-50'
                      : 'hover:border-primary-300'
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h4 className="font-semibold text-gray-900 mb-1">
                        {audience.name}
                      </h4>
                      <p className="text-sm text-gray-600">
                        {audience.description}
                      </p>
                      <p className="text-xs text-gray-500 mt-2">
                        {audience.newsletter_count || 0} newsletter(s) criada(s)
                      </p>
                    </div>
                    {wizardData.audience_id === audience.id && (
                      <div className="ml-3">
                        <div className="w-6 h-6 bg-primary-600 rounded-full flex items-center justify-center">
                          <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Modo: Criar novo público */}
      {mode === 'create' && (
        <div className="space-y-4">
          <div>
            <label className="label">
              Descrição do Público-Alvo *
            </label>
            <textarea
              value={wizardData.audience_description}
              onChange={(e) => updateWizardData({ audience_description: e.target.value })}
              placeholder="Ex: Mulheres 35-50 anos com insônia crônica que já tentaram remédios naturais e acordam frequentemente durante a noite com pensamentos ansiosos sobre trabalho e família"
              rows={5}
              className="input-field resize-none"
            />
            <p className="text-xs text-gray-500 mt-1">
              Seja específico: idade, gênero, problema principal, contexto
            </p>
          </div>

          <div className="border-t border-gray-200 pt-4">
            <label className="flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={wizardData.saveAudience}
                onChange={(e) => updateWizardData({ saveAudience: e.target.checked })}
                className="w-4 h-4 text-primary-600 rounded focus:ring-primary-500"
              />
              <span className="ml-2 text-sm font-medium text-gray-700">
                Salvar este público para uso futuro
              </span>
            </label>
          </div>

          {wizardData.saveAudience && (
            <div className="animate-fadeIn">
              <label className="label">
                Nome para este Público *
              </label>
              <input
                type="text"
                value={wizardData.audienceName}
                onChange={(e) => updateWizardData({ audienceName: e.target.value })}
                placeholder="Ex: Mulheres com Insônia Crônica"
                className="input-field"
              />
            </div>
          )}

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h4 className="font-medium text-blue-900 mb-2">💡 Exemplos de descrição:</h4>
            <ul className="text-sm text-blue-800 space-y-1">
              <li>• Homens 30+ estressados com pensamentos acelerados antes de dormir</li>
              <li>• Mulheres que sofrem com compulsão alimentar emocional após situações estressantes</li>
              <li>• Pessoas que tentam meditar mas não conseguem desligar a mente</li>
            </ul>
          </div>
        </div>
      )}

      {/* Botão Próximo */}
      <div className="mt-8 flex justify-end">
        <button onClick={handleNext} className="btn-primary px-8">
          Próximo
        </button>
      </div>
    </div>
  );
}

export default Step1Audience;
