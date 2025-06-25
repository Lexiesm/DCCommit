import { PostType } from '@/types/globals';

interface PostCardProps {
  post: PostType;
  onClick: (post: PostType) => void;
}

export default function PostCard({ post, onClick }: PostCardProps) {
  // Función para obtener el color del borde según el estado del post
  const getBorderColor = () => {
    switch (post.status) {
      case 'pending': return 'border-yellow-600 hover:border-yellow-500';
      case 'approved': return 'border-green-600 hover:border-green-500';
      case 'rejected': return 'border-red-600 hover:border-red-500';
      default: return 'border-gray-700 hover:border-gray-600';
    }
  };

  // Función para truncar el contenido del texto
  const truncateText = (text: string, maxLength: number) => {
    if (text.length <= maxLength) return text;
    return text.slice(0, maxLength) + '...';
  };
  
  // Eliminar marcas markdown del contenido
  const stripMarkdown = (text: string) => {
    return text
      .replace(/#{1,6}\s+/g, '') // Eliminar encabezados
      .replace(/\*\*(.+?)\*\*/g, '$1') // Eliminar negrita
      .replace(/\*(.+?)\*/g, '$1') // Eliminar cursiva
      .replace(/`{1,3}(.+?)`{1,3}/g, '$1') // Eliminar código
      .replace(/\[(.+?)\]\(.+?\)/g, '$1'); // Eliminar links
  };
  
  return (
    <div
      onClick={() => onClick(post)}
      className={`bg-gray-800 p-5 rounded-lg shadow-md border ${getBorderColor()} hover:bg-gray-700 cursor-pointer transition-all group`}
    >
      <div className="flex justify-between items-start">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 rounded-full overflow-hidden border border-blue-400">
            <img
              src={post.user?.profile_picture}
              alt={`Foto de ${post.user?.name}`}
              className="object-cover w-full h-full"
            />
          </div>
          <div>
            <p className="font-semibold leading-5">{post.user?.name}</p>
            <p className="text-xs text-gray-400 leading-4">
              {post.date}
            </p>
          </div>
        </div>
        <span className={`text-xs px-2 py-1 rounded-full ${
          post.status === 'pending' 
            ? 'bg-yellow-800 text-yellow-200' 
            : post.status === 'approved' 
              ? 'bg-green-800 text-green-200' 
              : 'bg-red-800 text-red-200'
        }`}>
          {post.status === 'pending' ? 'Pendiente' : 
          post.status === 'approved' ? 'Aprobado' : 'Rechazado'}
        </span>
      </div>
      
      <h1 className="text-lg font-bold mb-1 group-hover:text-violet-300 transition-colors line-clamp-2">{post.title}</h1>
      <p className="text-gray-400 text-sm mb-3 line-clamp-2">{stripMarkdown(post.content)}</p>
      
      <div className="flex flex-wrap gap-2 mb-3">
        {post.tags && post.tags.length > 0 ? (
          post.tags.map(tag => (
            <span
              key={tag}
              className="bg-gray-700 text-gray-300 px-2 py-1 rounded text-xs"
            >
              #{tag}
            </span>
          ))
        ) : null}
      </div>
      
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-4 text-xs text-gray-400">
          <span title="Comentarios" className="flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
            </svg>
            {post.comments}
          </span>
          <span title="Reacciones" className="flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
            </svg>
            {post.reactions}
          </span>
          <span title="Tiempo de lectura" className="flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            {post.readTime}
          </span>
        </div>
        <span className="text-violet-400 text-sm group-hover:text-violet-300 flex items-center">
          Revisar
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1 transform group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
          </svg>
        </span>
      </div>
      
      {/* Indicador de prioridad para posts pendientes */}
      {post.status === 'pending' && (
        <div className="mt-3 pt-3 border-t border-gray-700 flex justify-between items-center">
          <div className="text-xs text-amber-400">
            <span className="animate-pulse">●</span> Esperando moderación
          </div>
          <div className="flex">
            {/* Botones de acceso rápido */}
            <button 
              onClick={(e) => {
                e.stopPropagation();
                // Aquí irían las acciones rápidas
              }}
              className="text-gray-400 hover:text-white ml-2 p-1 rounded hover:bg-gray-700"
              title="Opciones rápidas"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 12h.01M12 12h.01M19 12h.01M6 12a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0z" />
              </svg>
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
