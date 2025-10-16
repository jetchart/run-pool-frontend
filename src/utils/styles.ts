// Utility para obtener colores según disponibilidad de asientos
export const getAvailabilityColor = (availableSeats: number): string => {
  if (availableSeats >= 3) return 'bg-green-600 text-white';
  if (availableSeats > 0) return 'bg-yellow-300 text-white';
  return 'bg-red-600 text-white';
};

// Utility para obtener texto de disponibilidad
export const getAvailabilityText = (availableSeats: number, totalSeats: number): string => {
  return `${totalSeats - availableSeats} / ${totalSeats}`;
};

// Utility para obtener clases CSS comunes de botones
export const getButtonVariants = {
  primary: 'bg-blue-600 hover:bg-blue-700 text-white',
  secondary: 'bg-gray-200 hover:bg-gray-300 text-gray-900',
  success: 'bg-green-600 hover:bg-green-700 text-white',
  danger: 'bg-red-600 hover:bg-red-700 text-white',
  outline: 'border border-gray-300 bg-white hover:bg-gray-50 text-gray-700'
};