'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation'; 
import PostToolbar from './TextToolbar';
import MarkdownPreview from './MarkdownPreview';
import SubmitButton from './SubmitButton';

import { useUser, useAuth } from '@clerk/nextjs';



const baseUrl = process.env.NEXT_PUBLIC_URL_BACK

export default function CreatePost() {
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [showPreview, setShowPreview] = useState(false);
    const { user, isSignedIn, isLoaded } = useUser();
    const { getToken } = useAuth();
    const [token, setToken] = useState<string | null>(null);
    const router = useRouter(); 

  useEffect(() => {
    if (!isLoaded) return

    if (!isSignedIn) {
      router.push('/unauthorized')
    } else {
      getToken({ template: 'access_token' }).then(setToken)
    }
    }, [isLoaded, isSignedIn, getToken, router])

    if (!isLoaded || !isSignedIn) {
        return (
            <div className="flex justify-center items-center h-screen">
                <div className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
            </div>
    )
    }

    const handleContentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        setContent(e.target.value);
    };

    const handleSubmit = async () => {
        if (!user?.id || !title.trim() || !content.trim()) {
            alert('Completa el título, contenido y asegúrate de estar logeado.');
            return;
        }

        const userData = {
            title,
            content,
        };

        try {
            const res = await fetch(`${baseUrl}/posts/${user.id}`, {
                method: 'POST',
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
                body: JSON.stringify(userData),
            });

            if (!res.ok) {
                const errorText = await res.text(); 
                throw new Error(`Error al crear post: ${res.status} - ${errorText}`);
            }

            alert('Publicación enviada. Debe ser aprobada por un moderador.');
            router.push('/')
            setTitle('');
            setContent('');
        } catch (error) {
            console.error(error);
            alert('Hubo un problema al enviar la publicación');
        }
    };

    return (
        <div className="container mx-auto p-4 bg-color-background">
            <div className="flex items-center gap-2 mb-4">
                <button
                    className={`px-4 py-2 rounded ${showPreview ? 'bg-blue-600 text-white' : 'bg-gray-200 text-black'}`}
                    onClick={() => setShowPreview((prev) => !prev)}
                    type="button"
                >
                    {showPreview ? 'Ocultar Preview' : 'Preview'}
                </button>
            </div>

            {showPreview ? (
                <MarkdownPreview content={content} title={title} />
            ) : (
                <>
                    <input
                        type="text"
                        placeholder="Título de tu post aquí..."
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        className="input input-bordered input-primary w-full mb-4"
                        style={{ backgroundColor: 'var(--input-bg)', color: 'var(--input-text)' }}
                    />

                    <PostToolbar content={content} setContent={setContent} />

                    <textarea
                        placeholder="Escribe tu contenido"
                        value={content}
                        onChange={handleContentChange}
                        className="textarea textarea-bordered textarea-primary w-full mb-4"
                        rows={10}
                        style={{ backgroundColor: 'var(--input-bg)', color: 'var(--input-text)' }}
                    />
                </>
            )}
                <div className="mt-4 flex justify-end">
                    <SubmitButton onClick={handleSubmit} />
                </div>
            
        </div>
    );
}