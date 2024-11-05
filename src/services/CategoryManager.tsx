import { useState } from 'react';
import { Plus, Edit, Trash } from 'lucide-react';
import { useQuery, useMutation } from '@tanstack/react-query';
import { queryClient } from '../lib/react-query';
import api from '../lib/axios';

// Definición de tipos
interface Category {
  id: number;
  name: string;
}

interface CategoryCreateRequest {
  name: string;
}

interface CategoryUpdateRequest {
  id: number;
  name: string;
}

export function CategoryManager() {
  const [newCategory, setNewCategory] = useState('');
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);

  // Query para obtener categorías
  const { data: categories = [] } = useQuery<Category[]>({
    queryKey: ['categories'],
    queryFn: async () => {
      const { data } = await api.get<Category[]>('/categories');
      return data;
    }
  });

  // Mutation para crear categoría
  const createCategory = useMutation({
    mutationFn: async (name: string) => {
      const { data } = await api.post<Category>('/categories', { name } as CategoryCreateRequest);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['categories'] });
      setNewCategory('');
    }
  });

  // Mutation para actualizar categoría
  const updateCategory = useMutation({
    mutationFn: async ({ id, name }: CategoryUpdateRequest) => {
      const { data } = await api.put<Category>(`/categories/${id}`, { name });
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['categories'] });
      setEditingCategory(null);
    }
  });

  // Mutation para eliminar categoría
  const deleteCategory = useMutation({
    mutationFn: async (id: number) => {
      await api.delete(`/categories/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['categories'] });
    }
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingCategory) {
      updateCategory.mutate({ id: editingCategory.id, name: editingCategory.name });
    } else if (newCategory.trim()) {
      createCategory.mutate(newCategory);
    }
  };

  return (
    <div className="space-y-6">
      <h2 className="text-lg font-medium">Gestionar Categorías</h2>

      {/* Formulario */}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="flex gap-2">
          <input
            type="text"
            placeholder="Nueva categoría"
            value={editingCategory ? editingCategory.name : newCategory}
            onChange={(e) => 
              editingCategory 
                ? setEditingCategory({ ...editingCategory, name: e.target.value })
                : setNewCategory(e.target.value)
            }
            className="flex-1 rounded-md border border-gray-300 px-3 py-2"
          />
          <button
            type="submit"
            className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700"
          >
            <Plus className="h-4 w-4 mr-2" />
            {editingCategory ? 'Actualizar' : 'Agregar'}
          </button>
        </div>
      </form>

      {/* Lista de categorías */}
      <ul className="space-y-2">
        {categories.map((category: Category) => (
          <li 
            key={category.id}
            className="flex items-center justify-between p-2 hover:bg-gray-50 rounded-md"
          >
            <span>{category.name}</span>
            <div className="flex gap-2">
              <button
                onClick={() => setEditingCategory(category)}
                className="text-gray-400 hover:text-gray-500"
              >
                <Edit className="h-4 w-4" />
              </button>
              <button
                onClick={() => {
                  if (window.confirm('¿Estás seguro de eliminar esta categoría?')) {
                    deleteCategory.mutate(category.id);
                  }
                }}
                className="text-gray-400 hover:text-gray-500"
              >
                <Trash className="h-4 w-4" />
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}