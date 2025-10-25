import React, { useState } from 'react';
import { Copy, RefreshCw, Edit, Save, Check } from 'lucide-react';
import { copyToClipboard } from '../../utils/helpers';
import SuccessMessage from '../../components/SuccessMessage';

/**
 * Etapa 5: Resultado - Newsletter Gerada
 */
function Step5Result({ newsletter, onRegenerate, onSave }) {
  const [activeTab, setActiveTab] = useState('newsletter');
  const [isEditing, setIsEditing] = useState(false);
  const [editedContent, setEditedContent] = useState(newsletter.generated_content);
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    const success = await copyToClipboard(editedContent);
    if (success) {
      setCopied(true);
      setTimeout(() => setCopied(false), 3000);
    }
  };

  const handleSave = () => {
    onSave(editedContent);
  };

  const tabs = [
    { id: 'newsletter', label: 'Newsletter Completa' },
    { id: 'framework', label: 'Framework Extraído' },
    { id: 'details', label: 'Detalhes' },
  ];

  return (
    <div className="max-w-5xl mx-auto">
      <div className="mb-6">
        <h2 className="text-3xl font-bold text-gray-900 mb-2">
          Newsletter Gerada com Sucesso! 🎉
        </h2>
        <p className="text-gray-600">
          Revise, edite se necessário e salve sua newsletter
        </p>
      </div>

      {copied && (
        <SuccessMessage
          message="Newsletter copiada para área de transferência!"
          onDismiss={() => setCopied(false)}
        />
      )}

      {/* Botões de ação */}
      <div className="flex gap-3 mb-6">
        <button onClick={handleCopy} className="btn-primary flex items-center gap-2">
          <Copy className="w-4 h-4" />
          Copiar Newsletter
        </button>
        <button onClick={onRegenerate} className="btn-secondary flex items-center gap-2">
          <RefreshCw className="w-4 h-4" />
          Regenerar
        </button>
        <button
          onClick={() => setIsEditing(!isEditing)}
          className="btn-secondary flex items-center gap-2"
        >
          <Edit className="w-4 h-4" />
          {isEditing ? 'Cancelar Edição' : 'Editar Manualmente'}
        </button>
        <button onClick={handleSave} className="btn-primary flex items-center gap-2 ml-auto">
          <Save className="w-4 h-4" />
          Salvar e Concluir
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

      {/* Conteúdo das tabs */}
      <div className="card">
        {/* Tab: Newsletter Completa */}
        {activeTab === 'newsletter' && (
          <div>
            {isEditing ? (
              <div>
                <label className="label">Editar Newsletter</label>
                <textarea
                  value={editedContent}
                  onChange={(e) => setEditedContent(e.target.value)}
                  rows={30}
                  className="input-field resize-none font-serif"
                />
                <div className="mt-4 flex justify-end gap-3">
                  <button
                    onClick={() => {
                      setEditedContent(newsletter.generated_content);
                      setIsEditing(false);
                    }}
                    className="btn-secondary"
                  >
                    Cancelar
                  </button>
                  <button
                    onClick={() => setIsEditing(false)}
                    className="btn-primary flex items-center gap-2"
                  >
                    <Check className="w-4 h-4" />
                    Aplicar Alterações
                  </button>
                </div>
              </div>
            ) : (
              <div className="prose max-w-none">
                <pre className="whitespace-pre-wrap font-serif text-gray-800 leading-relaxed">
                  {editedContent}
                </pre>
              </div>
            )}
          </div>
        )}

        {/* Tab: Framework Extraído */}
        {activeTab === 'framework' && (
          <div className="prose max-w-none">
            <h3 className="text-xl font-bold text-gray-900 mb-4">
              Framework/Método Criado
            </h3>
            <pre className="whitespace-pre-wrap font-serif text-gray-800 leading-relaxed">
              {newsletter.framework_extracted || 'Framework não extraído separadamente. Veja a newsletter completa.'}
            </pre>
          </div>
        )}

        {/* Tab: Detalhes */}
        {activeTab === 'details' && (
          <div className="space-y-6">
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">Público-Alvo</h3>
              <p className="text-gray-700">{newsletter.audience_description}</p>
            </div>

            <div>
              <h3 className="font-semibold text-gray-900 mb-2">Dor Trabalhada</h3>
              <p className="text-gray-700">{newsletter.pain_point}</p>
            </div>

            {newsletter.additional_context && (
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">Contexto Adicional</h3>
                <p className="text-gray-700">{newsletter.additional_context}</p>
              </div>
            )}

            <div>
              <h3 className="font-semibold text-gray-900 mb-2">Criada em</h3>
              <p className="text-gray-700">
                {new Date(newsletter.created_at).toLocaleString('pt-BR')}
              </p>
            </div>

            <div>
              <h3 className="font-semibold text-gray-900 mb-2">Estatísticas</h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-sm text-gray-600">Total de caracteres</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {newsletter.generated_content.length.toLocaleString()}
                  </p>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-sm text-gray-600">Total de palavras</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {newsletter.generated_content.split(/\s+/).length.toLocaleString()}
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Step5Result;
