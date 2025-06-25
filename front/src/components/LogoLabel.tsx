import React from "react";

interface LogoLabelProps {
  color?: string; // Clase de Tailwind para el color
  className?: string; // Clases adicionales opcionales
}

/**
 * Componente que muestra el logo SVG dentro de un label.
 * El color se controla con Tailwind (por defecto blanco).
 */
const LogoLabel: React.FC<LogoLabelProps> = ({ color = "text-white", className = "" }) => {
  return (
    <label className={`inline-flex items-center ${className}`}>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 220 40"
        fill="none"
        className={`w-auto h-8 ${color}`}
        aria-label="Logo DCCommit"
      >
        <text x="0" y="28" fontFamily="monospace" fontSize="28" fill="currentColor">DCCommit</text>
        <text x="130" y="28" fontFamily="monospace" fontSize="28" fill="currentColor">&gt;_</text>
      </svg>
    </label>
  );
};

export default LogoLabel;
