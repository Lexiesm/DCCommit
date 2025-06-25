import React from 'react'

interface PaginationProps {
  totalItems?: number
  itemsPerPage?: number
  totalPages?: number
  currentPage: number
  onPageChange: (page: number) => void
}

export default function Pagination({ totalItems, itemsPerPage, totalPages: propsTotalPages, currentPage, onPageChange }: PaginationProps) {
  // Calcular totalPages ya sea directamente desde props o desde totalItems/itemsPerPage
  const totalPages = propsTotalPages || (totalItems && itemsPerPage ? Math.ceil(totalItems / itemsPerPage) : 1)
  
  if (totalPages <= 1) return null
  
  // Crea un array de números de página para mostrar
  const getPageNumbers = () => {
    const pages = []
    const maxVisiblePages = 5
    
    if (totalPages <= maxVisiblePages) {
      // Si hay menos de maxVisiblePages, mostrar todas las páginas
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i)
      }
    } else {
      // Siempre mostrar la primera página
      pages.push(1)
      
      // Calcular el rango central
      let startPage = Math.max(2, currentPage - 1)
      let endPage = Math.min(totalPages - 1, currentPage + 1)
      
      // Ajustar si estamos cerca del principio o del final
      if (currentPage <= 3) {
        endPage = 4
      } else if (currentPage >= totalPages - 2) {
        startPage = totalPages - 3
      }
      
      // Añadir puntos suspensivos después de la página 1 si es necesario
      if (startPage > 2) {
        pages.push('...')
      }
      
      // Añadir páginas del rango central
      for (let i = startPage; i <= endPage; i++) {
        pages.push(i)
      }
      
      // Añadir puntos suspensivos antes de la última página si es necesario
      if (endPage < totalPages - 1) {
        pages.push('...')
      }
      
      // Siempre mostrar la última página
      pages.push(totalPages)
    }
    
    return pages
  }
  
  const pageNumbers = getPageNumbers()
  
  return (
    <div className="flex items-center justify-center mt-6 gap-1">
      <button
        onClick={() => onPageChange(Math.max(1, currentPage - 1))}
        disabled={currentPage === 1}
        className={`px-3 py-1 rounded-md ${
          currentPage === 1
            ? 'bg-gray-700 text-gray-400 cursor-not-allowed'
            : 'bg-gray-700 text-white hover:bg-gray-600'
        }`}
      >
        &lt;
      </button>
      
      {pageNumbers.map((page, index) => (
        <button
          key={index}
          onClick={() => typeof page === 'number' ? onPageChange(page) : null}
          className={`px-3 py-1 rounded-md ${
            page === currentPage
              ? 'bg-violet-700 text-white'
              : page === '...'
              ? 'bg-transparent text-gray-400 cursor-default'
              : 'bg-gray-700 text-white hover:bg-gray-600'
          }`}
        >
          {page}
        </button>
      ))}
      
      <button
        onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
        disabled={currentPage === totalPages}
        className={`px-3 py-1 rounded-md ${
          currentPage === totalPages
            ? 'bg-gray-700 text-gray-400 cursor-not-allowed'
            : 'bg-gray-700 text-white hover:bg-gray-600'
        }`}
      >
        &gt;
      </button>
    </div>
  )
}
