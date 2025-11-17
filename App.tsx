import React, { useState, useEffect, useCallback } from 'react';
import { Incident, VectorType } from './types';
import { exportToExcel } from './services/excelService';
import IncidentCard from './components/IncidentCard';
import AddIncidentModal from './components/AddIncidentModal';
import Button from './components/Button';
import Dashboard from './components/Dashboard';

type ActiveTab = 'dashboard' | 'records';

const App: React.FC = () => {
  const [incidents, setIncidents] = useState<Incident[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<ActiveTab>('dashboard');

  useEffect(() => {
    try {
      const storedIncidents = localStorage.getItem('vector-incidents');
      if (storedIncidents) {
        const parsedIncidents = JSON.parse(storedIncidents);
        // Simple migration for old data that doesn't have the 'vector' property
        const migratedIncidents = parsedIncidents.map((inc: any) => ({
          ...inc,
          vector: inc.vector || VectorType.Other,
        }));
        setIncidents(migratedIncidents);
      }
    } catch (error) {
      console.error("Failed to load incidents from localStorage", error);
    }
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem('vector-incidents', JSON.stringify(incidents));
    } catch (error) {
      console.error("Failed to save incidents to localStorage", error);
    }
  }, [incidents]);

  const addIncident = (newIncidentData: Omit<Incident, 'id'>) => {
    const newIncident: Incident = {
      id: `inc-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      ...newIncidentData,
    };
    setIncidents(prevIncidents => [newIncident, ...prevIncidents]);
  };

  const deleteIncident = useCallback((idToDelete: string) => {
    if (window.confirm('Tem certeza que deseja excluir este registro?')) {
      setIncidents(prevIncidents => prevIncidents.filter(incident => incident.id !== idToDelete));
    }
  }, []);

  const handleExport = () => {
    exportToExcel(incidents);
  };
  
  const TabButton: React.FC<{tabName: ActiveTab, currentTab: ActiveTab, onClick: (tab: ActiveTab) => void, children: React.ReactNode}> = ({tabName, currentTab, onClick, children}) => {
      const isActive = tabName === currentTab;
      const activeClasses = 'border-blue-600 text-blue-600';
      const inactiveClasses = 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300';
      return (
        <button
            onClick={() => onClick(tabName)}
            className={`whitespace-nowrap py-4 px-1 border-b-4 font-medium text-lg ${isActive ? activeClasses : inactiveClasses}`}
        >
            {children}
        </button>
      )
  }

  return (
    <div className="min-h-screen bg-gray-100 font-sans">
      <header className="bg-white shadow-md sticky top-0 z-10">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-4 flex flex-col sm:flex-row justify-between items-center">
          <div className="flex items-center mb-4 sm:mb-0">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-blue-600 mr-3" viewBox="0 0 20 20" fill="currentColor"><path d="M8 2a1 1 0 000 2h.586l1.207 1.207a1 1 0 00.707.293H12.5A2.5 2.5 0 0115 7.5v1.086l.914-.914A1 1 0 0015.207 7H18a1 1 0 011 1v2a1 1 0 01-1 1h-2.207a1 1 0 00-.707.293L14 12.414V13.5A2.5 2.5 0 0111.5 16h-3A2.5 2.5 0 016 13.5v-1.086l-.914.914A1 1 0 005.793 14H2a1 1 0 01-1-1V9a1 1 0 011-1h2.207a1 1 0 00.707-.293L6 6.586V5.5A2.5 2.5 0 018.5 3H10a1 1 0 000-2H8z" /></svg>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-800">Controle de Vetores</h1>
          </div>
          {incidents.length > 0 && (
            <button onClick={handleExport} className="bg-green-600 text-white font-semibold py-2 px-6 rounded-lg shadow-md hover:bg-green-700 transition-colors flex items-center text-lg">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
                Exportar Excel
            </button>
          )}
        </div>
      </header>

      <main className="container mx-auto p-4 sm:p-6 lg:p-8">
        <div className="bg-white p-6 rounded-2xl shadow-lg mb-8">
            <Button onClick={() => setIsModalOpen(true)} variant="primary">
              <span className="flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v3m0 0v3m0-3h3m-3 0H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                Registrar Nova Incidência
              </span>
            </Button>
        </div>
        
        <div className="mb-8">
            <div className="border-b border-gray-200">
                <nav className="-mb-px flex space-x-8" aria-label="Tabs">
                    <TabButton tabName="dashboard" currentTab={activeTab} onClick={setActiveTab}>Dashboard</TabButton>
                    <TabButton tabName="records" currentTab={activeTab} onClick={setActiveTab}>Registros</TabButton>
                </nav>
            </div>
        </div>

        {activeTab === 'dashboard' ? (
            <Dashboard incidents={incidents} />
        ) : (
            <>
                {incidents.length > 0 ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                    {incidents.map(incident => (
                      <IncidentCard key={incident.id} incident={incident} onDelete={deleteIncident} />
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-16 px-6 bg-white rounded-2xl shadow-lg">
                    <svg xmlns="http://www.w3.org/2000/svg" className="mx-auto h-16 w-16 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                    <h2 className="mt-4 text-2xl font-semibold text-gray-700">Nenhum incidente registrado.</h2>
                    <p className="mt-2 text-gray-500">Clique no botão acima para adicionar o primeiro registro.</p>
                  </div>
                )}
            </>
        )}

      </main>

      <AddIncidentModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onAddIncident={addIncident}
      />
    </div>
  );
};

export default App;