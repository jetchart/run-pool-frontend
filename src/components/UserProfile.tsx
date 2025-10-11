import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
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
  Distance,
  UserProfileResponse
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
  carYear: string;
  availableSeats: string;
  fuelType: string;
  licensePlate: string;
}

export function UserProfile() {
  const [currentStep, setCurrentStep] = useState(1);
  const [isEditMode, setIsEditMode] = useState(false);
  const [isLoadingProfile, setIsLoadingProfile] = useState(false);
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
  const location = useLocation();

  // Efecto para detectar modo edición y precargar datos
  useEffect(() => {
    if (location.state?.editMode && location.state?.profileData) {
      setIsLoadingProfile(true);
      setIsEditMode(true);
      setCurrentStep(1); // Asegurar que empezamos desde el primer paso
      const profile = location.state.profileData as UserProfileResponse;
      
      // Mapear datos del perfil a formulario
      console.log('preferredRaceTypes:', profile.preferredRaceTypes);
      console.log('preferredDistances:', profile.preferredDistances);
      console.log('usuallyTravelRace:', profile.usuallyTravelRace);
      console.log('cars:', profile.cars);
      
      const preloadedData = {
        basicInfo: {
          firstName: profile.name || '',
          lastName: profile.surname || '',
          birthYear: profile.birthYear?.toString() || '',
          gender: mapGenderToForm(profile.gender),
          experience: mapExperienceToForm(profile.runningExperience),
          email: profile.email || ''
        },
        preferences: {
          raceTypes: profile.preferredRaceTypes?.map((rt: any) => mapRaceTypeToForm(rt.raceType)) || [],
          distances: profile.preferredDistances?.map((d: any) => mapDistanceToForm(d.distance)) || [],
          travelStyle: mapTravelStyleToForm(profile.usuallyTravelRace)
        },
        finalization: {
          driverMode: profile.cars && profile.cars.length > 0,
          carBrand: profile.cars?.[0]?.brand || '',
          carModel: profile.cars?.[0]?.model || '',
          carColor: profile.cars?.[0]?.color || '',
          carYear: profile.cars?.[0]?.year?.toString() || '',
          availableSeats: profile.cars?.[0]?.seats?.toString() || '',
          fuelType: '', // No tenemos esta información en el perfil
          licensePlate: profile.cars?.[0]?.licensePlate || ''
        }
      };
      
      setUserData(preloadedData);
      setIsLoadingProfile(false);
    }
  }, [location.state]);

  // Funciones para mapear de enum a formulario
  const mapGenderToForm = (gender: any): string => {
    switch (gender) {
      case 1:
      case 'MASCULINE': return 'masculino';
      case 2:
      case 'FEMININE': return 'femenino';
      case 3:
      case 'NON_BINARY': return 'no-binario';
      case 4:
      case 'OTHER': return 'otro';
      case 0:
      case 'PREFER_NOT_TO_SAY':
      default: return 'prefiero-no-decir';
    }
  };

  const mapExperienceToForm = (experience: any): string => {
    switch (experience) {
      case 1:
      case 'BEGINNER': return '1';
      case 2:
      case 'INTERMEDIATE': return '2';
      case 3:
      case 'ADVANCED': return '3';
      default: return '1';
    }
  };

  const mapRaceTypeToForm = (raceType: any): string => {
    switch (raceType) {
      case 0:
      case 'STREET': return 'calle';
      case 1:
      case 'TRAIL': return 'trail';
      default: return 'calle';
    }
  };

  const mapDistanceToForm = (distance: any): string => {
    switch (distance) {
      case 0:
      case 'FIVE_K': return '5K';
      case 1:
      case 'TEN_K': return '10K';
      case 2:
      case 'HALF_MARATHON': return 'media-maraton';
      case 3:
      case 'MARATHON': return 'maraton';
      case 4:
      case 'ULTRA_MARATHON': return 'ultra-maraton';
      default: return '5K';
    }
  };

  const mapTravelStyleToForm = (travelStyle: any): string => {
    switch (travelStyle) {
      case 0:
      case 'ALONE': return 'solo';
      case 1:
      case 'WITH_FRIENDS': return 'con-amigos';
      case 2:
      case 'WITH_FAMILY': return 'con-familia';
      case 3:
      case 'WITH_PARTNER': return 'con-pareja';
      default: return 'solo';
    }
  };

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
      case '1': return RunningExperience.BEGINNER;
      case '2': return RunningExperience.INTERMEDIATE;
      case '3': return RunningExperience.ADVANCED;
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
      let userId = '';
      if (storedUser) {
        const parsedUser = JSON.parse(storedUser);
        token = parsedUser.token || parsedUser.accessToken || '';
        userId = parsedUser.id || parsedUser.userId || '';
      }

      // Usar PUT para actualizar, POST para crear
      const method = isEditMode ? 'PUT' : 'POST';
      const url = isEditMode 
        ? `${import.meta.env.VITE_BACKEND_URL}/user-profiles/user/${userId}`
        : `${import.meta.env.VITE_BACKEND_URL}/user-profiles`;

      const response = await fetch(url, {
        method: method,
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
      console.log(`Profile ${isEditMode ? 'updated' : 'created'} successfully:`, result);
      return result;
    } catch (error) {
      console.error(`Error ${isEditMode ? 'updating' : 'creating'} user profile:`, error);
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
      
      // Mostrar mensaje de éxito
      if (isEditMode) {
        alert('Perfil actualizado exitosamente');
        // Redirigir de vuelta al perfil
        const storedUser = localStorage.getItem('userCredential');
        if (storedUser) {
          const parsedUser = JSON.parse(storedUser);
          const userId = parsedUser.id || parsedUser.userId;
          navigate(`/profile/${userId}`);
        } else {
          navigate('/');
        }
      } else {
        // Redirigir a la página principal después de crear el perfil
        navigate('/');
      }
    } catch (error) {
      const action = isEditMode ? 'actualizar' : 'guardar';
      alert(`Error al ${action} el perfil. Por favor, intenta de nuevo.`);
      console.error('Error sending profile to backend:', error);
    }
  };

  const handleFinalizationBack = () => {
    setCurrentStep(2);
    // Scroll al top cuando se cambia de step
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Mostrar loading si estamos en modo edición y aún cargando los datos
  if (isEditMode && isLoadingProfile) {
    return (
      <div className="min-h-[calc(100vh-4rem)] bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto mb-4"></div>
          <p className="text-gray-600">Cargando datos del perfil...</p>
        </div>
      </div>
    );
  }

  // Renderizar el componente correspondiente según el paso actual
  switch (currentStep) {
    case 1:
      return (
        <UserBasicInfo 
          onNext={handleBasicInfoNext} 
          initialData={userData.basicInfo as any}
          isEditMode={isEditMode}
        />
      );
    case 2:
      return (
        <UserPreferences 
          onNext={handlePreferencesNext} 
          onBack={handlePreferencesBack} 
          initialData={userData.preferences as any}
          isEditMode={isEditMode}
        />
      );
    case 3:
      return (
        <UserFinalization 
          onComplete={handleFinalizationComplete} 
          onBack={handleFinalizationBack} 
          initialData={userData.finalization as any}
          isEditMode={isEditMode}
        />
      );
    default:
      return <UserBasicInfo onNext={handleBasicInfoNext} />;
  }
}