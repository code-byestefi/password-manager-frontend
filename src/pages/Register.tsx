/* eslint-disable @typescript-eslint/no-unused-vars */
import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/auth-context";
import { Lock } from 'lucide-react';


export function Register() {
    
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    
    const navigate = useNavigate();
    const { register } = useAuth();

    const handleSubmit = async (e: React.FormEvent) => {
      e.preventDefault();
      setError('');
      
      try {
          const response = await register(name, email, password);
          console.log('Registro exitoso:', response);
          
          if (response.requiresVerification) {
              navigate(`/verify-email?email=${encodeURIComponent(email)}`);
          } else {
              navigate('/passwords');
          }
      } catch (err) {
          console.error('Error en registro:', err);
          setError(err instanceof Error ? err.message : 'Error al registrar usuario');
      }
  };

    return(
        <div className="w-full">
      {/* Logo o Ícono */}
      <div className="mb-8 text-center">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary-100">
          <Lock className="w-8 h-8 text-primary-600" />
        </div>
      </div>

      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl">
          Crea tu cuenta
        </h2>
        <p className="mt-2 text-sm text-gray-600">
          ¿Ya tienes una cuenta?{' '}
          <Link
            to="/login"
            className="font-medium text-primary-600 hover:text-primary-500"
          >
            Inicia sesión
          </Link>
        </p>
      </div>

      {/* Formulario */}
      <form className="space-y-6" onSubmit={handleSubmit}>
        {error && (
          <div className="bg-red-50 text-red-600 text-sm rounded-lg p-3 text-center">
            {error}
          </div>
        )}

        <div>
          <label 
            htmlFor="name"
            className="block text-sm font-medium text-gray-700"
          >
            Nombre
          </label>
          <input
            id="name"
            type="text"
            required
            className="mt-2 block w-full rounded-lg border-0 py-2.5 px-3 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-primary-600 sm:text-sm"
            placeholder="Tu nombre"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>
        
        <div>
          <label 
            htmlFor="email"
            className="block text-sm font-medium text-gray-700"
          >
            Email
          </label>
          <input
            id="email"
            type="email"
            required
            className="mt-2 block w-full rounded-lg border-0 py-2.5 px-3 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-primary-600 sm:text-sm"
            placeholder="nombre@ejemplo.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>

        <div>
          <label
            htmlFor="password"
            className="block text-sm font-medium text-gray-700"
          >
            Contraseña
          </label>
          <input
            id="password"
            type="password"
            required
            className="mt-2 block w-full rounded-lg border-0 py-2.5 px-3 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-primary-600 sm:text-sm"
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <p className="mt-1 text-xs text-gray-500">
            Mínimo 8 caracteres
          </p>
        </div>

        <div>
          <button
            type="submit"
            className="w-full flex justify-center py-2.5 px-4 border border-transparent rounded-lg shadow-sm text-sm font-semibold text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 transition-colors"
          >
            Crear cuenta
          </button>
        </div>
      </form>

      {/* Versión móvil de la imagen */}
      <div className="mt-8 text-center md:hidden">
        <img
          src="/src/assets/safe.png"
          alt="Safe"
          className="w-48 h-auto mx-auto opacity-75"
        />
      </div>
    </div>
    );
}