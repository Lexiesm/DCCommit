'use client';
import { useState } from 'react';
import { useUser, useAuth } from '@clerk/nextjs';
import { createComment } from '@/services/comments';
import ModernTextToolbar from './ModernTextToolbar';
import SubmitButton from './SubmitButton';

interface CommentFormProps {
  postId: number;
  onCommentAdded?: () => void;
}

export default function CommentForm({ postId, onCommentAdded }: CommentFormProps) {
  const [content, setContent] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { user, isSignedIn } = useUser();
  const { getToken } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!content.trim()) {
      setError('El comentario no puede estar vacío');
      return;
    }

    if (!isSignedIn || !user) {
      setError('Debes iniciar sesión para comentar');
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      const token = await getToken({ template: 'access_token' });
      await createComment({
        content,
        postId,
        userId: user.id
      }, token || '');
      
      setContent('');
      if (onCommentAdded) {
        onCommentAdded();
      }
    } catch (err) {
      console.error('Error al crear el comentario:', err);
      setError('Ha ocurrido un error al enviar el comentario');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isSignedIn) {
    return (
      <div className="bg-gray-800 rounded-lg p-4 text-center">
        <p className="text-gray-300">Debes iniciar sesión para comentar</p>
      </div>
    );
  }

  return (
    <div className="bg-gray-800 rounded-lg p-4 mb-6 border border-gray-700">
      <h3 className="text-lg font-semibold text-white mb-3">Deja un comentario</h3>
      
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <ModernTextToolbar 
            value={content}
            onChange={setContent}
            placeholder="Escribe tu comentario..."
            minRows={3}
            maxRows={8}
          />
        </div>
        
        {error && (
          <div className="mb-3 text-red-400 text-sm">
            {error}
          </div>
        )}
        
        <div className="flex justify-end">
          <SubmitButton
            isSubmitting={isSubmitting}
            text="Comentar"
            submittingText="Enviando..."
          />
        </div>
      </form>
    </div>
  );
}
