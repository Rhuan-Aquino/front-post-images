// components/MemeFormModal.tsx
"use client";

import React, { useState } from 'react';
import { createMeme } from '../lib/posts.'; // Importa a função de criar meme

interface MemeFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void; // Callback para quando um meme é postado com sucesso
}

export default function MemeFormModal({ isOpen, onClose, onSuccess }: MemeFormModalProps) {
  const [personName, setPersonName] = useState(''); // Será mapeado para 'title'
  const [imageDescription, setImageDescription] = useState(''); // Será mapeado para 'description'
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null; // Não renderiza nada se o modal não estiver aberto

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setError(null); // Limpa erros anteriores

    if (!personName || !selectedImage) {
      setError('Por favor, preencha o nome e selecione uma imagem.');
      return;
    }

    setIsSubmitting(true);
    const formData = new FormData();
    formData.append('title', personName); // Mapeando nome da pessoa para 'title' do backend
    formData.append('description', imageDescription); // Mapeando descrição da imagem para 'description' do backend
    formData.append('image', selectedImage); // O arquivo da imagem

    try {
      await createMeme(formData); // Chama a função da sua lib/api/posts.ts
      alert('Meme postado com sucesso!');
      // Limpa o formulário
      setPersonName('');
      setImageDescription('');
      setSelectedImage(null);
      onSuccess(); // Notifica o componente pai que um novo meme foi criado
      onClose();   // Fecha o modal
    } catch (err: any) {
      console.error('Erro ao postar meme:', err);
      setError(err.message || 'Erro ao postar meme. Tente novamente.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white text-black p-6 rounded-lg shadow-xl w-full max-w-md relative">
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-600 hover:text-gray-900 text-2xl font-bold"
        >
          &times; {/* Símbolo de "X" */}
        </button>
        <h2 className="text-2xl font-bold mb-4 text-center">Postar Novo Meme</h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="personName" className="block text-sm font-medium text-gray-700 mb-1">
              Seu Nome / Nome do Criador:
            </label>
            <input
              type="text"
              id="personName"
              value={personName}
              onChange={(e) => setPersonName(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              placeholder="Ex: João da Silva"
              required
            />
          </div>

          <div>
            <label htmlFor="imageDescription" className="block text-sm font-medium text-gray-700 mb-1">
              Descrição do Meme (Opcional):
            </label>
            <textarea
              id="imageDescription"
              value={imageDescription}
              onChange={(e) => setImageDescription(e.target.value)}
              rows={3}
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              placeholder="Ex: Meme do cachorro triste..."
              required
            ></textarea>
          </div>

          <div>
            <label htmlFor="memeImage" className="block text-sm font-medium text-gray-700 mb-1">
              Selecionar Imagem:
            </label>
            <input
              type="file"
              id="memeImage"
              accept="image/*"
              onChange={(e) => setSelectedImage(e.target.files ? e.target.files[0] : null)}
              className="w-full p-2 border border-gray-300 rounded-md file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
              required
            />
            {selectedImage && <p className="text-sm text-gray-500 mt-1">Arquivo selecionado: {selectedImage.name}</p>}
          </div>

          {error && <p className="text-red-500 text-sm mt-2 text-center">{error}</p>}

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? 'Postando...' : 'Postar Meme'}
          </button>
        </form>
      </div>
    </div>
  );
}