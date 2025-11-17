import { Incident } from '../types';

// The xlsx library is loaded from a CDN in index.html, so we declare it here.
declare const XLSX: any;

export const exportToExcel = (incidents: Incident[], fileName: string = 'relatorio_vetores'): void => {
  if (!incidents.length) {
    alert('Não há dados para exportar.');
    return;
  }

  // We don't include the full base64 photo in the Excel sheet.
  const dataForExport = incidents.map(incident => {
    const incidentDate = new Date(incident.date);
    return {
      'ID': incident.id,
      'Data': incidentDate.toLocaleDateString('pt-BR'),
      'Hora': incidentDate.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
      'Setor': incident.sector,
      'Tipo de Vetor': incident.vector || 'N/A', // Add vector type
      'Foto Registrada': 'Sim',
    };
  });

  const worksheet = XLSX.utils.json_to_sheet(dataForExport);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Incidentes');

  // Set column widths for better readability
  worksheet['!cols'] = [
    { wch: 30 }, // ID
    { wch: 15 }, // Data
    { wch: 15 }, // Hora
    { wch: 20 }, // Setor
    { wch: 20 }, // Tipo de Vetor
    { wch: 20 }, // Foto Registrada
  ];

  XLSX.writeFile(workbook, `${fileName}_${new Date().toISOString().split('T')[0]}.xlsx`);
};