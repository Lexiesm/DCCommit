'use client';

import { useState, useEffect } from 'react';
import { useUser, useAuth } from '@clerk/nextjs';
import { useRouter } from 'next/navigation';
import PostCard from '@/components/PostCard';
import Loading from '@/components/Loading';
import { getUserPosts, deletePost } from '@/services/posts';
import { FiPlus } from 'react-icons/fi';




const baseUrl = process.env.NEXT_PUBLIC_URL_BACK

export default function MyPostsPage() {
  const [posts, setPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user, isSignedIn, isLoaded } = useUser();
  const { getToken } = useAuth();
  const router = useRouter();
  
  // Estado para manejar confirmación de eliminación
  const [postToDelete, setPostToDelete] = useState<number | null>(null);

  useEffect(() => {
    if (!isLoaded) return;
    
    if (!isSignedIn) {
      router.push('/unauthorized');
      return;
    }
    
    const fetchUserPosts = async () => {
      try {
        const token = await getToken({ template: 'access_token' });
        if (!user || !token) return;
        
        const resP = await fetch(`${baseUrl}/posts/user/${user.id}`, {
          method: 'GET',
          credentials: 'include',
          headers: { 
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}` },
          })

        const posts = await resP.json()
        setPosts(posts)
      } catch (err) {
        console.error('Error al obtener posts del usuario:', err);
        setError('No se pudieron cargar tus publicaciones');
      } finally {
        setLoading(false);
      }
    };
    
    fetchUserPosts();
  }, [isLoaded, isSignedIn, user, getToken, router]);

  const handleDeleteClick = (postId: number) => {
    setPostToDelete(postId);
  };

  const confirmDelete = async () => {
  if (!postToDelete || !isSignedIn) return;

  try {
    setLoading(true);
    const token = await getToken({ template: 'access_token' });

    const resP = await fetch(`${baseUrl}/posts/${postToDelete}`, {
      method: 'DELETE',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      }
    });

    if (!resP.ok) {
      throw new Error('No se pudo eliminar el post');
    }

    // Luego vuelve a cargar los posts
    const resPo = await fetch(`${baseUrl}/posts/user/${user?.id}`, {
      method: 'GET',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      }
    });

    const posts = await resPo.json();
    setPosts(posts);
    setPostToDelete(null);
  } catch (err) {
    console.error('Error al eliminar post:', err);
    setError('No se pudo eliminar la publicación');
    setPostToDelete(null);
  } finally {
    setLoading(false);
  }
};

  if (loading) {
    return <Loading />;
  }

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="max-w-4xl mx-auto p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Mis Publicaciones</h1>
          <button
            onClick={() => router.push('/post')}
            className="bg-violet-600 hover:bg-violet-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
          >
            <FiPlus size={18} />
            Nueva Publicación
          </button>
        </div>
        
        {error && (
          <div className="bg-red-900/30 border border-red-700 rounded-lg p-4 mb-6">
            <p className="text-red-300">{error}</p>
          </div>
        )}
        
        {posts.length > 0 ? (
          <div className="space-y-6">
            {posts.map((post) => (
              <PostCard
                key={post.id}
                id={post.id}
                title={post.title}
                content={post.content}
                date={post.date}
                author={{
                  name: user?.fullName || user?.firstName || 'Usuario',
                  image: user?.imageUrl,
                  nickname: user?.username ?? user?.firstName ?? 'usuario'
                }}
                status={post.status}
                showActions={true}
                onDelete={() => handleDeleteClick(post.id)}
              />
            ))}
          </div>
        ) : (
          <div className="bg-gray-800 rounded-lg p-8 text-center">
            <h2 className="text-xl font-semibold mb-2">No tienes publicaciones aún</h2>
            <p className="text-gray-400 mb-6">Crea tu primera publicación para compartir con la comunidad</p>
            {/* <button
              onClick={() => router.push('/post')}
              className="bg-violet-600 hover:bg-violet-700 text-white px-6 py-2 rounded-lg transition-colors"
            >
              Crear publicación
            </button> */}
          </div>
        )}
        
        {/* Modal de confirmación de eliminación */}
        {postToDelete && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-gray-800 rounded-lg p-6 max-w-md w-full m-4">
              <h3 className="text-lg font-semibold mb-3">¿Eliminar publicación?</h3>
              <p className="text-gray-300 mb-6">Esta acción no se puede deshacer.</p>
              <div className="flex justify-end gap-3">
                <button
                  onClick={() => setPostToDelete(null)}
                  className="bg-gray-700 hover:bg-gray-600 text-white px-4 py-2 rounded-lg transition-colors"
                >
                  Cancelar
                </button>
                <button
                  onClick={confirmDelete}
                  className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg transition-colors"
                >
                  Eliminar
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
