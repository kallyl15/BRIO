import React, { useState } from 'react';
import { Mail, Lock, X, Loader2, Sparkles } from 'lucide-react';
import { Habit, MoodEntry, CheckInRecord, JournalEntries } from '../types';
import { generateWeeklyLetter } from '../services/ai';

interface WeeklyLetterProps {
  habits: Habit[];
  moodData: MoodEntry[];
  checkIns: CheckInRecord;
  journalEntries: JournalEntries;
}

export const WeeklyLetter: React.FC<WeeklyLetterProps> = ({
  habits,
  moodData,
  checkIns,
  journalEntries
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [letterContent, setLetterContent] = useState<string | null>(null);

  // Lógica de "Semana Passada": Para fins de demonstração, vamos considerar Domingo (0) como o dia de abrir.
  // Em produção, poderia ser uma lógica mais complexa de datas.
  const today = new Date();
  const isSunday = today.getDay() === 0;

  const handleOpenLetter = async () => {
    if (!isSunday && !letterContent) return; // Se não é domingo e não tem carta cacheada, não abre

    setIsOpen(true);

    // Se já geramos, não gera de novo para economizar token e manter a "carta" estática
    if (!letterContent) {
      setIsGenerating(true);
      const content = await generateWeeklyLetter(habits, moodData, checkIns, journalEntries);
      setLetterContent(content);
      setIsGenerating(false);
    }
  };

  return (
    <>
      {/* O Envelope na Interface */}
      <div className="relative group cursor-pointer w-full flex justify-center py-4" onClick={isSunday ? handleOpenLetter : undefined}>
        <div 
          className={`
            relative w-48 h-32 bg-[#eaddcf] shadow-md transition-all duration-300 flex items-center justify-center
            border-b-[16px] border-[#d4c5b0] rounded-b-lg overflow-hidden
            ${isSunday ? 'hover:scale-105 hover:-rotate-1 cursor-pointer' : 'opacity-80 grayscale-[0.3] cursor-not-allowed'}
          `}
          // Shape do envelope usando clip-path para a aba
          style={{
             clipPath: 'polygon(0% 0%, 50% 50%, 100% 0%, 100% 100%, 0% 100%)' // Simplificação visual ou usar CSS puro abaixo
          }}
        >
          {/* Aba do envelope (Visual CSS) */}
        </div>
        
        {/* Reconstrução Visual do Envelope com Divs para melhor controle que clip-path */}
        <div className={`absolute w-48 h-32 bg-[#f3e5d8] rounded-md shadow-lg flex items-center justify-center border border-[#eaddcf]
             ${isSunday ? 'hover:translate-y-[-2px] hover:shadow-xl' : ''}
        `}>
           {/* Triângulo da aba (CSS borders) */}
           <div className="absolute top-0 left-0 w-0 h-0 border-l-[96px] border-r-[96px] border-t-[60px] border-l-transparent border-r-transparent border-t-[#eaddcf]/80 z-10"></div>
           
           {/* Conteúdo Central */}
           <div className="z-20 flex flex-col items-center">
              {isSunday ? (
                <>
                  <Sparkles className="w-8 h-8 text-indigo-400 animate-pulse mb-1" />
                  <span className="font-hand text-indigo-900 font-bold bg-white/50 px-2 rounded">Carta da Semana</span>
                </>
              ) : (
                <>
                  <Lock className="w-8 h-8 text-pencil mb-1" />
                  <span className="font-hand text-pencil text-sm bg-white/50 px-2 rounded">Abre domingo</span>
                </>
              )}
           </div>
        </div>
      </div>

      {/* Modal da Carta */}
      {isOpen && (
        <div className="fixed inset-0 z-[70] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-500">
          <div className="relative w-full max-w-2xl bg-[#fdfbf7] shadow-2xl p-8 md:p-12 transform rotate-1">
            
            {/* Papel Texturizado */}
            <div className="absolute inset-0 opacity-10 pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/cream-paper.png')]"></div>
            
            {/* Botão Fechar */}
            <button 
              onClick={() => setIsOpen(false)}
              className="absolute top-4 right-4 text-pencil hover:text-ink transition-colors z-50"
            >
              <X className="w-8 h-8" />
            </button>

            {/* Conteúdo */}
            <div className="relative z-10 min-h-[300px] flex flex-col items-center justify-center">
              {isGenerating ? (
                <div className="flex flex-col items-center gap-4 text-ink/60">
                  <Loader2 className="w-10 h-10 animate-spin" />
                  <p className="font-hand text-xl animate-pulse">Escrevendo sua carta...</p>
                </div>
              ) : (
                <div className="prose prose-lg font-hand text-ink w-full text-justify leading-relaxed text-xl md:text-2xl">
                   {/* Linhas de dobra do papel */}
                   <div className="absolute top-1/3 left-0 right-0 h-px bg-black/5"></div>
                   <div className="absolute top-2/3 left-0 right-0 h-px bg-black/5"></div>

                   <div className="whitespace-pre-wrap">
                     {letterContent}
                   </div>

                   <div className="mt-8 flex justify-end">
                      <div className="flex flex-col items-center">
                        <span className="font-title text-sm text-pencil">Com carinho,</span>
                        <span className="font-title text-xl">Seu Diário</span>
                      </div>
                   </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
};