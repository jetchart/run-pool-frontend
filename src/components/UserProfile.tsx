import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { UserBasicInfo } from './UserBasicInfo';
import { UserPreferences } from './UserPreferences';
import { UserFinalization } from './UserFinalization';

export function UserProfile() {
  const [currentStep, setCurrentStep] = useState(1);
  const [userData, setUserData] = useState({
    basicInfo: {},
    preferences: {},
    finalization: {}
  });
  const navigate = useNavigate();

  const handleBasicInfoNext = (data: any) => {
    setUserData(prev => ({
      ...prev,
      basicInfo: data
    }));
    setCurrentStep(2);
  };

  const handlePreferencesNext = (data: any) => {
    setUserData(prev => ({
      ...prev,
      preferences: data
    }));
    setCurrentStep(3);
  };

  const handlePreferencesBack = () => {
    setCurrentStep(1);
  };

  const handleFinalizationComplete = (data: any) => {
    const completeUserData = {
      ...userData,
      finalization: data
    };
    
    console.log('Datos completos del usuario:', completeUserData);
    // Aquí enviarías los datos al backend
    
    // Redirigir a la página principal después de completar el perfil
    navigate('/');
  };

  const handleFinalizationBack = () => {
    setCurrentStep(2);
  };

  // Renderizar el componente correspondiente según el paso actual
  switch (currentStep) {
    case 1:
      return <UserBasicInfo onNext={handleBasicInfoNext} />;
    case 2:
      return (
        <UserPreferences 
          onNext={handlePreferencesNext} 
          onBack={handlePreferencesBack} 
        />
      );
    case 3:
      return (
        <UserFinalization 
          onComplete={handleFinalizationComplete} 
          onBack={handleFinalizationBack} 
        />
      );
    default:
      return <UserBasicInfo onNext={handleBasicInfoNext} />;
  }
}