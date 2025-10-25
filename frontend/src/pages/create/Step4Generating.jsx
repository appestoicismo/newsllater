import React, { useEffect, useState } from 'react';
import { Sparkles } from 'lucide-react';

/**
 * Etapa 4: Tela de Loading durante geração
 */
function Step4Generating() {
  const [currentMessage, setCurrentMessage] = useState(0);

  const messages = [
    'Analisando materiais enviados...',
    'Extraindo conhecimento relevante...',
    'Identificando técnicas aplicáveis...',
    'Criando framework prático...',
    'Gerando copywriting profissional...',
    'Estruturando a newsletter...',
    'Finalizando os detalhes...',
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentMessage((prev) => (prev + 1) % messages.length);
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="max-w-2xl mx-auto text-center py-12">
      <div className="mb-8">
        <div className="inline-flex items-center justify-center w-24 h-24 bg-gradient-to-br from-primary-500 to-secondary-500 rounded-full mb-6">
          <Sparkles className="w-12 h-12 text-white animate-pulse" />
        </div>
        <h2 className="text-3xl font-bold text-gray-900 mb-3">
          Gerando Newsletter...
        </h2>
        <p className="text-gray-600">
          Isso pode levar até 60 segundos. Por favor, aguarde.
        </p>
      </div>

      {/* Barra de progresso animada */}
      <div className="mb-8">
        <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
          <div className="h-full bg-gradient-to-r from-primary-500 to-secondary-500 rounded-full animate-pulse"
               style={{
                 width: '100%',
                 animation: 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite'
               }}
          />
        </div>
      </div>

      {/* Mensagem rotativa */}
      <div className="min-h-[60px] flex items-center justify-center">
        <p className="text-lg text-primary-700 font-medium animate-fadeIn">
          {messages[currentMessage]}
        </p>
      </div>

      {/* Informações adicionais */}
      <div className="mt-12 bg-gray-50 rounded-lg p-6 text-left">
        <h3 className="font-semibold text-gray-900 mb-3">
          O que está acontecendo nos bastidores:
        </h3>
        <ul className="space-y-2 text-sm text-gray-700">
          <li className="flex items-start">
            <span className="text-primary-600 mr-2">•</span>
            <span>Processando e extraindo texto dos arquivos enviados</span>
          </li>
          <li className="flex items-start">
            <span className="text-primary-600 mr-2">•</span>
            <span>Identificando técnicas e conceitos relevantes para a dor mencionada</span>
          </li>
          <li className="flex items-start">
            <span className="text-primary-600 mr-2">•</span>
            <span>Criando um framework prático e aplicável</span>
          </li>
          <li className="flex items-start">
            <span className="text-primary-600 mr-2">•</span>
            <span>Gerando copy profissional com tom empático e acolhedor</span>
          </li>
          <li className="flex items-start">
            <span className="text-primary-600 mr-2">•</span>
            <span>Estruturando em blocos para máxima retenção e engajamento</span>
          </li>
        </ul>
      </div>
    </div>
  );
}

export default Step4Generating;
