import React, { useState, useEffect } from 'react';
import { MockReport } from '@/services/mockData';
import { getAllReports, updateReportStatus } from '@/services/reports';
import Notification from '@/components/Notification';
import { useAuth } from '@clerk/nextjs';
import { useRouter } from 'next/navigation';


interface ReportsListProps {}

const baseUrl = process.env.NEXT_PUBLIC_URL_BACK

export default function ReportsList({}: ReportsListProps) {
  const [reports, setReports] = useState<MockReport[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [notification, setNotification] = useState<{
    type: 'success' | 'error' | 'warning' | 'info';
    message: string;
  } | null>(null);
  const [navigating, setNavigating] = useState(false);
  const [navigatingToReport, setNavigatingToReport] = useState<MockReport | null>(null);
  
  const { getToken } = useAuth();
  const router = useRouter();
  
  // Función para navegar al contenido reportado
  const handleNavigateToReportedContent = (report: MockReport) => {
    if (navigating) return;
    
    setNavigating(true);
    setNavigatingToReport(report);
    setNotification({
      type: 'info',
      message: 'Navegando al contenido reportado...'
    });
    
    setTimeout(() => {
      // Determinar la URL de destino según el tipo de reporte
      if (report.postId) {
        // Si es un reporte de post, navegar a la página del post
        router.push(`/post/${report.postId}?reportId=${report.id}`);
      } else if (report.commentId) {
        // Si es un reporte de comentario, necesitamos saber el post al que pertenece
        // En un caso real haríamos una consulta, aquí asumimos que podemos derivarlo
        // del reportId como ejemplo
        const mockPostId = Math.floor(report.commentId / 10) + 1;
        router.push(`/post/${mockPostId}?commentId=${report.commentId}&reportId=${report.id}`);
      }
    }, 300);
  };
  
  // Cargar reportes al iniciar
  useEffect(() => {
    const fetchReports = async () => {
      try {
        setIsLoading(true);
        const token = await getToken?.({ template: 'access_token' });
        const fetchedReports = await fetch (`${baseUrl}/reports`,{
            method: 'GET',
              credentials: 'include',
              headers: { 
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}` },
            })
        const reportsData = await fetchedReports.json();
        setReports(reportsData);
      } catch (error) {
        console.error('Error cargando reportes:', error);
        setNotification({
          type: 'error',
          message: 'Error al cargar los reportes'
        });
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchReports();
  }, [getToken]);
  
  // Filtrar reportes pendientes
  const pendingReports = reports.filter(report => report.status === 'pending');
  
  // Función para resolver un reporte
  const handleResolveReport = async (id: number) => {
    try {
      const token = await getToken?.({ template: 'access_token' });
      await updateReportStatus(id, 'resolved', token || '');
      
      // Actualizar la lista local
      setReports(prevReports => 
        prevReports.map(report => 
          report.id === id ? {...report, status: 'resolved'} : report
        )
      );
      
      setNotification({
        type: 'success',
        message: 'Reporte marcado como resuelto'
      });
    } catch (error) {
      console.error('Error al resolver el reporte:', error);
      setNotification({
        type: 'error',
        message: 'Error al resolver el reporte'
      });
    }
  };
  
  // Función para desestimar un reporte
  const handleDismissReport = async (id: number) => {
    try {
      const token = await getToken?.({ template: 'access_token' });
      await updateReportStatus(id, 'dismissed', token || '');
      
      // Actualizar la lista local
      setReports(prevReports => 
        prevReports.map(report => 
          report.id === id ? {...report, status: 'dismissed'} : report
        )
      );
      
      setNotification({
        type: 'info',
        message: 'Reporte desestimado'
      });
    } catch (error) {
      console.error('Error al desestimar el reporte:', error);
      setNotification({
        type: 'error',
        message: 'Error al desestimar el reporte'
      });
    }
  };
  
  if (isLoading) {
    return (
      <div className="bg-gray-800/50 border border-gray-700 rounded-lg p-4 animate-pulse">
        <div className="h-6 w-48 bg-gray-700 rounded mb-4"></div>
        <div className="space-y-3">
          <div className="h-20 bg-gray-700 rounded"></div>
          <div className="h-20 bg-gray-700 rounded"></div>
        </div>
      </div>
    );
  }
  
  if (navigating) {
    return (
      <div className="bg-gray-800/50 border border-gray-700 rounded-lg p-4">
        <h2 className="text-lg font-semibold text-violet-300 mb-3">Navegando...</h2>
        <div className="py-6 flex items-center justify-center">
          <div className="flex flex-col items-center gap-4">
            <div className="w-12 h-12 border-4 border-t-violet-600 border-r-violet-600 border-b-gray-700 border-l-gray-700 rounded-full animate-spin"></div>
            <p className="text-gray-400">
              {navigatingToReport?.postId
                ? `Cargando post #${navigatingToReport.postId}...`
                : navigatingToReport?.commentId
                ? `Cargando comentario #${navigatingToReport.commentId}...`
                : 'Cargando contenido reportado...'}
            </p>
          </div>
        </div>
      </div>
    );
  }
  
  if (pendingReports.length === 0) {
    return (
      <div className="bg-gray-800/50 border border-gray-700 rounded-lg p-4">
        <h2 className="text-lg font-semibold text-violet-300 mb-3">Reportes pendientes</h2>
        <div className="py-8 text-center">
          <p className="text-gray-400">No hay reportes pendientes</p>
          <p className="text-gray-500 text-sm mt-1">Todos los reportes han sido atendidos</p>
        </div>
      </div>
    );
  }
  
  return (
    <div className="bg-gray-800/50 border border-gray-700 rounded-lg p-4">
      {notification && (
        <Notification
          type={notification.type}
          message={notification.message}
          onClose={() => setNotification(null)}
        />
      )}
      
      <h2 className="text-lg font-semibold text-violet-300 mb-3">
        Reportes pendientes ({pendingReports.length})
      </h2>
      
      <div className="space-y-3">
        {pendingReports.map(report => (
          <div 
            key={report.id} 
            className="bg-gray-800 border border-red-900/30 rounded-lg p-4 transition-all hover:bg-gray-750 cursor-pointer group"
            onClick={() => handleNavigateToReportedContent(report)}
          >
            <div className="flex justify-between items-start mb-2">
              <div>
                <span className="bg-red-900/50 text-red-200 text-xs px-2 py-1 rounded">
                  {report.reason}
                </span>
                <span className="text-gray-400 text-xs ml-2">
                  ID: {report.id} • {new Date(report.createdAt).toLocaleDateString()}
                </span>
              </div>
              <span className="text-violet-400 text-xs font-medium group-hover:text-violet-300">
                Ver contenido reportado &rarr;
              </span>
            </div>
            
            <p className="text-gray-300 text-sm mb-3">
              {report.description || 'Sin descripción'}
            </p>
            
            <div className="border-t border-gray-700 pt-3 mt-2">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-xs text-gray-400">
                    {report.postId 
                      ? `Reporte sobre post #${report.postId}` 
                      : report.commentId 
                        ? `Reporte sobre comentario #${report.commentId}`
                        : 'Reporte general'}
                  </span>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDismissReport(report.id);
                    }}
                    className="text-gray-300 hover:text-white text-xs bg-gray-700 hover:bg-gray-600 px-3 py-1 rounded"
                  >
                    Desestimar
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleResolveReport(report.id);
                    }}
                    className="text-white text-xs bg-violet-700 hover:bg-violet-600 px-3 py-1 rounded"
                  >
                    Resolver
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
