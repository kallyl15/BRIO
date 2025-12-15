import React, { useState } from 'react';
import { Habit, MONTH_DAYS } from '../types';
import { Trash2, Plus } from 'lucide-react';

interface HabitGridProps {
  habits: Habit[];
  onToggleDay: (habitId: string, day: number) => void;
  onAddHabit: (title: string) => void;
  onDeleteHabit: (id: string) => void;
  onDayClick: (day: number) => void; // Novo prop para abrir modal
  currentDay: number;
}

export const HabitGrid: React.FC<HabitGridProps> = ({ 
  habits, 
  onToggleDay, 
  onAddHabit, 
  onDeleteHabit, 
  onDayClick,
  currentDay 
}) => {
  const [newHabitTitle, setNewHabitTitle] = useState('');

  // Lógica alterada: Mostra apenas dias do passado até hoje (incluso) e inverte a ordem (Hoje primeiro)
  const visibleDays = MONTH_DAYS.filter(day => day <= currentDay).reverse();

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newHabitTitle.trim()) {
      onAddHabit(newHabitTitle.trim());
      setNewHabitTitle('');
    }
  };

  return (
    <div className="w-full overflow-x-auto pb-6">
      {/* Container ajustado para largura flexível, liberando espaço à direita */}
      <div className="min-w-fit p-1 inline-block">
        <table className="w-auto border-collapse">
          <thead>
            <tr>
              <th className="text-left p-4 font-title text-2xl text-ink w-64 border-b-2 border-ink/80 rotate-[-1deg] whitespace-nowrap">
                Hábitos
              </th>
              {visibleDays.map((day) => {
                const isToday = day === currentDay;
                return (
                  <th 
                    key={day} 
                    onClick={() => onDayClick(day)} // Abre o Modal
                    className={`
                      p-1 font-hand text-lg text-center w-8 align-bottom cursor-pointer group
                      ${isToday ? 'bg-black/10 font-bold text-ink rounded-t-md' : 'text-pencil hover:text-ink'}
                    `}
                    title={isToday ? "Hoje" : `Dia ${day}`}
                  >
                    <div className={`
                      inline-block transition-transform duration-200
                      ${isToday ? 'scale-125' : 'group-hover:scale-125 group-hover:-translate-y-1'}
                    `}>
                      {day}
                    </div>
                  </th>
                );
              })}
            </tr>
          </thead>
          <tbody>
            {habits.map((habit, index) => (
              <tr key={habit.id} className="group">
                {/* Habit Name Row */}
                <td className="p-3 font-hand text-xl text-ink border-r-2 border-ink/10 relative group-hover:bg-black/[0.02] transition-colors whitespace-nowrap">
                  <div className="flex items-center justify-between pr-2 gap-2">
                    <div className={`transition-transform duration-300 ${index % 2 === 0 ? '-rotate-1' : 'rotate-1'}`}>
                      {habit.title}
                    </div>
                    {/* Delete Button (Visible on Hover) */}
                    <button 
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        onDeleteHabit(habit.id);
                      }}
                      className="opacity-0 group-hover:opacity-100 p-2 z-10 text-red-400 hover:text-red-600 transition-all transform hover:scale-110 focus:opacity-100 cursor-pointer"
                      title="Excluir hábito"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                  {/* Decorative underline for each row header */}
                  <div className="absolute bottom-0 left-0 w-3/4 h-[1px] bg-pencil/20 ml-2 rounded-full" />
                </td>

                {/* Days Grid */}
                {visibleDays.map((day) => {
                  const completionValue = habit.completed[day] || 0; // 0, 0.5, or 1
                  const isToday = day === currentDay;
                  
                  return (
                    <td 
                      key={`${habit.id}-${day}`} 
                      className={`
                        p-[2px] relative text-center align-middle cursor-pointer transition-colors
                        ${isToday ? 'bg-black/10' : 'hover:bg-black/5'}
                      `}
                      onClick={() => onToggleDay(habit.id, day)}
                    >
                      {/* The Highlighter Mark */}
                      <div 
                        className={`
                          w-6 h-6 mx-auto rounded-sm flex items-center justify-center transition-all duration-300
                          ${completionValue > 0 ? 'scale-100 opacity-90' : 'scale-75 opacity-0'}
                        `}
                        style={{
                          background: completionValue === 1 
                            ? habit.color // Full color
                            : `linear-gradient(135deg, ${habit.color} 50%, transparent 50%)`, // Diagonal half fill
                          
                          // Hand-drawn uneven shape using clip-path or border-radius
                          borderRadius: '3px 5px 4px 6px',
                          transform: completionValue > 0 ? `rotate(${Math.random() * 6 - 3}deg)` : 'none',
                        }}
                      >
                      </div>
                    </td>
                  );
                })}
              </tr>
            ))}
            
            {/* Add New Habit Row */}
            <tr>
              <td className="p-3 font-hand text-xl text-ink border-r-2 border-ink/10 relative">
                <form onSubmit={handleAddSubmit} className="flex items-center gap-2">
                  <Plus className="w-4 h-4 text-pencil" />
                  <input 
                    type="text" 
                    value={newHabitTitle}
                    onChange={(e) => setNewHabitTitle(e.target.value)}
                    placeholder="Novo hábito..." 
                    className="bg-transparent border-b border-pencil/30 focus:border-pencil outline-none w-full placeholder-pencil/50 text-ink"
                  />
                </form>
              </td>
              {visibleDays.map((day) => (
                <td 
                  key={`empty-${day}`} 
                  className={`${day === currentDay ? 'bg-black/10' : ''}`}
                ></td>
              ))}
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};