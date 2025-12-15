import React, { useState, useEffect } from 'react';
import { X, Check } from 'lucide-react';
import { CHECKIN_CATEGORIES } from '../types';

interface CheckInModalProps {
  isOpen: boolean;
  onClose: () => void;
  day: number;
  existingData?: Record<string, number>;
  onSave: (data: Record<string, number>) => void;
}

export const CheckInModal: React.FC<CheckInModalProps> = ({
  isOpen,
  onClose,
  day,
  existingData,
  onSave
}) => {
  const [answers, setAnswers] = useState<Record<string, number>>({});

  useEffect(() => {
    if (isOpen) {
      setAnswers(existingData || {});
    }
  }, [isOpen, existingData]);

  if (!isOpen) return null;

  const handleSelect = (categoryId: string, value: number) => {
    setAnswers(prev => ({ ...prev, [categoryId]: value }));
  };

  const handleSave = () => {
    onSave(answers);
    onClose();
  };

  // Ícones SVG simples desenhados à mão para as opções
  const Icons = {
    Bad: () => (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10" />
        <path d="M16 16s-1.5-2-4-2-4 2-4 2" />
        <line x1="9" y1="9" x2="9.01" y2="9" />
        <line x1="15" y1="9" x2="15.01" y2="9" />
      </svg>
    ),
    Meh: () => (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10" />
        <line x1="8" y1="15" x2="16" y2="15" />
        <line x1="9" y1="9" x2="9.01" y2="9" />
        <line x1="15" y1="9" x2="15.01" y2="9" />
      </svg>
    ),
    Good: () => (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10" />
        <path d="M8 14s1.5 2 4 2 4-2 4-2" />
        <line x1="9" y1="9" x2="9.01" y2="9" />
        <line x1="15" y1="9" x2="15.01" y2="9" />
      </svg>
    )
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-ink/30 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-md bg-[#f4f1ea] shadow-2xl rounded-sm transform -rotate-1 hand-drawn-box">
        
        {/* Clip de Papel simulado no topo */}
        <div className="absolute -top-4 left-1/2 -translate-x-1/2 w-16 h-8 border-4 border-gray-400 rounded-t-xl z-20 bg-transparent border-b-0 shadow-sm"></div>
        <div className="absolute -top-4 left-1/2 -translate-x-1/2 w-14 h-4 bg-gray-300 rounded-b-md z-10 shadow-md"></div>

        {/* Botão Fechar */}
        <button 
          onClick={onClose}
          className="absolute top-3 right-3 text-pencil hover:text-ink transition-colors"
        >
          <X className="w-6 h-6" />
        </button>

        <div className="p-8 pt-10">
          <h2 className="font-title text-3xl text-ink mb-1 text-center border-b-2 border-pencil/20 pb-2">
            Check-in Diário
          </h2>
          <p className="text-center font-hand text-pencil text-lg mb-6">Dia {day}</p>

          <div className="space-y-5">
            {CHECKIN_CATEGORIES.map((cat) => (
              <div key={cat.id} className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <span className="font-hand text-xl text-ink w-40 flex flex-col leading-tight">
                  {cat.label}
                  {cat.note && <span className="text-xs text-pencil italic">{cat.note}</span>}
                </span>
                
                <div className="flex items-center gap-3">
                  {/* Opção 1: Ruim */}
                  <button
                    onClick={() => handleSelect(cat.id, 1)}
                    className={`
                      w-10 h-10 rounded-full flex items-center justify-center border-2 transition-all
                      ${answers[cat.id] === 1 
                        ? 'bg-red-200 border-ink scale-110 shadow-[2px_2px_0px_rgba(0,0,0,0.2)]' 
                        : 'bg-transparent border-pencil/30 text-pencil hover:border-pencil'}
                    `}
                    title="Ruim"
                  >
                    <Icons.Bad />
                  </button>

                  {/* Opção 2: Médio */}
                  <button
                    onClick={() => handleSelect(cat.id, 2)}
                    className={`
                      w-10 h-10 rounded-full flex items-center justify-center border-2 transition-all
                      ${answers[cat.id] === 2 
                        ? 'bg-yellow-100 border-ink scale-110 shadow-[2px_2px_0px_rgba(0,0,0,0.2)]' 
                        : 'bg-transparent border-pencil/30 text-pencil hover:border-pencil'}
                    `}
                    title="Médio"
                  >
                    <Icons.Meh />
                  </button>

                  {/* Opção 3: Bom */}
                  <button
                    onClick={() => handleSelect(cat.id, 3)}
                    className={`
                      w-10 h-10 rounded-full flex items-center justify-center border-2 transition-all
                      ${answers[cat.id] === 3 
                        ? 'bg-green-200 border-ink scale-110 shadow-[2px_2px_0px_rgba(0,0,0,0.2)]' 
                        : 'bg-transparent border-pencil/30 text-pencil hover:border-pencil'}
                    `}
                    title="Bom"
                  >
                    <Icons.Good />
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-8 flex justify-center">
            <button
              onClick={handleSave}
              className="bg-ink text-paper font-hand text-xl px-8 py-2 rounded-full shadow-lg hover:-translate-y-1 transition-transform flex items-center gap-2 border-2 border-transparent hover:border-ink hover:bg-white hover:text-ink"
            >
              <Check className="w-5 h-5" />
              Salvar Ficha
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};