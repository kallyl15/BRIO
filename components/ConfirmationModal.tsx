import React from 'react';
import { Trash2 } from 'lucide-react';

interface ConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title?: string;
  message?: string;
}

export const ConfirmationModal: React.FC<ConfirmationModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  title = "Excluir Hábito",
  message = "Tem certeza? Essa ação não pode ser desfeita."
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-ink/20 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative bg-[#fcfbf9] w-full max-w-sm p-6 shadow-[10px_10px_0px_rgba(0,0,0,0.1)] border-2 border-ink transform rotate-1">
        
        {/* Tape effect */}
        <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-24 h-6 bg-red-200/80 rotate-[-2deg] shadow-sm"></div>

        <h3 className="font-title text-2xl text-ink mb-4 text-center mt-2">{title}</h3>
        <p className="font-hand text-lg text-pencil text-center mb-8 leading-tight">{message}</p>
        
        <div className="flex gap-4 justify-center">
          <button 
            onClick={onClose}
            className="px-4 py-2 font-hand text-lg text-ink border-2 border-transparent hover:border-pencil/30 rounded transition-colors"
          >
            Cancelar
          </button>
          
          <button 
            onClick={() => { onConfirm(); onClose(); }}
            className="px-6 py-2 bg-red-100 font-hand text-lg text-red-800 border-2 border-red-200 rounded hover:bg-red-200 hover:border-red-300 shadow-sm transition-all flex items-center gap-2"
          >
            <Trash2 className="w-4 h-4" />
            Excluir
          </button>
        </div>
      </div>
    </div>
  );
};