import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import CreateNewsletter from './pages/CreateNewsletter';
import Audiences from './pages/Audiences';
import History from './pages/History';
import Settings from './pages/Settings';
import NewsletterView from './pages/NewsletterView';
import useStore from './store/useStore';
import { audiencesAPI } from './services/api';

function App() {
  const { setAudiences } = useStore();

  // Carregar públicos ao iniciar
  useEffect(() => {
    loadInitialData();
  }, []);

  const loadInitialData = async () => {
    try {
      const response = await audiencesAPI.list();
      setAudiences(response.data);
    } catch (err) {
      console.error('Erro ao carregar dados iniciais:', err);
    }
  };

  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/create" element={<CreateNewsletter />} />
          <Route path="/audiences" element={<Audiences />} />
          <Route path="/history" element={<History />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="/newsletter/:id" element={<NewsletterView />} />
        </Routes>
      </Layout>
    </Router>
  );
}

export default App;
