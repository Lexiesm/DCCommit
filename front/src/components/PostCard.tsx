'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import MarkdownPreview from './MarkdownPreview';

interface PostCardProps {
  id: number;
  title: string;
  content: string;
  date: string;
  author: {
    name: string;
    image?: string;
    nickname?: string;
  };
  status?: string;
  showActions?: boolean;
  onDelete?: () => void;
}

export default function PostCard({ 
  id, 
  title, 
  content, 
  date, 
  author, 
  status = 'approved', 
  showActions = false,
  onDelete
}: PostCardProps) {
  const router = useRouter();
  const [showFullContent, setShowFullContent] = useState(false);
  
  // Formato para la fecha
  const formattedDate = new Date(date).toLocaleDateString('es-ES', {
    day: 'numeric',
    month: 'short',
    year: 'numeric'
  });

  // Limitar contenido para la vista previa
  const previewContent = content.length > 150 ? `${content.substring(0, 150)}...` : content;

  return (
    <div className="bg-gray-800 rounded-lg p-6 mb-4 shadow-lg border border-gray-700 hover:border-violet-500 transition-all duration-300">
      <div className="flex items-center gap-3 mb-3">
        <div className="w-10 h-10 rounded-full overflow-hidden bg-gray-600">
          {author.image ? (
            <img 
              src={author.image} 
              alt={`${author.name}'s profile`} 
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-white text-lg font-bold">
              {author.name.charAt(0)}
            </div>
          )}
        </div>
        <div>
          <p className="font-semibold text-white">{author.name}</p>
          {author.nickname && <p className="text-xs text-gray-400">@{author.nickname}</p>}
          <p className="text-xs text-gray-400">{formattedDate}</p>
        </div>
      </div>
      
      <h2 className="text-2xl font-bold text-white mb-2 hover:text-violet-400 transition-colors cursor-pointer" 
          onClick={() => router.push(`/post/${id}`)}>
        {title}
      </h2>
      
      <div className="prose prose-invert max-w-none mb-3">
        {showFullContent ? (
          <MarkdownPreview content={content} />
        ) : (
          <div className="text-gray-300">
            <MarkdownPreview content={previewContent} />
            {content.length > 150 && (
              <button 
                className="text-violet-400 hover:text-violet-300 mt-2"
                onClick={() => setShowFullContent(true)}
              >
                Leer más...
              </button>
            )}
          </div>
        )}
      </div>
      
      {status !== 'approved' && (
        <div className="mb-3">
          <span className={`px-3 py-1 rounded-full text-xs font-medium ${
            status === 'pending' ? 'bg-yellow-500/20 text-yellow-300' : 
            status === 'rejected' ? 'bg-red-500/20 text-red-300' : 
            'bg-green-500/20 text-green-300'
          }`}>
            {status === 'pending' ? 'Pendiente' : 
             status === 'rejected' ? 'Rechazado' : 'Aprobado'}
          </span>
        </div>
      )}
      
      {showActions && (
        <div className="flex gap-2 mt-4">
          <button 
            onClick={onDelete}
            className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded-md text-sm transition-colors"
          >
            Eliminar
          </button>
        </div>
      )}
    </div>
  );
}
