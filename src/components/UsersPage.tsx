import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axiosAuth from '../lib/axios';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from './ui/dialog';
import { Users, User, MapPin, Calendar, Star, Eye, Mail, Phone, Car, Cake, UserCheck, Zap } from 'lucide-react';
import { UserProfileView } from './UserProfileView';
import { toast } from 'sonner';
import { requireAuth } from '../utils/auth';
import { 
  Gender, 
  GENDER_INFO, 
  RunningExperience, 
  RUNNING_EXPERIENCE_INFO,
  type GenderInfo,
  type UserProfileCarResponse 
} from '../types/userProfile.types';

interface UserListItem {
  id: number;
  email: string;
  givenName: string;
  familyName: string;
  name: string;
  pictureUrl?: string;
  createdAt: string;
  userProfile?: {
    id: number;
    birthYear?: number;
    city?: string;
    province?: string;
    phoneNumber?: string;
    phoneCountryCode?: string;
    gender?: Gender;
    runningExperience?: RunningExperience;
    averagePace?: string;
    cars?: UserProfileCarResponse[];
  };
}

export function UsersPage() {
  const navigate = useNavigate();
  const [users, setUsers] = useState<UserListItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedUserId, setSelectedUserId] = useState<number | null>(null);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    if (!requireAuth(navigate)) {
      return;
    }

    setIsLoading(true);
    try {
      const response = await axiosAuth.get('/users');
      setUsers(response.data as UserListItem[]);
    } catch (error: any) {
      console.error('Error cargando usuarios:', error);
      const errorMessage = error.response?.data?.message || 'Error al cargar los usuarios';
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const handleViewProfile = (userId: number) => {
    setSelectedUserId(userId);
    setIsProfileModalOpen(true);
  };

  const closeProfileModal = () => {
    setIsProfileModalOpen(false);
    setSelectedUserId(null);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const calculateAge = (birthYear?: number): number | null => {
    if (!birthYear) return null;
    const currentYear = new Date().getFullYear();
    return currentYear - birthYear;
  };

  const getGenderBadgeColor = (gender?: Gender) => {
    if (!gender) return 'bg-gray-100 text-gray-800';
    
    switch (gender) {
      case Gender.MASCULINE:
        return 'bg-blue-100 text-blue-800';
      case Gender.FEMININE:
        return 'bg-pink-100 text-pink-800';
      case Gender.NON_BINARY:
        return 'bg-purple-100 text-purple-800';
      case Gender.PREFER_NOT_TO_SAY:
        return 'bg-gray-100 text-gray-800';
      case Gender.OTHER:
        return 'bg-orange-100 text-orange-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getGenderText = (gender?: Gender): string => {
    if (!gender) return 'No especificado';
    return GENDER_INFO[gender]?.description || 'No especificado';
  };

  const getRunningExperienceText = (experience?: RunningExperience): string => {
    if (!experience) return '';
    return RUNNING_EXPERIENCE_INFO[experience]?.description || '';
  };

  const isDriver = (userProfile?: UserListItem['userProfile']): boolean => {
    return userProfile?.cars && userProfile.cars.length > 0 || false;
  };

  return (
    <div className="container mx-auto px-4 py-6">
      {/* Header */}
      <div className="flex items-center gap-4 mb-6">
        <div className="flex items-center gap-2">
          <Users className="w-6 h-6 text-blue-600" />
          <h1 className="text-3xl font-bold text-gray-900">
            Usuarios Registrados
          </h1>
        </div>
      </div>

      <div className="mb-4 text-gray-600">
        {isLoading ? 'Cargando...' : `${users.length} usuarios registrados`}
      </div>

      {/* Estado de carga */}
      {isLoading && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <Card key={i} className="animate-pulse">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-gray-200 rounded-full"></div>
                  <div className="flex-1">
                    <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                    <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="h-3 bg-gray-200 rounded w-full"></div>
                  <div className="h-3 bg-gray-200 rounded w-2/3"></div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Lista de usuarios */}
      {!isLoading && users.length === 0 && (
        <div className="text-center py-12">
          <Users className="w-16 h-16 mx-auto mb-4 text-gray-400" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            No hay usuarios registrados
          </h3>
          <p className="text-gray-500">
            Aún no se han registrado usuarios en la plataforma.
          </p>
        </div>
      )}

      {!isLoading && users.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {users.map((user) => (
            <Card key={user.id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden">
                      {user.pictureUrl ? (
                        <img 
                          src={user.pictureUrl} 
                          alt={user.name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <User className="w-6 h-6 text-gray-500" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <CardTitle className="text-lg truncate">
                        {user.name}
                      </CardTitle>
                      <p className="text-sm text-gray-500 truncate">
                        {user.email}
                      </p>
                    </div>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleViewProfile(user.id)}
                    className="flex items-center gap-1"
                  >
                    <Eye className="w-4 h-4" />
                    Ver
                  </Button>
                </div>
              </CardHeader>
              
              <CardContent className="pt-0">
                <div className="space-y-3">
                  {/* Información básica */}
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Calendar className="w-4 h-4" />
                    <span>Registrado: {formatDate(user.createdAt)}</span>
                  </div>

                  {/* Información del perfil si existe */}
                  {user.userProfile && (
                    <div className="space-y-2">
                      {user.userProfile.city && user.userProfile.province && (
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <MapPin className="w-4 h-4" />
                          <span>{user.userProfile.city}, {user.userProfile.province}</span>
                        </div>
                      )}
                      
                      <div className="flex flex-wrap gap-2">
                        {calculateAge(user.userProfile.birthYear) && (
                          <Badge variant="secondary" className="text-xs flex items-center gap-1">
                            <Cake className="w-3 h-3" />
                            {calculateAge(user.userProfile.birthYear)} años
                          </Badge>
                        )}
                        
                        {user.userProfile.gender && (
                          <Badge className={`text-xs flex items-center gap-1 ${getGenderBadgeColor(user.userProfile.gender)}`}>
                            <UserCheck className="w-3 h-3" />
                            {getGenderText(user.userProfile.gender)}
                          </Badge>
                        )}
                        
                        {user.userProfile.runningExperience && (
                          <Badge variant="outline" className="text-xs flex items-center gap-1">
                            <Zap className="w-3 h-3" />
                            {getRunningExperienceText(user.userProfile.runningExperience)}
                          </Badge>
                        )}
                        
                        {isDriver(user.userProfile) && (
                          <Badge className="text-xs bg-green-100 text-green-800 flex items-center gap-1">
                            <Car className="w-3 h-3" />
                            Conductor
                          </Badge>
                        )}
                      </div>

                      {user.userProfile.averagePace && (
                        <div className="text-xs text-gray-500">
                          Ritmo promedio: {user.userProfile.averagePace}
                        </div>
                      )}
                    </div>
                  )}

                  {!user.userProfile && (
                    <div className="text-xs text-gray-400 italic">
                      Perfil no completado
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Modal de perfil */}
      <Dialog open={isProfileModalOpen} onOpenChange={setIsProfileModalOpen}>
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Perfil de Usuario</DialogTitle>
          </DialogHeader>
          {selectedUserId && (
            <UserProfileView 
              userId={selectedUserId.toString()}
              isModal={true}
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default UsersPage;