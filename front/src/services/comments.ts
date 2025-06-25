// Servicios para gestionar los comentarios (VERSION MOCK)
import { mockComments, MockComment } from './mockData';

// Función para generar un ID único
const generateId = (): number => {
    return Math.max(0, ...mockComments.map(comment => comment.id)) + 1;
};

export async function createComment(data: { 
    content: string; 
    postId: number; 
    userId: string 
}, token: string) {
    // Simulamos una demora de red
    await new Promise(resolve => setTimeout(resolve, 600));
    
    try {
        // Creamos un nuevo comentario simulado
        const newComment: MockComment = {
            id: generateId(),
            content: data.content,
            createdAt: new Date().toISOString(),
            userId: data.userId,
            postId: data.postId,
            user: {
                name: 'Usuario Actual',
                nickname: 'usuario',
                clerkId: data.userId
            }
        };
        
        // Agregamos el comentario a nuestra colección simulada
        mockComments.push(newComment);
        
        return newComment;
    } catch (error) {
        console.error('[createComment] Error:', error);
        throw error;
    }
}

export async function getAllComments() {
    // Simulamos una demora de red
    await new Promise(resolve => setTimeout(resolve, 400));
    
    try {
        // Devolvemos directamente los comentarios simulados
        return [...mockComments]; // Devolvemos una copia para evitar mutaciones
    } catch (error) {
        console.error('[getAllComments] Error:', error);
        throw error;
    }
}

export async function getCommentById(id: number) {
    // Simulamos una demora de red
    await new Promise(resolve => setTimeout(resolve, 200));
    
    try {
        // Buscamos el comentario por ID en nuestros datos simulados
        const comment = mockComments.find(comment => comment.id === id);
        
        if (!comment) {
            throw new Error('Comentario no encontrado');
        }
        
        return { ...comment }; // Devolvemos una copia para evitar mutaciones
    } catch (error) {
        console.error('[getCommentById] Error:', error);
        throw error;
    }
}

export async function getPostComments(postId: number) {
    // Simulamos una demora de red
    await new Promise(resolve => setTimeout(resolve, 300));
    
    try {
        // Filtramos los comentarios del post directamente de nuestros datos simulados
        const postComments = mockComments.filter(comment => comment.postId === postId);
        
        return [...postComments]; // Devolvemos una copia para evitar mutaciones
    } catch (error) {
        console.error('[getPostComments] Error:', error);
        throw error;
    }
}

export async function deleteComment(id: number, token: string) {
    // Simulamos una demora de red
    await new Promise(resolve => setTimeout(resolve, 500));
    
    try {
        // Buscamos el índice del comentario en nuestros datos simulados
        const commentIndex = mockComments.findIndex(comment => comment.id === id);
        
        if (commentIndex === -1) {
            throw new Error('Comentario no encontrado');
        }
        
        // Eliminamos el comentario de nuestros datos simulados
        mockComments.splice(commentIndex, 1);
        
        return true; // La eliminación fue exitosa
    } catch (error) {
        console.error('[deleteComment] Error:', error);
        throw error;
    }
}
