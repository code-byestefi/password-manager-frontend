import { useState } from 'react';
import { Link, Outlet, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/auth-context';
import { 
  KeyRound, 
  Settings, 
  LogOut, 
  Menu,
  X,
  Shield,
  RefreshCw  
} from 'lucide-react';

export function DashboardLayout() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Sidebar Mobile */}
      <div className="lg:hidden">
        <div className="fixed inset-0 z-40 flex">
          {/* Overlay */}
          {isSidebarOpen && (
            <div 
              className="fixed inset-0 bg-gray-600 bg-opacity-75"
              onClick={() => setIsSidebarOpen(false)}
            />
          )}

          {/* Sidebar */}
          <div className={`
            fixed inset-y-0 left-0 z-40 w-64 bg-white transition-transform duration-300 ease-in-out transform
            ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}
          `}>
            <div className="flex items-center justify-between h-16 px-4 border-b">
              <Link to="/dashboard" className="flex items-center space-x-2">
                <Shield className="w-8 h-8 text-primary-600" />
                <span className="text-xl font-semibold text-gray-900">Password Manager</span>
              </Link>
              <button onClick={() => setIsSidebarOpen(false)}>
                <X className="w-6 h-6 text-gray-500" />
              </button>
            </div>
            {/* Mobile Sidebar Content */}
            <nav className="mt-5 px-2 space-y-1">
              {renderNavLinks()}
            </nav>
          </div>
        </div>
      </div>

      {/* Desktop Sidebar */}
      <div className="hidden lg:fixed lg:inset-y-0 lg:flex lg:w-64 lg:flex-col">
        <div className="flex flex-col flex-1 min-h-0 bg-white border-r border-gray-200">
          <div className="flex items-center h-16 flex-shrink-0 px-4 border-b">
            <Link to="/dashboard" className="flex items-center space-x-2">
              <Shield className="w-8 h-8 text-primary-600" />
              <span className="text-xl font-semibold text-gray-900">Password Manager</span>
            </Link>
          </div>
          <div className="flex-1 flex flex-col overflow-y-auto">
            <nav className="flex-1 px-4 py-4 space-y-1">
              {renderNavLinks()}
            </nav>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="lg:pl-64 flex flex-col flex-1">
        <div className="sticky top-0 z-10 flex h-16 flex-shrink-0 bg-white border-b">
          <button
            type="button"
            className="px-4 border-r border-gray-200 text-gray-500 lg:hidden"
            onClick={() => setIsSidebarOpen(true)}
          >
            <Menu className="h-6 w-6" />
          </button>
          
          <div className="flex-1 flex justify-between px-4">
            <div className="flex-1" />
            <div className="ml-4 flex items-center md:ml-6">
              {/* User Dropdown */}
              <div className="flex items-center space-x-2">
                <span className="text-sm text-gray-700">{user?.name}</span>
                <button
                  onClick={handleLogout}
                  className="p-1 rounded-full text-gray-500 hover:text-gray-700"
                >
                  <LogOut className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
        </div>

        <main className="flex-1">
          <div className="py-6 px-4 sm:px-6 lg:px-8">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );

  function renderNavLinks() {
    return (
      <>
        <Link
          to="/passwords"
          className="flex items-center px-2 py-2 text-base font-medium rounded-md text-gray-600 hover:bg-gray-50 hover:text-gray-900"
        >
          <KeyRound className="mr-4 flex-shrink-0 h-6 w-6" />
          Contraseñas
        </Link>
        <Link
          to="/generator"
          className="flex items-center px-2 py-2 text-base font-medium rounded-md text-gray-600 hover:bg-gray-50 hover:text-gray-900"
        >
          <RefreshCw className="mr-4 flex-shrink-0 h-6 w-6" />
          Generador
        </Link>
        <Link
          to="/profile"  
          className="flex items-center px-2 py-2 text-base font-medium rounded-md text-gray-600 hover:bg-gray-50 hover:text-gray-900"
        >
          <Settings className="mr-4 flex-shrink-0 h-6 w-6" />
          Configuración
        </Link>
      </>
    );
  }
}