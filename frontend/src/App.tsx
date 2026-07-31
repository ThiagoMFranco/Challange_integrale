import { useState } from 'react';
import { AppLayout } from './components/layout/AppLayout';
import type { AppView } from './components/layout/NavBar';
import CadastroPage from './pages/CadastroPage';
import ListagemPage from './pages/ListagemPage';

function App() {
  const [activeView, setActiveView] = useState<AppView>('cadastro');

  return (
    <AppLayout activeView={activeView} onNavigate={setActiveView}>
      {activeView === 'cadastro' ? <CadastroPage /> : <ListagemPage />}
    </AppLayout>
  );
}

export default App;
