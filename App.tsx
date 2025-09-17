
import React from 'react';
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AppContextProvider } from './context/AppContext';
import MainLayout from './components/layout/MainLayout';
import Dashboard from './pages/Dashboard';
import ProjectDetail from './pages/ProjectDetail';
import PromptDetail from './pages/PromptDetail';
import Templates from './pages/Templates';
import Caps from './pages/Caps';
import Sandbox from './pages/Sandbox';
import Export from './pages/Export';
import Settings from './pages/Settings';
import NotFound from './pages/NotFound';
import { ToastProvider } from './context/ToastContext';

function App() {
  return (
    <AppContextProvider>
      <ToastProvider>
        <HashRouter>
          <Routes>
            <Route element={<MainLayout />}>
              <Route path="/" element={<Navigate to="/dashboard" replace />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/projects/:id" element={<ProjectDetail />} />
              <Route path="/prompts/:id" element={<PromptDetail />} />
              <Route path="/templates" element={<Templates />} />
              <Route path="/caps" element={<Caps />} />
              <Route path="/sandbox" element={<Sandbox />} />
              <Route path="/export" element={<Export />} />
              <Route path="/settings" element={<Settings />} />
              <Route path="*" element={<NotFound />} />
            </Route>
          </Routes>
        </HashRouter>
      </ToastProvider>
    </AppContextProvider>
  );
}

export default App;
