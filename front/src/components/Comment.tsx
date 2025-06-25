'use client';
import { useState } from 'react';
import MarkdownPreview from './MarkdownPreview';
import { FiTrash, FiFlag } from 'react-icons/fi';

interface CommentProps {
  id: number;
  content: string;
  date: string;
  author: {
    name: string;
    image?: string;
    nickname?: string;
  };
  currentUserId?: string;
  authorId?: string;
  onDelete?: (id: number) => void;
  onReport?: () => void;
  isUserAdmin?: boolean;
  isUserModerator?: boolean;
}

export default function Comment({
  id,
  content,
  date,
  author,
  currentUserId,
  authorId,
  onDelete,
  onReport,
  isUserAdmin = false,
  isUserModerator = false
}: CommentProps) {
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  
  // Formato para la fecha
  const formattedDate = new Date(date).toLocaleDateString('es-ES', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });

  // Verificar si el usuario actual puede eliminar este comentario
  const canDelete = isUserAdmin || isUserModerator || currentUserId === authorId;

  const handleDelete = () => {
    if (onDelete) {
      onDelete(id);
    }
    setShowDeleteConfirm(false);
  };

  return (
    <div className="bg-gray-800 rounded-lg p-4 mb-3 border border-gray-700">
      <div className="flex justify-between items-start">
        <div className="flex items-center gap-2 mb-2">
          <div className="w-8 h-8 rounded-full overflow-hidden bg-gray-600">
            {author.image ? (
              <img 
                src={author.image} 
                alt={`${author.name}'s profile`} 
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-white text-sm font-bold">
                {author.name.charAt(0)}
              </div>
            )}
          </div>
          <div>
            <p className="font-medium text-white text-sm">{author.name}</p>
            {author.nickname && <p className="text-xs text-gray-400">@{author.nickname}</p>}
          </div>
          <span className="text-xs text-gray-400 ml-2">{formattedDate}</span>
        </div>
        
        <div className="flex gap-2">
          {canDelete && (
            <div className="relative">
              <button 
                onClick={() => setShowDeleteConfirm(true)}
                className="text-gray-400 hover:text-red-400 transition-colors"
                aria-label="Eliminar comentario"
              >
                <FiTrash size={16} />
              </button>
              
              {showDeleteConfirm && (
                <div className="absolute right-0 top-6 bg-gray-900 border border-gray-700 rounded-lg p-3 shadow-lg z-10 w-48">
                  <p className="text-sm text-white mb-2">¿Eliminar este comentario?</p>
                  <div className="flex justify-between gap-2">
                    <button 
                      onClick={handleDelete}
                      className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded text-xs transition-colors"
                    >
                      Eliminar
                    </button>
                    <button 
                      onClick={() => setShowDeleteConfirm(false)}
                      className="bg-gray-700 hover:bg-gray-600 text-white px-3 py-1 rounded text-xs transition-colors"
                    >
                      Cancelar
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
          
          {currentUserId && onReport && currentUserId !== authorId && (
            <button
              onClick={onReport}
              className="text-gray-400 hover:text-red-400 transition-colors"
              aria-label="Reportar comentario"
            >
              <FiFlag size={16} />
            </button>
          )}
        </div>
      </div>
      
      <div className="prose prose-invert prose-sm max-w-none mt-2">
        <MarkdownPreview content={content} />
      </div>
    </div>
  );
}
