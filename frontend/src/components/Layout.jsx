import React from 'react';
import { NavLink } from 'react-router-dom';
import { Home, Users, History, Settings } from 'lucide-react';

/**
 * Layout principal com sidebar
 */
function Layout({ children }) {
  const navLinks = [
    { to: '/', icon: Home, label: 'Dashboard' },
    { to: '/audiences', icon: Users, label: 'Públicos Salvos' },
    { to: '/history', icon: History, label: 'Histórico' },
    { to: '/settings', icon: Settings, label: 'Configurações' },
  ];

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <aside className="w-64 bg-gradient-to-b from-primary-600 to-secondary-600 text-white shadow-lg">
        <div className="p-6">
          <h1 className="text-2xl font-bold mb-1">Newsletter Generator</h1>
          <p className="text-primary-100 text-sm">AppAutoHipnose</p>
        </div>

        <nav className="mt-6">
          {navLinks.map(({ to, icon: Icon, label }) => (
            <NavLink
              key={to}
              to={to}
              className={({ isActive }) =>
                `flex items-center px-6 py-3 text-white hover:bg-white/10 transition-colors ${
                  isActive ? 'bg-white/20 border-l-4 border-white' : ''
                }`
              }
            >
              <Icon className="w-5 h-5 mr-3" />
              <span className="font-medium">{label}</span>
            </NavLink>
          ))}
        </nav>

        <div className="absolute bottom-0 left-0 right-0 w-64 p-6 border-t border-white/10">
          <p className="text-xs text-primary-100">
            Criado por Alex Dantas
          </p>
          <p className="text-xs text-primary-200 mt-1">
            v1.0.0
          </p>
        </div>
      </aside>

      {/* Conteúdo principal */}
      <main className="flex-1 overflow-y-auto">
        <div className="container mx-auto px-8 py-6">
          {children}
        </div>
      </main>
    </div>
  );
}

export default Layout;
