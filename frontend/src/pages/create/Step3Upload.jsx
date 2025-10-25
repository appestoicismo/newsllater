import React, { useRef } from 'react';
import { Upload, X, FileText } from 'lucide-react';
import useStore from '../../store/useStore';
import { formatFileSize, isValidFileType } from '../../utils/helpers';

/**
 * Etapa 3: Upload de Fontes de Conhecimento
 */
function Step3Upload({ onNext, onBack }) {
  const { wizardData, updateWizardData } = useStore();
  const fileInputRef = useRef(null);

  const handleFileSelect = (e) => {
    const selectedFiles = Array.from(e.target.files);

    // Validar tipos
    const invalidFiles = selectedFiles.filter(file => !isValidFileType(file));

    if (invalidFiles.length > 0) {
      alert(`Arquivos inválidos: ${invalidFiles.map(f => f.name).join(', ')}\nUse apenas PDF, DOCX, TXT ou MD`);
      return;
    }

    // Adicionar arquivos
    updateWizardData({
      files: [...wizardData.files, ...selectedFiles]
    });

    // Resetar input
    e.target.value = '';
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const droppedFiles = Array.from(e.dataTransfer.files);

    // Validar tipos
    const invalidFiles = droppedFiles.filter(file => !isValidFileType(file));

    if (invalidFiles.length > 0) {
      alert(`Arquivos inválidos: ${invalidFiles.map(f => f.name).join(', ')}\nUse apenas PDF, DOCX, TXT ou MD`);
      return;
    }

    updateWizardData({
      files: [...wizardData.files, ...droppedFiles]
    });
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const removeFile = (index) => {
    const newFiles = wizardData.files.filter((_, i) => i !== index);
    updateWizardData({ files: newFiles });
  };

  const handleNext = () => {
    const hasFiles = wizardData.files.length > 0;
    const hasText = wizardData.source_text.trim().length > 0;

    if (!hasFiles && !hasText) {
      alert('Envie pelo menos um arquivo ou cole o texto de conhecimento');
      return;
    }

    onNext();
  };

  return (
    <div className="max-w-3xl mx-auto">
      <h2 className="text-2xl font-bold text-gray-900 mb-2">
        Materiais de Conhecimento
      </h2>
      <p className="text-gray-600 mb-6">
        Envie os arquivos ou cole o texto que servirá como base para criar a newsletter
      </p>

      <div className="space-y-6">
        {/* Área de Upload */}
        <div>
          <label className="label">Upload de Arquivos</label>
          <div
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            onClick={() => fileInputRef.current?.click()}
            className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center cursor-pointer hover:border-primary-500 hover:bg-primary-50 transition-colors"
          >
            <Upload className="w-12 h-12 text-gray-400 mx-auto mb-3" />
            <p className="text-gray-700 font-medium mb-1">
              Clique ou arraste arquivos aqui
            </p>
            <p className="text-sm text-gray-500">
              PDF, DOCX, TXT ou MD (máx 10MB cada)
            </p>
            <input
              ref={fileInputRef}
              type="file"
              multiple
              accept=".pdf,.docx,.txt,.md"
              onChange={handleFileSelect}
              className="hidden"
            />
          </div>
        </div>

        {/* Lista de arquivos */}
        {wizardData.files.length > 0 && (
          <div>
            <h4 className="font-medium text-gray-900 mb-3">
              Arquivos selecionados ({wizardData.files.length})
            </h4>
            <div className="space-y-2">
              {wizardData.files.map((file, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-200"
                >
                  <div className="flex items-center flex-1">
                    <FileText className="w-5 h-5 text-gray-400 mr-3" />
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-900">
                        {file.name}
                      </p>
                      <p className="text-xs text-gray-500">
                        {formatFileSize(file.size)}
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => removeFile(index)}
                    className="ml-3 text-gray-400 hover:text-red-600 transition-colors"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Divisor OU */}
        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-300"></div>
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-4 bg-gray-50 text-gray-500 font-medium">OU</span>
          </div>
        </div>

        {/* Área de texto */}
        <div>
          <label className="label">
            Cole o Texto/Anotações Diretamente
          </label>
          <textarea
            value={wizardData.source_text}
            onChange={(e) => updateWizardData({ source_text: e.target.value })}
            placeholder="Cole aqui suas anotações, transcrições, artigos ou qualquer material de conhecimento que você queira usar como base..."
            rows={10}
            className="input-field resize-none font-mono text-sm"
          />
          <p className="text-xs text-gray-500 mt-1">
            Você pode colar textos de livros, artigos, suas próprias anotações, etc.
          </p>
        </div>

        {/* Informações */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <h4 className="font-medium text-blue-900 mb-2">💡 Dicas sobre materiais:</h4>
          <ul className="text-sm text-blue-800 space-y-1">
            <li>• Quanto mais rico o material, melhor será a newsletter gerada</li>
            <li>• Você pode combinar arquivos E texto colado</li>
            <li>• Inclua técnicas, explicações científicas e exemplos práticos</li>
            <li>• O sistema vai extrair as partes mais relevantes automaticamente</li>
          </ul>
        </div>
      </div>

      {/* Botões de navegação */}
      <div className="mt-8 flex justify-between">
        <button onClick={onBack} className="btn-secondary px-8">
          Voltar
        </button>
        <button onClick={handleNext} className="btn-primary px-8">
          Gerar Newsletter
        </button>
      </div>
    </div>
  );
}

export default Step3Upload;
