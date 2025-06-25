import { PostType } from '@/types/globals'
import { useState } from 'react'
import ConfirmDialog from '@/components/ConfirmDialog'
import dynamic from 'next/dynamic'

// Importar el componente MarkdownPreview de forma dinámica para evitar problemas de SSR
const MarkdownPreview = dynamic(
  () => import('@/components/MarkdownPreview'),
  { ssr: false, loading: () => <p className="text-gray-400">Cargando vista previa...</p> }
)

interface PostDetailProps {
  post: PostType
  onClose: () => void
  onApprove: (id: number) => void
  onReject: (id: number) => void
}

export default function PostDetail({ post, onClose, onApprove, onReject }: PostDetailProps) {
  const [confirmAction, setConfirmAction] = useState<'approve' | 'reject' | null>(null)
  const [reason, setReason] = useState('')
  const [showReasonInput, setShowReasonInput] = useState(false)
  
  const handleConfirmAction = () => {
    if (confirmAction === 'approve') {
      onApprove(post.id)
    } else if (confirmAction === 'reject') {
      onReject(post.id)
    }
    setConfirmAction(null)
  }
  
  // Determinar el color del borde según el estado
  const getBorderColor = () => {
    switch (post.status) {
      case 'pending': return 'border-yellow-600';
      case 'approved': return 'border-green-600';
      case 'rejected': return 'border-red-600';
      default: return 'border-gray-600';
    }
  };
  
  return (
    <div className={`bg-gray-800 p-6 rounded-lg shadow-md border ${getBorderColor()} mb-8`}>
      {/* Header con información del autor y estado */}
      <div className="flex justify-between items-start mb-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-full overflow-hidden border border-blue-400">
            <img
              src={post.user?.profile_picture}
              alt="Foto de perfil"
              className="object-cover w-full h-full"
            />
          </div>
          <div>
            <p className="font-semibold text-lg">{post.user?.name}</p>
            <p className="text-sm text-gray-400">
              {post.date}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <span className={`text-sm px-3 py-1 rounded-full ${
            post.status === 'pending' 
              ? 'bg-yellow-800 text-yellow-200' 
              : post.status === 'approved' 
                ? 'bg-green-800 text-green-200' 
                : 'bg-red-800 text-red-200'
          }`}>
            {post.status === 'pending' ? 'Pendiente' : 
            post.status === 'approved' ? 'Aprobado' : 'Rechazado'}
          </span>
          <button 
            onClick={onClose}
            className="text-gray-400 hover:text-white focus:outline-none focus:ring-2 focus:ring-violet-500 rounded-full p-1"
            aria-label="Cerrar"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      </div>
      
      {/* Título del post */}
      <h2 className="text-2xl font-bold mb-3">{post.title}</h2>
      
      {/* Etiquetas */}
      <div className="flex flex-wrap gap-2 mb-4">
        {post.tags && post.tags.length > 0 ? (
          post.tags.map((tag: string) => (
            <span
              key={tag}
              className="bg-gray-700 text-gray-300 px-2 py-1 rounded text-xs"
            >
              #{tag}
            </span>
          ))
        ) : (
          <span className="text-gray-500 text-sm">Sin etiquetas</span>
        )}
      </div>
      
      {/* Contenido del post con Markdown */}
      <div className="bg-gray-900 p-4 rounded mb-6 text-gray-300 leading-relaxed min-h-[200px] max-h-[500px] overflow-y-auto">
        <MarkdownPreview content={post.content} />
      </div>
      
      {/* Estadísticas del post */}
      <div className="flex items-center gap-4 text-sm text-gray-400 mb-6">
        <span className="flex items-center gap-1">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
          </svg>
          {post.comments} comentarios
        </span>
        <span className="flex items-center gap-1">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
          </svg>
          {post.reactions} reacciones
        </span>
        <span className="flex items-center gap-1">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          {post.readTime}
        </span>
      </div>
      
      {/* Campo opcional para motivo de rechazo */}
      {showReasonInput && (
        <div className="mb-4">
          <label className="block text-gray-300 mb-2">Motivo del rechazo (opcional):</label>
          <textarea 
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            className="w-full bg-gray-900 border border-gray-700 rounded-md p-3 text-white focus:outline-none focus:ring-2 focus:ring-violet-500"
            rows={3}
            placeholder="Explica el motivo del rechazo..."
          />
        </div>
      )}
      
      {/* Botones de acción */}
      <div className="flex gap-4 justify-end">
        <button 
          onClick={() => {
            setShowReasonInput(!showReasonInput)
          }}
          className="text-gray-300 hover:text-white font-medium py-2 px-4 rounded-md transition"
        >
          {showReasonInput ? 'Ocultar motivo' : 'Añadir motivo'}
        </button>
        <button 
          onClick={() => setConfirmAction('reject')}
          disabled={post.status === 'rejected'}
          className={`${
            post.status === 'rejected' 
              ? 'bg-gray-700 text-gray-400 cursor-not-allowed' 
              : 'bg-red-600 hover:bg-red-700 text-white'
          } font-medium py-2 px-6 rounded-md transition flex items-center gap-2`}
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
          </svg>
          {post.status === 'rejected' ? 'Ya rechazado' : 'Rechazar'}
        </button>
        <button 
          onClick={() => setConfirmAction('approve')}
          disabled={post.status === 'approved'}
          className={`${
            post.status === 'approved' 
              ? 'bg-gray-700 text-gray-400 cursor-not-allowed' 
              : 'bg-green-600 hover:bg-green-700 text-white'
          } font-medium py-2 px-6 rounded-md transition flex items-center gap-2`}
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
          </svg>
          {post.status === 'approved' ? 'Ya aprobado' : 'Aprobar'}
        </button>
      </div>
      
      {/* Diálogo de confirmación */}
      <ConfirmDialog
        isOpen={confirmAction === 'approve'}
        title="Confirmar aprobación"
        message="¿Estás seguro de que deseas aprobar este post? Una vez aprobado, estará visible para todos los usuarios."
        confirmText="Aprobar"
        cancelText="Cancelar"
        confirmButtonClass="bg-green-600 hover:bg-green-700"
        onConfirm={handleConfirmAction}
        onCancel={() => setConfirmAction(null)}
      />
      
      <ConfirmDialog
        isOpen={confirmAction === 'reject'}
        title="Confirmar rechazo"
        message={`¿Estás seguro de que deseas rechazar este post?${reason ? ' Se incluirá el motivo que has proporcionado.' : ''}`}
        confirmText="Rechazar"
        cancelText="Cancelar"
        confirmButtonClass="bg-red-600 hover:bg-red-700"
        onConfirm={handleConfirmAction}
        onCancel={() => setConfirmAction(null)}
      />
    </div>
  )
}
