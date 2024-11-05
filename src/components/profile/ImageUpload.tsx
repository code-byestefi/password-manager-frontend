/* eslint-disable @typescript-eslint/no-explicit-any */
// src/components/profile/ImageUpload.tsx
import { useRef, useState } from 'react';
import { Camera, Loader2, User } from 'lucide-react';
import { useMutation } from '@tanstack/react-query';
import api from '../../lib/axios';
import { useAuth } from '../../context/auth-context';

interface ImageUploadProps {
  currentImage?: string | null ;
  onUploadSuccess: (imageUrl: string) => void;
}

export function ImageUpload({ currentImage, onUploadSuccess }: ImageUploadProps) {
  const { updateUserProfile } = useAuth();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(currentImage || null);

  // Función auxiliar para construir la URL completa de la imagen
  const getImageUrl = (path: string | null | undefined) => {
    if (!path) return undefined; // Devuelve undefined en lugar de null
    return `http://localhost:8080/${path}`;
  };

  const uploadImage = useMutation({
    mutationFn: async (file: File) => {
      const formData = new FormData();
      formData.append('image', file);
      
      const { data } = await api.post('/profile/image', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      
      return data;
    },
    onSuccess: (data) => {
      console.log('✅ Imagen subida exitosamente:', data);
      updateUserProfile({
        profileImage: data.profileImage
      });
      onUploadSuccess(data.profileImage);
      setPreviewUrl(data.profileImage);
    },
    onError: (error: any) => {
      console.error('❌ Error en mutation:', error);
      alert('Error al subir la imagen. Por favor, intenta de nuevo.');
    },
  });

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validaciones
    if (!file.type.startsWith('image/')) {
      alert('Por favor, selecciona una imagen válida (JPG, PNG, etc.)');
      return;
    }

    const MAX_SIZE = 5 * 1024 * 1024; // 5MB
    if (file.size > MAX_SIZE) {
      alert('La imagen no debe superar los 5MB');
      return;
    }

    // Crear preview temporal
    const objectUrl = URL.createObjectURL(file);
    setPreviewUrl(objectUrl);

    // Subir imagen
    uploadImage.mutate(file);

    // Limpiar input
    event.target.value = '';
  };

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="relative">
      <input
        type="file"
        ref={fileInputRef}
        className="hidden"
        accept="image/*"
        onChange={handleFileChange}
      />
      
      <div className="relative group cursor-pointer" onClick={handleClick}>
        <div className="h-32 w-32 rounded-full overflow-hidden bg-gray-200">
          {previewUrl ? (
            <img 
              src={getImageUrl(previewUrl)}
              alt="Profile" 
              className="h-full w-full object-cover"
              onError={(e) => {
                console.log('❌ Error al cargar la imagen:', getImageUrl(previewUrl));
                setPreviewUrl(null);
                e.currentTarget.src = '';
              }}
            />
          ) : (
            <div className="h-full w-full flex items-center justify-center text-gray-400">
              <User className="h-16 w-16" />
            </div>
          )}
          
          <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-300" />
        </div>

        <button
          type="button"
          disabled={uploadImage.isPending}
          className="absolute bottom-0 right-0 p-2 bg-primary-600 rounded-full text-white hover:bg-primary-700 transition-colors disabled:opacity-50"
        >
          {uploadImage.isPending ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Camera className="h-4 w-4" />
          )}
        </button>
      </div>

      {uploadImage.isPending && (
        <div className="mt-2 text-sm text-center text-gray-500">
          Subiendo imagen...
        </div>
      )}

      <div className="mt-2 text-xs text-center text-gray-500">
        Haz clic para cambiar la imagen
      </div>
    </div>
  );
}