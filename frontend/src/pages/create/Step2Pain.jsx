import React from 'react';
import useStore from '../../store/useStore';

/**
 * Etapa 2: Definição da Dor da Semana
 */
function Step2Pain({ onNext, onBack }) {
  const { wizardData, updateWizardData } = useStore();

  const handleNext = () => {
    if (!wizardData.pain_point.trim()) {
      alert('Descreva a dor específica desta semana');
      return;
    }
    onNext();
  };

  return (
    <div className="max-w-3xl mx-auto">
      <h2 className="text-2xl font-bold text-gray-900 mb-2">
        Dor da Semana
      </h2>
      <p className="text-gray-600 mb-6">
        Qual o problema emocional ou situação específica que vamos abordar nesta newsletter?
      </p>

      <div className="space-y-6">
        <div>
          <label className="label">
            Qual a dor emocional/problema específico desta semana? *
          </label>
          <textarea
            value={wizardData.pain_point}
            onChange={(e) => updateWizardData({ pain_point: e.target.value })}
            placeholder="Ex: Acordar às 3h da manhã e não conseguir voltar a dormir, ficando em loop de pensamentos sobre problemas do trabalho"
            rows={4}
            className="input-field resize-none"
          />
          <p className="text-xs text-gray-500 mt-1">
            Seja específico sobre a situação, momento e sentimento
          </p>
        </div>

        <div>
          <label className="label">
            Contexto Adicional (Opcional)
          </label>
          <textarea
            value={wizardData.additional_context}
            onChange={(e) => updateWizardData({ additional_context: e.target.value })}
            placeholder="Ex: Essa pessoa geralmente entra em loop de pensamentos sobre trabalho e sente culpa por não conseguir desligar a mente. Já tentou contar carneirinhos, ler, tomar chá, mas nada funciona consistentemente."
            rows={4}
            className="input-field resize-none"
          />
          <p className="text-xs text-gray-500 mt-1">
            Informações adicionais que ajudem a entender melhor o contexto
          </p>
        </div>

        <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
          <h4 className="font-medium text-purple-900 mb-2">💡 Dicas para descrever a dor:</h4>
          <ul className="text-sm text-purple-800 space-y-1">
            <li>✓ Descreva o momento específico (quando acontece)</li>
            <li>✓ Inclua os pensamentos que surgem</li>
            <li>✓ Mencione o que a pessoa já tentou sem sucesso</li>
            <li>✓ Explique como isso afeta o dia seguinte</li>
          </ul>
        </div>

        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <h4 className="font-medium text-yellow-900 mb-2">📝 Exemplos de dores bem descritas:</h4>
          <ul className="text-sm text-yellow-800 space-y-2">
            <li className="pb-2 border-b border-yellow-200">
              <strong>Ansiedade noturna:</strong><br />
              "Deitar na cama e sentir o coração acelerar com pensamentos sobre tudo que precisa fazer amanhã, entrando em espiral de 'e se...'"
            </li>
            <li className="pb-2 border-b border-yellow-200">
              <strong>Compulsão alimentar:</strong><br />
              "Chegar em casa após um dia estressante e ir direto para a geladeira, comendo sem controle até sentir culpa e vergonha"
            </li>
            <li>
              <strong>Procrastinação:</strong><br />
              "Saber exatamente o que precisa fazer, mas sentir um bloqueio mental que impede de começar, gastando horas em redes sociais em vez de trabalhar"
            </li>
          </ul>
        </div>
      </div>

      {/* Botões de navegação */}
      <div className="mt-8 flex justify-between">
        <button onClick={onBack} className="btn-secondary px-8">
          Voltar
        </button>
        <button onClick={handleNext} className="btn-primary px-8">
          Próximo
        </button>
      </div>
    </div>
  );
}

export default Step2Pain;
