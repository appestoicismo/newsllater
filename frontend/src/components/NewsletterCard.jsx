import React from 'react';
import { Eye, Copy, Trash2 } from 'lucide-react';
import { formatDate, truncateText } from '../utils/helpers';

/**
 * Card de newsletter para exibição em listas
 */
function NewsletterCard({ newsletter, onView, onDuplicate, onDelete }) {
  return (
    <div className="card hover:shadow-md transition-shadow cursor-pointer">
      <div onClick={() => onView(newsletter)}>
        <div className="flex items-start justify-between mb-3">
          <div className="flex-1">
            <h3 className="font-semibold text-lg text-gray-900 mb-1">
              {truncateText(newsletter.pain_point, 80)}
            </h3>
            <p className="text-sm text-gray-500">
              {formatDate(newsletter.created_at)}
            </p>
          </div>
        </div>

        <div className="mb-3">
          <span className="inline-block bg-primary-100 text-primary-700 text-xs font-medium px-2.5 py-1 rounded">
            {newsletter.audience_name || 'Público personalizado'}
          </span>
        </div>

        <p className="text-sm text-gray-600 mb-4">
          {truncateText(newsletter.generated_content, 150)}
        </p>
      </div>

      <div className="flex gap-2 pt-4 border-t border-gray-200">
        <button
          onClick={() => onView(newsletter)}
          className="flex-1 btn-secondary text-sm py-2"
        >
          <Eye className="w-4 h-4 inline mr-1" />
          Ver Detalhes
        </button>
        <button
          onClick={() => onDuplicate(newsletter)}
          className="btn-secondary text-sm py-2 px-3"
          title="Duplicar"
        >
          <Copy className="w-4 h-4" />
        </button>
        <button
          onClick={() => onDelete(newsletter)}
          className="btn-secondary text-sm py-2 px-3 text-red-600 hover:bg-red-50"
          title="Deletar"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}

export default NewsletterCard;
