/* eslint-disable @typescript-eslint/no-explicit-any */
// src/pages/profile/Profile.tsx
import { useState } from 'react';
import { useAuth } from '../../context/auth-context';
import { useMutation } from '@tanstack/react-query';
import api from '../../lib/axios';
import { ImageUpload } from '../../components/profile/ImageUpload';

interface ProfileData {
  name: string;
  email: string;
  profileImage: string
}

interface ChangePasswordData {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

export function Profile() {
  const { user, updateUserProfile } = useAuth();
  
  // Estado para el formulario de perfil
  const [profileData, setProfileData] = useState<ProfileData>({
    name: user?.name || '',
    email: user?.email || '',
    profileImage: user?.profileImage || ''
  });

  // Estado para el formulario de cambio de contraseña
  const [passwordData, setPasswordData] = useState<ChangePasswordData>({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  // Estado para mostrar/ocultar mensajes de error
  const [error, setError] = useState('');

  // Mutation para actualizar perfil
  const updateProfile = useMutation({
    mutationFn: async (data: ProfileData) => {
      const response = await api.put('/profile', data);
      return response.data;
    },
    onSuccess: (updatedUser) => {
      updateUserProfile(updatedUser);
      alert('Perfil actualizado exitosamente');
    },
    onError: (error: any) => {
      setError(error.response?.data?.message || 'Error al actualizar el perfil');
    }
  });

  // Mutation para cambiar contraseña
  const changePassword = useMutation({
    mutationFn: async (data: ChangePasswordData) => {
      const response = await api.post('/profile/change-password', data);
      return response.data;
    },
    onSuccess: () => {
      alert('Contraseña actualizada exitosamente');
      setPasswordData({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      });
    },
    onError: (error: any) => {
      setError(error.response?.data?.message || 'Error al cambiar la contraseña');
    }
  });

  // Manejadores de eventos
  const handleProfileSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    updateProfile.mutate(profileData);
  };

  const handlePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setError('Las contraseñas no coinciden');
      return;
    }
    
    changePassword.mutate(passwordData);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-semibold text-gray-900">Perfil de Usuario</h1>
        <p className="mt-1 text-sm text-gray-500">
          Administra tu información personal y preferencias de seguridad.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Sección de Avatar/Imagen */}
        <div className="md:col-span-1">
          <div className="bg-white shadow-sm ring-1 ring-gray-900/5 sm:rounded-lg p-6">
            <div className="flex flex-col items-center">
                <ImageUpload 
                    currentImage={user?.profileImage}
                    onUploadSuccess={(imageUrl) => {
                    updateUserProfile({ ...user!, profileImage: imageUrl });
                    }}
                />
                <h3 className="mt-4 text-lg font-medium text-gray-900">{user?.name}</h3>
                <p className="text-sm text-gray-500">{user?.email}</p>
                </div>
          </div>
        </div>

        {/* Sección Principal */}
        <div className="md:col-span-2 space-y-6">
          {/* Formulario de Perfil */}
          <div className="bg-white shadow-sm ring-1 ring-gray-900/5 sm:rounded-lg p-6">
            <h2 className="text-lg font-medium text-gray-900 mb-6">Información Personal</h2>
            <form onSubmit={handleProfileSubmit} className="space-y-4">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                  Nombre
                </label>
                <input
                  type="text"
                  id="name"
                  value={profileData.name}
                  onChange={(e) => setProfileData({ ...profileData, name: e.target.value })}
                  className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-primary-500 focus:outline-none focus:ring-primary-500 sm:text-sm"
                />
              </div>

              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  value={profileData.email}
                  onChange={(e) => setProfileData({ ...profileData, email: e.target.value })}
                  className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-primary-500 focus:outline-none focus:ring-primary-500 sm:text-sm"
                />
              </div>

              <div className="flex justify-end">
                <button
                  type="submit"
                  disabled={updateProfile.isPending}
                  className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50"
                >
                  {updateProfile.isPending ? 'Guardando...' : 'Guardar Cambios'}
                </button>
              </div>
            </form>
          </div>

          {/* Formulario de Cambio de Contraseña */}
          <div className="bg-white shadow-sm ring-1 ring-gray-900/5 sm:rounded-lg p-6">
            <h2 className="text-lg font-medium text-gray-900 mb-6">Cambiar Contraseña</h2>
            <form onSubmit={handlePasswordSubmit} className="space-y-4">
              <div>
                <label htmlFor="currentPassword" className="block text-sm font-medium text-gray-700">
                  Contraseña Actual
                </label>
                <input
                  type="password"
                  id="currentPassword"
                  value={passwordData.currentPassword}
                  onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })}
                  className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-primary-500 focus:outline-none focus:ring-primary-500 sm:text-sm"
                />
              </div>

              <div>
                <label htmlFor="newPassword" className="block text-sm font-medium text-gray-700">
                  Nueva Contraseña
                </label>
                <input
                  type="password"
                  id="newPassword"
                  value={passwordData.newPassword}
                  onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                  className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-primary-500 focus:outline-none focus:ring-primary-500 sm:text-sm"
                />
              </div>

              <div>
                <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">
                  Confirmar Nueva Contraseña
                </label>
                <input
                  type="password"
                  id="confirmPassword"
                  value={passwordData.confirmPassword}
                  onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
                  className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-primary-500 focus:outline-none focus:ring-primary-500 sm:text-sm"
                />
              </div>

              {error && (
                <div className="text-sm text-red-600">
                  {error}
                </div>
              )}

              <div className="flex justify-end">
                <button
                  type="submit"
                  disabled={changePassword.isPending}
                  className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50"
                >
                  {changePassword.isPending ? 'Cambiando...' : 'Cambiar Contraseña'}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}