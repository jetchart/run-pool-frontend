import { useState, useEffect } from 'react';
import { GoogleOAuthProvider, GoogleLogin } from '@react-oauth/google';
import { useNavigate } from 'react-router-dom';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { Zap } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

declare global {
  interface ImportMeta {
    env: {
      VITE_BACKEND_URL: any;
      VITE_GOOGLE_CLIENT_ID: string;
    };
  }
}

export function Login() {
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { userCredential, setUserCredential } = useAuth();

  useEffect(() => {
    // Si ya está logueado, verificar perfil y redirigir
    if (userCredential) {
      checkUserProfileAndRedirect(userCredential);
    }
  }, [navigate, userCredential]);

  const checkUserProfileAndRedirect = async (userData: any) => {
    try {
      const userId = userData.id || userData.userId;
      const token = userData.token || userData.accessToken;
      
      if (!userId) {
        console.error('No se encontró userId en userData');
        navigate('/profile');
        return;
      }

      const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/user-profiles/user/${userId}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        // Usuario tiene perfil, redirigir a races
        console.log('Usuario tiene perfil, redirigiendo a races...');
        navigate('/');
      } else if (response.status === 404) {
        // Usuario no tiene perfil, redirigir a crear perfil
        console.log('Usuario no tiene perfil, redirigiendo a crear perfil...');
        navigate('/profile');
      } else {
        // Error inesperado, redirigir a crear perfil por seguridad
        console.log('Error verificando perfil, redirigiendo a crear perfil...');
        navigate('/profile');
      }
    } catch (error) {
      console.error('Error verificando perfil del usuario:', error);
      // En caso de error, redirigir a crear perfil por seguridad
      navigate('/profile');
    }
  };

  const handleGoogleLoginSuccess = async (credentialResponse: any) => {
    const token = credentialResponse.credential;
    setIsLoading(true);
    
    try {
      const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/auth/google/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ token }),
      });
      
      const data = await response.json();
      
      // Ensure token is present in userCredential for API calls
      if (data && (data.token || data.accessToken)) {
        const userData: any = {
          ...data,
          token: data.token || data.accessToken
        };
        
        // Actualizar el contexto de autenticación (esto notificará automáticamente al Header)
        setUserCredential(userData);
        
        // Verificar si el usuario tiene un perfil y redirigir apropiadamente
        await checkUserProfileAndRedirect(userData);
      }
      
      console.log('Login backend response:', data);
    } catch (error) {
      console.error('Error enviando token al backend:', error);
      alert('Error al iniciar sesión. Por favor, intenta de nuevo.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleLoginError = () => {
    console.log("Login Failed");
    alert('Error al iniciar sesión con Google. Por favor, intenta de nuevo.');
  };

  const handleLogout = () => {
    setUserCredential(null);
    navigate('/login');
  };

  // Si ya está logueado, mostrar estado de usuario
  if (userCredential) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-black rounded-full mb-4">
              <Zap className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">RunPool</h1>
          </div>

          <Card className="p-8 shadow-sm">
            <div className="text-center">
              <h2 className="text-xl font-semibold text-gray-900 mb-2">
                ¡Hola, {userCredential.name}!
              </h2>
              <p className="text-gray-600 text-sm mb-6">
                Sesión iniciada correctamente
              </p>
              
              <div className="space-y-4">
                <Button
                  onClick={() => navigate('/profile')}
                  className="w-full bg-black hover:bg-gray-800 text-white"
                >
                  Ir al perfil
                </Button>
                
                <Button
                  onClick={handleLogout}
                  variant="outline"
                  className="w-full border border-gray-300 hover:bg-gray-50"
                >
                  Cerrar sesión
                </Button>
              </div>
            </div>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID}>
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          {/* Logo y título */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-black rounded-full mb-4">
              <Zap className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">RunPool</h1>
            <p className="text-gray-600 text-sm">
              Encuentra transporte compartido a tus carreras
            </p>
          </div>

          {/* Card de login */}
          <Card className="p-8 shadow-sm">
            <div className="text-center mb-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-2">
                Bienvenido
              </h2>
              <p className="text-gray-600 text-sm">
                Inicia sesión para ver las carreras disponibles
              </p>
            </div>

            {/* Google Login Component */}
            <div className="flex justify-center">
              {isLoading ? (
                <Button
                  disabled
                  variant="outline"
                  className="w-full flex items-center justify-center gap-3 py-3 border border-gray-300"
                >
                  <div className="w-5 h-5 border-2 border-gray-300 border-t-gray-600 rounded-full animate-spin"></div>
                  Iniciando sesión...
                </Button>
              ) : (
                <GoogleLogin
                  onSuccess={handleGoogleLoginSuccess}
                  onError={handleGoogleLoginError}
                  theme="outline"
                  shape="rectangular"
                  text="signin_with"
                  width="100%"
                />
              )}
            </div>

            {/* Términos y condiciones */}
            <p className="text-xs text-gray-500 text-center mt-6 leading-relaxed">
              Al continuar, aceptas nuestros{' '}
              <a href="#" className="text-blue-600 hover:underline">
                términos y condiciones
              </a>
            </p>
          </Card>
        </div>
      </div>
    </GoogleOAuthProvider>
  );
}