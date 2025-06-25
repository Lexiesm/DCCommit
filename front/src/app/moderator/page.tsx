'use client';

import { useState, useEffect } from 'react';
import { PostStatus } from '@/types/globals';
import PostCard from '@/components/moderator/PostCard';
import PostDetail from '@/components/moderator/PostDetail';
import FilterMenu from '@/components/moderator/FilterMenu';
import ReportsList from '@/components/moderator/ReportsList';
import Pagination from '@/components/Pagination';
import Notification from '@/components/Notification';
import { useUser, useAuth } from '@clerk/nextjs';
import { useRouter } from 'next/navigation';
import { getAllPosts, updatePostStatus } from '@/services/posts';
import { MockPost } from '@/services/mockData';
import { PostType } from '@/types/globals';


const baseUrl = process.env.NEXT_PUBLIC_URL_BACK

// Adaptamos los datos de MockPost a la estructura que espera PostCard
const adaptPostForModeratorUI = (mockPost: MockPost) => {
  return {
    id: mockPost.id,
    user: {
      profile_picture: mockPost.user?.profile_picture || 'https://randomuser.me/api/portraits/lego/1.jpg',
      name: mockPost.user?.name || 'Usuario'
    },
    date: new Date(mockPost.date).toLocaleDateString('es-ES', { day: 'numeric', month: 'short' }),
    title: mockPost.title,
    content: mockPost.content,
    tags: [], // No tenemos tags en nuestros mocks actuales
    comments: 0, // Para ser implementado más tarde
    reactions: mockPost.likes,
    readTime: `${Math.ceil(mockPost.content.length / 1000)} min read`,
    status: mockPost.status
  };
};

