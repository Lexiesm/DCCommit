// Servicios para gestionar los posts (VERSION MOCK)
import { mockPosts, MockPost } from './mockData';

// Cuando conectemos con el backend, usaremos esta URL
// const API_URL = 'http://localhost:4000';

// Función para generar un ID único
const generateId = (): number => {
    return Math.max(0, ...mockPosts.map(post => post.id)) + 1;
};

export async function createPost(userId: string, data: { title: string; content: string }, token: string) {
    // Simulamos una demora de red
    await new Promise(resolve => setTimeout(resolve, 800));
    
    try {
        // En un caso real, enviaríamos esto al servidor
        const newPost: MockPost = {
            id: generateId(),
            title: data.title,
            content: data.content,
            date: new Date().toISOString(),
            status: 'pending', // Todos los posts comienzan como pendientes
            likes: 0,
            userId,
            // Simulamos datos de usuario basados en el usuario actual
            user: {
                name: 'Usuario Actual',
                nickname: 'usuario',
                clerkId: userId
            }
        };
        
        // Agregamos el post a nuestra colección simulada
        mockPosts.push(newPost);
        
        return newPost;
    } catch (error) {
        console.error('[createPost] Error:', error);
        throw error;
    }
}

export async function getAllPosts(token?: string) {
    // Simulamos una demora de red
    await new Promise(resolve => setTimeout(resolve, 500));
    
    try {
        // Devolvemos directamente los posts simulados
        return [...mockPosts]; // Devolvemos una copia para evitar mutaciones
    } catch (error) {
        console.error('[getAllPosts] Error:', error);
        throw error;
    }
}

export async function getPostById(id: number, token?: string) {
    // Simulamos una demora de red
    await new Promise(resolve => setTimeout(resolve, 300));
    
    try {
        // Buscamos el post por ID en nuestros datos simulados
        const post = mockPosts.find(post => post.id === id);
        
        if (!post) {
            throw new Error('Publicación no encontrada');
        }
        
        return { ...post }; // Devolvemos una copia para evitar mutaciones
    } catch (error) {
        console.error('[getPostById] Error:', error);
        throw error;
    }
}

export async function getUserPosts(userId: string, token: string) {
    // Simulamos una demora de red
    await new Promise(resolve => setTimeout(resolve, 400));
    
    try {
        // Filtramos los posts del usuario directamente de nuestros datos simulados
        const userPosts = mockPosts.filter(post => 
            post.userId === userId || post.user?.clerkId === userId
        );
        
        return [...userPosts]; // Devolvemos una copia para evitar mutaciones
    } catch (error) {
        console.error('[getUserPosts] Error:', error);
        throw error;
    }
}

export async function deletePost(id: number, token: string) {
    // Simulamos una demora de red
    await new Promise(resolve => setTimeout(resolve, 600));
    
    try {
        // Buscamos el índice del post en nuestros datos simulados
        const postIndex = mockPosts.findIndex(post => post.id === id);
        
        if (postIndex === -1) {
            throw new Error('Publicación no encontrada');
        }
        
        // Eliminamos el post de nuestros datos simulados
        mockPosts.splice(postIndex, 1);
        
        return true; // La eliminación fue exitosa
    } catch (error) {
        console.error('[deletePost] Error:', error);
        throw error;
    }
}

export async function updatePostStatus(id: number, status: 'approved' | 'rejected', token: string) {
    // Simulamos una demora de red
    await new Promise(resolve => setTimeout(resolve, 500));
    
    try {
        // Buscamos el post en nuestros datos simulados
        const post = mockPosts.find(post => post.id === id);
        
        if (!post) {
            throw new Error('Publicación no encontrada');
        }
        
        // Actualizamos el estado del post
        post.status = status;
        
        return { ...post }; // Devolvemos una copia para evitar mutaciones
    } catch (error) {
        console.error('[updatePostStatus] Error:', error);
        throw error;
    }
}
