import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Home, Menu, CarFront, LogOut, User, Users, UserRoundCog, Network, Trophy } from 'lucide-react';
import { Button } from './ui/button';
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from './ui/dropdown-menu';
import { useAuth } from '../contexts/AuthContext';
import { usePendingTripsCount } from '../hooks/usePendingTripsCount';

declare global {
  interface ImportMeta {
    env: {
      VITE_BACKEND_URL: any;
      VITE_GOOGLE_CLIENT_ID: string;
      VITE_GOOGLE_GA4_MEASUREMENT_ID: string;
    };
  }
}

export function Header() {
  const location = useLocation();
  const navigate = useNavigate();
  const { userCredential, logout } = useAuth();
  const pendingTripsCount = usePendingTripsCount();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const getInitials = (name: string) => {
    if (!name) return 'U';
    const names = name.split(' ');
    if (names.length >= 2) {
      return (names[0][0] + names[names.length - 1][0]).toUpperCase();
    }
    return name[0].toUpperCase();
  };

  const handleProfileClick = () => {
    if (!userCredential) return;
    navigate(`/profile/view/`);
  };


  return (
    <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <div className="flex items-center">
            <Link to="/" className="flex items-center space-x-2">
              <CarFront className="h-8 w-8 text-primary" />
              <span className="text-xl font-bold">RunPool</span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-4">
            
            {/* User section */}
            {userCredential ? (
              <div className="ml-4">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" className="cursor-pointer">
                      <div className="flex items-center justify-center font-medium gap-2">
                        {userCredential.pictureUrl ? (
                          <img
                            src={userCredential.pictureUrl}
                            alt={userCredential.givenName}
                            className="w-6 h-6 rounded-full object-cover border"
                          />
                        ) : (
                          <User className="w-5 h-5" />
                        )}
                        <span>{userCredential.givenName}</span>
                      </div>
                      {pendingTripsCount > 0 && (
                        <span className="w-5 h-5 flex items-center justify-center bg-yellow-500 text-white text-xs font-bold rounded-full">
                          {pendingTripsCount}
                        </span>
                      )}
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-56" align="end" forceMount>
                    <div className="flex items-center justify-start gap-2 p-2">
                      <div className="flex flex-col space-y-1 leading-none">
                        <span className="font-medium">{userCredential.name || 'Usuario'}</span>
                        <span className="w-[200px] truncate text-sm text-muted-foreground">
                          {userCredential.email || 'No email'}
                        </span>
                      </div>
                    </div>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={handleProfileClick} className="cursor-pointer">
                      <User className="mr-2 h-4 w-4" />
                      <span>Mi perfil</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => navigate('/my-trips')} className="cursor-pointer">
                      <Users className="mr-2 h-4 w-4" />
                      <span>Mis Viajes</span>
                      {pendingTripsCount > 0 && (
                        <span className="ml-2 w-5 h-5 flex items-center justify-center bg-yellow-500 text-white text-xs font-bold rounded-full">
                          {pendingTripsCount}
                        </span>
                      )}
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={handleLogout} className="cursor-pointer">
                      <LogOut className="mr-2 h-4 w-4" />
                      <span>Cerrar sesión</span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            ) : (
              <Link to="/login">
                <Button variant="outline" size="sm">
                  Iniciar sesión
                </Button>
              </Link>
            )}
          </nav>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center space-x-2">
            {userCredential ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" >
                      <div className="flex items-center justify-center font-medium gap-2">
                        {userCredential.pictureUrl ? (
                          <img
                            src={userCredential.pictureUrl}
                            alt={userCredential.givenName}
                            className="w-6 h-6 rounded-full object-cover border"
                          />
                        ) : (
                          <User className="w-5 h-5" />
                        )}
                        <span>{userCredential.givenName}</span>
                      </div>
                      {pendingTripsCount > 0 && (
                        <span className="w-5 h-5 flex items-center justify-center bg-yellow-500 text-white text-xs font-bold rounded-full">
                          {pendingTripsCount}
                        </span>
                      )}
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56" align="end" forceMount>
                  <div className="flex items-center justify-start gap-2 p-2">
                    <div className="flex flex-col space-y-1 leading-none">
                      <div className="font-medium">{userCredential.name || 'Usuario'}</div>
                      <div className="w-[200px] truncate text-sm text-muted-foreground">
                        {userCredential.email || 'No email'}
                      </div>
                    </div>
                  </div>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleProfileClick} className="cursor-pointer">
                    <User className="mr-2 h-4 w-4" />
                    <span>Mi perfil</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => navigate('/my-trips')} className="cursor-pointer">
                    <Users className="mr-2 h-4 w-4" />
                    <span>Mis Viajes</span>
                    {pendingTripsCount > 0 && (
                      <span className="ml-2 w-5 h-5 flex items-center justify-center bg-yellow-500 text-white text-xs font-bold rounded-full">
                        {pendingTripsCount}
                      </span>
                    )}
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={handleLogout} className="cursor-pointer">
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Cerrar sesión</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Link to="/login">
                <Button variant="ghost" size="sm">
                  Login
                </Button>
              </Link>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}