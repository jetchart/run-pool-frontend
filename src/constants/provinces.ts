import { State, City } from 'country-state-city';

// Obtener todas las provincias de Argentina directamente de la librería
const argentineStates = State.getStatesOfCountry('AR');

// Usar directamente los nombres de la librería, ordenados alfabéticamente
export const ARGENTINE_PROVINCES = argentineStates
  .map(state => state.name)
  .sort();

export type ArgentineProvince = typeof ARGENTINE_PROVINCES[number];

// Datos manuales solo para Buenos Aires y CABA (porque la librería no los maneja bien)
const MANUAL_CITIES: Record<string, string[]> = {
  'Buenos Aires': [
    'La Plata', 'Mar del Plata', 'Bahía Blanca', 'Quilmes', 'Almirante Brown',
    'Lomas de Zamora', 'Morón', 'San Isidro', 'Avellaneda', 'Lanús',
    'San Martín', 'Tres de Febrero', 'Vicente López', 'San Miguel',
    'Tigre', 'Malvinas Argentinas', 'Pilar', 'Moreno', 'Merlo',
    'Florencio Varela', 'Berazategui', 'Esteban Echeverría', 'Hurlingham',
    'Ituzaingó', 'José C. Paz', 'Tandil', 'Olavarría', 'Pergamino',
    'Junín', 'Necochea', 'Campana', 'Zárate', 'Luján', 'Mercedes',
    'Azul', 'Chivilcoy', 'Dolores', 'General Belgrano', 'Chascomús',
    'San Nicolás', 'Ramallo', 'San Pedro', 'Baradero', 'Arrecifes',
    'Capitán Sarmiento', 'Carmen de Areco', 'Chacabuco', 'Rojas',
    'Salto', 'Lobos', 'Navarro', 'Cañuelas', 'San Vicente',
    'Brandsen', 'Magdalena', 'Punta Indio', 'Castelli', 'Tordillo',
    'Maipú', 'General Paz', 'Roque Pérez', 'Las Flores', 'Saladillo',
    'Bolívar', 'Tapalqué', 'Daireaux', 'Hipólito Yrigoyen', 'Rivadavia',
    'General Alvear', 'Laprida', 'Benito Juárez', 'Tres Arroyos',
    'San Cayetano', 'Coronel Dorrego', 'Monte Hermoso', 'Villarino',
    'Patagones', 'Coronel Rosales', 'Puán', 'Saavedra', 'Tornquist',
    'Coronel Suárez', 'Guaminí', 'Adolfo Alsina', 'Trenque Lauquen',
    'Tres Lomas', 'Salliqueló', 'Pellegrini', 'Pehuajó', 'Carlos Tejedor',
    'Florentino Ameghino', 'Rivadavia', 'Lincoln', 'General Pinto',
    'Leandro N. Alem', 'Junín', 'Bragado', 'Chivilcoy', 'Suipacha',
    'Mercedes', 'Luján', 'General Rodríguez', 'Marcos Paz', 'Las Heras',
    'Matanza', 'Ezeiza', 'Presidente Perón', 'San Fernando', 'Escobar',
    'Campana', 'Exaltación de la Cruz'
  ],
  'Ciudad Autónoma de Buenos Aires': [
    'Puerto Madero', 'Retiro', 'San Nicolás', 'Montserrat', 'San Telmo',
    'La Boca', 'Barracas', 'Parque Patricios', 'Nueva Pompeya', 'Constitución',
    'San Cristóbal', 'Balvanera', 'Recoleta', 'Palermo', 'Villa Crespo',
    'Almagro', 'Caballito', 'Flores', 'Parque Chacabuco', 'Boedo',
    'Villa Soldati', 'Villa Riachuelo', 'Villa Lugano', 'Liniers',
    'Mataderos', 'Parque Avellaneda', 'Floresta', 'Monte Castro',
    'Versalles', 'Villa Luro', 'Villa del Parque', 'Villa Devoto',
    'Villa Pueyrredón', 'Villa Urquiza', 'Villa Ortúzar', 'Coghlan',
    'Saavedra', 'Chacarita', 'Paternal', 'Agronomía',
    'Parque Chas', 'Villa Santa Rita', 'Colegiales', 'Belgrano', 'Núñez'
  ]
};

// Función para obtener ciudades de una provincia
export const getCitiesByProvince = (provinceName: string): string[] => {
  // Si tenemos datos manuales, los usamos
  if (MANUAL_CITIES[provinceName]) {
    return MANUAL_CITIES[provinceName].sort();
  }

  // Para el resto de provincias, usar la librería directamente
  const state = argentineStates.find(s => s.name === provinceName);
  if (!state) return [];

  // Obtener ciudades y ordenarlas
  const cities = City.getCitiesOfState('AR', state.isoCode);
  return cities.map(city => city.name).sort();
};

// Función helper para obtener el código ISO de una provincia (útil para APIs)
export const getProvinceIsoCode = (provinceName: string): string | undefined => {
  const state = argentineStates.find(s => s.name === provinceName);
  return state?.isoCode;
};