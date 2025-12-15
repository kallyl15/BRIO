import React, { useState, useEffect } from 'react';
import { Lightbulb, Sparkles, Loader2 } from 'lucide-react';
import { Habit, MoodEntry, CheckInRecord } from '../types';
import { analyzePatternsWithAI } from '../services/ai';
import { StickyNote } from './StickyNote';

interface InsightStickyProps {
  habits: Habit[];
  moodData: MoodEntry[];
  checkIns: CheckInRecord;
  isVisible: boolean;
  onClose: () => void;
}

export const InsightSticky: React.FC<InsightStickyProps> = ({ habits, moodData, checkIns, isVisible, onClose }) => {
  const [insight, setInsight] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  // Algoritmo local básico (Fallback)
  const generateLocalInsight = () => {
    // 1. Analisa Humor vs Hábitos
    const happyDays = moodData.filter(m => m.value === 3).map(m => m.day);
    if (happyDays.length >= 3) {
        let bestHabit = '';
        let maxCount = 0;
        habits.forEach(habit => {
        let count = 0;
        happyDays.forEach(day => {
            if (habit.completed[day] === 1) count++;
        });
        if (count > happyDays.length * 0.7 && count > maxCount) {
            maxCount = count;
            bestHabit = habit.title;
        }
        });
        if (bestHabit) return `Notei que nos dias que você completa "${bestHabit}", seu humor tende a ser radiante!`;
    }
    
    // 2. Analisa Sono
    const goodSleepDays = Object.values(checkIns).filter(c => c.sleep === 3).length;
    if (goodSleepDays > 5) return "Você tem cuidado muito bem do seu sono ultimamente!";

    return "Continue registrando seus dias para eu descobrir padrões no seu comportamento!";
  };

  useEffect(() => {
    setInsight(generateLocalInsight());
  }, [habits, moodData, checkIns]);

  const handleAiAnalysis = async () => {
    setLoading(true);
    const aiInsight = await analyzePatternsWithAI(habits, moodData, checkIns);
    setInsight(aiInsight);
    setLoading(false);
  };

  if (!isVisible || !insight) return null;

  return (
    <div className="relative animate-in fade-in slide-in-from-right duration-700">
      <StickyNote
        text={insight}
        color="yellow"
        rotation={2}
        onDelete={onClose}
        readOnly={true}
        headerTitle="Insight"
        headerIcon={
           <button 
             onClick={handleAiAnalysis}
             disabled={loading}
             className="p-1 hover:bg-amber-200 rounded-full transition-colors"
             title="Buscar Padrões com IA"
           >
             {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Lightbulb className="w-5 h-5 text-amber-600" />}
           </button>
        }
      />
    </div>
  );
};