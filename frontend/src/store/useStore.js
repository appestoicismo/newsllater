import { create } from 'zustand';

/**
 * Store global usando Zustand para gerenciamento de estado
 */
const useStore = create((set, get) => ({
  // Estado
  audiences: [],
  newsletters: [],
  settings: {},
  loading: false,
  error: null,

  // Newsletter em criação (wizard)
  wizardData: {
    step: 1,
    audience_id: null,
    audience_description: '',
    saveAudience: false,
    audienceName: '',
    pain_point: '',
    additional_context: '',
    files: [],
    source_text: '',
  },

  // Actions - Audiences
  setAudiences: (audiences) => set({ audiences }),

  addAudience: (audience) => set((state) => ({
    audiences: [audience, ...state.audiences]
  })),

  updateAudience: (id, updatedAudience) => set((state) => ({
    audiences: state.audiences.map((a) =>
      a.id === id ? { ...a, ...updatedAudience } : a
    )
  })),

  removeAudience: (id) => set((state) => ({
    audiences: state.audiences.filter((a) => a.id !== id)
  })),

  // Actions - Newsletters
  setNewsletters: (newsletters) => set({ newsletters }),

  addNewsletter: (newsletter) => set((state) => ({
    newsletters: [newsletter, ...state.newsletters]
  })),

  updateNewsletter: (id, updatedNewsletter) => set((state) => ({
    newsletters: state.newsletters.map((n) =>
      n.id === id ? { ...n, ...updatedNewsletter } : n
    )
  })),

  removeNewsletter: (id) => set((state) => ({
    newsletters: state.newsletters.filter((n) => n.id !== id)
  })),

  // Actions - Settings
  setSettings: (settings) => set({ settings }),

  updateSettings: (newSettings) => set((state) => ({
    settings: { ...state.settings, ...newSettings }
  })),

  // Actions - Wizard
  setWizardStep: (step) => set((state) => ({
    wizardData: { ...state.wizardData, step }
  })),

  updateWizardData: (data) => set((state) => ({
    wizardData: { ...state.wizardData, ...data }
  })),

  resetWizard: () => set({
    wizardData: {
      step: 1,
      audience_id: null,
      audience_description: '',
      saveAudience: false,
      audienceName: '',
      pain_point: '',
      additional_context: '',
      files: [],
      source_text: '',
    }
  }),

  // Actions - UI
  setLoading: (loading) => set({ loading }),

  setError: (error) => set({ error }),

  clearError: () => set({ error: null }),
}));

export default useStore;
