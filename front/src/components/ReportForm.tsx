'use client';
import { useState } from 'react';
import { useUser, useAuth } from '@clerk/nextjs';
import { createReport } from '@/services/reports';

interface ReportFormProps {
  postId?: number;
  commentId?: number;
  onClose: () => void;
}

export default function ReportForm({ postId, commentId, onClose }: ReportFormProps) {
  const [reason, setReason] = useState('');
  const [description, setDescription] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  
  const { user, isSignedIn } = useUser();
  const { getToken } = useAuth();

  if (!postId && !commentId) {
    return null; // No hay nada que reportar
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!reason) {
      setError('Por favor selecciona una razón');
      return;
    }

    if (!isSignedIn || !user) {
      setError('Debes iniciar sesión para reportar');
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      const token = await getToken({ template: 'access_token' });
      const reportData = {
        reason,
        description,
        postId,
        commentId,
        reporterId: user.id
      };
      
      // Usando nuestro servicio mock
      await createReport(reportData, token || '');

      setSuccess(true);
      setTimeout(() => {
        onClose();
      }, 2000);
    } catch (err) {
      console.error('Error al enviar reporte:', err);
      setError('Ha ocurrido un error al enviar el reporte');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-gray-800 rounded-lg p-6 w-full max-w-md m-4">
        {success ? (
          <div className="text-center">
            <svg className="w-16 h-16 text-green-500 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            <h3 className="text-xl font-semibold text-white mb-2">Reporte enviado</h3>
            <p className="text-gray-300 mb-4">Gracias por ayudar a mantener la comunidad segura</p>
          </div>
        ) : (
          <>
            <h2 className="text-xl font-semibold text-white mb-4">
              Reportar {postId ? 'publicación' : 'comentario'}
            </h2>
            
            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label className="block text-gray-300 mb-2">Razón del reporte</label>
                <select
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white"
                  required
                >
                  <option value="">Selecciona una razón</option>
                  <option value="spam">Spam</option>
                  <option value="inappropriate">Contenido inapropiado</option>
                  <option value="harassment">Acoso</option>
                  <option value="misinformation">Información falsa</option>
                  <option value="other">Otro</option>
                </select>
              </div>
              
              <div className="mb-6">
                <label className="block text-gray-300 mb-2">Descripción (opcional)</label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white min-h-[100px]"
                  placeholder="Proporciona detalles adicionales sobre el problema..."
                />
              </div>
              
              {error && (
                <div className="mb-4 text-red-400 text-sm">
                  {error}
                </div>
              )}
              
              <div className="flex justify-end gap-3">
                <button
                  type="button"
                  onClick={onClose}
                  className="bg-gray-700 hover:bg-gray-600 text-white px-4 py-2 rounded-lg transition-colors"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg transition-colors disabled:opacity-70"
                >
                  {isSubmitting ? 'Enviando...' : 'Enviar reporte'}
                </button>
              </div>
            </form>
          </>
        )}
      </div>
    </div>
  );
}
