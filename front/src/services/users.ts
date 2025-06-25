// Servicios para gestionar los usuarios (VERSION MOCK)
import { mockUsers, MockUser } from './mockData';

export async function getUserByClerkId(clerkId: string, token: string) {
    // Simulamos una demora de red
    await new Promise(resolve => setTimeout(resolve, 300));
    
    try {
        // Buscamos el usuario por su Clerk ID en nuestros datos simulados
        const user = mockUsers.find(user => user.clerkId === clerkId);
        
        if (!user) {
            // Si el usuario no existe, creamos uno nuevo (simulando registro automático)
            const newUser: MockUser = {
                id: mockUsers.length + 1,
                name: 'Nuevo Usuario',
                nickname: 'usuario' + (mockUsers.length + 1),
                email: `usuario${mockUsers.length + 1}@example.com`,
                clerkId,
                role: 'USER',
                createdAt: new Date().toISOString()
            };
            
            mockUsers.push(newUser);
            return { ...newUser };
        }
        
        return { ...user }; // Devolvemos una copia para evitar mutaciones
    } catch (error) {
        console.error('[getUserByClerkId] Error:', error);
        throw error;
    }
}

export async function getAllUsers(token: string) {
    // Simulamos una demora de red
    await new Promise(resolve => setTimeout(resolve, 500));
    
    try {
        // Devolvemos directamente los usuarios simulados
        return [...mockUsers]; // Devolvemos una copia para evitar mutaciones
    } catch (error) {
        console.error('[getAllUsers] Error:', error);
        throw error;
    }
}

export async function updateUserNickname(userId: string, nickname: string, token: string) {
    // Simulamos una demora de red
    await new Promise(resolve => setTimeout(resolve, 600));
    
    try {
        // Buscamos el usuario en nuestros datos simulados
        const user = mockUsers.find(user => user.clerkId === userId);
        
        if (!user) {
            throw new Error('Usuario no encontrado');
        }
        
        // Actualizamos el nickname del usuario
        user.nickname = nickname;
        
        return { ...user }; // Devolvemos una copia para evitar mutaciones
    } catch (error) {
        console.error('[updateUserNickname] Error:', error);
        throw error;
    }
}

export async function updateUserRole(userId: string, role: string, token: string) {
    // Simulamos una demora de red
    await new Promise(resolve => setTimeout(resolve, 600));
    
    try {
        // Buscamos el usuario en nuestros datos simulados
        const user = mockUsers.find(user => user.clerkId === userId);
        
        if (!user) {
            throw new Error('Usuario no encontrado');
        }
        
        // Verificamos que el rol sea válido
        if (!['USER', 'MODERATOR', 'ADMIN'].includes(role)) {
            throw new Error('Rol no válido');
        }
        
        // Actualizamos el rol del usuario
        user.role = role as 'USER' | 'MODERATOR' | 'ADMIN';
        
        return { ...user }; // Devolvemos una copia para evitar mutaciones
    } catch (error) {
        console.error('[updateUserRole] Error:', error);
        throw error;
    }
}
