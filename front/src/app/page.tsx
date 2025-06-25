'use client'

import { useUser, useAuth } from '@clerk/nextjs'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import Loading from '@/components/Loading'
import Markdown from 'react-markdown'
import MarkdownPreview from '@/components/MarkdownPreview'



const baseUrl = process.env.NEXT_PUBLIC_URL_BACK

export default function Home() {
  const { user, isSignedIn } = useUser()
  const { getToken } = useAuth()
  const [loading, setLoading] = useState(true)
  const [posts, setPosts] = useState<any[]>([])
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    // Sincronizar usuario con el backend
    const sync = async () => {
      if (!isSignedIn || !user) return

      const token = await getToken({ template: 'access_token' })

      const userData = {
        name: user.fullName || '',
        nickname: user.username || user.fullName || '',
        email: user.emailAddresses[0]?.emailAddress || '',
        profile_picture: user.imageUrl || '',
        rol: user.publicMetadata?.role || 'USER'
      }

      try {
        const res = await fetch(`${baseUrl}/users/sync-user`, {
          method: 'POST',
          credentials: 'include',
          headers: { 
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}` },
          body: JSON.stringify(userData)
        })

        await res.json()
      } catch (error) {
        console.error('Error al sincronizar:', error)
      }
    }
    

    // Cargar posts aprobados
    const loadPosts = async () => {
      const token = await getToken({ template: 'access_token' })
      try {
        setLoading(true)
        const resP = await fetch(`${baseUrl}/posts`, {
              method: 'GET',
              credentials: 'include',
              headers: { 
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}` },
            })

            const posts = await resP.json()
            
        
        // Filtrar posts aprobados
        const approvedPosts = posts.filter((post: any) => post.status === 'approved')
        setPosts(approvedPosts)
      } catch (err) {
        console.error('Error al cargar posts:', err)
        setError('No se pudieron cargar las publicaciones')
      } finally {
        setLoading(false)
      }
    }

    sync()
    loadPosts()
  }, [user, isSignedIn, getToken])
  
  const handleRefresh = async () => {
    try {

      setLoading(true)
      const token = await getToken({ template: 'access_token' })
      const resP = await fetch(`${baseUrl}/posts`, {
              method: 'GET',
              credentials: 'include',
              headers: { 
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}` },
            })

            const posts = await resP.json()
      
      // Filtrar posts aprobados
      const approvedPosts = posts.filter((post: any) => post.status === 'approved')
        setPosts(approvedPosts)
    } catch (err) {
      console.error('Error al cargar posts:', err)
      setError('No se pudieron cargar las publicaciones')
    } finally {
      setLoading(false)
    }
  }
  
  return (
    <div className="min-h-screen flex flex-col">
      {/* Barra superior */}
      <div className="w-full bg-gray-900 p-3 border-b border-gray-800">
        <div className="flex items-center gap-4">
          <button 
            onClick={handleRefresh}
            className="bg-gray-800 hover:bg-gray-700 text-white font-medium py-2 px-4 rounded-md"
          >
            Actualizar
          </button>
          <div className="flex-grow"></div>
     
          
        </div>
      </div>
      
      {/* Contenido principal */}
      <div className="flex-grow p-4 flex justify-center">
        <div className="w-full max-w-4xl">
          {loading ? (
            <Loading count={3} />
          ) : error ? (
            <div className="bg-red-900/30 border border-red-700 rounded-lg p-4 mb-6">
              <p className="text-red-300">{error}</p>
            </div>
          ) : posts.length > 0 ? (
            <div className="space-y-6">
              {posts.map((post) => (
                <div key={post.id} className="bg-gray-800 rounded-lg p-6 mb-4 shadow-lg border border-gray-700 hover:border-violet-500 transition-all duration-300">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-10 h-10 rounded-full overflow-hidden bg-gray-600">
                      {post.user?.profile_picture ? (
                        <img 
                          src={post.user.profile_picture} 
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
                      {post.user?.nickname && <p className="text-xs text-gray-400">@{post.user.nickname}</p>}
                      <p className="text-xs text-gray-400">
                        {new Date(post.date).toLocaleDateString('es-ES', {
                          day: 'numeric',
                          month: 'short'
                        })}
                      </p>
                    </div>
                  </div>
                  
                  <Link href={`/post/${post.id}`}>
                    <h2 className="text-2xl font-bold text-white mb-2 hover:text-violet-400 transition-colors">
                      {post.title}
                    </h2>
                  </Link>
                  
                  <MarkdownPreview content={post.content.length > 150 
                ? `${post.content.substring(0, 150)}...` 
                  : post.content} 
                      />
                    {post.content.length > 150 && (
                      <Link href={`/post/${post.id}`} className="text-violet-400 hover:text-violet-300 ml-2">
                        Leer más
                      </Link>
                    )}
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center mt-8 bg-gray-800 rounded-lg p-8">
              <h2 className="text-xl font-semibold mb-2">Aún no hay posts publicados</h2>
              <p className="text-gray-400 mb-6">Sé el primero en compartir contenido con la comunidad</p>
              {isSignedIn && (
                <Link href="/post" className="bg-violet-600 hover:bg-violet-700 text-white px-6 py-2 rounded-lg transition-colors">
                  Crear publicación
                </Link>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
