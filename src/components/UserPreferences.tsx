import { useState } from 'react';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { Car, Users, MessageSquare } from 'lucide-react';
import { USUALLY_TRAVEL_RACE_INFO, UsuallyTravelRace, RaceType, Distance, DISTANCE_INFO } from '../types/userProfile.types';

interface UserPreferencesProps {
  onNext: (data: any) => void;
  onBack: () => void;
  initialData?: {
    raceTypes: string[];
    distances: string[];
    travelStyle: string;
  };
  isEditMode?: boolean;
}

export function UserPreferences({ onNext, onBack, initialData, isEditMode = false }: UserPreferencesProps) {
  const [formData, setFormData] = useState({
    raceTypes: initialData?.raceTypes || [] as string[],
    distances: initialData?.distances || [] as string[],
    travelStyle: initialData?.travelStyle || ''
  });

  const handleRaceTypeToggle = (type: string) => {
    setFormData(prev => ({
      ...prev,
      raceTypes: prev.raceTypes.includes(type)
        ? prev.raceTypes.filter(t => t !== type)
        : [...prev.raceTypes, type]
    }));
  };

  const handleDistanceToggle = (distance: string) => {
    setFormData(prev => ({
      ...prev,
      distances: prev.distances.includes(distance)
        ? prev.distances.filter(d => d !== distance)
        : [...prev.distances, distance]
    }));
  };

  const handleTravelStyleSelect = (style: string) => {
    setFormData(prev => ({
      ...prev,
      travelStyle: style
    }));
  };

  const handleNext = () => {
    onNext(formData);
  };

  // Validar si se puede habilitar el botón
  const isFormValid = () => {
    return (
      formData.raceTypes.length > 0 &&
      formData.distances.length > 0 &&
      formData.travelStyle !== ''
    );
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-gray-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Header con progreso */}
        <div className="text-center mb-8">
          <div className="text-sm text-gray-500 mb-2">Paso 2 de 3</div>
          <div className="w-full bg-gray-200 rounded-full h-1 mb-6">
            <div className="bg-black h-1 rounded-full w-2/3"></div>
          </div>
          <div className="text-sm text-gray-500 mb-1">67%</div>
        </div>

        <Card className="p-8 shadow-sm">
          <div className="text-center mb-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-2">
              {isEditMode ? 'Actualiza tus preferencias' : 'Contanos un poco sobre cómo corrés'}
            </h2>
            <p className="text-gray-600 text-sm">
              {isEditMode 
                ? 'Modifica tus preferencias de running según como hayas evolucionado.'
                : 'Tus preferencias nos ayudan a recomendarte viajes y grupos que encajen con vos.'
              }
            </p>
          </div>

          <div className="space-y-6">
            {/* Tipo de carrera preferida */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Tipo de carrera preferida
              </label>
              <p className="text-xs text-gray-500 mb-3">
                Podés seleccionar más de una opción
              </p>
              <div className="space-y-2">
                {Object.values(RaceType).map((raceType) => {
                  const raceKey = raceType === RaceType.STREET ? 'calle' : 'trail';
                  const icon = raceType === RaceType.STREET ? Car : Users;
                  const IconComponent = icon;
                  
                  return (
                    <button
                      key={raceType}
                      type="button"
                      onClick={() => handleRaceTypeToggle(raceKey)}
                      className={`w-full p-3 border-2 rounded-lg text-left transition-colors flex items-center gap-3 ${
                        formData.raceTypes.includes(raceKey)
                          ? 'border-blue-500 bg-blue-50'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <IconComponent className="w-5 h-5" />
                      <span className="font-medium">{raceType}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Distancias favoritas */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Distancias favoritas
              </label>
              <p className="text-xs text-gray-500 mb-3">
                Podés seleccionar más de una opción
              </p>
              <div className="grid grid-cols-2 gap-3">
                {Object.values(Distance).filter(value => typeof value === 'number').map((distanceValue) => {
                  const distanceInfo = DISTANCE_INFO[distanceValue as Distance];
                  return (
                    <button
                      key={distanceValue}
                      type="button"
                      onClick={() => handleDistanceToggle(distanceInfo.shortDescription)}
                      className={`p-3 border-2 rounded-lg text-center transition-colors ${
                        formData.distances.includes(distanceInfo.shortDescription)
                          ? 'border-blue-500 bg-blue-50'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <div className="font-medium">{distanceInfo.shortDescription}</div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Cómo solés viajar */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                ¿Cómo solés viajar a las carreras?
              </label>
              <div className="space-y-2">
                {Object.values(UsuallyTravelRace).filter(value => typeof value === 'number').map((travelValue) => {
                  const travelInfo = USUALLY_TRAVEL_RACE_INFO[travelValue as UsuallyTravelRace];
                  const travelKey = travelValue === UsuallyTravelRace.GO_ALONE ? 'solo' :
                                   travelValue === UsuallyTravelRace.GO_WITH_FRIENDS_FAMILY ? 'amigos' : 'gente';
                  
                  const icon = travelValue === UsuallyTravelRace.GO_ALONE ? '🏃‍♂️' :
                              travelValue === UsuallyTravelRace.GO_WITH_FRIENDS_FAMILY ? '👥' : '💬';
                  
                  return (
                    <button
                      key={travelValue}
                      type="button"
                      onClick={() => handleTravelStyleSelect(travelKey)}
                      className={`w-full p-4 border-2 rounded-lg text-left transition-colors flex items-center gap-3 ${
                        formData.travelStyle === travelKey
                          ? 'border-blue-500 bg-blue-50'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <span className="text-xl">{icon}</span>
                      <span className="font-medium">{travelInfo.description}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Botones */}
          <div className="flex justify-between mt-8">
            <Button
              onClick={onBack}
              variant="ghost"
              className="text-gray-600 hover:text-gray-800"
            >
              Atrás
            </Button>
            
            <Button
              onClick={handleNext}
              className="bg-gray-900 hover:bg-gray-800 text-white px-6 disabled:bg-gray-400 disabled:cursor-not-allowed"
              disabled={!isFormValid()}
            >
              Siguiente
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
}