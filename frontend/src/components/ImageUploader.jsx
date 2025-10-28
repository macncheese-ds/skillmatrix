import React, { useState, useRef } from 'react';
import { api } from '../api.js';

const ImageUploader = ({ currentImage, onImageChange, empleadoId = null }) => {
  const [isUploading, setIsUploading] = useState(false);
  const [previewImage, setPreviewImage] = useState(currentImage || null);
  const [uploadError, setUploadError] = useState('');
  const fileInputRef = useRef(null);

  // Función para manejar la selección de archivo
  const handleFileSelect = (event) => {
    const file = event.target.files[0];
    if (!file) return;

    // Validar tipo de archivo
    const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
    if (!validTypes.includes(file.type)) {
      setUploadError('Solo se permiten archivos de imagen (JPEG, PNG, GIF, WebP)');
      return;
    }

    // Validar tamaño (5MB máximo)
    if (file.size > 5 * 1024 * 1024) {
      setUploadError('El archivo debe ser menor a 5MB');
      return;
    }

    // Crear preview local
    const reader = new FileReader();
    reader.onload = (e) => {
      setPreviewImage(e.target.result);
    };
    reader.readAsDataURL(file);

    // Subir archivo
    uploadFile(file);
  };

  // Función para subir el archivo al servidor
  const uploadFile = async (file) => {
    setIsUploading(true);
    setUploadError('');

    try {
      const formData = new FormData();
      formData.append('image', file);

  const response = await fetch('http://10.229.52.220:5000/api/upload/upload', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Error al subir la imagen');
      }

      const data = await response.json();
      
      // Construir URL completa para mostrar la imagen
  const fullImageUrl = `http://10.229.52.220:5000${data.imageUrl}`;
      setPreviewImage(fullImageUrl);
      
      // Notificar al componente padre
      if (onImageChange) {
        onImageChange(fullImageUrl);
      }

    } catch (error) {
      console.error('Error uploading image:', error);
      setUploadError('Error al subir la imagen');
      setPreviewImage(currentImage);
    } finally {
      setIsUploading(false);
    }
  };

  // Función para eliminar imagen
  const removeImage = () => {
    setPreviewImage(null);
    if (onImageChange) {
      onImageChange('');
    }
    // Limpiar input file
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="space-y-4">
      {/* Preview de la imagen */}
      <div className="flex justify-center">
        <div className="relative">
          {previewImage ? (
            <div className="relative group">
              <img
                src={previewImage}
                alt="Preview"
                className="w-32 h-32 rounded-full object-cover border-4 border-gray-600 shadow-lg"
                onError={() => {
                  setPreviewImage(null);
                  setUploadError('Error al cargar la imagen');
                }}
              />
              {/* Botón para eliminar imagen */}
              <button
                type="button"
                onClick={removeImage}
                className="absolute -top-2 -right-2 bg-red-600 hover:bg-red-700 text-white rounded-full w-8 h-8 flex items-center justify-center text-sm transition-colors"
                title="Eliminar imagen"
              >
                ✕
              </button>
              {/* Overlay para cambiar imagen */}
              <div className="absolute inset-0 bg-black bg-opacity-50 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                <span className="text-white text-xs text-center">Clic para cambiar</span>
              </div>
            </div>
          ) : (
            <div className="w-32 h-32 rounded-full bg-gray-700 border-4 border-gray-600 flex items-center justify-center shadow-lg">
              <span className="text-gray-400 text-xs text-center">Sin imagen</span>
            </div>
          )}
        </div>
      </div>

      {/* Botones de acción */}
      <div className="flex justify-center gap-3">
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          disabled={isUploading}
          className="bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white px-4 py-2 rounded-lg text-sm transition-colors flex items-center gap-2"
        >
          {isUploading ? (
            <>
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              Subiendo...
            </>
          ) : (
            <>
              📷 {previewImage ? 'Cambiar' : 'Subir'} Imagen
            </>
          )}
        </button>
      </div>

      {/* Input file oculto */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileSelect}
        className="hidden"
      />

      {/* Mensaje de error */}
      {uploadError && (
        <div className="text-red-400 text-sm text-center">
          {uploadError}
        </div>
      )}

      {/* Información adicional */}
      <div className="text-gray-400 text-xs text-center space-y-1">
        <p>Formatos soportados: JPEG, PNG, GIF, WebP</p>
        <p>Tamaño máximo: 5MB</p>
        <p>Se ajustará automáticamente a formato circular</p>
      </div>
    </div>
  );
};

export default ImageUploader;
