import React, { useState } from 'react';
import { X, Sparkles, Loader2 } from 'lucide-react';

interface StickyNoteProps {
  id?: string;
  text: string;
  color: string; // hex ou classe de cor
  rotation: number;
  onDelete?: (id: string) => void;
  onChange?: (id: string, text: string) => void;
  onGenerateAI?: () => Promise<string>; // Nova prop para IA
  className?: string;
  headerIcon?: React.ReactNode;
  headerTitle?: string;
  readOnly?: boolean;
}

export const StickyNote: React.FC<StickyNoteProps> = ({
  id,
  text,
  color,
  rotation,
  onDelete,
  onChange,
  onGenerateAI,
  className = '',
  headerIcon,
  headerTitle,
  readOnly = false
}) => {
  const [isGenerating, setIsGenerating] = useState(false);
  
  // Mapeamento de cores para classes Tailwind ou estilos inline
  const bgColors: Record<string, string> = {
    yellow: 'bg-[#fef9c3]',
    pink: 'bg-[#ffdde1]',
    blue: 'bg-[#dff9fb]',
    green: 'bg-[#dbfbc4]',
  };

  const bgColorClass = bgColors[color] || color; 

  const handleAiClick = async () => {
    if (!onGenerateAI || !onChange || !id) return;
    
    setIsGenerating(true);
    try {
      const generatedText = await onGenerateAI();
      onChange(id, generatedText);
    } catch (error) {
      console.error("Erro ao gerar texto", error);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div 
      className={`relative p-4 pb-8 shadow-md hand-drawn-box rounded-none border-0 transition-all hover:scale-105 group w-60 shrink-0 ${bgColorClass} ${className}`}
      style={{ transform: `rotate(${rotation}deg)` }}
    >
      {/* Fita adesiva */}
      <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-20 h-6 bg-white/40 shadow-sm rotate-[-1deg] border border-white/20 pointer-events-none"></div>
      
      {/* Botões de Ação (X e IA) */}
      <div className="absolute -top-2 -right-2 flex gap-1 z-10 opacity-0 group-hover:opacity-100 transition-opacity">
        {/* Botão IA (apenas se editável e função fornecida) */}
        {!readOnly && onGenerateAI && (
          <button 
            onClick={handleAiClick}
            disabled={isGenerating}
            className="w-6 h-6 bg-indigo-400 text-white rounded-full flex items-center justify-center shadow-sm hover:bg-indigo-500 transition-colors disabled:opacity-50"
            title="Gerar Insight com IA"
          >
            {isGenerating ? <Loader2 className="w-3 h-3 animate-spin" /> : <Sparkles className="w-3 h-3" />}
          </button>
        )}

        {/* Botão Fechar */}
        {onDelete && (
          <button 
            onClick={(e) => { e.stopPropagation(); onDelete(id || ''); }}
            className="w-6 h-6 bg-red-400 text-white rounded-full flex items-center justify-center shadow-sm hover:bg-red-500 transition-colors"
            title="Remover Post-it"
          >
            <X className="w-3 h-3" />
          </button>
        )}
      </div>

      {/* Header Opcional (para Insights fixos) */}
      {(headerIcon || headerTitle) && (
        <div className="flex items-center justify-between mb-2 text-ink/70">
           <div className="flex items-center gap-2">
              {headerIcon}
              {headerTitle && <h4 className="font-title text-xl font-bold">{headerTitle}</h4>}
           </div>
        </div>
      )}
      
      {readOnly ? (
        <p className="font-hand text-ink text-lg leading-tight min-h-[3rem] whitespace-pre-wrap">
          {text}
        </p>
      ) : (
        <textarea
          value={text}
          onChange={(e) => onChange && onChange(id || '', e.target.value)}
          placeholder="Escreva algo..."
          className="w-full h-full bg-transparent border-none outline-none font-hand text-xl text-ink resize-none leading-tight min-h-[5rem] placeholder-black/20"
          spellCheck={false}
        />
      )}
    </div>
  );
};