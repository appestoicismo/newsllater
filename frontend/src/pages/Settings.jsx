import React, { useEffect, useState } from 'react';
import { Save, Eye, EyeOff } from 'lucide-react';
import useStore from '../store/useStore';
import { settingsAPI } from '../services/api';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorMessage from '../components/ErrorMessage';
import SuccessMessage from '../components/SuccessMessage';

/**
 * Página de Configurações
 */
function Settings() {
  const { settings, setSettings } = useStore();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [showApiKey, setShowApiKey] = useState(false);

  const [formData, setFormData] = useState({
    anthropic_api_key: '',
    signature_name: 'Alex Dantas',
    default_tone: 'equilibrado',
  });

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      setLoading(true);
      const response = await settingsAPI.get();
      setSettings(response.data);
      setFormData({
        anthropic_api_key: response.data.anthropic_api_key || '',
        signature_name: response.data.signature_name || 'Alex Dantas',
        default_tone: response.data.default_tone || 'equilibrado',
      });
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    if (!formData.anthropic_api_key.trim()) {
      setError('API Key da Anthropic é obrigatória');
      return;
    }

    try {
      setSaving(true);
      await settingsAPI.update(formData);
      setSettings(formData);
      setSuccess('Configurações salvas com sucesso!');
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <LoadingSpinner message="Carregando configurações..." />;
  }

  return (
    <div className="max-w-3xl animate-fadeIn">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Configurações</h1>
        <p className="text-gray-600 mt-1">
          Configure as preferências do gerador de newsletters
        </p>
      </div>

      <ErrorMessage message={error} onDismiss={() => setError(null)} />
      <SuccessMessage message={success} onDismiss={() => setSuccess(null)} />

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* API Key */}
        <div className="card">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            API da Anthropic Claude
          </h2>

          <div>
            <label className="label">
              API Key *
            </label>
            <div className="relative">
              <input
                type={showApiKey ? 'text' : 'password'}
                value={formData.anthropic_api_key}
                onChange={(e) => setFormData({ ...formData, anthropic_api_key: e.target.value })}
                placeholder="sk-ant-api03-..."
                className="input-field pr-12"
              />
              <button
                type="button"
                onClick={() => setShowApiKey(!showApiKey)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                {showApiKey ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
            <p className="text-xs text-gray-500 mt-1">
              Obtenha sua chave em{' '}
              <a
                href="https://console.anthropic.com/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary-600 hover:underline"
              >
                console.anthropic.com
              </a>
            </p>
          </div>

          <div className="mt-4 bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <h4 className="font-medium text-yellow-900 mb-2">⚠️ Importante:</h4>
            <ul className="text-sm text-yellow-800 space-y-1">
              <li>• Sua API Key é armazenada localmente e não é compartilhada</li>
              <li>• Você será cobrado pela Anthropic pelo uso da API</li>
              <li>• Cada newsletter custa aproximadamente $0.10 - $0.30 USD</li>
              <li>• Mantenha sua chave segura e não a compartilhe</li>
            </ul>
          </div>
        </div>

        {/* Assinatura */}
        <div className="card">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            Assinatura
          </h2>

          <div>
            <label className="label">
              Seu Nome de Assinatura
            </label>
            <input
              type="text"
              value={formData.signature_name}
              onChange={(e) => setFormData({ ...formData, signature_name: e.target.value })}
              placeholder="Alex Dantas"
              className="input-field"
            />
            <p className="text-xs text-gray-500 mt-1">
              Nome que aparecerá ao final de cada newsletter
            </p>
          </div>
        </div>

        {/* Tom Padrão */}
        <div className="card">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            Tom de Escrita
          </h2>

          <div>
            <label className="label">
              Tom Padrão das Newsletters
            </label>
            <select
              value={formData.default_tone}
              onChange={(e) => setFormData({ ...formData, default_tone: e.target.value })}
              className="input-field"
            >
              <option value="acolhedor">Acolhedor e Suave</option>
              <option value="equilibrado">Equilibrado (Recomendado)</option>
              <option value="direto">Direto e Provocativo</option>
            </select>
            <p className="text-xs text-gray-500 mt-1">
              Define o estilo de comunicação das newsletters geradas
            </p>
          </div>

          <div className="mt-4 space-y-3">
            <div className="bg-gray-50 p-3 rounded-lg">
              <p className="text-sm font-medium text-gray-900">Acolhedor e Suave</p>
              <p className="text-xs text-gray-600 mt-1">
                Linguagem mais gentil, validação emocional constante, tom maternal
              </p>
            </div>
            <div className="bg-gray-50 p-3 rounded-lg">
              <p className="text-sm font-medium text-gray-900">Equilibrado ⭐</p>
              <p className="text-xs text-gray-600 mt-1">
                Combina empatia com ação prática, validação com desafio suave
              </p>
            </div>
            <div className="bg-gray-50 p-3 rounded-lg">
              <p className="text-sm font-medium text-gray-900">Direto e Provocativo</p>
              <p className="text-xs text-gray-600 mt-1">
                Tom mais direto, quebra de padrões, provocação construtiva
              </p>
            </div>
          </div>
        </div>

        {/* Botão Salvar */}
        <div className="flex justify-end">
          <button
            type="submit"
            disabled={saving}
            className="btn-primary px-8 flex items-center gap-2"
          >
            <Save className="w-4 h-4" />
            {saving ? 'Salvando...' : 'Salvar Configurações'}
          </button>
        </div>
      </form>

      {/* Informações adicionais */}
      <div className="mt-8 card bg-blue-50 border-blue-200">
        <h3 className="font-semibold text-blue-900 mb-2">ℹ️ Sobre o Sistema</h3>
        <div className="text-sm text-blue-800 space-y-1">
          <p><strong>Versão:</strong> 1.0.0</p>
          <p><strong>Modelo IA:</strong> Claude Sonnet 4 (claude-sonnet-4-20250514)</p>
          <p><strong>Criado por:</strong> Alex Dantas</p>
          <p><strong>Comunidade:</strong> AppAutoHipnose</p>
        </div>
      </div>
    </div>
  );
}

export default Settings;
