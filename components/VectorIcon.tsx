import React from 'react';
import { VectorType } from '../types';

interface VectorIconProps {
  vector: VectorType | 'N/A';
  className?: string;
}

export const VectorIcon: React.FC<VectorIconProps> = ({ vector, className = 'h-6 w-6' }) => {
  switch (vector) {
    case VectorType.Cockroach:
      return (
        <svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 2 L12 6"/>
            <path d="M12 18 L12 22"/>
            <path d="M4.93 4.93 L7.76 7.76"/>
            <path d="M16.24 16.24 L19.07 19.07"/>
            <path d="M2 12 L6 12"/>
            <path d="M18 12 L22 12"/>
            <path d="M4.93 19.07 L7.76 16.24"/>
            <path d="M16.24 7.76 L19.07 4.93"/>
            <path d="M12,4 C14,4 16,6 16,8 L16,16 C16,18 14,20 12,20 C10,20 8,18 8,16 L8,8 C8,6 10,4 12,4 z"/>
        </svg>
      );
    case VectorType.Rodent:
      return (
        <svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M20 12v-4a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v4a8 8 0 0 0 16 0z" />
            <path d="M12 12a4 4 0 0 1-8 0" />
            <path d="M12 12a4 4 0 0 0 8 0" />
            <path d="M4 12a.5.5 0 0 0 0 1" />
            <path d="M20 12a.5.5 0 0 0 0 1" />
            <path d="M18 12a.5.5 0 0 1-1 0" />
            <path d="M6 12a.5.5 0 0 1-1 0" />
            <path d="M11 2a2 2 0 0 0-2 2" />
            <path d="M15 2a2 2 0 0 1 2 2" />
        </svg>
      );
    case VectorType.Fly:
      return (
        <svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M12 8.5V15.5" />
          <path d="M8 12H16" />
          <path d="M5.5 18.5L9 15" />
          <path d="M18.5 18.5L15 15" />
          <path d="M2 11h2c0-2.5 2-4 4.5-4S13 8.5 13 11h2c0-3.5-2.5-6-6.5-6S4 7.5 4 11" />
        </svg>
      );
    case VectorType.Other:
    default:
      return (
        <svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M8 2a1 1 0 000 2h.586l1.207 1.207a1 1 0 00.707.293H12.5A2.5 2.5 0 0115 7.5v1.086l.914-.914A1 1 0 0015.207 7H18a1 1 0 011 1v2a1 1 0 01-1 1h-2.207a1 1 0 00-.707.293L14 12.414V13.5A2.5 2.5 0 0111.5 16h-3A2.5 2.5 0 016 13.5v-1.086l-.914.914A1 1 0 005.793 14H2a1 1 0 01-1-1V9a1 1 0 011-1h2.207a1 1 0 00.707-.293L6 6.586V5.5A2.5 2.5 0 018.5 3H10a1 1 0 000-2H8z" />
        </svg>
      );
  }
};
