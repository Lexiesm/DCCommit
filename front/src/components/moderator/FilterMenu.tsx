import React from 'react';
import { PostStatus } from '@/types/globals';

interface FilterMenuProps {
  currentFilter: PostStatus | 'all';
  counts: {
    all: number;
    pending: number;
    approved: number;
    rejected: number;
  };
  onFilterChange: (filter: PostStatus | 'all') => void;
}

export default function FilterMenu({ currentFilter, counts, onFilterChange }: FilterMenuProps) {
  const filters: Array<{ value: PostStatus | 'all', label: string, icon: React.ReactNode }> = [
    { 
      value: 'all', 
      label: 'Todos', 
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" />
        </svg>
      )
    },
    { 
      value: 'pending', 
      label: 'Pendientes', 
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      )
    },
    { 
      value: 'approved', 
      label: 'Aprobados', 
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      )
    },
    { 
      value: 'rejected', 
      label: 'Rechazados', 
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      )
    }
  ];
  
  return (
    <div className="bg-gray-800 rounded-lg overflow-hidden mb-6 border border-gray-700">
      {/* Filtros versión móvil (selector) */}
      <div className="block sm:hidden p-2">
        <select 
          value={currentFilter}
          onChange={(e) => onFilterChange(e.target.value as PostStatus | 'all')}
          className="w-full bg-gray-900 text-white rounded-md border border-gray-700 p-2"
        >
          {filters.map(filter => (
            <option key={filter.value} value={filter.value}>
              {filter.label} ({counts[filter.value as keyof typeof counts]})
            </option>
          ))}
        </select>
      </div>
      
      {/* Filtros versión desktop (botones) */}
      <div className="hidden sm:flex flex-wrap">
        {filters.map(filter => (
          <button
            key={filter.value}
            onClick={() => onFilterChange(filter.value)}
            className={`px-4 py-3 text-sm font-medium flex items-center justify-between ${
              currentFilter === filter.value
                ? 'bg-violet-700 text-white'
                : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
            } transition-colors flex-1`}
          >
            <div className="flex items-center">
              {filter.icon}
              <span>{filter.label}</span>
            </div>
            <span className={`ml-2 px-2 py-0.5 rounded-full text-xs ${
              currentFilter === filter.value
                ? 'bg-violet-900 text-violet-200'
                : 'bg-gray-700 text-gray-400'
            }`}>
              {counts[filter.value as keyof typeof counts]}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}
