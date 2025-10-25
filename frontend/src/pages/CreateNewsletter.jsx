import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import useStore from '../store/useStore';
import { newslettersAPI, audiencesAPI } from '../services/api';
import Step1Audience from './create/Step1Audience';
import Step2Pain from './create/Step2Pain';
import Step3Upload from './create/Step3Upload';
import Step4Generating from './create/Step4Generating';
import Step5Result from './create/Step5Result';
import ErrorMessage from '../components/ErrorMessage';

/**
 * Página de criação de newsletter (wizard completo)
 */
function CreateNewsletter() {
  const navigate = useNavigate();
  const location = useLocation();
  const { wizardData, updateWizardData, setWizardStep, resetWizard, addAudience } = useStore();
  const [error, setError] = useState(null);
  const [generatedNewsletter, setGeneratedNewsletter] = useState(null);

  useEffect(() => {
    // Se veio de duplicação, preencher dados
    if (location.state?.duplicateFrom) {
      const newsletter = location.state.duplicateFrom;
      updateWizardData({
        audience_id: newsletter.audience_id,
        audience_description: newsletter.audience_description,
        pain_point: newsletter.pain_point,
        additional_context: newsletter.additional_context || '',
      });
    }
  }, [location.state]);

  const handleNext = async () => {
    setError(null);

    if (wizardData.step === 3) {
      // Etapa 3 -> Gerar newsletter
      await generateNewsletter();
    } else {
      // Avançar para próxima etapa
      setWizardStep(wizardData.step + 1);
    }
  };

  const handleBack = () => {
    if (wizardData.step > 1) {
      setWizardStep(wizardData.step - 1);
    }
  };

  const generateNewsletter = async () => {
    try {
      setWizardStep(4); // Mostrar tela de loading

      // Preparar FormData
      const formData = new FormData();

      // Se precisa salvar audience primeiro
      if (!wizardData.audience_id && wizardData.saveAudience) {
        const audienceResponse = await audiencesAPI.create({
          name: wizardData.audienceName,
          description: wizardData.audience_description,
        });
        addAudience(audienceResponse.data);
        formData.append('audience_id', audienceResponse.data.id);
      } else if (wizardData.audience_id) {
        formData.append('audience_id', wizardData.audience_id);
      } else {
        formData.append('audience_description', wizardData.audience_description);
      }

      formData.append('pain_point', wizardData.pain_point);

      if (wizardData.additional_context) {
        formData.append('additional_context', wizardData.additional_context);
      }

      if (wizardData.source_text) {
        formData.append('source_text', wizardData.source_text);
      }

      // Adicionar arquivos
      wizardData.files.forEach((file) => {
        formData.append('files', file);
      });

      // Chamar API
      const response = await newslettersAPI.generate(formData);

      // Sucesso
      setGeneratedNewsletter(response.data);
      setWizardStep(5);

    } catch (err) {
      console.error('Erro ao gerar newsletter:', err);
      setError(err.message || 'Erro ao gerar newsletter');
      setWizardStep(3); // Voltar para etapa 3
    }
  };

  const handleRegenerate = () => {
    setGeneratedNewsletter(null);
    generateNewsletter();
  };

  const handleSave = async (editedContent) => {
    try {
      // Se foi editado, atualizar no banco
      if (editedContent !== generatedNewsletter.generated_content) {
        await newslettersAPI.update(generatedNewsletter.id, {
          generated_content: editedContent,
        });
      }

      // Resetar wizard e voltar ao dashboard
      resetWizard();
      navigate('/', { state: { message: 'Newsletter salva com sucesso!' } });
    } catch (err) {
      setError(err.message || 'Erro ao salvar newsletter');
    }
  };

  const handleCancel = () => {
    if (confirm('Tem certeza que deseja cancelar? Todos os dados serão perdidos.')) {
      resetWizard();
      navigate('/');
    }
  };

  return (
    <div className="max-w-7xl mx-auto animate-fadeIn">
      {/* Header */}
      <div className="mb-8">
        <button
          onClick={handleCancel}
          className="flex items-center text-gray-600 hover:text-gray-900 mb-4"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Cancelar e voltar
        </button>

        <h1 className="text-3xl font-bold text-gray-900">Criar Nova Newsletter</h1>

        {/* Progress indicator */}
        {wizardData.step < 5 && (
          <div className="mt-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-700">
                Etapa {wizardData.step} de 4
              </span>
              <span className="text-sm text-gray-500">
                {Math.round((wizardData.step / 4) * 100)}% completo
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-gradient-to-r from-primary-500 to-secondary-500 h-2 rounded-full transition-all duration-300"
                style={{ width: `${(wizardData.step / 4) * 100}%` }}
              />
            </div>
          </div>
        )}
      </div>

      {error && <ErrorMessage message={error} onDismiss={() => setError(null)} />}

      {/* Etapas */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
        {wizardData.step === 1 && <Step1Audience onNext={handleNext} />}
        {wizardData.step === 2 && <Step2Pain onNext={handleNext} onBack={handleBack} />}
        {wizardData.step === 3 && <Step3Upload onNext={handleNext} onBack={handleBack} />}
        {wizardData.step === 4 && <Step4Generating />}
        {wizardData.step === 5 && generatedNewsletter && (
          <Step5Result
            newsletter={generatedNewsletter}
            onRegenerate={handleRegenerate}
            onSave={handleSave}
          />
        )}
      </div>
    </div>
  );
}

export default CreateNewsletter;
