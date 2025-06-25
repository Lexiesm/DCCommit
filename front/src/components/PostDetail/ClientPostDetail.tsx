'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useUser, useAuth } from '@clerk/nextjs';
import { useRouter, useSearchParams } from 'next/navigation';
import { FiClock, FiCalendar, FiFlag, FiX, FiTrash, FiArrowLeft } from 'react-icons/fi';
import MarkdownPreview from '@/components/MarkdownPreview';
import CommentForm from '@/components/CommentForm';
import Comment from '@/components/Comment';
import Loading from '@/components/Loading';
import ReportForm from '@/components/ReportForm';
import { getPostById, deletePost } from '@/services/posts';
import { getPostComments, deleteComment } from '@/services/comments';
import { getReportById, updateReportStatus } from '@/services/reports';

const baseUrl = process.env.NEXT_PUBLIC_URL_BACK;

interface ClientPostDetailProps {
  postId: number;
}

export default function ClientPostDetail({ postId }: ClientPostDetailProps) {
  const [post, setPost] = useState<any>(null);
  const [comments, setComments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showReportForm, setShowReportForm] = useState(false);
  const [reportTarget, setReportTarget] = useState<{ postId?: number, commentId?: number }>({});
  const { user, isSignedIn, isLoaded } = useUser();
  const { getToken } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const reportId = searchParams.get('reportId');
  const commentId = searchParams.get('commentId');
  
  // Estado para manejar acciones de moderador
  const [report, setReport] = useState<any>(null);
  const [reportLoading, setReportLoading] = useState(false);
  const [reportActionInProgress, setReportActionInProgress] = useState(false);
  const [notification, setNotification] = useState<{
    type: 'success' | 'error' | 'warning' | 'info';
    message: string;
  } | null>(null);
  
  // Referencia para scroll al comentario reportado
  const reportedCommentRef = useRef<HTMLDivElement | null>(null);

  // Verificar permisos de usuario
  const [userRole, setUserRole] = useState<string | null>(null);
  const isAdmin = userRole === 'ADMIN';
  const isModerator = userRole === 'MODERATOR';

  const fetchPostAndComments = async () => {
    try {
      setLoading(true);
      const token = isSignedIn ? await getToken({ template: 'access_token' }) : null;
      
      const resP = await fetch(`${baseUrl}/posts/${postId}`, {
        method: 'GET',
        credentials: 'include',
          headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}` },
        });

      const posts = await resP.json();
      // const commentsData = await getPostComments(postId);
      
      setPost(posts);
      // setComments(commentsData);
      
      // Si existe usuario logueado, obtener su rol
      if (isSignedIn && user) {
        // Para fines de demostración, vamos a establecer el rol como MODERATOR para probar la funcionalidad
        setUserRole('MODERATOR');
      }
    } catch (err) {
      console.error('Error al cargar el post:', err);
      setError('No se pudo cargar el post. Intente nuevamente.');
    } finally {
      setLoading(false);
    }
  };
  
  // Cargar detalles del reporte si existe un reportId
  const fetchReportDetails = async () => {
    if (!reportId || !isSignedIn) return;
    
    try {
      setReportLoading(true);
      const token = await getToken({ template: 'access_token' });
      const reportData = await getReportById(parseInt(reportId), token || '');
      setReport(reportData);
    } catch (err) {
      console.error('Error al cargar el reporte:', err);
    } finally {
      setReportLoading(false);
    }
  };

  useEffect(() => {
    if (!postId) return;
    if (isLoaded) {
      fetchPostAndComments();
      fetchReportDetails();
    }
  }, [postId, isLoaded]);
  
  // Efecto para scrollear al comentario reportado
  useEffect(() => {
    if (commentId && comments.length > 0 && reportedCommentRef.current) {
      reportedCommentRef.current.scrollIntoView({ 
        behavior: 'smooth', 
        block: 'center' 
      });
      
      // Agregamos una clase para destacar el comentario
      reportedCommentRef.current.classList.add('ring-2', 'ring-red-500');
      
      // Quitamos el highlight después de unos segundos
      setTimeout(() => {
        if (reportedCommentRef.current) {
          reportedCommentRef.current.classList.remove('ring-2', 'ring-red-500');
        }
      }, 3000);
    }
  }, [comments, commentId]);

  const handleCommentAdded = () => {
    fetchPostAndComments();
  };

  const handleDeleteComment = async (commentId: number) => {
    if (!isSignedIn) return;
    
    try {
      setReportActionInProgress(true);
      const token = await getToken({ template: 'access_token' });
      await deleteComment(commentId, token || '');
      
      // Actualizar la lista de comentarios
      setComments(comments.filter(comment => comment.id !== commentId));
      
      // Si estamos eliminando un comentario reportado, actualizar el estado del reporte
      if (reportId && report?.commentId === commentId) {
        await updateReportStatus(parseInt(reportId), 'resolved', token || '');
        setNotification({
          type: 'success',
          message: 'Comentario eliminado y reporte resuelto'
        });
      } else {
        setNotification({
          type: 'success',
          message: 'Comentario eliminado correctamente'
        });
      }
    } catch (err) {
      console.error('Error al eliminar comentario:', err);
      setNotification({
        type: 'error',
        message: 'Error al eliminar comentario'
      });
    } finally {
      setReportActionInProgress(false);
    }
  };
  
  // Función para eliminar un post (moderador o administrador)
  const handleDeletePost = async () => {
    if (!isSignedIn || (!isAdmin && !isModerator)) return;
    
    try {
      setReportActionInProgress(true);
      const token = await getToken({ template: 'access_token' });
      await deletePost(postId, token || '');
      
      // Si hay un reporte asociado, marcarlo como resuelto
      if (reportId) {
        await updateReportStatus(parseInt(reportId), 'resolved', token || '');
      }
      
      setNotification({
        type: 'success',
        message: 'Post eliminado correctamente'
      });
      
      // Redirigir al dashboard después de un breve delay
      setTimeout(() => {
        router.push('/moderator');
      }, 1500);
    } catch (err) {
      console.error('Error al eliminar post:', err);
      setNotification({
        type: 'error',
        message: 'Error al eliminar post'
      });
    } finally {
      setReportActionInProgress(false);
    }
  };
  
  // Función para desestimar un reporte
  const handleDismissReport = async () => {
    if (!reportId || !isSignedIn || (!isAdmin && !isModerator)) return;
    
    try {
      setReportActionInProgress(true);
      const token = await getToken({ template: 'access_token' });
      await updateReportStatus(parseInt(reportId), 'dismissed', token || '');
      
      setNotification({
        type: 'info',
        message: 'Reporte desestimado correctamente'
      });
      
      // Actualizar el estado local del reporte
      setReport({ ...report, status: 'dismissed' });
    } catch (err) {
      console.error('Error al desestimar reporte:', err);
      setNotification({
        type: 'error',
        message: 'Error al desestimar el reporte'
      });
    } finally {
      setReportActionInProgress(false);
    }
  };
  
  // Funciones para manejar reportes
  const handleReportPost = () => {
    setReportTarget({ postId });
    setShowReportForm(true);
  };
  
  const handleReportComment = (commentId: number) => {
    setReportTarget({ commentId });
    setShowReportForm(true);
  };
  
  const closeReportForm = () => {
    setShowReportForm(false);
    setReportTarget({});
  };

  if (loading) {
    return <Loading />;
  }

  if (error || !post) {
    return (
      <div className="min-h-screen bg-black text-white p-6">
        <div className="max-w-3xl mx-auto">
          <div className="bg-red-900/30 border border-red-700 rounded-lg p-6">
            <h2 className="text-xl font-bold mb-2">Error</h2>
            <p>{error || 'No se encontró el post solicitado'}</p>
            <button
              className="mt-4 bg-violet-600 hover:bg-violet-700 px-4 py-2 rounded"
              onClick={() => router.push('/')}
            >
              Volver al inicio
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Formatear la fecha para visualización
  const formattedDate = new Date(post.date).toLocaleDateString('es-ES', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  });

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="max-w-3xl mx-auto p-6">
        {/* Notificación */}
        {notification && (
          <div className={`mb-4 rounded-lg p-4 ${
            notification.type === 'success' ? 'bg-green-900/30 border border-green-700' : 
            notification.type === 'error' ? 'bg-red-900/30 border border-red-700' :
            notification.type === 'warning' ? 'bg-yellow-900/30 border border-yellow-700' :
            'bg-violet-900/30 border border-violet-700'
          }`}>
            <div className="flex items-center justify-between">
              <p className={`${
                notification.type === 'success' ? 'text-green-300' : 
                notification.type === 'error' ? 'text-red-300' :
                notification.type === 'warning' ? 'text-yellow-300' :
                'text-violet-300'
              }`}>{notification.message}</p>
              <button 
                onClick={() => setNotification(null)}
                className="text-gray-400 hover:text-white"
              >
                <FiX size={16} />
              </button>
            </div>
          </div>
        )}
        
        {/* Botón volver al dashboard para moderadores */}
        {(isAdmin || isModerator) && (
          <div className="mb-4">
            <button
              onClick={() => router.push('/moderator')}
              className="text-violet-400 hover:text-violet-300 flex items-center gap-1"
            >
              <FiArrowLeft size={14} />
              <span>Volver al dashboard de moderador</span>
            </button>
          </div>
        )}
        
        {/* Alerta de contenido reportado para moderadores */}
        {(isAdmin || isModerator) && reportId && report && report.status === 'pending' && (
          <div className="mb-4 bg-red-900/30 border border-red-700 rounded-lg p-4">
            <div className="flex flex-col gap-3">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-red-300 font-semibold">Contenido reportado</h3>
                  <p className="text-gray-300 text-sm mt-1">
                    Razón: <span className="text-red-300">{report.reason}</span>
                  </p>
                  {report.description && (
                    <p className="text-gray-300 text-sm mt-1">
                      Descripción: {report.description}
                    </p>
                  )}
                </div>
                <div className="text-sm text-gray-400">
                  ID de reporte: {report.id}
                </div>
              </div>
              
              <div className={`flex ${report.commentId ? 'justify-start' : 'justify-between'} gap-3`}>
                {report.commentId ? (
                  <p className="text-sm text-gray-400">
                    El comentario reportado se destaca a continuación
                  </p>
                ) : (
                  <>
                    <button
                      onClick={handleDeletePost}
                      disabled={reportActionInProgress}
                      className="bg-red-600 hover:bg-red-700 text-white text-sm px-3 py-1 rounded flex items-center gap-1"
                    >
                      <FiTrash size={14} />
                      <span>Eliminar post</span>
                    </button>
                    <button
                      onClick={handleDismissReport}
                      disabled={reportActionInProgress}
                      className="bg-gray-700 hover:bg-gray-600 text-white text-sm px-3 py-1 rounded"
                    >
                      Desestimar reporte
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>
        )}
        
        {reportActionInProgress && (
          <div className="mb-4 flex justify-center">
            <div className="w-6 h-6 border-2 border-t-violet-600 border-r-violet-600 border-b-gray-700 border-l-gray-700 rounded-full animate-spin"></div>
          </div>
        )}
        
        {/* Post Header */}
        <div className="bg-gray-800 rounded-lg p-6 shadow-lg mb-6">
          <h1 className="text-3xl font-bold mb-4">{post.title}</h1>
          
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 rounded-full overflow-hidden bg-gray-600">
              {post.user?.imageUrl ? (
                <img 
                  src={post.user.imageUrl} 
                  alt={`${post.user.name}'s profile`} 
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-white text-lg font-bold">
                  {post.user?.name?.charAt(0) || '?'}
                </div>
              )}
            </div>
            <div>
              <p className="font-semibold text-white">{post.user?.name || 'Usuario'}</p>
              {post.user?.nickname && <p className="text-sm text-gray-400">@{post.user?.nickname}</p>}
              <div className="flex items-center text-sm text-gray-400 mt-1 gap-2">
                <FiCalendar size={14} />
                <span>{formattedDate}</span>
                {post.readTime && (
                  <>
                    <span className="mx-1">•</span>
                    <FiClock size={14} />
                    <span>{post.readTime}</span>
                  </>
                )}
              </div>
            </div>
          </div>
          
          {/* Post Content */}
          <div className="prose prose-invert max-w-none">
            <MarkdownPreview content={post.content} />
          </div>
          
          {/* Post Actions */}
          <div className="flex justify-between items-center mt-6 border-t border-gray-700 pt-4">
            <div className="flex gap-2">
              {/* Aquí podrían ir otros botones como "Me gusta" */}
            </div>
            
            {isSignedIn && !reportId && (
              <button
                onClick={handleReportPost}
                className="text-gray-400 hover:text-red-500 flex items-center gap-1 text-sm"
              >
                <FiFlag size={14} />
                <span>Reportar</span>
              </button>
            )}
            
            {/* Botones de moderador para el post */}
            {(isAdmin || isModerator) && !reportId && (
              <button
                onClick={handleDeletePost}
                className="text-red-500 hover:text-red-400 flex items-center gap-1 text-sm"
              >
                <FiTrash size={14} />
                <span>Eliminar</span>
              </button>
            )}
          </div>
          
          {/* Post Status */}
          {post.status && post.status !== 'approved' && (
            <div className="mt-6 p-3 rounded-lg bg-yellow-900/30 border border-yellow-700">
              <p className="text-yellow-300 text-sm">
                Estado: <strong>{post.status === 'pending' ? 'Pendiente de aprobación' : 'Rechazado'}</strong>
              </p>
            </div>
          )}
        </div>
        
        {/* Comments Section */}
        <div className="bg-gray-900 rounded-lg p-6 shadow-lg">
          <h2 className="text-xl font-bold mb-4">Comentarios ({comments.length})</h2>
          
          {/* Comment Form */}
          <CommentForm postId={postId} onCommentAdded={handleCommentAdded} />
          
          {/* Comments List */}
          {comments.length > 0 ? (
            <div className="space-y-4 mt-6">
              {comments.map((comment) => (
                <div 
                  key={comment.id} 
                  ref={comment.id.toString() === commentId ? reportedCommentRef : null}
                  className={`transition-all duration-300 ${comment.id.toString() === commentId ? 'border-red-500 rounded-lg' : ''}`}
                >
                  <Comment
                    id={comment.id}
                    content={comment.content}
                    date={comment.createdAt}
                    author={{
                      name: comment.user?.name || 'Usuario',
                      image: comment.user?.imageUrl,
                      nickname: comment.user?.nickname
                    }}
                    currentUserId={user?.id}
                    authorId={comment.user?.clerkId}
                    onDelete={handleDeleteComment}
                    onReport={() => handleReportComment(comment.id)}
                    isUserAdmin={isAdmin}
                    isUserModerator={isModerator}
                  />
                  
                  {/* Botones adicionales para moderadores si este comentario está reportado */}
                  {(isAdmin || isModerator) && commentId && comment.id.toString() === commentId && report && report.status === 'pending' && (
                    <div className="bg-red-900/30 border border-red-500 rounded-lg p-3 mt-1">
                      <div className="flex justify-between items-center">
                        <p className="text-sm text-red-300">Comentario reportado</p>
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleDismissReport()}
                            disabled={reportActionInProgress}
                            className="bg-gray-700 hover:bg-gray-600 text-white text-xs px-3 py-1 rounded"
                          >
                            Desestimar reporte
                          </button>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="mt-6 text-center py-8 text-gray-400">
              <p>No hay comentarios todavía. ¡Sé el primero en comentar!</p>
            </div>
          )}
        </div>
      </div>
      
      {/* Formulario de reporte */}
      {showReportForm && (
        <ReportForm 
          postId={reportTarget.postId} 
          commentId={reportTarget.commentId} 
          onClose={closeReportForm} 
        />
      )}
    </div>
  );
}
