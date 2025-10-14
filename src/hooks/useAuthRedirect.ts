import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export const useAuthRedirect = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    checkAuthStatus();
  }, []);

  const checkAuthStatus = () => {
    const storedUser = localStorage.getItem('userCredential');
    if (storedUser) {
      try {
        const userCredential = JSON.parse(storedUser);
        const isValid = userCredential.token && userCredential.userId;
        setIsAuthenticated(isValid);
      } catch (error) {
        localStorage.removeItem('userCredential');
        setIsAuthenticated(false);
      }
    } else {
      setIsAuthenticated(false);
    }
    setIsLoading(false);
  };

  const requireAuth = (callback?: () => void) => {
    if (!isAuthenticated) {
      // Guardar la URL actual para redirección después del login
      const currentPath = window.location.pathname + window.location.search;
      localStorage.setItem('redirectAfterLogin', currentPath);
      
      navigate('/login');
      return false;
    }
    
    if (callback) callback();
    return true;
  };

  const logout = () => {
    localStorage.removeItem('userCredential');
    localStorage.removeItem('redirectAfterLogin');
    setIsAuthenticated(false);
    navigate('/login');
  };

  return {
    isAuthenticated,
    isLoading,
    requireAuth,
    logout,
    checkAuthStatus
  };
};