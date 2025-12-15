import React from 'react';
import { Target, ArrowRight } from 'lucide-react';
import { Tape } from './Tape';

interface TomorrowFocusProps {
  focusText: string;
  setFocusText: (text: string) => void;
}

export const TomorrowFocus: React.FC<TomorrowFocusProps> = ({ focusText, setFocusText }) => {
  return (
    <div className="relative w-full mt-4 transform rotate-1 transition-transform hover:rotate-0">
      {/* Fita adesiva segurando o cartão */}
      <Tape className="top-[-10px] left-[40%] bg-blue-100/80" rotation="-rotate-2" />

      {/* Cartão Estilo Ficha Pautada (Index Card) */}
      <div className="bg-white border border-gray-200 shadow-md p-6 rounded-sm relative overflow-hidden">
        {/* Linha vermelha do topo do index card */}
        <div className="absolute top-12 left-0 right-0 h-[2px] bg-red-300/50"></div>
        {/* Linhas azuis */}
        <div className="absolute inset-0 pointer-events-none" 
             style={{ backgroundImage: 'repeating-linear-gradient(transparent, transparent 29px, #a5b1c220 29px, #a5b1c220 30px)', marginTop: '50px' }}>
        </div>

        <div className="relative z-10">
          <div className="flex items-center gap-2 mb-6">
            <Target className="w-5 h-5 text-red-400" />
            <h3 className="font-title text-xl text-ink uppercase tracking-wider">O Foco de Amanhã</h3>
          </div>

          <div className="flex items-start gap-2">
             <ArrowRight className="w-6 h-6 text-pencil mt-1" />
             <textarea
               value={focusText}
               onChange={(e) => setFocusText(e.target.value)}
               placeholder="Qual a ÚNICA coisa que fará o dia valer a pena?"
               className="w-full bg-transparent border-none outline-none font-hand text-2xl text-ink resize-none leading-[30px] min-h-[90px] placeholder-pencil/30"
             />
          </div>
        </div>
      </div>
    </div>
  );
};
