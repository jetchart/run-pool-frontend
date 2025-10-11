import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { UserBasicInfo } from './UserBasicInfo';
import { UserPreferences } from './UserPreferences';
import { UserFinalization } from './UserFinalization';
import { 
  CreateCompleteUserProfileDto, 
  Gender, 
  RunningExperience, 
  UsuallyTravelRace,
  RaceType,
  CreateUserProfileCarDto,
  CreateUserProfileRaceTypeDto,
  CreateUserProfileDistanceDto,
  Distance
} from '../types/userProfile.types';

declare global {
  interface ImportMeta {
    env: {
      VITE_BACKEND_URL: any;
      VITE_GOOGLE_CLIENT_ID: string;
    };
  }
}

interface BasicInfoData {
  firstName: string;
  lastName: string;
  birthYear: string;
  gender: string;
  experience: string;
  email: string;
}

interface PreferencesData {
  raceTypes: string[];
  distances: string[];
  travelStyle: string;
}

interface FinalizationData {
  driverMode: boolean;
  carBrand: string;
  carModel: string;
  carColor: string;
  availableSeats: string;
  fuelType: string;
  licensePlate: string;
}

export function UserProfile() {
  const [currentStep, setCurrentStep] = useState(1);
  const [userData, setUserData] = useState<{
    basicInfo: BasicInfoData | {};
    preferences: PreferencesData | {};
    finalization: FinalizationData | {};
  }>({
    basicInfo: {},
    preferences: {},
    finalization: {}
  });
  const navigate = useNavigate();

  // Mapeo de valores del formulario a enums
  const mapGender = (gender: string): Gender => {
    switch (gender) {
      case 'masculino': return Gender.MASCULINE;
      case 'femenino': return Gender.FEMININE;
      case 'no-binario': return Gender.NON_BINARY;
      case 'otro': return Gender.OTHER;
      default: return Gender.PREFER_NOT_TO_SAY;
    }
  };

  const mapExperience = (experience: string): RunningExperience => {
    switch (experience) {
      case 'principiante': return RunningExperience.BEGINNER;
      case 'intermedio': return RunningExperience.INTERMEDIATE;
      case 'avanzado': return RunningExperience.ADVANCED;
      default: return RunningExperience.BEGINNER;
    }
  };

  const mapTravelStyle = (style: string): UsuallyTravelRace => {
    switch (style) {
      case 'solo': return UsuallyTravelRace.GO_ALONE;
      case 'amigos': return UsuallyTravelRace.GO_WITH_FRIENDS_FAMILY;
      case 'gente': return UsuallyTravelRace.USUALLY_BRING_PEOPLE;
      default: return UsuallyTravelRace.GO_ALONE;
    }
  };

  const mapRaceTypes = (raceTypes: string[]): CreateUserProfileRaceTypeDto[] => {
    return raceTypes.map(type => ({
      raceType: type === 'calle' ? RaceType.STREET : RaceType.TRAIL
    }));
  };

  const mapDistances = (distances: string[]): CreateUserProfileDistanceDto[] => {
    // Mapeo de distancias usando los valores reales del enum Distance
    const distanceMap: { [key: string]: Distance } = {
      '5K': Distance.FIVE_K,      // 5
      '10K': Distance.TEN_K,      // 20
      '21K': Distance.TWENTY_ONE_K, // 21
      '42K': Distance.FORTY_TWO_K   // 42
    };

    return distances.map(distance => ({
      distance: distanceMap[distance] || Distance.FIVE_K
    }));
  };

  const buildCompleteDTO = (completeUserData?: any): CreateCompleteUserProfileDto => {
    const data = completeUserData || userData;
    const basicInfo = data.basicInfo as BasicInfoData;
    const preferences = data.preferences as PreferencesData;
    const finalization = data.finalization as FinalizationData;

    // Obtener userId del localStorage (del login)
    const storedUser = localStorage.getItem('userCredential');
    let userId = 1; // valor por defecto
    if (storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser);
        userId = parsedUser.id || parsedUser.userId || 1;
      } catch (error) {
        console.error('Error parsing user credential:', error);
      }
    }

    const dto: CreateCompleteUserProfileDto = {
      userId,
      name: basicInfo.firstName || '',
      surname: basicInfo.lastName || '',
      email: basicInfo.email || '',
      birthYear: parseInt(basicInfo.birthYear) || new Date().getFullYear(),
      gender: mapGender(basicInfo.gender),
      runningExperience: mapExperience(basicInfo.experience),
      usuallyTravelRace: mapTravelStyle(preferences.travelStyle),
      preferredRaceTypes: mapRaceTypes(preferences.raceTypes || []),
      preferredDistances: mapDistances(preferences.distances || [])
    };

    // Agregar información del auto si está en modo conductor
    if (finalization.driverMode && finalization.carBrand) {
      const currentYear = new Date().getFullYear();
      dto.cars = [{
        brand: finalization.carBrand,
        model: finalization.carModel || '',
        year: currentYear, // Podrías pedir el año en el formulario
        color: finalization.carColor || '',
        seats: parseInt(finalization.availableSeats) || 1,
        licensePlate: finalization.licensePlate || ''
      }];
    }

    return dto;
  };

  const sendToBackend = async (dto: CreateCompleteUserProfileDto) => {
    try {
      const storedUser = localStorage.getItem('userCredential');
      let token = '';
      if (storedUser) {
        const parsedUser = JSON.parse(storedUser);
        token = parsedUser.token || parsedUser.accessToken || '';
      }

      const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/user-profiles`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(dto),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      console.log('Profile created successfully:', result);
      return result;
    } catch (error) {
      console.error('Error creating user profile:', error);
      throw error;
    }
  };

  const handleBasicInfoNext = (data: BasicInfoData) => {
    setUserData(prev => ({
      ...prev,
      basicInfo: data
    }));
    setCurrentStep(2);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handlePreferencesNext = (data: PreferencesData) => {
    setUserData(prev => ({
      ...prev,
      preferences: data
    }));
    setCurrentStep(3);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handlePreferencesBack = () => {
    setCurrentStep(1);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleFinalizationComplete = async (data: FinalizationData) => {
    // Crear los datos completos con los datos finales recibidos
    const completeUserData = {
      ...userData,
      finalization: data
    };
    setUserData(completeUserData);

    // Construir el DTO completo con los datos actuales
    const dto = buildCompleteDTO(completeUserData);
    
    try {
      // Enviar al backend
      await sendToBackend(dto);
      
      console.log('Datos completos enviados al backend:', dto);
      
      // Redirigir a la página principal después de completar el perfil
      navigate('/');
    } catch (error) {
      alert('Error al guardar el perfil. Por favor, intenta de nuevo.');
      console.error('Error sending profile to backend:', error);
    }
  };

  const handleFinalizationBack = () => {
    setCurrentStep(2);
    // Scroll al top cuando se cambia de step
    window.scrollTo({ top: 0, behavior: 'smooth' });
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