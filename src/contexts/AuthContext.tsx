import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import axiosAuth from '../lib/axios';

interface UserCredential {
  token?: string;
  accessToken?: string;
  name?: string;
  email?: string;
  id?: number;
  userId?: number;
  [key: string]: any;
}

interface AuthContextType {
  userCredential: UserCredential | null;
  setUserCredential: (user: UserCredential | null) => void;
  updateUserProfile: () => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [userCredential, setUserCredentialState] = useState<UserCredential | null>(null);

  useEffect(() => {
    // Cargar usuario del localStorage al inicializar
    const stored = localStorage.getItem('userCredential');
    if (stored) {
      try {
        const parsedCredential = JSON.parse(stored);
        setUserCredentialState(parsedCredential);
      } catch {
        setUserCredentialState(null);
        localStorage.removeItem('userCredential');
      }
    }
  }, []);

  const setUserCredential = (user: UserCredential | null) => {
    setUserCredentialState(user);
    if (user) {
      localStorage.setItem('userCredential', JSON.stringify(user));
    } else {
      localStorage.removeItem('userCredential');
    }
  };

  const updateUserProfile = async () => {
    if (!userCredential?.userId && !userCredential?.id) {
      console.warn('No hay usuario logueado para actualizar');
      return;
    }

    try {
      const userId = userCredential.userId || userCredential.id;
      const response = await axiosAuth.get(`/users/${userId}`);
      
      // Actualizar el userCredential con la nueva información, pero manteniendo el token
      const updatedCredential = {
        ...(response.data as UserCredential),
        accessToken: userCredential?.accessToken
      };
      
      setUserCredential(updatedCredential);
    } catch (error) {
      console.error('Error al actualizar el perfil del usuario:', error);
    }
  };

  const logout = () => {
    setUserCredential(null);
  };

  return (
    <AuthContext.Provider value={{ userCredential, setUserCredential, updateUserProfile, logout }}>
      {children}
    </AuthContext.Provider>
  );
};