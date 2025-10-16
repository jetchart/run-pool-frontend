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
import { TripsPage } from './components/TripsPage';
import StyleGuide from './components/StyleGuide';
import { Login } from './components/Login';
import { UserProfile } from './components/UserProfile';
import { UserProfileView } from './components/UserProfileView';
import { UsersPage } from './components/UsersPage';
import CreateTrip from './components/CreateTrip';
import TripDetail from './components/TripDetail';
import { AuthProvider } from './contexts/AuthContext';
import { Toaster } from './components/ui/sonner';

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen flex flex-col bg-background">
          <Header />
          <main className="flex-1">
            <Routes>
              <Route path="/" element={<RacesList />} />
              <Route path="/races/:raceId/trips" element={<TripsPage />} />
              <Route path="/login" element={<Login />} />
              <Route path="/profile" element={<UserProfile />} />
              <Route path="/profile/view" element={<UserProfileView />} />
              <Route path="/profile/view/:userId" element={<UserProfileView />} />
              <Route path="/users" element={<UsersPage />} />
              <Route path="/trips/create" element={<CreateTrip />} />
              <Route path="/trips/:tripId" element={<TripDetail />} />
              <Route path="/style-guide" element={<StyleGuide />} />
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
          <Toaster />
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App
