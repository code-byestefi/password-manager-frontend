/* eslint-disable @typescript-eslint/no-explicit-any */
// src/pages/generator/PasswordGenerator.tsx
import { useState } from 'react';
import { Copy, RefreshCw } from 'lucide-react';
import { useMutation } from '@tanstack/react-query';
import api from '../../lib/axios';

interface PasswordGeneratorConfig {
  length: number;
  includeUppercase: boolean;
  includeLowercase: boolean;
  includeNumbers: boolean;
  includeSpecialChars: boolean;
}

interface GeneratedPasswordDTO {
  password: string;
  strength: string;
  score: number;
}

export function PasswordGenerator() {
  console.log('Renderizando PasswordGenerator');

  const [config, setConfig] = useState<PasswordGeneratorConfig>({
    length: 12,
    includeUppercase: true,
    includeLowercase: true,
    includeNumbers: true,
    includeSpecialChars: true
  });

  const [generatedData, setGeneratedData] = useState<GeneratedPasswordDTO | null>(null);

  const generatePassword = useMutation({
    mutationFn: async (config: PasswordGeneratorConfig) => {
      console.log('📡 Enviando configuración al generador:', config);
      const { data } = await api.post<GeneratedPasswordDTO>('/passwords/generator', config);
      console.log('✅ Respuesta del generador:', data);
      return data;
    },
    onSuccess: (data) => {
      console.log('✅ Contraseña generada exitosamente:', data);
      setGeneratedData(data);
    },
    onError: (error: any) => {
      console.error('❌ Error al generar contraseña:', error);
      alert('Error al generar la contraseña');
    }
  });

  const handleGenerate = () => {
    console.log('🔄 Iniciando generación con config:', config);
    
    const hasAtLeastOneOption = 
      config.includeUppercase || 
      config.includeLowercase || 
      config.includeNumbers || 
      config.includeSpecialChars;

    if (!hasAtLeastOneOption) {
      console.warn('⚠️ Debe seleccionar al menos un tipo de carácter');
      alert('Debes seleccionar al menos un tipo de carácter');
      return;
    }

    generatePassword.mutate(config);
  };

  const copyToClipboard = async () => {
    if (!generatedData) {
      console.warn('⚠️ No hay contraseña para copiar');
      return;
    }

    try {
      await navigator.clipboard.writeText(generatedData.password);
      console.log('✅ Contraseña copiada al portapapeles');
      alert('Contraseña copiada al portapapeles');
    } catch (err) {
      console.error('❌ Error al copiar:', err);
      alert('Error al copiar la contraseña');
    }
  };

  const handleConfigChange = (newConfig: Partial<PasswordGeneratorConfig>) => {
    console.log('🔧 Actualizando configuración:', { ...config, ...newConfig });
    setConfig(prevConfig => ({ ...prevConfig, ...newConfig }));
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-semibold text-gray-900">Generador de Contraseñas</h1>
        <p className="mt-1 text-sm text-gray-500">
          Genera contraseñas seguras con los parámetros que necesites.
        </p>
      </div>

      {/* Generated Password Display */}
      <div className="bg-white shadow-sm ring-1 ring-gray-900/5 sm:rounded-lg p-6">
        <div className="space-y-4">
          <div className="flex items-center gap-4">
            <div className="flex-1 font-mono text-lg bg-gray-50 p-4 rounded-lg break-all">
              {generatedData?.password || 'Haz clic en generar para crear una contraseña'}
            </div>
            <div className="flex gap-2">
              <button
                onClick={handleGenerate}
                className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
                title="Generar nueva contraseña"
              >
                <RefreshCw className="w-5 h-5" />
              </button>
              <button
                onClick={copyToClipboard}
                disabled={!generatedData}
                className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                title="Copiar al portapapeles"
              >
                <Copy className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Strength Indicator */}
          {generatedData && (
            <div className="text-sm">
              <div className="flex items-center gap-2">
                <span className="font-medium">Fortaleza:</span>
                <span className={`
                  px-2 py-1 rounded-full text-xs font-medium
                  ${generatedData.strength === 'STRONG' ? 'bg-green-100 text-green-700' :
                    generatedData.strength === 'MEDIUM' ? 'bg-yellow-100 text-yellow-700' :
                    'bg-red-100 text-red-700'}
                `}>
                  {generatedData.strength}
                </span>
              </div>
              <div className="mt-1">
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className={`h-2 rounded-full ${
                      generatedData.strength === 'STRONG' ? 'bg-green-500' :
                      generatedData.strength === 'MEDIUM' ? 'bg-yellow-500' :
                      'bg-red-500'
                    }`}
                    style={{ width: `${generatedData.score}%` }}
                  />
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Configuration */}
      <div className="bg-white shadow-sm ring-1 ring-gray-900/5 sm:rounded-lg p-6">
        <h2 className="text-lg font-medium text-gray-900 mb-4">Configuración</h2>
        
        {/* Length Selector */}
        <div className="space-y-4">
          <div>
            <label htmlFor="length" className="block text-sm font-medium text-gray-700">
              Longitud: {config.length} caracteres
            </label>
            <input
              type="range"
              id="length"
              min="8"
              max="32"
              value={config.length}
              onChange={(e) => handleConfigChange({ length: parseInt(e.target.value) })}
              className="mt-1 w-full"
            />
          </div>

          {/* Character Types */}
          <div className="space-y-3">
            <div className="flex items-center">
              <input
                type="checkbox"
                id="uppercase"
                checked={config.includeUppercase}
                onChange={(e) => handleConfigChange({ includeUppercase: e.target.checked })}
                className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
              />
              <label htmlFor="uppercase" className="ml-2 block text-sm text-gray-700">
                Incluir mayúsculas (A-Z)
              </label>
            </div>

            <div className="flex items-center">
              <input
                type="checkbox"
                id="lowercase"
                checked={config.includeLowercase}
                onChange={(e) => handleConfigChange({ includeLowercase: e.target.checked })}
                className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
              />
              <label htmlFor="lowercase" className="ml-2 block text-sm text-gray-700">
                Incluir minúsculas (a-z)
              </label>
            </div>

            <div className="flex items-center">
              <input
                type="checkbox"
                id="numbers"
                checked={config.includeNumbers}
                onChange={(e) => handleConfigChange({ includeNumbers: e.target.checked })}
                className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
              />
              <label htmlFor="numbers" className="ml-2 block text-sm text-gray-700">
                Incluir números (0-9)
              </label>
            </div>

            <div className="flex items-center">
              <input
                type="checkbox"
                id="special"
                checked={config.includeSpecialChars}
                onChange={(e) => handleConfigChange({ includeSpecialChars: e.target.checked })}
                className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
              />
              <label htmlFor="special" className="ml-2 block text-sm text-gray-700">
                Incluir caracteres especiales (!@#$%^&*)
              </label>
            </div>
          </div>
        </div>

        {/* Generate Button */}
        <button
          onClick={handleGenerate}
          disabled={generatePassword.isPending}
          className="mt-6 w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50"
        >
          {generatePassword.isPending ? 'Generando...' : 'Generar Contraseña'}
        </button>
      </div>

      {/* Loading Overlay */}
      {generatePassword.isPending && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-4 rounded-lg">
            <div className="animate-spin rounded-full h-8 w-8 border-4 border-primary-500 border-r-transparent" />
          </div>
        </div>
      )}
    </div>
  );
}