import { useState, useEffect } from 'react';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { Camera, Medal } from 'lucide-react';
import { GENDER_INFO, Gender, RUNNING_EXPERIENCE_INFO, RunningExperience } from '../types/userProfile.types';

interface UserBasicInfoProps {
  onNext: (data: any) => void;
  initialData?: {
    firstName: string;
    lastName: string;
    birthYear: string;
    gender: string;
    experience: string;
    email: string;
  };
  isEditMode?: boolean;
}

export function UserBasicInfo({ onNext, initialData, isEditMode = false }: UserBasicInfoProps) {
  const [formData, setFormData] = useState({
    firstName: initialData?.firstName || '',
    lastName: initialData?.lastName || '',
    birthYear: initialData?.birthYear || '',
    gender: initialData?.gender || '',
    experience: initialData?.experience || '',
    email: initialData?.email || ''
  });

  // Actualizar formData cuando cambien los initialData
  useEffect(() => {
    if (initialData && isEditMode) {
      setFormData({
        firstName: initialData.firstName || '',
        lastName: initialData.lastName || '',
        birthYear: initialData.birthYear || '',
        gender: initialData.gender || '',
        experience: initialData.experience || '',
        email: initialData.email || ''
      });
    }
  }, [initialData, isEditMode]);

  useEffect(() => {
    if (!isEditMode) {
      const storedUser = localStorage.getItem('userCredential');
      if (storedUser) {
        try {
          const parsedUser = JSON.parse(storedUser);
          
          setFormData(prev => ({
            ...prev,
            firstName: parsedUser.given_name || parsedUser.givenName || '',
            lastName: parsedUser.family_name || parsedUser.familyName || '',
            email: parsedUser.email || ''
          }));
        } catch (error) {
          console.error('Error parsing user credential:', error);
        }
      }
    }
  }, [isEditMode, initialData]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleExperienceSelect = (experienceId: string) => {
    setFormData(prev => ({
      ...prev,
      experience: experienceId
    }));
  };

  const handleNext = () => {
    onNext(formData);
  };

  const handleSkip = () => {
    onNext(formData);
  };

  // Validar si se pueden habilitar los botones
  const isFormValid = () => {
    return (
      formData.firstName.trim().length >= 1 &&
      formData.lastName.trim().length >= 1 &&
      formData.birthYear !== '' &&
      formData.email.includes('@') &&
      formData.experience !== ''
    );
  };

  // Generar opciones de años (desde 1950 hasta año actual)
  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: currentYear - 1949 }, (_, i) => currentYear - i);

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-gray-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Header con progreso */}
        <div className="text-center mb-4">
          <div className="text-sm text-gray-500 mb-2">Paso 1 de 3</div>
          <div className="w-full bg-gray-200 rounded-full h-1 mb-4">
            <div className="bg-black h-1 rounded-full w-1/3"></div>
          </div>
          <div className="text-sm text-gray-500 mb-1">33%</div>
        </div>

        <Card className="p-8 shadow-sm">
          <div className="text-center mb-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-2">
              {isEditMode ? '¡Actualiza tu información!' : '¡Queremos conocerte!'}
            </h2>
            <p className="text-gray-600 text-sm">
              {isEditMode 
                ? 'Modifica los campos que desees actualizar en tu perfil.'
                : 'Esto nos ayuda a conectarte con otros runners que comparten tu ritmo y energía.'
              }
            </p>
          </div>

          {/* Avatar */}
          <div className="flex justify-center mb-6">
            <div className="relative">
              <div className="w-16 h-16 bg-black rounded-full flex items-center justify-center">
                <span className="text-white text-xl font-bold">?</span>
              </div>
              <button className="absolute -bottom-1 -right-1 w-6 h-6 bg-gray-600 rounded-full flex items-center justify-center">
                <Camera className="w-3 h-3 text-white" />
              </button>
            </div>
          </div>

          <div className="space-y-4">
            {/* Nombre y Apellido */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Nombre
                </label>
                <input
                  type="text"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Apellido
                </label>
                <input
                  type="text"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>

            {/* Año de nacimiento */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Año de nacimiento
              </label>
              <select
                name="birthYear"
                value={formData.birthYear}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-500"
              >
                <option value="">Selecciona tu año de nacimiento</option>
                {years.map(year => (
                  <option key={year} value={year}>{year}</option>
                ))}
              </select>
            </div>

            {/* Género / Pronombres */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Género / Pronombres <span className="text-gray-400">(opcional)</span>
              </label>
              <select
                name="gender"
                value={formData.gender}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-500"
              >
                <option value="">Selecciona una opción</option>
                {Object.values(Gender).filter(value => typeof value === 'number').map((genderValue) => (
                  <option key={genderValue} value={GENDER_INFO[genderValue as Gender].description.toLowerCase()}>
                    {GENDER_INFO[genderValue as Gender].description}
                  </option>
                ))}
              </select>
            </div>

            {/* Nivel de experiencia */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Nivel de experiencia en running
              </label>
              <div className="grid grid-cols-3 gap-3">
                {Object.values(RunningExperience).filter(value => typeof value === 'number').map((experienceValue) => {
                  const experienceInfo = RUNNING_EXPERIENCE_INFO[experienceValue as RunningExperience];
                  
                  return (
                    <button
                      key={experienceValue}
                      type="button"
                      onClick={() => handleExperienceSelect(experienceValue.toString())}
                      className={`p-3 border-2 rounded-lg text-center transition-colors ${
                        formData.experience === experienceValue.toString()
                          ? 'border-blue-500 bg-blue-50'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <div className='flex flex-col gap-1 justify-center items-center'>
                        {experienceValue === RunningExperience.BEGINNER && (<Medal className="w-3 h-3" />)}
                        {experienceValue === RunningExperience.INTERMEDIATE && (<Medal className="w-4 h-4" />)}
                        {experienceValue === RunningExperience.ADVANCED && (<Medal className="w-5 h-5" />)}
                        <div className="text-xs font-medium">{experienceInfo.description}</div>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Correo electrónico */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Correo electrónico
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-gray-100"
                disabled
              />
              <p className="text-xs text-gray-500 mt-1">
                Completado automáticamente desde tu cuenta de Gmail
              </p>
            </div>
          </div>

          {/* Botones */}
          <div className="flex justify-between mt-8">
            <Button
              variant="ghost"
              className="text-gray-600 hover:text-gray-800"
            >
              Atrás
            </Button>
            
            <div className="flex gap-3">
              <Button
                onClick={handleNext}
                className="bg-gray-900 hover:bg-gray-800 text-white px-6 disabled:bg-gray-400 disabled:cursor-not-allowed"
                disabled={!isFormValid()}
              >
                Siguiente
              </Button>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}