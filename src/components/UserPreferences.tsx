import { useState } from 'react';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { Car, Users, MessageSquare } from 'lucide-react';

interface UserPreferencesProps {
  onNext: (data: any) => void;
  onBack: () => void;
}

export function UserPreferences({ onNext, onBack }: UserPreferencesProps) {
  const [formData, setFormData] = useState({
    raceTypes: [] as string[],
    distances: [] as string[],
    travelStyle: ''
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

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
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
              Contanos un poco sobre cómo corrés
            </h2>
            <p className="text-gray-600 text-sm">
              Tus preferencias nos ayudan a recomendarte viajes y grupos que encajen con vos.
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
                {[
                  { id: 'calle', label: 'Calle', icon: Car },
                  { id: 'trail', label: 'Trail', icon: Users }
                ].map((type) => (
                  <button
                    key={type.id}
                    type="button"
                    onClick={() => handleRaceTypeToggle(type.id)}
                    className={`w-full p-3 border-2 rounded-lg text-left transition-colors flex items-center gap-3 ${
                      formData.raceTypes.includes(type.id)
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <type.icon className="w-5 h-5" />
                    <span className="font-medium">{type.label}</span>
                  </button>
                ))}
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
                {['5K', '10K', '21K', '42K'].map((distance) => (
                  <button
                    key={distance}
                    type="button"
                    onClick={() => handleDistanceToggle(distance)}
                    className={`p-3 border-2 rounded-lg text-center transition-colors ${
                      formData.distances.includes(distance)
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className="font-medium">{distance}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Cómo solés viajar */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                ¿Cómo solés viajar a las carreras?
              </label>
              <div className="space-y-2">
                {[
                  { id: 'solo', label: 'Voy solo', icon: '🏃‍♂️' },
                  { id: 'amigos', label: 'Voy con amigos/familia', icon: '👥' },
                  { id: 'gente', label: 'Suelo llevar gente', icon: '💬' }
                ].map((style) => (
                  <button
                    key={style.id}
                    type="button"
                    onClick={() => handleTravelStyleSelect(style.id)}
                    className={`w-full p-4 border-2 rounded-lg text-left transition-colors flex items-center gap-3 ${
                      formData.travelStyle === style.id
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <span className="text-xl">{style.icon}</span>
                    <span className="font-medium">{style.label}</span>
                  </button>
                ))}
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
              className="bg-gray-900 hover:bg-gray-800 text-white px-6"
            >
              Siguiente
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
}