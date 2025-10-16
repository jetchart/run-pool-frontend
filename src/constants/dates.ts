// Constantes para fechas en español
export const DAY_NAMES = ['DOM', 'LUN', 'MAR', 'MIE', 'JUE', 'VIE', 'SAB'];

export const MONTH_NAMES = [
  'enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio',
  'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre'
];

// Función helper para formatear fecha y hora
export const formatDateTime = (departureDay: Date, departureHour: string): string => {
  const date = new Date(departureDay);
  const dayName = DAY_NAMES[date.getDay()];
  const day = date.getDate();
  const month = MONTH_NAMES[date.getMonth()];
  
  return `${dayName}. ${day} ${month} • ${departureHour} hs`;
};