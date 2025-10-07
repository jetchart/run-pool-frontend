declare global {
  interface ImportMeta {
    env: {
      VITE_BACKEND_URL: any;
      VITE_GOOGLE_CLIENT_ID: string;
    };
  }
}

import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Header } from './components/Header';
import { RacesList } from './components/RacesList';

function App() {
  return (
    <Router>
      <div className="min-h-screen flex flex-col bg-background">
        <Header />
        <main className="flex-1">
          <Routes>
            <Route path="/" element={<RacesList />} />
            {/* Página 404 */}
            <Route path="*" element={
              <div className="container mx-auto px-4 py-16 text-center">
                <h1 className="text-4xl font-bold mb-4">404 - Página no encontrada</h1>
                <p className="text-muted-foreground mb-8">La página que buscas no existe.</p>
                <a href="/" className="text-primary hover:underline">Volver al inicio</a>
              </div>
            } />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App