export default function ModeratorDashboard() {
  const [selectedPost, setSelectedPost] = useState<PostType | null>(null);
  const [posts, setPosts] = useState<PostType[]>([]);
  const [currentFilter, setCurrentFilter] = useState<'all' | PostStatus>('pending');
  const [currentPage, setCurrentPage] = useState(1);
  const [notification, setNotification] = useState<{
    type: 'success' | 'error' | 'warning' | 'info';
    message: string;
  } | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isActionLoading, setIsActionLoading] = useState(false);
  
  const { user, isLoaded, isSignedIn } = useUser();
  const { getToken } = useAuth();
  const router = useRouter();
  
  // Cargar posts y verificar permisos
  useEffect(() => {
    const fetchPosts = async () => {
      if (!isLoaded) return;
      
      // Verificar si el usuario está logueado
      if (!isSignedIn) {
        router.push('/unauthorized');
        return;
      }
      
      try {
        setIsLoading(true);
        const token = await getToken({ template: 'access_token' });
        const fetchedPosts = await fetch(`${baseUrl}/posts`, {
              method: 'GET',
              credentials: 'include',
              headers: { 
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}` },
            })
        const postsData = await fetchedPosts.json();
        // Convertir los posts al formato que espera la UI
        const adaptedPosts = postsData.map(adaptPostForModeratorUI);
        setPosts(adaptedPosts);
        
        // Mostrar notificación de éxito solo al cargar inicialmente
        if (adaptedPosts.length > 0) {
          setNotification({
            type: 'info',
            message: `${adaptedPosts.length} posts cargados correctamente`
          });
        } else {
          setNotification({
            type: 'info',
            message: 'No hay posts disponibles para moderar'
          });
        }
      } catch (error) {
        console.error('Error cargando posts:', error);
        setNotification({
          type: 'error',
          message: 'Error al cargar los posts'
        });
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchPosts();
  }, [isLoaded, isSignedIn, router, getToken]);
  
  // Número de posts por página
  const postsPerPage = 5;
  
  // Filtrar posts según el filtro actual
  const filteredPosts = currentFilter === 'all'
    ? posts
    : posts.filter(post => post.status === currentFilter);
    
  // Calcular posts para la página actual
  const indexOfLastPost = currentPage * postsPerPage;
  const indexOfFirstPost = indexOfLastPost - postsPerPage;
  const currentPosts = filteredPosts.slice(indexOfFirstPost, indexOfLastPost);
  
  // Contar posts por estado
  const counts = {
    all: posts.length,
    pending: posts.filter(post => post.status === 'pending').length,
    approved: posts.filter(post => post.status === 'approved').length,
    rejected: posts.filter(post => post.status === 'rejected').length
  };
  
  // Función para cambiar el filtro
  const handleFilterChange = (filter: 'all' | PostStatus) => {
    setCurrentFilter(filter);
    setCurrentPage(1); // Volver a la primera página al cambiar el filtro
  };
  
  // Función para manejar el cambio de página
  const handlePageChange = (pageNumber: number) => {
    setCurrentPage(pageNumber);
    window.scrollTo(0, 0); // Volver al inicio de la página
  };
  
  // Función para manejar la aprobación de un post
  const handleApprovePost = async (id: number) => {
    setIsActionLoading(true);
    try {
      const token = await getToken({ template: 'access_token' });

      const updatedPost = await fetch(`${baseUrl}/posts/${id}/status`, {
        method: 'PATCH',
        credentials: 'include',
          headers: { 
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}` 
                  },
          body: JSON.stringify({ status: 'approved' })
        })
      const postData = await updatedPost.json();
      
      // Actualizar el estado local
      setPosts(posts.map(post => 
        post.id === id ? {...post, status: 'approved'} : post
      ));
      setSelectedPost(null);
      setNotification({
        type: 'success',
        message: 'Post aprobado correctamente'
      });
    } catch (error) {
      console.error('Error al aprobar el post:', error);
      setNotification({
        type: 'error',
        message: 'Error al aprobar el post'
      });
    } finally {
      setIsActionLoading(false);
    }
  };
  
  // Función para manejar el rechazo de un post
  const handleRejectPost = async (id: number) => {
    setIsActionLoading(true);
    try {
      const token = await getToken({ template: 'access_token' });
      const updatedPost = await fetch(`${baseUrl}/posts/${id}/status`, {
        method: 'PATCH',
        credentials: 'include',
          headers: { 
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}` 
                  },
          body: JSON.stringify({ status: 'rejected' })
        })
      const postData = await updatedPost.json();
      
      // Actualizar el estado local
      setPosts(posts.map(post => 
        post.id === id ? {...post, status: 'rejected'} : post
      ));
      setSelectedPost(null);
      setNotification({
        type: 'warning',
        message: 'Post rechazado'
      });
    } catch (error) {
      console.error('Error al rechazar el post:', error);
      setNotification({
        type: 'error',
        message: 'Error al rechazar el post'
      });
    } finally {
      setIsActionLoading(false);
    }
  };

  // UI loading state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-16 h-16 border-4 border-t-violet-600 border-r-violet-600 border-b-gray-700 border-l-gray-700 rounded-full animate-spin"></div>
          <p className="text-lg text-gray-400">Cargando publicaciones...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white">
      {notification && (
        <Notification
          type={notification.type}
          message={notification.message}
          onClose={() => setNotification(null)}
        />
      )}
      
      <div className="container mx-auto px-4 py-8 max-w-5xl">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-bold text-white">Panel de Moderación</h1>
          <div className="bg-violet-900/40 border border-violet-700 px-4 py-2 rounded-lg">
            <span className="text-violet-300 font-medium">
              {counts.pending} {counts.pending === 1 ? 'post pendiente' : 'posts pendientes'}
            </span>
          </div>
        </div>
        
        {isActionLoading && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-40">
            <div className="bg-gray-800 rounded-lg p-6 flex items-center gap-4">
              <div className="w-10 h-10 border-4 border-t-violet-600 border-r-violet-600 border-b-gray-700 border-l-gray-700 rounded-full animate-spin"></div>
              <p className="text-gray-300">Procesando acción...</p>
            </div>
          </div>
        )}
        
        {selectedPost ? (
          <PostDetail 
            post={selectedPost}
            onClose={() => setSelectedPost(null)}
            onApprove={handleApprovePost}
            onReject={handleRejectPost}
          />
        ) : (
          <>
            {/* Filtro de posts */}
            <FilterMenu 
              currentFilter={currentFilter}
              counts={counts}
              onFilterChange={handleFilterChange}
            />
            
            {/* Lista de posts */}
            <div className="flex flex-col gap-4">
              {currentPosts.length > 0 ? (
                currentPosts.map(post => (
                  <PostCard 
                    key={post.id}
                    post={post}
                    onClick={() => setSelectedPost(post)}
                  />
                ))
              ) : (
                <div className="bg-gray-800 p-8 rounded-lg text-center">
                  <p className="text-gray-400">
                    {currentFilter === 'all' 
                      ? 'No hay posts disponibles.' 
                      : currentFilter === 'pending'
                        ? 'No hay posts pendientes de moderación.'
                        : currentFilter === 'approved'
                          ? 'No hay posts aprobados.'
                          : 'No hay posts rechazados.'}
                  </p>
                </div>
              )}
            </div>
            
            {/* Paginación */}
            {filteredPosts.length > postsPerPage && (
              <div className="mt-6">
                <Pagination 
                  currentPage={currentPage}
                  totalPages={Math.ceil(filteredPosts.length / postsPerPage)}
                  onPageChange={handlePageChange}
                />
              </div>
            )}
            
            {/* Estadísticas de moderación */}
            <div className="mt-8 bg-gray-800/50 border border-gray-700 rounded-lg p-4">
              <h2 className="text-lg font-semibold text-violet-300 mb-3">Resumen de moderación</h2>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="bg-gray-800 p-4 rounded-lg border border-yellow-700/30">
                  <h3 className="text-yellow-400 font-medium">Pendientes</h3>
                  <p className="text-2xl font-bold mt-1">{counts.pending}</p>
                </div>
                <div className="bg-gray-800 p-4 rounded-lg border border-green-700/30">
                  <h3 className="text-green-400 font-medium">Aprobados</h3>
                  <p className="text-2xl font-bold mt-1">{counts.approved}</p>
                </div>
                <div className="bg-gray-800 p-4 rounded-lg border border-red-700/30">
                  <h3 className="text-red-400 font-medium">Rechazados</h3>
                  <p className="text-2xl font-bold mt-1">{counts.rejected}</p>
                </div>
              </div>
            </div>
            
            {/* Reportes pendientes */}
            <div className="mt-6">
              <ReportsList />
            </div>
          </>
        )}
      </div>
    </div>
  );
}
