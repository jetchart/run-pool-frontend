import { useState } from 'react';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { Info } from 'lucide-react';

interface UserFinalizationProps {
  onComplete: (data: any) => void;
  onBack: () => void;
  validationErrors?: string[];
}

export function UserFinalization({ onComplete, onBack, validationErrors = [] }: UserFinalizationProps) {
  const [formData, setFormData] = useState({
    driverMode: false,
    carBrand: '',
    carModel: '',
    carColor: '',
    availableSeats: '',
    fuelType: '',
    licensePlate: ''
  });

  const handleDriverModeToggle = () => {
    setFormData(prev => ({
      ...prev,
      driverMode: !prev.driverMode
    }));
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleComplete = () => {
    onComplete(formData);
  };

  // Validar si se puede habilitar el botón
  const isFormValid = () => {
    if (!formData.driverMode) {
      return true; // Si no es conductor, siempre es válido
    }
    
    // Si es conductor, validar campos del auto
    return (
      formData.carBrand.trim().length >= 2 &&
      formData.carModel.trim().length >= 1 &&
      formData.carColor.trim().length >= 2 &&
      formData.availableSeats !== '' &&
      parseInt(formData.availableSeats) >= 1 &&
      parseInt(formData.availableSeats) <= 8 &&
      formData.licensePlate.trim().length >= 6
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Header con progreso */}
        <div className="text-center mb-8">
          <div className="text-sm text-gray-500 mb-2">Paso 3 de 3</div>
          <div className="w-full bg-gray-200 rounded-full h-1 mb-6">
            <div className="bg-black h-1 rounded-full w-full"></div>
          </div>
          <div className="text-sm text-gray-500 mb-1">100%</div>
        </div>

        {/* Errores de validación */}
        {validationErrors.length > 0 && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
            <h3 className="text-sm font-medium text-red-800 mb-2">
              Por favor corrige los siguientes errores:
            </h3>
            <ul className="list-disc list-inside space-y-1">
              {validationErrors.map((error, index) => (
                <li key={index} className="text-sm text-red-700">{error}</li>
              ))}
            </ul>
          </div>
        )}

        <Card className="p-8 shadow-sm">
          <div className="text-center mb-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-2">
              ¿Tenés auto para compartir?
            </h2>
            <p className="text-gray-600 text-sm">
              Compartí tu auto con otros runners y ayudá a más personas a llegar a la largada 🚗💨
            </p>
          </div>

          <div className="space-y-6">
            {/* Toggle de modo conductor */}
            <div className="bg-gray-50 p-4 rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <div>
                  <h3 className="font-medium text-gray-900">Activar modo conductor</h3>
                  <p className="text-sm text-gray-600">Podés ofrecer lugares en tu auto para las carreras</p>
                </div>
                <button
                  onClick={handleDriverModeToggle}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                    formData.driverMode ? 'bg-blue-600' : 'bg-gray-300'
                  }`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      formData.driverMode ? 'translate-x-6' : 'translate-x-1'
                    }`}
                  />
                </button>
              </div>
            </div>

            {/* Información visible solo para pasajeros */}
            {formData.driverMode && (
              <div className="flex items-start gap-2 p-3 bg-blue-50 rounded-lg">
                <Info className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" />
                <p className="text-xs text-blue-700">
                  Esta información será visible solo para pasajeros confirmados
                </p>
              </div>
            )}

            {/* Campos del auto - Solo visibles si está activado el modo conductor */}
            {formData.driverMode && (
              <div className="space-y-4">
                {/* Marca y Modelo */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Marca
                    </label>
                    <input
                      type="text"
                      name="carBrand"
                      value={formData.carBrand}
                      onChange={handleInputChange}
                      placeholder="Ej: Toyota"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Modelo
                    </label>
                    <input
                      type="text"
                      name="carModel"
                      value={formData.carModel}
                      onChange={handleInputChange}
                      placeholder="Ej: Corolla"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                </div>

                {/* Color */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Color
                  </label>
                  <input
                    type="text"
                    name="carColor"
                    value={formData.carColor}
                    onChange={handleInputChange}
                    placeholder="Ej: Blanco"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                {/* Cantidad de asientos */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Cantidad de asientos disponibles
                  </label>
                  <select
                    name="availableSeats"
                    value={formData.availableSeats}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-500"
                  >
                    <option value="">Selecciona cantidad de asientos</option>
                    <option value="1">1 asiento</option>
                    <option value="2">2 asientos</option>
                    <option value="3">3 asientos</option>
                    <option value="4">4 asientos</option>
                    <option value="5">5 asientos</option>
                  </select>
                </div>

                {/* Tipo de combustible */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Tipo de combustible <span className="text-gray-400">(opcional)</span>
                  </label>
                  <select
                    name="fuelType"
                    value={formData.fuelType}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-500"
                  >
                    <option value="">Selecciona tipo de combustible</option>
                    <option value="nafta">Nafta</option>
                    <option value="gasoil">Gasoil</option>
                    <option value="gnc">GNC</option>
                    <option value="electrico">Eléctrico</option>
                    <option value="hibrido">Híbrido</option>
                  </select>
                </div>

                {/* Patente */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Patente
                  </label>
                  <input
                    type="text"
                    name="licensePlate"
                    value={formData.licensePlate}
                    onChange={handleInputChange}
                    placeholder="Ej: ABC123"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Solo será visible para pasajeros confirmados
                  </p>
                </div>
              </div>
            )}
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
              onClick={handleComplete}
              className="bg-gray-900 hover:bg-gray-800 text-white px-6 disabled:bg-gray-400 disabled:cursor-not-allowed"
              disabled={!isFormValid()}
            >
              Guardar
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
}