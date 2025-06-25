'use client';
import { useState, useEffect } from 'react';
import { useUser, useAuth } from '@clerk/nextjs';
import { useRouter } from 'next/navigation';



const baseUrl = process.env.NEXT_PUBLIC_URL_BACK

export default function Settings() {
  const [nickname, setNickname] = useState('')
  const { user, isSignedIn } = useUser()
  const { getToken } = useAuth()
  const router = useRouter()
  const [currentNickname, setCurrentNickname] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!isSignedIn || !user) return

    const token = await getToken({ template: 'access_token' })

    try {
      const res = await fetch(`${baseUrl}/users/update-nickname`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ clerkId: user.id, nickname })
      })

      const json = await res.json()

      if (!res.ok) {
        console.error('Error desde backend:', json)
        alert('Nickname ya esta en uso, elija otro')
        return
      }
      alert('Nickname actualizado!')
      router.push('/')
    } catch (err) {
      console.error('Error al actualizar nickname:', err)
    }
  }

    useEffect(() => {
      const fetchNickname = async () => {
        if (!isSignedIn || !user) return
  
        const token = await getToken({ template: 'access_token' })
  
        try {
          const res = await fetch(`${baseUrl}/users/by-clerk/${user.id}`, {
            headers: {
              'Authorization': `Bearer ${token}`,
            }
          })
          if (!res.ok) throw new Error('Error al obtener usuario')
  
          const data = await res.json()
          setCurrentNickname(data.nickname || '')
        } catch (err) {
          console.error('Error al obtener nickname:', err)
        }
      }
  
      fetchNickname()
    }, [isSignedIn, user, getToken])

  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <h1 className="text-2xl font-bold mb-4">Configuración</h1>
      <p>username</p>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          value={nickname}
          placeholder={currentNickname}
          onChange={(e) => setNickname(e.target.value)}
          className="border rounded text-white px-3 py-2"
          required
        />
        <button
          type="submit"
          className="bg-blue-500 text-white px-4 py-2 rounded"
        >
          Guardar
        </button>
      </form>
    </div>
  );
}