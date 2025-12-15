import React, { useState } from 'react';
import { Heart, Plus } from 'lucide-react';
import { GratitudeItem } from '../types';

interface GratitudeBoxProps {
  items: GratitudeItem[];
  onAdd: (text: string) => void;
  onDelete: (id: string) => void;
}

export const GratitudeBox: React.FC<GratitudeBoxProps> = ({ items, onAdd, onDelete }) => {
  const [text, setText] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (text.trim()) {
      onAdd(text.trim());
      setText('');
    }
  };

  return (
    <div className="relative w-full filter drop-shadow-md">
      {/* Container visual do Papel Rasgado */}
      <div 
        className="bg-[#fffefb] p-6 pb-12 w-full relative"
        style={{
          // Efeito de papel pautado
          backgroundImage: 'repeating-linear-gradient(transparent, transparent 31px, #a29bfe30 31px, #a29bfe30 32px)',
          backgroundAttachment: 'local',
          // Borda superior rasgada (CSS clip-path simplificado)
          clipPath: 'polygon(0% 0%, 5% 5px, 10% 0%, 15% 5px, 20% 0%, 25% 5px, 30% 0%, 35% 5px, 40% 0%, 45% 5px, 50% 0%, 55% 5px, 60% 0%, 65% 5px, 70% 0%, 75% 5px, 80% 0%, 85% 5px, 90% 0%, 95% 5px, 100% 0%, 100% 100%, 0% 100%)',
          marginTop: '10px' // Espaço para o rasgo não cortar conteúdo acima se tiver
        }}
      >
        <div className="flex items-center gap-2 mb-6 text-purple-900/70 pt-2">
           <Heart className="w-5 h-5 fill-purple-100" />
           <h3 className="font-title text-2xl">Caixa de Gratidão</h3>
        </div>

        {/* Lista de Gratidão */}
        <div className="space-y-4 mb-4 min-h-[100px]">
           {items.length === 0 && (
             <p className="font-hand text-pencil/40 text-lg italic text-center mt-4">
               Pelo que você é grato hoje?
             </p>
           )}
           {items.slice(0, 5).map(item => ( // Mostra apenas os últimos 5
             <div key={item.id} className="group flex justify-between items-start font-hand text-xl text-ink leading-8">
                <span className="flex-1">- {item.text}</span>
                <button 
                  onClick={() => onDelete(item.id)}
                  className="opacity-0 group-hover:opacity-100 text-red-300 hover:text-red-500 transition-opacity ml-2 text-sm pt-1"
                >
                  (x)
                </button>
             </div>
           ))}
        </div>

        {/* Input */}
        <form onSubmit={handleSubmit} className="relative mt-2">
           <input 
             type="text"
             value={text}
             onChange={(e) => setText(e.target.value)}
             placeholder="Escreva e dê Enter..."
             className="w-full bg-transparent border-none outline-none font-hand text-xl text-ink placeholder-pencil/30"
           />
           <button type="submit" className="absolute right-0 top-0 text-pencil/50 hover:text-purple-500">
             <Plus className="w-5 h-5" />
           </button>
        </form>

        {/* Efeito de sombra interna na base para dar profundidade */}
        <div className="absolute bottom-0 left-0 right-0 h-8 bg-gradient-to-t from-white/80 to-transparent pointer-events-none"></div>
      </div>
    </div>
  );
};
