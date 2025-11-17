import React from 'react';
import { Incident, VectorType } from '../types';
import { VectorIcon } from './VectorIcon';

interface IncidentCardProps {
  incident: Incident;
  onDelete: (id: string) => void;
}

const IncidentCard: React.FC<IncidentCardProps> = ({ incident, onDelete }) => {
  const formattedDate = new Date(incident.date).toLocaleString('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden transform transition-transform hover:shadow-xl hover:-translate-y-1">
      <img src={incident.photo} alt={`Incidente em ${incident.sector}`} className="w-full h-48 object-cover" />
      <div className="p-4">
        <div className="flex items-center mb-2">
          <VectorIcon vector={incident.vector} className="h-6 w-6 text-gray-700" />
          <p className="ml-2 text-gray-800 font-bold text-lg">{incident.vector}</p>
        </div>
        <p className="text-gray-600 font-semibold text-base">{incident.sector}</p>
        <p className="text-gray-500 text-sm mt-1">{formattedDate}</p>
        <button
          onClick={() => onDelete(incident.id)}
          className="mt-4 w-full bg-red-500 text-white text-sm font-bold py-2 px-4 rounded-lg hover:bg-red-600 transition-colors"
        >
          Excluir
        </button>
      </div>
    </div>
  );
};

export default IncidentCard;