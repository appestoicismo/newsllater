import React from 'react';
import { CheckCircle, X } from 'lucide-react';

/**
 * Componente de mensagem de sucesso
 */
function SuccessMessage({ message, onDismiss }) {
  if (!message) return null;

  return (
    <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-4 animate-fadeIn">
      <div className="flex items-start">
        <CheckCircle className="w-5 h-5 text-green-600 mt-0.5 mr-3 flex-shrink-0" />
        <div className="flex-1">
          <p className="text-sm text-green-800">{message}</p>
        </div>
        {onDismiss && (
          <button
            onClick={onDismiss}
            className="ml-3 text-green-400 hover:text-green-600"
          >
            <X className="w-5 h-5" />
          </button>
        )}
      </div>
    </div>
  );
}

export default SuccessMessage;
