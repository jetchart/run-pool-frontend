import { toast } from 'sonner';
import { NavigateFunction } from 'react-router-dom';

// Utility para obtener el usuario almacenado en localStorage
export const getStoredUser = () => {
  try {
    const storedUser = localStorage.getItem('userCredential');
    return storedUser ? JSON.parse(storedUser) : null;
  } catch (error) {
    console.error('Error parsing stored user:', error);
    return null;
  }
};

// Utility para verificar autenticación con redirección automática
export const requireAuth = (navigate: NavigateFunction, customMessage?: string): boolean => {
  const storedUser = getStoredUser();
  
  if (!storedUser) {
    toast.error(customMessage || 'No estás autenticado');
    navigate('/login');
    return false;
  }
  
  return true;
};

// Utility para verificar autenticación con toast personalizable
export const checkAuthWithToast = (navigate: NavigateFunction, message: string = 'Debes iniciar sesión'): boolean => {
  const storedUser = getStoredUser();
  
  if (!storedUser) {
    toast.error(message);
    navigate('/login');
    return false;
  }
  
  return true;
};