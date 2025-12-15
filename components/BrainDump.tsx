import React, { useState } from 'react';
import { Trash2, Plus, CloudRain, Loader2, Sparkles } from 'lucide-react';
import { BrainDumpItem } from '../types';
import { analyzeBrainDump } from '../services/ai';

interface BrainDumpProps {
  items: BrainDumpItem[];
  onAddItem: (text: string) => void;
  onToggleItem: (id: string) => void;
  onDeleteItem: (id: string) => void;
}

export const BrainDump: React.FC<BrainDumpProps> = ({ items, onAddItem, onToggleItem, onDeleteItem }) => {
  const [newItemText, setNewItemText] = useState('');
  const [weatherReport, setWeatherReport] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newItemText.trim()) {
      onAddItem(newItemText.trim());
      setNewItemText('');
      setWeatherReport(null); // Reset report on new item
    }
  };

  const handleAnalyze = async () => {
    setIsAnalyzing(true);
    const texts = items.filter(i => !i.isDone).map(i => i.text);
    const result = await analyzeBrainDump(texts);
    setWeatherReport(result);
    setIsAnalyzing(false);
  };

  return (
    <div className="w-full bg-[#fdf6e3] p-6 relative hand-drawn-box shadow-md rotate-[-0.5deg]">
      {/* Visual de Papel Pautado */}
      <div className="absolute inset-0 pointer-events-none opacity-10" 
           style={{ backgroundImage: 'repeating-linear-gradient(transparent, transparent 31px, #94a3b8 31px, #94a3b8 32px)' }}>
      </div>
      
      {/* Título */}
      <div className="relative z-10 flex items-center justify-between mb-4 border-b-2 border-dashed border-ink/20 pb-2">
        <div>
          <h3 className="font-title text-3xl text-ink">Brain Dump</h3>
          <span className="font-hand text-sm text-pencil">Despejo Mental</span>
        </div>
        
        {/* AI Button */}
        <button
          onClick={handleAnalyze}
          disabled={isAnalyzing || items.length === 0}
          className="group flex items-center gap-2 px-3 py-1 rounded-full bg-white/50 border border-ink/10 hover:bg-white transition-colors disabled:opacity-50"
          title="Ver Previsão do Tempo Mental"
        >
          {isAnalyzing ? <Loader2 className="w-4 h-4 animate-spin text-ink" /> : <CloudRain className="w-4 h-4 text-blue-400 group-hover:text-blue-600" />}
          <span className="font-hand text-sm hidden sm:inline">Clima Mental</span>
        </button>
      </div>

      {/* Weather Report Sticky */}
      {weatherReport && (
        <div className="relative z-10 mb-4 p-3 bg-blue-50/80 border border-blue-100 rounded-lg animate-in fade-in slide-in-from-top-2">
          <div className="flex items-start gap-2">
            <Sparkles className="w-4 h-4 text-blue-400 mt-1 shrink-0" />
            <p className="font-hand text-ink italic text-lg leading-tight">{weatherReport}</p>
          </div>
        </div>
      )}

      {/* Lista */}
      <div className="relative z-10 space-y-1 min-h-[150px] max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
        {items.length === 0 && (
           <div className="text-center text-pencil/50 font-hand text-lg mt-8 italic">
              Coisas na cabeça? Escreva aqui para esquecer...
           </div>
        )}
        
        {items.map((item) => (
          <div key={item.id} className="group flex items-center gap-3 py-1 hover:bg-black/5 rounded px-2 transition-colors">
            <button 
              onClick={() => onToggleItem(item.id)}
              className={`w-5 h-5 border-2 border-ink rounded-sm flex items-center justify-center transition-colors ${item.isDone ? 'bg-ink' : 'bg-transparent'}`}
            >
              {item.isDone && <span className="text-paper text-sm font-bold">✓</span>}
            </button>
            
            <span className={`flex-1 font-hand text-xl text-ink pt-1 ${item.isDone ? 'line-through opacity-50' : ''}`}>
              {item.text}
            </span>

            <button 
              onClick={() => onDeleteItem(item.id)}
              className="opacity-0 group-hover:opacity-100 text-red-400 hover:text-red-600 transition-opacity"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        ))}
      </div>

      {/* Input */}
      <form onSubmit={handleSubmit} className="relative z-10 mt-4 flex items-center gap-2 border-t border-ink/10 pt-4">
        <Plus className="w-5 h-5 text-pencil" />
        <input 
          type="text" 
          value={newItemText}
          onChange={(e) => setNewItemText(e.target.value)}
          placeholder="Adicionar pensamento rápido..."
          className="flex-1 bg-transparent border-none outline-none font-hand text-xl text-ink placeholder-pencil/50"
        />
      </form>
    </div>
  );
};