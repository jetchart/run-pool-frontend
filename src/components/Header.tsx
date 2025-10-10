import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Home, Menu, CarFront, LogOut, User } from 'lucide-react';
import { Button } from './ui/button';
import { useState, useEffect } from 'react';

export function Header() {
  const location = useLocation();
  const navigate = useNavigate();
  const [userCredential, setUserCredential] = useState<any | null>(null);

  useEffect(() => {
    const stored = localStorage.getItem('userCredential');
    if (stored) {
      try {
        setUserCredential(JSON.parse(stored));
      } catch {
        setUserCredential(null);
      }
    }
  }, []);

  const handleLogout = () => {
    setUserCredential(null);
    localStorage.removeItem('userCredential');
    navigate('/login');
  };

  const navigation = [
    { name: 'Inicio', href: '/', icon: Home },
  ];

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
            {navigation.map((item) => {
              const isActive = location.pathname === item.href;
              return (
                <Link
                  key={item.name}
                  to={item.href}
                  className={`flex items-center space-x-1 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                    isActive
                      ? 'bg-primary text-primary-foreground'
                      : 'text-muted-foreground hover:text-foreground hover:bg-accent'
                  }`}
                >
                  <item.icon className="h-4 w-4" />
                  <span>{item.name}</span>
                </Link>
              );
            })}
            
            {/* User section */}
            {userCredential ? (
              <div className="flex items-center space-x-2 ml-4">
                <div className="flex items-center space-x-2 px-3 py-2 text-sm">
                  <User className="h-4 w-4" />
                  <span className="text-muted-foreground">
                    {userCredential.name || 'Usuario'}
                  </span>
                </div>
                <Link to={`/profile/view/${userCredential.id || userCredential.userId || 1}`}>
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex items-center space-x-1"
                  >
                    <User className="h-4 w-4" />
                    <span>Mi Perfil</span>
                  </Button>
                </Link>
                <Button
                  onClick={handleLogout}
                  variant="outline"
                  size="sm"
                  className="flex items-center space-x-1"
                >
                  <LogOut className="h-4 w-4" />
                  <span>Salir</span>
                </Button>
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
              <>
                <Link to={`/profile/view/${userCredential.id || userCredential.userId || 1}`}>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="flex items-center space-x-1"
                  >
                    <User className="h-4 w-4" />
                  </Button>
                </Link>
                <Button
                  onClick={handleLogout}
                  variant="ghost"
                  size="sm"
                  className="flex items-center space-x-1"
                >
                  <LogOut className="h-4 w-4" />
                </Button>
              </>
            ) : (
              <Link to="/login">
                <Button variant="ghost" size="sm">
                  Login
                </Button>
              </Link>
            )}
            <Button variant="ghost" size="icon">
              <Menu className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
}