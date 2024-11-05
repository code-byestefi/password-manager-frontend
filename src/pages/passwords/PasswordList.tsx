// src/pages/passwords/PasswordList.tsx
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Plus, Copy, Edit, Trash } from 'lucide-react';
import { useMutation, useQuery } from '@tanstack/react-query';
import api from '../../lib/axios';
import { queryClient } from '../../lib/react-query';

interface Password {
  id: number;
  name: string;
  username: string;
  websiteUrl?: string;
  categoryName?: string;
}

export function PasswordList() {
  const [search, setSearch] = useState('');
  const navigate = useNavigate();

  // Obtener las contraseñas usando React Query
  const { data: passwords = [], isLoading } = useQuery({
    queryKey: ['passwords'],
    queryFn: async () => {
      const { data } = await api.get<Password[]>('/passwords');
      return data;
    }
  });

  // Filtrar contraseñas según la búsqueda
  const filteredPasswords = passwords.filter(password => 
    password.name.toLowerCase().includes(search.toLowerCase()) ||
    password.username.toLowerCase().includes(search.toLowerCase())
  );


  const copyPassword = async (id: number) => {
    try {
      // Obtener la contraseña desencriptada
      const { data } = await api.get<string>(`/passwords/${id}/decrypt`);
      
      // Copiar al portapapeles
      await navigator.clipboard.writeText(data);
      
      // TODO: Mostrar notificación de éxito
      alert('Contraseña copiada al portapapeles');
    } catch (err) {
      console.error('Error al copiar la contraseña:', err);
      // TODO: Mostrar notificación de error
      alert('Error al copiar la contraseña');
    }
  };

  const deletePassword = useMutation({
    mutationFn: (id: number) => 
      api.delete(`/passwords/${id}`).then(res => res.data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['passwords'] });
      // TODO: Mostrar notificación de éxito
      alert('Contraseña eliminada correctamente');
    },
    onError: () => {
      // TODO: Mostrar notificación de error
      alert('Error al eliminar la contraseña');
    }
  });

  const handleDelete = (id: number) => {
    if (window.confirm('¿Estás seguro de que quieres eliminar esta contraseña?')) {
      deletePassword.mutate(id);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between">
        <h1 className="text-2xl font-semibold text-gray-900">Mis Contraseñas</h1>
        <button
          onClick={() => navigate('/passwords/new')}
          className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
        >
          <Plus className="h-4 w-4 mr-2" />
          Nueva Contraseña
        </button>
      </div>

      {/* Search Bar */}
      <div className="flex items-center space-x-4">
        <div className="flex-1 max-w-md">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Buscar contraseñas..."
              className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>
      </div>

      {/* Password List */}
      <div className="bg-white shadow-sm ring-1 ring-gray-900/5 sm:rounded-lg">
        {isLoading ? (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-primary-500 border-r-transparent" />
          </div>
        ) : filteredPasswords.length === 0 ? (
          <div className="text-center py-12">
            <h3 className="mt-2 text-sm font-semibold text-gray-900">
              {search ? 'No se encontraron contraseñas' : 'No hay contraseñas'}
            </h3>
            <p className="mt-1 text-sm text-gray-500">
              {search ? 'Intenta con otra búsqueda.' : 'Comienza creando una nueva contraseña.'}
            </p>
            {!search && (
              <div className="mt-6">
                <button
                  onClick={() => navigate('/passwords/new')}
                  className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Nueva Contraseña
                </button>
              </div>
            )}
          </div>
        ) : (
          <table className="min-w-full divide-y divide-gray-300">
            <thead>
              <tr>
                <th scope="col" className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6">
                  Nombre
                </th>
                <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                  Usuario
                </th>
                <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                  Sitio Web
                </th>
                <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                  Categoría
                </th>
                <th scope="col" className="relative py-3.5 pl-3 pr-4 sm:pr-6">
                  <span className="sr-only">Acciones</span>
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredPasswords.map((password) => (
                <tr key={password.id}>
                  <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-6">
                    {password.name}
                  </td>
                  <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                    {password.username}
                  </td>
                  <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                    {password.websiteUrl && (
                      <a 
                        href={password.websiteUrl} 
                        target="_blank" 
                        rel="noopener noreferrer" 
                        className="text-primary-600 hover:text-primary-900"
                      >
                        {password.websiteUrl}
                      </a>
                    )}
                  </td>
                  <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                    {password.categoryName || '-'}
                  </td>
                  <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6">
                    <div className="flex justify-end gap-2">
                      <button
                        onClick={() => copyPassword(password.id)}
                        className="text-gray-400 hover:text-gray-500"
                        title="Copiar contraseña"
                      >
                        <Copy className="h-5 w-5" />
                      </button>
                      <button
                        onClick={() => navigate(`/passwords/${password.id}/edit`)}
                        className="text-gray-400 hover:text-gray-500"
                        title="Editar"
                      >
                        <Edit className="h-5 w-5" />
                      </button>
                      <button
                        onClick={() => handleDelete(password.id)}
                        className="text-gray-400 hover:text-gray-500"
                        title="Eliminar"
                      >
                        <Trash className="h-5 w-5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}