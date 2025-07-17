// app/Home.tsx
"use client";

import React, { useEffect, useState } from "react";
import { getAllMemes, deleteMeme, MemePost } from '../../lib/posts.';
import MemeFormModal from '../../components/form';

function ImageViewModal({ isOpen, onClose, imageUrl, title, description }: {
  isOpen: boolean;
  onClose: () => void;
  imageUrl: string;
  title: string;
  description?: string;
}) {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4"
      onClick={onClose}
    >
      <div
        className="bg-white text-black rounded-lg shadow-xl relative max-w-3xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-2 right-2 text-gray-800 hover:text-gray-900 text-3xl font-bold z-10 p-2"
        >
          &times;
        </button>
        <img
          src={imageUrl}
          alt={title}
          className="max-w-full max-h-[70vh] object-contain mx-auto block rounded-t-lg"
        />
      </div>
    </div>
  );
}

export default function Home() {
  const [memes, setMemes] = useState<MemePost[]>([]);
  const [favorites, setFavorites] = useState<string[]>([]);
  const [showFavorites, setShowFavorites] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [isImageViewModalOpen, setIsImageViewModalOpen] = useState(false);
  const [selectedMeme, setSelectedMeme] = useState<MemePost | null>(null);

  useEffect(() => {
    fetchMemes();
  }, []);

  const fetchMemes = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getAllMemes();
      setMemes(data);
    } catch (err: any) {
      console.error("Falha ao carregar memes:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const toggleFavorite = (id: string) => {
    setFavorites((prev) =>
      prev.includes(id) ? prev.filter((fav) => fav !== id) : [...prev, id]
    );
  };

  const handleDeleteMeme = async (id: string) => {
    if (!window.confirm("Tem certeza que deseja deletar este meme?")) {
      return;
    }

    try {
      await deleteMeme(id);
      alert('Meme deletado com sucesso!');
      setMemes((prevMemes) => prevMemes.filter(meme => meme._id !== id));
      setFavorites((prevFavorites) => prevFavorites.filter(favId => favId !== id));
    } catch (err: any) {
      console.error('Erro ao deletar meme:', err);
    }
  };

  const openImageViewModal = (meme: MemePost) => {
    setSelectedMeme(meme);
    setIsImageViewModalOpen(true);
  };

  const filteredMemes = showFavorites
    ? memes.filter((meme) => favorites.includes(meme._id))
    : memes;

  return (
    <main className="min-h-screen p-6 bg-[#003087] text-white flex flex-col items-center">
      <div className="w-full max-w-4xl mx-auto">
        <div className="flex flex-col mb-8 gap-3.5">
          <h1 className="text-2xl font-bold">MEMES E NADA MAIS</h1>
          
            <button
              onClick={() => setShowFavorites((prev) => !prev)}
              className="bg-[#0070D1] hover:bg-[#005bb5] text-white px-4 py-2 rounded transition"
            >
              {showFavorites ? "Mostrar todos" : "Mostrar favoritos"}
            </button>
            <button
              onClick={() => setIsFormModalOpen(true)}
              className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded transition"
            >
              Postar Novo Meme
            </button>
        </div>

        {loading ? (
          <p className="text-center text-white/80">Carregando memes...</p>
        ) : error ? (
          <p className="text-center text-red-500">Erro ao carregar memes: {error}</p>
        ) : filteredMemes.length === 0 ? (
          <p className="text-center text-white/80">
            Nenhum meme encontrado. Que tal postar um?
          </p>
        ) : (
          <div className="w-full flex flex-col gap-5.5">
            {filteredMemes.map((meme) => (
              <div
                key={meme._id}
                className="w-[100%] min-w-full bg-white text-black rounded-lg shadow-md overflow-hidden relative group cursor-pointer flex flex-col items-center pb-4"
              >
                <div className="relative w-[95%] h-100 overflow-hidden mt-4 rounded-lg">
                  <img
                    src={meme.imageUrl}
                    alt={meme.title || "Meme"}
                    className="w-full h-full object-cover object-center transition-transform duration-300 group-hover:scale-105"
                    onClick={() => openImageViewModal(meme)}
                  />
                  <div className="absolute top-2 right-2 flex space-x-2">
                    <button
                      onClick={(e) => { e.stopPropagation(); toggleFavorite(meme._id); }}
                      className="bg-white hover:bg-[#0070D1] text-red-500 rounded-full p-2 text-sm shadow-md transition"
                    >
                      {favorites.includes(meme._id) ? "❤️" : "🤍"}
                    </button>
                    <button
                      onClick={(e) => { e.stopPropagation(); handleDeleteMeme(meme._id); }}
                      className="bg-red-600 hover:bg-red-700 text-white rounded-full p-2 text-sm shadow-md transition"
                      title="Deletar Meme"
                    >
                      🗑️
                    </button>
                  </div>
                </div>

                <div className="p-3 flex-grow w-[90%]">
                  <h2 className="text-md font-semibold truncate">{meme.title}</h2>
                  {meme.description && (
                    <p className="text-sm text-gray-600 mt-1 truncate">{meme.description}</p>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div> {/* Fim do container principal */}

      <MemeFormModal
        isOpen={isFormModalOpen}
        onClose={() => setIsFormModalOpen(false)}
        onSuccess={fetchMemes}
      />

      {selectedMeme && (
        <ImageViewModal
          isOpen={isImageViewModalOpen}
          onClose={() => setIsImageViewModalOpen(false)}
          imageUrl={selectedMeme.imageUrl}
          title={selectedMeme.title}
          description={selectedMeme.description}
        />
      )}
    </main>
  );
}