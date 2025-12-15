import React, { useState } from 'react';
import { X, Wand2, Loader2 } from 'lucide-react';
import { Habit, MoodEntry, CheckInRecord } from '../types';
import { generateGhostScribeEntry } from '../services/ai';

interface JournalModalProps {
  isOpen: boolean;
  onClose: () => void;
  day: number;
  content: string;
  onSave: (text: string) => void;
  monthName: string;
  // New props for AI context
  habits: Habit[];
  moodData: MoodEntry[];
  checkIns: CheckInRecord;
}

export const JournalModal: React.FC<JournalModalProps> = ({ 
  isOpen, 
  onClose, 
  day, 
  content, 
  onSave,
  monthName,
  habits,
  moodData,
  checkIns
}) => {
  const [isGenerating, setIsGenerating] = useState(false);

  if (!isOpen) return null;

  const handleGhostWrite = async () => {
    setIsGenerating(true);
    const text = await generateGhostScribeEntry(day, monthName, habits, moodData, checkIns);
    // Append or replace? Let's append if there is content, or just set if empty.
    const newContent = content ? `${content}\n\n${text}` : text;
    onSave(newContent);
    setIsGenerating(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-ink/20 backdrop-blur-sm animate-in fade-in duration-200">
      <div 
        className="relative w-full max-w-lg bg-[#fcfbf9] shadow-2xl transform rotate-1 transition-all"
        style={{
          boxShadow: '10px 10px 20px rgba(0,0,0,0.15)',
          borderRadius: '2px'
        }}
      >
        {/* Header Tape */}
        <div className="absolute -top-4 left-1/2 -translate-x-1/2 w-32 h-8 bg-blue-200/80 shadow-sm rotate-1 z-10"
             style={{
               clipPath: 'polygon(2% 0%, 98% 0%, 100% 100%, 0% 100%)',
               maskImage: 'url("data:image/svg+xml;base64,PHN2ZyB2aWV3Qm94PSIwIDAgMTAwIDEwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cGF0aCBkPSJNMCAwIGwxMDAgMHYxMDBIMHoiIGZpbGw9ImJsYWNrIi8+PC9zdmc+")'
             }}
        />

        {/* Close Button */}
        <button 
          onClick={onClose}
          className="absolute top-2 right-2 text-pencil hover:text-ink hover:rotate-90 transition-all z-20"
        >
          <X className="w-6 h-6" />
        </button>

        {/* Paper Content */}
        <div className="p-8 pb-10 min-h-[400px] flex flex-col relative overflow-hidden">
            {/* Margem Vermelha Esquerda */}
            <div className="absolute top-0 bottom-0 left-12 w-[1px] bg-red-300/50 z-0 pointer-events-none"></div>

            <div className="flex justify-between items-end mb-6 ml-6 z-10">
              <h2 className="font-title text-3xl text-ink leading-none">
                Dia {day}
                <span className="block text-base text-pencil font-hand">{monthName}</span>
              </h2>
              
              {/* Ghost Scribe Button */}
              <button
                onClick={handleGhostWrite}
                disabled={isGenerating}
                className="flex items-center gap-2 px-3 py-1 text-sm font-hand text-purple-600 bg-purple-50 hover:bg-purple-100 border border-purple-200 rounded-full transition-colors disabled:opacity-50"
                title="Escriba Fantasma (Auto-preencher)"
              >
                {isGenerating ? <Loader2 className="w-4 h-4 animate-spin" /> : <Wand2 className="w-4 h-4" />}
                <span className="hidden sm:inline">Auto-escrever</span>
              </button>
            </div>

            {/* Area de Texto com Linhas */}
            <div className="flex-1 relative z-10">
              <textarea
                autoFocus
                value={content}
                onChange={(e) => onSave(e.target.value)}
                placeholder="Como foi o dia hoje? Escreva aqui..."
                className="w-full h-full bg-transparent border-none outline-none font-hand text-xl text-ink resize-none leading-[2.5rem]"
                style={{
                  backgroundImage: 'repeating-linear-gradient(transparent, transparent 2.4rem, #a29bfe40 2.4rem, #a29bfe40 2.5rem)',
                  backgroundAttachment: 'local',
                  lineHeight: '2.5rem',
                  paddingTop: '0.2rem'
                }}
              />
            </div>
        </div>
      </div>
    </div>
  );
};