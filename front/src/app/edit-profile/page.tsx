'use client'

import { useUser, useAuth } from '@clerk/nextjs'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { FiFileText, FiMessageCircle } from 'react-icons/fi'


const baseUrl = process.env.NEXT_PUBLIC_URL_BACK

export default function EditProfile() {
  const { user, isSignedIn } = useUser()
  const { getToken } = useAuth()
  const [currentnickname, setCurrentNickname] = useState('')
  const [userPosts, setUserPosts] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    // Importaciones dinámicas
    import('@/services/users').then(userServices => {
      import('@/services/posts').then(postServices => {
        const fetchUserData = async () => {
          if (!isSignedIn || !user) return
          setLoading(true)
          const token = await getToken({ template: 'access_token' })

          const userData = {
            name: user.fullName || '',
            nickname: user.username || user.fullName,
            email: user.emailAddresses[0]?.emailAddress || '',
            profile_picture: user.imageUrl || '',
            rol: user.publicMetadata?.role || 'USER'
          }

          try {
            // Obtener datos del usuario
            const res = await fetch(`${baseUrl}/users/sync-user`, {
              method: 'POST',
              credentials: 'include',
              headers: { 
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}` },
              body: JSON.stringify(userData)
            })

            await res.json()

            const USERdata = await fetch(`${baseUrl}/users/by-clerk/${user.id}`, {
              method: 'GET',
              credentials: 'include',
              headers: { 
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}` }
              
            })

            const dataUser = await USERdata.json()
            setCurrentNickname(dataUser.nickname || '')
            
            // Obtener posts del usuario
            const resP = await fetch(`${baseUrl}/posts/user/${user.id}`, {
              method: 'GET',
              credentials: 'include',
              headers: { 
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}` },
            })

            const posts = await resP.json()
            setUserPosts(posts)
          } catch (err) {
            console.error('Error al obtener datos del usuario:', err)
          } finally {
            setLoading(false)
          }
        }
        fetchUserData()
      })
    })
  }, [isSignedIn, user, getToken])

  const joinedDate = user?.createdAt
    ? (() => {
        const date = new Date(user.createdAt)
        const month = date.toLocaleString('es-ES', { month: 'long' })
        const year = date.getFullYear()
        return `${month} del ${year}`
      })()
    : ''
  const fullName = user?.fullName || user?.firstName || user?.username || ''
  const profileImage = user?.imageUrl || ''

  return (
    <div className="relative min-h-screen bg-black">
      {/* Fondo superior verde absoluto */}
      <div className="absolute top-0 left-0 w-full h-48 bg-green-900 z-0" />
      {/* Avatar centrado y superpuesto */}
      <div className="relative flex flex-col items-center" style={{ zIndex: 20 }}>
        <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-green-900 shadow-lg mt-8"
          style={{ marginBottom: '-64px', zIndex: 30, position: 'relative' }}>
          {profileImage && (
            <img
              src={profileImage}
              alt="Foto de perfil"
              className="object-cover w-full h-full"
            />
          )}
        </div>
      </div>
      {/* Tarjeta principal */}
      <div className="relative z-10 flex flex-col items-center">
        <div className="bg-gray-custom text-white p-8 rounded-lg shadow-md w-full max-w-3xl mt-0 flex flex-col items-center">
          <div className="w-full flex flex-col md:flex-row md:items-center md:justify-between">
            <div className="flex flex-col items-center md:items-start">
              <h1 className="text-3xl font-bold mb-1 text-center md:text-left">{fullName}</h1>
              <p className="text-gray-400 text-center md:text-left mb-2">{currentnickname ? currentnickname : 'AQUI VA EL NICKNAME'}</p>
              <div className="flex items-center gap-2 text-gray-400 text-sm mb-2">
                <span>Se unió en {joinedDate}</span>
              </div>
            </div>
            <button
              className="bg-violet-600 hover:bg-violet-700 text-white font-semibold px-6 py-2 rounded-lg shadow mt-4 md:mt-0 self-center md:self-end"
              onClick={() => router.push('/settings')}
            >
              Editar Perfil
            </button>
          </div>
        </div>
        {/* Sección de estadísticas y post destacado */}
        <div className="flex flex-col md:flex-row gap-4 w-full max-w-5xl mt-6">
          {/* Estadísticas */}
          <div className="bg-gray-custom text-white p-6 rounded-lg shadow-md w-full max-w-xs flex flex-col gap-2">
            <p className="flex items-center gap-2">
              <FiFileText className="text-lg" />
              <span>{loading ? 'Cargando...' : `${userPosts.length} publicaciones`}</span>
            </p>
            <p className="flex items-center gap-2">
              <FiMessageCircle className="text-lg" />
              <span>Comentarios</span>
            </p>
            <button
              onClick={() => router.push('/my-posts')}
              className="bg-violet-600 hover:bg-violet-700 text-white px-4 py-2 rounded-lg mt-3 w-full transition-colors"
            >
              Ver mis publicaciones
            </button>
          </div>
          
          {/* Todos los posts */}
          <div className="bg-gray-custom text-white p-6 rounded-lg shadow-md w-full max-w-2xl min-w-[320px] flex flex-col gap-4 border border-gray-700 hover:shadow-lg transition-shadow duration-200">
          {loading ? (
          <p className="text-center py-6">Cargando...</p>
          ) : userPosts.length > 0 ? (
          userPosts.map((post) => (
          <div key={post.id} className="border-b border-gray-600 pb-4 last:border-b-0">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 rounded-full overflow-hidden border border-blue-400">
                {profileImage && (
                  <img src={profileImage} alt="Foto de perfil" className="object-cover w-full h-full" />
                )}
              </div>
            <div>
              <p className="font-semibold leading-5">{fullName}</p>
              <p className="text-xs text-gray-400 leading-4">
                {new Date(post.date).toLocaleDateString('es-ES', {
                  day: 'numeric',
                  month: 'short',
                })}
              </p>
            </div>
          </div>
          <div>
          <div className="flex items-center justify-between">
  <h3 className="font-bold text-lg mb-1">{post.title}</h3>
  <span
    className={`text-sm px-2 py-1 rounded-full font-medium ${
          post.status === 'approved'
              ? 'bg-green-700 text-white'
            : post.status === 'pending'
            ? 'bg-yellow-700 text-white'
            : 'bg-red-700 text-white'
          }`}
        >
          {post.status === 'approved'
            ? 'Aceptado'
          : post.status === 'pending'
        ? 'Pendiente'
          : 'Rechazado'}
      </span>
    </div>
          {/* <p className="text-gray-300 line-clamp-3">{post.content.substring(0, 150)}...</p> */}
        </div>
        <div className="mt-2">
          <button
            onClick={() => router.push(`/post/${post.id}`)}
            className="text-violet-400 hover:text-violet-300"
          >
            Leer publicación completa
          </button>
        </div>
      </div>
          ))
        ) : (
      <div className="text-center py-6">
        <p className="text-gray-400 mb-4">No tienes publicaciones todavía.</p>
        <button
          onClick={() => router.push('/post')}
          className="bg-violet-600 hover:bg-violet-700 text-white px-4 py-2 rounded-lg transition-colors"
        >
          Crear publicación
        </button>
      </div>
      )}
      </div>
        </div>
      </div>
    </div>
  )
}
