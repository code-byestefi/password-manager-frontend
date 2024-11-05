import { Outlet } from 'react-router-dom';
import safeLogo from '../../../public/image/login.jpeg';

export function AuthLayout() {
    return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-xl max-w-6xl w-full overflow-hidden">
            <div className="flex flex-col md:flex-row">
              {/* Formulario */}
              <div className="w-full md:w-1/2 p-8 lg:p-12">
                <Outlet />
              </div>
    
              {/* Imagen */}
              <div className="w-full md:w-1/2 bg-gradient-to-br from-blue-50 to-blue-100 p-8 lg:p-12 hidden md:flex items-center justify-center">
                <div className="relative w-full max-w-sm">
                  <img
                    src={safeLogo}
                    alt="Safe"
                    className="w-full h-auto object-contain"
                  />
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-blue-600 opacity-10 rounded-full blur-3xl -z-10" />
                </div>
              </div>
            </div>
          </div>
        </div>
      );
}