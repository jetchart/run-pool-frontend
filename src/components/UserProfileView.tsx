import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axiosAuth from '../lib/axios';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { 
  UserProfileResponse, 
  GENDER_INFO, 
  RUNNING_EXPERIENCE_INFO, 
  USUALLY_TRAVEL_RACE_INFO,
  DISTANCE_INFO,
  RaceType,
  RACE_TYPE_INFO,
  UsuallyTravelRace
} from '../types/userProfile.types';
import { User, Car, MapPin, Trophy, Clock, Calendar, Mail, Edit, Mountain, ChevronsUp, Users, Bus, MessageCircle } from 'lucide-react';

declare global {
  interface ImportMeta {
    env: {
      VITE_BACKEND_URL: any;
      VITE_GOOGLE_CLIENT_ID: string;
    };
  }
}

interface UserProfileViewProps {
  userId?: string;
  isModal?: boolean;
}

export function UserProfileView({ userId: propUserId, isModal = false }: UserProfileViewProps = {}) {
  const { userId: paramUserId } = useParams<{ userId: string }>();
  const navigate = useNavigate();
  const [profile, setProfile] = useState<UserProfileResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [ownProfile, setOwnProfile] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Usar userId de props si está disponible, sino usar el de params
  const userId = propUserId || paramUserId;

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const storedUser = localStorage.getItem('userCredential') ? JSON.parse(localStorage.getItem('userCredential')!) : null;

        if (!storedUser) {
          if (!isModal) {
            navigate('/login');
            return;
          }
          // En modo modal, continuar sin autenticación para usuarios públicos
        }

        const targetUserId = userId || storedUser.userId;
        const ownProfileValue = !userId || (storedUser && (userId.toString() == storedUser.userId));
        setOwnProfile(ownProfileValue);

        try {
          const response = await axiosAuth.get(`/user-profiles/user/${targetUserId}`);
          setProfile(response.data as UserProfileResponse);
        } catch (error: any) {
          if (error.response && error.response.status === 404 && ownProfileValue) {
            console.log('Usuario no tiene perfil, redirigiendo a crear perfil...');
            navigate('/profile');
          } else {
            throw error;
          }
        }
      } catch (error) {
        console.error('Error fetching user profile:', error);
        setError('Error al cargar el perfil del usuario');
      } finally {
        setLoading(false);
      }
    };

    fetchUserProfile();
  }, [userId, navigate]);

  const calculateAge = (birthYear: number) => {
    return new Date().getFullYear() - birthYear;
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  if (loading) {
    return (
      <div className="min-h-[calc(100vh-4rem)] bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto mb-4"></div>
          <p className="text-gray-600">Cargando perfil...</p>
        </div>
      </div>
    );
  }

  if (error || !profile) {
    if (isModal) {
      return (
        <div className="text-center py-8">
          <p className="text-red-600">{error || 'Perfil no encontrado'}</p>
        </div>
      );
    }
    
    return (
      <div className="min-h-[calc(100vh-4rem)] bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 mb-4">{error || 'Perfil no encontrado'}</p>
            <Button onClick={() => navigate('/')} variant="outline">
              Volver al inicio
            </Button>
        </div>
      </div>
    );
  }

  return (
    <div className={isModal ? "space-y-6" : "min-h-[calc(100vh-4rem)] bg-gray-50 py-8"}>
      <div className="max-w-4xl mx-auto px-4 space-y-6">
        {/* Header - solo mostrar en modo no-modal */}
        {!isModal && (
          <div className="flex justify-between items-center">
            <Button onClick={() => navigate('/')} variant="outline">
              ← Volver
            </Button>
            {ownProfile && (<Button 
              onClick={() => navigate('/profile', { state: { editMode: true, profileData: profile } })} 
              className="flex items-center gap-2"
            >
              <Edit className="w-4 h-4" />
              Editar Perfil
            </Button>)}
          </div>
        )}

        {/* Información Personal */}
        <Card className="p-6">
          <div className="flex items-start gap-6">
            <div className="flex-shrink-0">
              {profile.user.pictureUrl ? (
                <img 
                  src={profile.user.pictureUrl} 
                  alt={`${profile.name} ${profile.surname}`}
                  className="w-24 h-24 rounded-full object-cover"
                />
              ) : (
                <div className="w-24 h-24 bg-gray-300 rounded-full flex items-center justify-center">
                  <User className="w-12 h-12 text-gray-600" />
                </div>
              )}
            </div>
            
            <div className="flex-1">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                {profile.name} {profile.surname}
              </h1>
              
              <div className="space-y-2 text-gray-600">
                <div className="flex items-center gap-2">
                  <Mail className="w-4 h-4" />
                  <span>{profile.email}</span>
                </div>
                {profile.phoneNumber && (
                  <div className="flex items-center gap-2">
                    <MessageCircle className="w-4 h-4" />
                    <a
                      href={`https://wa.me/${profile.phoneCountryCode || '54'}${profile.phoneNumber}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="hover:underline transition-colors"
                    >
                      +{profile.phoneCountryCode || '54'} {profile.phoneNumber}
                    </a>
                  </div>
                )}
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4" />
                  <span>{calculateAge(profile.birthYear)} años (nacido en {profile.birthYear})</span>
                </div>
                <div className="flex items-center gap-2">
                  <User className="w-4 h-4" />
                  <span>{GENDER_INFO[profile.gender].description}</span>
                </div>
              </div>

              <div className="mt-4 flex gap-2">
                <Badge variant="secondary" className="flex items-center gap-1">
                  <Trophy className="w-3 h-3" />
                  {RUNNING_EXPERIENCE_INFO[profile.runningExperience]?.description}
                </Badge>
                <Badge variant="outline" className="flex items-center gap-1">
                  {profile.usuallyTravelRace === UsuallyTravelRace.GO_ALONE && (<User className="w-5 h-5" />)}
                  {profile.usuallyTravelRace === UsuallyTravelRace.GO_WITH_FRIENDS_FAMILY && (<Users className="w-5 h-5" />)}
                  {profile.usuallyTravelRace === UsuallyTravelRace.USUALLY_BRING_PEOPLE && (<Bus className="w-5 h-5" />)}
                  {USUALLY_TRAVEL_RACE_INFO[profile.usuallyTravelRace]?.description}
                </Badge>
              </div>
            </div>
          </div>
        </Card>

        {/* Preferencias de Running */}
        <Card className="p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Preferencias de Running</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Tipos de carrera */}
            <div>
              <h3 className="text-sm font-medium text-gray-700 mb-3">Tipos de carrera preferidos</h3>
              <div className="space-y-2">
                {profile.preferredRaceTypes.map((raceType) => (
                  <Badge key={raceType.id} variant="outline" className="mr-2">
                    {raceType.raceType === RaceType.STREET && (<><ChevronsUp className="w-4 h-4" /> {RACE_TYPE_INFO[RaceType.STREET].description}</>)}
                    {raceType.raceType === RaceType.TRAIL && (<><Mountain className="w-4 h-4" /> {RACE_TYPE_INFO[RaceType.TRAIL].description}</>)}
                  </Badge>
                ))}
                {profile.preferredRaceTypes.length === 0 && (
                  <p className="text-gray-500 text-sm">No especificado</p>
                )}
              </div>
            </div>

            {/* Distancias */}
            <div>
              <h3 className="text-sm font-medium text-gray-700 mb-3">Distancias favoritas</h3>
              <div className="space-y-2">
                {profile.preferredDistances.map((distance) => (
                  <Badge key={distance.id} variant="outline" className="mr-2">
                    {DISTANCE_INFO[distance.distance].shortDescription}
                  </Badge>
                ))}
                {profile.preferredDistances.length === 0 && (
                  <p className="text-gray-500 text-sm">No especificado</p>
                )}
              </div>
            </div>
          </div>
        </Card>

        {/* Información de Vehículos */}
        {profile.cars && profile.cars.length > 0 && (
          <Card className="p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <Car className="w-5 h-5" />
              Vehículos
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {profile.cars.map((car) => (
                <div key={car.id} className="border border-gray-200 rounded-lg p-4">
                  <h4 className="font-medium text-gray-900 mb-2">
                    {car.brand} {car.model} ({car.year})
                  </h4>
                  <div className="flex flex-col gap-2 text-sm text-gray-600">
                    <div>
                        <span className="font-medium">Color: </span> {car.color}
                    </div>
                    <div>
                        <span className="font-medium">Asientos: </span> {car.seats}
                    </div>
                    <div>
                        <span className="font-medium">Patente: </span> {car.licensePlate}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        )}

        {/* Información del sistema */}
        <Card className="p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Información del perfil</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-600">
            <div>
              <span className="font-medium">Perfil creado:</span> {formatDate(profile.createdAt.toString())}
            </div>
            <div>
              <span className="font-medium">Última actualización:</span> {formatDate(profile.updatedAt.toString())}
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}