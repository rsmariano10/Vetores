import React, { useState, useRef, useEffect } from 'react';
import { Incident, Sector, VectorType } from '../types';
import Button from './Button';
import { VectorIcon } from './VectorIcon';

interface AddIncidentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddIncident: (incident: Omit<Incident, 'id'>) => void;
}

const fileToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = error => reject(error);
  });
};

const AddIncidentModal: React.FC<AddIncidentModalProps> = ({ isOpen, onClose, onAddIncident }) => {
  const [sector, setSector] = useState<Sector>(Sector.Kitchen);
  const [vector, setVector] = useState<VectorType | null>(null);
  const [photo, setPhoto] = useState<string | null>(null);
  const [error, setError] = useState<string>('');
  const [isCameraOpen, setIsCameraOpen] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const streamRef = useRef<MediaStream | null>(null);

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'environment' }
      });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        streamRef.current = stream;
      }
      setIsCameraOpen(true);
      setError('');
    } catch (err) {
      console.error("Camera error:", err);
      setError('Não foi possível acessar a câmera. Verifique as permissões do navegador.');
      setIsCameraOpen(false);
    }
  };

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    setIsCameraOpen(false);
  };

  const capturePhoto = () => {
    if (videoRef.current && canvasRef.current) {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      const context = canvas.getContext('2d');
      if (context) {
        context.drawImage(video, 0, 0, video.videoWidth, video.videoHeight);
        const dataUrl = canvas.toDataURL('image/jpeg');
        setPhoto(dataUrl);
        stopCamera();
      }
    }
  };

  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      try {
        const base64 = await fileToBase64(file);
        setPhoto(base64);
        setError('');
      } catch (err) {
        setError('Falha ao carregar a imagem.');
      }
    }
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    if (!photo || !vector) {
      setError('A foto e o tipo de vetor são obrigatórios.');
      return;
    }
    onAddIncident({
      photo,
      date: new Date().toISOString(),
      sector,
      vector,
    });
    resetForm();
    onClose();
  };
  
  const resetForm = () => {
    setSector(Sector.Kitchen);
    setPhoto(null);
    setVector(null);
    setError('');
    stopCamera();
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  useEffect(() => {
    if (!isOpen) {
      stopCamera();
    }
  }, [isOpen]);

  if (!isOpen) return null;
  
  const renderPhotoInput = () => {
    if (photo) {
      return (
        <div className="relative">
          <img src={photo} alt="Pré-visualização" className="w-full h-auto max-h-80 object-contain rounded-lg bg-gray-100" />
          <button
            type="button"
            onClick={() => { setPhoto(null); setVector(null); setError(''); }}
            className="mt-4 w-full bg-gray-500 text-white text-sm font-bold py-3 px-4 rounded-lg hover:bg-gray-600 transition-colors text-base"
          >
            Trocar Foto
          </button>
        </div>
      );
    }

    if (isCameraOpen) {
      return (
        <div className="space-y-4">
          <div className="relative w-full bg-black rounded-lg overflow-hidden aspect-video">
            <video ref={videoRef} autoPlay playsInline className="w-full h-full object-cover"></video>
            <canvas ref={canvasRef} className="hidden"></canvas>
          </div>
          <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-4">
            <Button type="button" variant="primary" onClick={capturePhoto} className="flex-1 py-3 text-base">
              Capturar Foto
            </Button>
            <Button type="button" variant="secondary" onClick={stopCamera} className="flex-1 py-3 text-base">
              Cancelar
            </Button>
          </div>
        </div>
      );
    }
    
    return (
        <>
            <input
              type="file"
              accept="image/*"
              ref={fileInputRef}
              onChange={handleFileSelect}
              className="hidden"
            />
            <div className="w-full border-2 border-dashed border-gray-300 rounded-lg flex flex-col justify-center items-center text-gray-500 hover:bg-gray-50 p-4 space-y-3">
                <button
                    type="button"
                    onClick={startCamera}
                    className="flex items-center justify-center w-full text-blue-600 hover:text-blue-800 transition-colors p-3 rounded-lg"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                    <span className="text-lg font-semibold">Usar Câmera</span>
                </button>
                <div className="text-center text-sm text-gray-400 font-medium">OU</div>
                <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="flex items-center justify-center w-full text-blue-600 hover:text-blue-800 transition-colors p-3 rounded-lg"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                    <span className="text-lg font-semibold">Escolher da Galeria</span>
                </button>
            </div>
        </>
    );
  }

  const VectorButton: React.FC<{type: VectorType}> = ({type}) => {
    const isSelected = vector === type;
    return (
        <button
            type="button"
            onClick={() => setVector(type)}
            className={`flex-1 flex flex-col items-center justify-center p-3 rounded-xl border-2 transition-all duration-200 ${isSelected ? 'bg-blue-100 border-blue-500 ring-2 ring-blue-500' : 'bg-gray-50 border-gray-200 hover:border-blue-400'}`}
        >
            <VectorIcon vector={type} className={`h-8 w-8 mb-1 ${isSelected ? 'text-blue-600' : 'text-gray-600'}`} />
            <span className={`font-semibold text-sm ${isSelected ? 'text-blue-700' : 'text-gray-700'}`}>{type}</span>
        </button>
    )
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex justify-center items-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl p-6 md:p-8 w-full max-w-lg max-h-full overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-800">Registrar Incidência</h2>
          <button onClick={handleClose} className="text-gray-500 hover:text-gray-800 text-3xl">&times;</button>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-lg font-medium text-gray-700 mb-2">1. Foto do Vetor</label>
            {renderPhotoInput()}
          </div>

          <div>
            <label className="block text-lg font-medium text-gray-700 mb-2">2. Tipo de Vetor</label>
            <div className={`grid grid-cols-2 sm:grid-cols-4 gap-3 ${!photo ? 'opacity-50 pointer-events-none' : ''}`}>
                {Object.values(VectorType).map(v => <VectorButton key={v} type={v} />)}
            </div>
          </div>


          <div>
            <label htmlFor="sector" className="block text-lg font-medium text-gray-700 mb-2">3. Setor do Restaurante</label>
            <select
              id="sector"
              value={sector}
              onChange={(e) => setSector(e.target.value as Sector)}
              className="w-full text-lg p-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              disabled={!photo || !vector}
            >
              {Object.values(Sector).map((s) => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
          </div>
          
          {error && <p className="text-red-500 text-center font-medium">{error}</p>}

          <div className="pt-4 space-y-4">
            <Button type="submit" variant="primary" disabled={!photo || !vector}>
              Salvar Registro
            </Button>
            <Button type="button" variant="secondary" onClick={handleClose}>
              Cancelar
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddIncidentModal;