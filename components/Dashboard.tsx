import React, { useMemo } from 'react';
import { Incident, Sector, VectorType } from '../types';
import { VectorIcon } from './VectorIcon';

interface DashboardProps {
  incidents: Incident[];
}

interface MetricCardProps {
    title: string;
    value: string;
    description?: string;
    icon?: React.ReactNode;
}

const MetricCard: React.FC<MetricCardProps> = ({ title, value, description, icon }) => (
    <div className="bg-white p-6 rounded-2xl shadow-lg flex flex-col justify-between">
        <div>
            <div className="flex justify-between items-start">
              <p className="text-base font-medium text-gray-500">{title}</p>
              {icon}
            </div>
            <p className="text-4xl font-bold text-gray-800 mt-2">{value}</p>
        </div>
        {description && <p className="text-sm text-gray-400 mt-4">{description}</p>}
    </div>
);


const Dashboard: React.FC<DashboardProps> = ({ incidents }) => {
  const stats = useMemo(() => {
    if (!incidents.length) {
      return {
        total: 0,
        topSector: { name: 'N/A', count: 0 },
        topVector: { name: 'N/A' as VectorType | 'N/A', count: 0},
        lastIncidentDate: null,
        bySector: [],
        byVector: [],
      };
    }

    const sectorCounts = incidents.reduce((acc, incident) => {
      acc[incident.sector] = (acc[incident.sector] || 0) + 1;
      return acc;
    }, {} as Record<Sector, number>);

    const vectorCounts = incidents.reduce((acc, incident) => {
        acc[incident.vector] = (acc[incident.vector] || 0) + 1;
        return acc;
      }, {} as Record<VectorType, number>);

    const topSector = Object.entries(sectorCounts).reduce(
      (top, [sector, count]) => (count > top.count ? { name: sector as Sector, count } : top),
      { name: Sector.Other, count: 0 }
    );
    
    const topVector = Object.entries(vectorCounts).reduce(
        (top, [vector, count]) => (count > top.count ? { name: vector as VectorType, count } : top),
        { name: VectorType.Other, count: 0 }
      );

    const lastIncident = incidents[0];

    const bySector = Object.values(Sector).map(sector => ({
        name: sector,
        count: sectorCounts[sector] || 0
    })).sort((a, b) => b.count - a.count);
    
    const byVector = Object.values(VectorType).map(vector => ({
        name: vector,
        count: vectorCounts[vector] || 0
    })).sort((a, b) => b.count - a.count);

    return {
      total: incidents.length,
      topSector,
      topVector,
      lastIncidentDate: new Date(lastIncident.date),
      bySector,
      byVector,
    };
  }, [incidents]);

  if (incidents.length === 0) {
      return (
        <div className="text-center py-16 px-6 bg-white rounded-2xl shadow-lg">
            <svg xmlns="http://www.w3.org/2000/svg" className="mx-auto h-16 w-16 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" /></svg>
            <h2 className="mt-4 text-2xl font-semibold text-gray-700">Dashboard vazio.</h2>
            <p className="mt-2 text-gray-500">Adicione um registro para ver as estatísticas aqui.</p>
        </div>
      )
  }

  return (
    <div className="space-y-8">
        {/* Metric Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <MetricCard title="Total de Registros" value={stats.total.toString()} />
            <MetricCard 
                title="Vetor Mais Comum" 
                value={stats.topVector.name}
                description={`${stats.topVector.count} registro(s)`} 
                icon={stats.topVector.name !== 'N/A' ? <VectorIcon vector={stats.topVector.name} className="h-8 w-8 text-blue-500" /> : undefined}
            />
            <MetricCard 
                title="Último Registro" 
                value={stats.lastIncidentDate?.toLocaleDateString('pt-BR') ?? 'N/A'}
                description={stats.lastIncidentDate?.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }) ?? ''}
            />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Incidents by Sector */}
            <div className="bg-white p-6 rounded-2xl shadow-lg">
                <h3 className="text-xl font-bold text-gray-800 mb-4">Incidências por Setor</h3>
                <div className="space-y-4">
                    {stats.bySector.map(({ name, count }) => (
                        <div key={name}>
                            <div className="flex justify-between items-center mb-1">
                                <span className="font-medium text-gray-700">{name}</span>
                                <span className="text-sm font-semibold text-gray-600">{count}</span>
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-2.5">
                                <div 
                                    className="bg-blue-600 h-2.5 rounded-full" 
                                    style={{ width: `${stats.total > 0 ? (count / stats.total) * 100 : 0}%` }}
                                ></div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
            {/* Incidents by Vector */}
            <div className="bg-white p-6 rounded-2xl shadow-lg">
                <h3 className="text-xl font-bold text-gray-800 mb-4">Incidências por Vetor</h3>
                <div className="space-y-4">
                    {stats.byVector.map(({ name, count }) => (
                        <div key={name}>
                            <div className="flex justify-between items-center mb-1">
                                <span className="font-medium text-gray-700 flex items-center">
                                    <VectorIcon vector={name} className="h-5 w-5 mr-2 text-gray-600"/>
                                    {name}
                                </span>
                                <span className="text-sm font-semibold text-gray-600">{count}</span>
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-2.5">
                                <div 
                                    className="bg-green-600 h-2.5 rounded-full" 
                                    style={{ width: `${stats.total > 0 ? (count / stats.total) * 100 : 0}%` }}
                                ></div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    </div>
  );
};

export default Dashboard;