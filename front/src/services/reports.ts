// Servicios para gestionar los reportes (VERSION MOCK)
import { mockReports, MockReport } from './mockData';

// Función para generar un ID único
const generateId = (): number => {
    return Math.max(0, ...mockReports.map(report => report.id)) + 1;
};

export async function createReport(data: {
    reason: string;
    description?: string;
    postId?: number;
    commentId?: number;
    reporterId: string;
}, token: string) {
    // Simulamos una demora de red
    await new Promise(resolve => setTimeout(resolve, 700));
    
    try {
        // Validamos que el reporte tenga al menos un postId o un commentId
        if (!data.postId && !data.commentId) {
            throw new Error('El reporte debe referirse a un post o un comentario');
        }
        
        // Creamos un nuevo reporte simulado
        const newReport: MockReport = {
            id: generateId(),
            reason: data.reason,
            description: data.description,
            postId: data.postId,
            commentId: data.commentId,
            reporterId: data.reporterId,
            createdAt: new Date().toISOString(),
            status: 'pending'
        };
        
        // Agregamos el reporte a nuestra colección simulada
        mockReports.push(newReport);
        
        return newReport;
    } catch (error) {
        console.error('[createReport] Error:', error);
        throw error;
    }
}

export async function getAllReports(token: string) {
    // Simulamos una demora de red
    await new Promise(resolve => setTimeout(resolve, 500));
    
    try {
        // Devolvemos directamente los reportes simulados
        return [...mockReports]; // Devolvemos una copia para evitar mutaciones
    } catch (error) {
        console.error('[getAllReports] Error:', error);
        throw error;
    }
}

export async function getReportById(id: number, token: string) {
    // Simulamos una demora de red
    await new Promise(resolve => setTimeout(resolve, 300));
    
    try {
        // Buscamos el reporte por ID en nuestros datos simulados
        const report = mockReports.find(report => report.id === id);
        
        if (!report) {
            throw new Error('Reporte no encontrado');
        }
        
        return { ...report }; // Devolvemos una copia para evitar mutaciones
    } catch (error) {
        console.error('[getReportById] Error:', error);
        throw error;
    }
}

export async function updateReportStatus(id: number, status: 'resolved' | 'dismissed', token: string) {
    // Simulamos una demora de red
    await new Promise(resolve => setTimeout(resolve, 600));
    
    try {
        // Buscamos el reporte en nuestros datos simulados
        const report = mockReports.find(report => report.id === id);
        
        if (!report) {
            throw new Error('Reporte no encontrado');
        }
        
        // Actualizamos el estado del reporte
        report.status = status;
        
        return { ...report }; // Devolvemos una copia para evitar mutaciones
    } catch (error) {
        console.error('[updateReportStatus] Error:', error);
        throw error;
    }
}
