import React, { useState, useEffect, useMemo } from 'react';
import { DEFAULT_HABITS, INITIAL_MOOD_DATA, Habit, MoodEntry, HIGHLIGHTER_COLORS, LegacyHabit, JournalEntries, CheckInRecord, MONTH_DAYS, BrainDumpItem, StickyNoteData, UserProfile, GratitudeItem } from './types';
import { HabitGrid } from './components/HabitGrid';
import { MetricsCarousel } from './components/MetricsCarousel';
import { BrainDump } from './components/BrainDump';
import { InsightSticky } from './components/InsightSticky';
import { StickyNote } from './components/StickyNote';
import { Tape } from './components/Tape';
import { JournalModal } from './components/JournalModal';
import { CheckInModal } from './components/CheckInModal';
import { ConfirmationModal } from './components/ConfirmationModal';
import { WeeklyLetter } from './components/WeeklyLetter';
import { ProfilePage } from './components/ProfilePage';
import { GratitudeBox } from './components/GratitudeBox';
import { TomorrowFocus } from './components/TomorrowFocus';
import { Pen, Smile, Meh, Frown, ClipboardList, User, Flame } from 'lucide-react';
import { analyzePatternsWithAI } from './services/ai';

const App: React.FC = () => {
  
  // --- Estados & Inicialização ---
  
  // View State: 'dashboard' | 'profile'
  const [currentView, setCurrentView] = useState<'dashboard' | 'profile'>('dashboard');

  const [habits, setHabits] = useState<Habit[]>(() => {
    const saved = localStorage.getItem('journal_habits');
    if (!saved) return DEFAULT_HABITS;
    try {
      const parsed = JSON.parse(saved);
      if (parsed.length > 0 && Array.isArray(parsed[0].completedDays)) {
        return parsed.map((h: LegacyHabit) => ({
          id: h.id,
          title: h.title,
          color: h.color,
          completed: h.completedDays.reduce((acc: Record<number, number>, day: number) => {
            acc[day] = 1;
            return acc;
          }, {})
        }));
      }
      return parsed;
    } catch (e) {
      return DEFAULT_HABITS;
    }
  });

  const [moodData, setMoodData] = useState<MoodEntry[]>(() => {
    const saved = localStorage.getItem('journal_mood');
    return saved ? JSON.parse(saved) : INITIAL_MOOD_DATA;
  });

  const [journalEntries, setJournalEntries] = useState<JournalEntries>(() => {
    const saved = localStorage.getItem('journal_entries');
    return saved ? JSON.parse(saved) : {};
  });

  const [checkIns, setCheckIns] = useState<CheckInRecord>(() => {
    const saved = localStorage.getItem('journal_checkins');
    return saved ? JSON.parse(saved) : {};
  });

  const [brainDumpItems, setBrainDumpItems] = useState<BrainDumpItem[]>(() => {
    const saved = localStorage.getItem('journal_braindump');
    return saved ? JSON.parse(saved) : [];
  });

  const [gratitudeItems, setGratitudeItems] = useState<GratitudeItem[]>(() => {
    const saved = localStorage.getItem('journal_gratitude');
    return saved ? JSON.parse(saved) : [];
  });

  const [tomorrowFocus, setTomorrowFocus] = useState<string>(() => {
    return localStorage.getItem('journal_focus') || '';
  });

  // Estado dos Sticky Notes Manuais
  const [stickyNotes, setStickyNotes] = useState<StickyNoteData[]>(() => {
    const saved = localStorage.getItem('journal_stickies');
    return saved ? JSON.parse(saved) : [];
  });

  // Estado do Perfil de Usuário
  const [userProfile, setUserProfile] = useState<UserProfile>(() => {
    const saved = localStorage.getItem('journal_user_profile');
    const parsed = saved ? JSON.parse(saved) : {};
    
    // Default / Migration logic
    return {
      name: parsed.name || 'Viajante',
      bio: parsed.bio || 'Pequenos passos todos os dias...',
      joinDate: parsed.joinDate || new Date().toISOString(),
      avatarSeed: parsed.avatarSeed || '1',
      bestStreak: parsed.bestStreak || 0
    };
  });

  // Estado de visibilidade do Insight AI (para permitir fechar)
  const [showInsight, setShowInsight] = useState(true);

  // Modais e Interações
  const [selectedDayForJournal, setSelectedDayForJournal] = useState<number | null>(null);
  const [isCheckInOpen, setIsCheckInOpen] = useState(false);
  const [habitToDelete, setHabitToDelete] = useState<string | null>(null);

  const today = new Date();
  const currentDay = today.getDate();
  const monthName = today.toLocaleString('pt-BR', { month: 'long' });
  const formattedMonth = monthName.charAt(0).toUpperCase() + monthName.slice(1);

  // --- Lógica de Ofensiva (Streak) ---
  const currentStreak = useMemo(() => {
    if (habits.length === 0) return 0;
    
    let streak = 0;
    // Iteramos do dia atual para trás
    for (let d = currentDay; d >= 1; d--) {
      // Verifica se TODOS os hábitos foram completados (valor 1) neste dia 'd'
      const allDone = habits.every(h => (h.completed[d] || 0) === 1);
      
      if (allDone) {
        streak++;
      } else {
        // Se não completou hoje, tudo bem, a ofensiva não quebra (ainda), 
        // apenas não incrementa. Continuamos checando ontem.
        // Se falhou em um dia anterior a hoje, a ofensiva quebrou lá.
        if (d !== currentDay) {
          break;
        }
      }
    }
    return streak;
  }, [habits, currentDay]);

  // Atualiza o recorde (bestStreak) se a ofensiva atual for maior
  useEffect(() => {
    if (currentStreak > userProfile.bestStreak) {
      setUserProfile(prev => ({ ...prev, bestStreak: currentStreak }));
    }
  }, [currentStreak, userProfile.bestStreak]);

  // --- Efeitos de Persistência ---
  useEffect(() => { localStorage.setItem('journal_habits', JSON.stringify(habits)); }, [habits]);
  useEffect(() => { localStorage.setItem('journal_mood', JSON.stringify(moodData)); }, [moodData]);
  useEffect(() => { localStorage.setItem('journal_entries', JSON.stringify(journalEntries)); }, [journalEntries]);
  useEffect(() => { localStorage.setItem('journal_checkins', JSON.stringify(checkIns)); }, [checkIns]);
  useEffect(() => { localStorage.setItem('journal_braindump', JSON.stringify(brainDumpItems)); }, [brainDumpItems]);
  useEffect(() => { localStorage.setItem('journal_gratitude', JSON.stringify(gratitudeItems)); }, [gratitudeItems]);
  useEffect(() => { localStorage.setItem('journal_focus', tomorrowFocus); }, [tomorrowFocus]);
  useEffect(() => { localStorage.setItem('journal_stickies', JSON.stringify(stickyNotes)); }, [stickyNotes]);
  useEffect(() => { localStorage.setItem('journal_user_profile', JSON.stringify(userProfile)); }, [userProfile]);

  // --- Lógica de Hábitos ---
  const toggleHabitDay = (habitId: string, day: number) => {
    setHabits((prev) =>
      prev.map((habit) => {
        if (habit.id !== habitId) return habit;
        const currentValue = habit.completed[day] || 0;
        let nextValue = 0;
        if (currentValue === 0) nextValue = 0.5;
        else if (currentValue === 0.5) nextValue = 1;
        else nextValue = 0;

        const newCompleted = { ...habit.completed };
        if (nextValue === 0) delete newCompleted[day];
        else newCompleted[day] = nextValue;

        return { ...habit, completed: newCompleted };
      })
    );
  };

  const addHabit = (title: string) => {
    const newHabit: Habit = {
      id: Date.now().toString(),
      title,
      color: HIGHLIGHTER_COLORS[Math.floor(Math.random() * HIGHLIGHTER_COLORS.length)],
      completed: {},
    };
    setHabits([...habits, newHabit]);
  };

  const requestDeleteHabit = (id: string) => {
    setHabitToDelete(id);
  };

  const confirmDeleteHabit = () => {
    if (habitToDelete) {
      setHabits(habits.filter(h => h.id !== habitToDelete));
      setHabitToDelete(null);
    }
  };

  // --- Lógica de Gratidão ---
  const addGratitude = (text: string) => {
    const newItem: GratitudeItem = {
      id: Date.now().toString(),
      text,
      date: new Date().toISOString()
    };
    // Adiciona no topo
    setGratitudeItems(prev => [newItem, ...prev]);
  };

  const deleteGratitude = (id: string) => {
    setGratitudeItems(prev => prev.filter(item => item.id !== id));
  };

  // --- Lógica de Stickies ---
  const addStickyNote = (color: string) => {
    const newNote: StickyNoteData = {
      id: Date.now().toString(),
      text: '',
      color,
      rotation: Math.random() * 4 - 2 // Rotação aleatória entre -2 e 2
    };
    setStickyNotes(prev => [...prev, newNote]);
  };

  const updateStickyNote = (id: string, text: string) => {
    setStickyNotes(prev => prev.map(note => note.id === id ? { ...note, text } : note));
  };

  const deleteStickyNote = (id: string) => {
    setStickyNotes(prev => prev.filter(note => note.id !== id));
  };

  // Função para gerar texto via IA para um post-it específico
  const handleGenerateAINote = async (): Promise<string> => {
    return await analyzePatternsWithAI(habits, moodData, checkIns);
  };

  // --- Lógica de Brain Dump ---
  const addBrainDumpItem = (text: string) => {
    const newItem: BrainDumpItem = { id: Date.now().toString(), text, isDone: false };
    setBrainDumpItems(prev => [newItem, ...prev]);
  };

  const toggleBrainDumpItem = (id: string) => {
    setBrainDumpItems(prev => prev.map(item => 
      item.id === id ? { ...item, isDone: !item.isDone } : item
    ));
  };

  const deleteBrainDumpItem = (id: string) => {
    setBrainDumpItems(prev => prev.filter(item => item.id !== id));
  };

  // --- Lógica de Humor ---
  const toggleMoodForDay = (day: number) => {
    setMoodData(prev => prev.map(entry => {
      if (entry.day !== day) return entry;
      let nextValue: number | null = null;
      if (entry.value === null) nextValue = 3;
      else if (entry.value === 3) nextValue = 2;
      else if (entry.value === 2) nextValue = 1;
      else if (entry.value === 1) nextValue = null;
      return { ...entry, value: nextValue };
    }));
  };

  const setTodayMoodManual = (value: number) => {
    setMoodData(prev => prev.map(entry => {
      if (entry.day !== currentDay) return entry;
      return { ...entry, value };
    }));
  };

  const saveCheckIn = (data: Record<string, number>) => {
    setCheckIns(prev => ({ ...prev, [currentDay]: data }));
    
    // Atualiza o humor automaticamente baseado na média das respostas
    const values = Object.values(data);
    if (values.length > 0) {
      const sum = values.reduce((a, b) => a + b, 0);
      const average = sum / values.length;
      let moodValue = 2;
      if (average < 1.66) moodValue = 1;
      else if (average > 2.33) moodValue = 3;
      setTodayMoodManual(moodValue);
    }
  };

  const handleDayClick = (day: number) => {
    setSelectedDayForJournal(day);
  };

  const saveJournalEntry = (text: string) => {
    if (selectedDayForJournal !== null) {
      setJournalEntries(prev => ({ ...prev, [selectedDayForJournal]: text }));
    }
  };

  // --- CÁLCULO DE MÉTRICAS DERIVADAS ---
  const sleepData = useMemo(() => {
    return MONTH_DAYS.map(day => {
      const dayData = checkIns[day];
      return {
        day,
        value: dayData?.sleep || null 
      };
    });
  }, [checkIns]);

  const productivityData = useMemo(() => {
    return MONTH_DAYS.map(day => {
      const totalHabits = habits.length;
      let habitScore = 0;
      if (totalHabits > 0) {
        const completedSum = habits.reduce((acc, habit) => acc + (habit.completed[day] || 0), 0);
        habitScore = (completedSum / totalHabits) * 100;
      }

      const focusLevel = checkIns[day]?.focus; 
      let focusScore = 0;
      let hasFocusData = false;
      
      if (focusLevel) {
        hasFocusData = true;
        if (focusLevel === 3) focusScore = 100;
        else if (focusLevel === 2) focusScore = 50;
        else focusScore = 20;
      }

      let finalScore = habitScore;
      if (hasFocusData && totalHabits > 0) {
        finalScore = (habitScore + focusScore) / 2;
      } else if (hasFocusData && totalHabits === 0) {
        finalScore = focusScore;
      }

      return {
        day,
        value: Math.round(finalScore)
      };
    });
  }, [habits, checkIns]);

  const todayMoodValue = moodData.find(m => m.day === currentDay)?.value;

  return (
    <div className="min-h-screen dot-grid font-hand text-ink p-4 md:p-8 flex justify-center items-start">
      
      <JournalModal 
        isOpen={selectedDayForJournal !== null}
        onClose={() => setSelectedDayForJournal(null)}
        day={selectedDayForJournal || 0}
        monthName={formattedMonth}
        content={selectedDayForJournal ? (journalEntries[selectedDayForJournal] || '') : ''}
        onSave={saveJournalEntry}
        habits={habits}
        moodData={moodData}
        checkIns={checkIns}
      />

      <CheckInModal 
        isOpen={isCheckInOpen}
        onClose={() => setIsCheckInOpen(false)}
        day={currentDay}
        existingData={checkIns[currentDay]}
        onSave={saveCheckIn}
      />

      <ConfirmationModal
        isOpen={habitToDelete !== null}
        onClose={() => setHabitToDelete(null)}
        onConfirm={confirmDeleteHabit}
        title="Apagar Hábito?"
        message="Tem certeza que deseja remover este hábito da sua lista?"
      />

      <div className="relative max-w-7xl w-full bg-paper min-h-[90vh] shadow-[5px_5px_15px_rgba(0,0,0,0.1)] p-6 md:p-12 hand-drawn-box transition-all">
        
        <Tape className="top-[-15px] left-[30%] bg-blue-200/80" rotation="rotate-1" />
        <Tape className="top-[-10px] right-[20%] bg-amber-200/80" rotation="-rotate-3" />

        {/* Header Section */}
        <header className="flex flex-col md:flex-row justify-between items-end mb-12 border-b-2 border-pencil/20 pb-4">
          <div>
            <h1 className="font-title text-5xl md:text-6xl text-ink mb-2">
              {formattedMonth} <span className="text-pencil text-5xl md:text-6xl ml-2">{currentDay}</span>
            </h1>
            <p className="text-xl text-pencil italic ml-2">"{userProfile.bio}"</p>
          </div>
          
          <div className="flex flex-col items-end gap-2 mt-6 md:mt-0">
             
             {/* Navegação Topo & Ofensiva */}
             <div className="flex items-center gap-4 mb-2">
                
                {/* Ícone de Ofensiva (Streak) */}
                <div 
                   className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full border transition-all ${
                     currentStreak > 0 
                       ? 'bg-orange-50 border-orange-200 text-orange-600' 
                       : 'bg-black/5 border-transparent text-pencil/50'
                   }`}
                   title="Ofensiva de Hábitos (Dias consecutivos com TUDO completado)"
                >
                   <Flame 
                     className={`w-5 h-5 ${currentStreak > 0 ? 'fill-orange-500 animate-pulse drop-shadow-sm' : ''}`} 
                   />
                   <span className="font-title text-xl font-bold pt-1 leading-none">{currentStreak}</span>
                </div>

                <button
                   onClick={() => setCurrentView('profile')}
                   className={`flex items-center gap-2 px-3 py-1 rounded-full transition-all ${currentView === 'profile' ? 'bg-ink text-paper' : 'text-ink hover:bg-black/5'}`}
                   title="Meu Perfil"
                >
                   <User className="w-5 h-5" />
                   <span className="font-hand font-bold">{userProfile.name}</span>
                </button>
             </div>

             {/* Controles de Humor & Checkin (Apenas Visíveis no Dashboard) */}
             {currentView === 'dashboard' && (
                <>
                   <span className="font-hand text-2xl text-ink self-center md:self-end">Como foi o dia {currentDay}?</span>
                   
                   <div className="flex items-center gap-6 bg-black/5 p-2 rounded-lg hand-drawn-border-bottom animate-in fade-in duration-300">
                     <div className="flex gap-4">
                       <button 
                        onClick={() => setTodayMoodManual(3)}
                        className={`group flex flex-col items-center gap-1 transition-transform hover:-translate-y-1 active:scale-95 ${todayMoodValue === 3 ? 'scale-110 font-bold' : 'opacity-70 hover:opacity-100'}`}
                      >
                        <div className={`w-8 h-8 rounded-full border-2 border-ink flex items-center justify-center shadow-sm ${todayMoodValue === 3 ? 'bg-[#dbfbc4]' : 'bg-[#dbfbc4]/50'}`}>
                          <Smile className="w-5 h-5 text-ink/80" />
                        </div>
                      </button>
                      <button 
                        onClick={() => setTodayMoodManual(2)}
                        className={`group flex flex-col items-center gap-1 transition-transform hover:-translate-y-1 active:scale-95 ${todayMoodValue === 2 ? 'scale-110 font-bold' : 'opacity-70 hover:opacity-100'}`}
                      >
                        <div className={`w-8 h-8 rounded-full border-2 border-ink flex items-center justify-center shadow-sm ${todayMoodValue === 2 ? 'bg-[#74b9ff]' : 'bg-[#74b9ff]/50'}`}>
                          <Meh className="w-5 h-5 text-ink/80" />
                        </div>
                      </button>
                      <button 
                        onClick={() => setTodayMoodManual(1)}
                        className={`group flex flex-col items-center gap-1 transition-transform hover:-translate-y-1 active:scale-95 ${todayMoodValue === 1 ? 'scale-110 font-bold' : 'opacity-70 hover:opacity-100'}`}
                      >
                        <div className={`w-8 h-8 rounded-full border-2 border-ink flex items-center justify-center shadow-sm ${todayMoodValue === 1 ? 'bg-[#fab1a0]' : 'bg-[#fab1a0]/50'}`}>
                          <Frown className="w-5 h-5 text-ink/80" />
                        </div>
                      </button>
                     </div>
                     <div className="h-8 w-[1px] bg-pencil/30 mx-1"></div>
                     <button 
                       onClick={() => setIsCheckInOpen(true)}
                       className="flex items-center gap-2 text-ink hover:text-blue-600 transition-colors group"
                       title="Avaliação detalhada do dia"
                     >
                       <ClipboardList className="w-6 h-6 group-hover:scale-110 transition-transform" />
                       <span className="text-sm font-hand hidden md:inline">Ficha</span>
                     </button>
                   </div>
                </>
             )}
          </div>
        </header>

        {/* --- MAIN CONTENT SWITCHER --- */}
        {currentView === 'profile' ? (
           <ProfilePage 
             userProfile={userProfile}
             onUpdateProfile={setUserProfile}
             onBack={() => setCurrentView('dashboard')}
             habits={habits}
             moodData={moodData}
           />
        ) : (
          <main className="space-y-12 animate-in fade-in duration-500">
            
            <section className="relative flex flex-col lg:flex-row items-start gap-8">
              {/* Grade de Hábitos (Lado Esquerdo) */}
              <div className="flex-1 w-full lg:w-auto">
                  <HabitGrid 
                    habits={habits} 
                    onToggleDay={toggleHabitDay} 
                    onAddHabit={addHabit}
                    onDeleteHabit={requestDeleteHabit} 
                    onDayClick={handleDayClick}
                    currentDay={currentDay}
                  />
              </div>

              {/* Parede de Post-its & Carta Semanal (Direita) */}
              <div className="w-full lg:w-64 shrink-0 flex flex-col gap-6 pt-10 lg:pt-0">
                 
                 {/* Controles para Adicionar Sticky */}
                 <div className="flex items-center gap-2 mb-2 p-2 bg-black/5 rounded-full self-start lg:self-center">
                    <span className="text-xs font-hand text-pencil uppercase tracking-widest pl-2">Novo Bilhete:</span>
                    <button onClick={() => addStickyNote('yellow')} className="w-6 h-6 rounded-full bg-[#fef9c3] border border-black/10 hover:scale-110 transition-transform"></button>
                    <button onClick={() => addStickyNote('pink')} className="w-6 h-6 rounded-full bg-[#ffdde1] border border-black/10 hover:scale-110 transition-transform"></button>
                    <button onClick={() => addStickyNote('blue')} className="w-6 h-6 rounded-full bg-[#dff9fb] border border-black/10 hover:scale-110 transition-transform"></button>
                    <button onClick={() => addStickyNote('green')} className="w-6 h-6 rounded-full bg-[#dbfbc4] border border-black/10 hover:scale-110 transition-transform"></button>
                 </div>
                 
                 {/* --- CARTA SEMANAL --- */}
                 <WeeklyLetter 
                   habits={habits}
                   moodData={moodData}
                   checkIns={checkIns}
                   journalEntries={journalEntries}
                 />
                 
                 {/* Insight Sticky (IA) */}
                 <InsightSticky 
                    habits={habits}
                    moodData={moodData}
                    checkIns={checkIns}
                    isVisible={showInsight}
                    onClose={() => setShowInsight(false)}
                 />

                 {/* User Sticky Notes */}
                 {stickyNotes.map(note => (
                   <StickyNote
                      key={note.id}
                      id={note.id}
                      text={note.text}
                      color={note.color}
                      rotation={note.rotation}
                      onDelete={deleteStickyNote}
                      onChange={updateStickyNote}
                      onGenerateAI={handleGenerateAINote}
                   />
                 ))}
                 
                 {stickyNotes.length === 0 && !showInsight && (
                    <div className="text-center p-8 border-2 border-dashed border-pencil/20 rounded-lg text-pencil/40 font-hand text-lg">
                      Espaço livre para colar suas anotações...
                    </div>
                 )}
              </div>
            </section>

            {/* Seção 2: Métricas (Carrossel) */}
            <section className="relative pt-8 border-t-2 border-dashed border-pencil/30">
              <div className="w-full">
                <MetricsCarousel 
                  moodData={moodData}
                  sleepData={sleepData}
                  productivityData={productivityData}
                  checkIns={checkIns} 
                  onToggleMood={toggleMoodForDay}
                />
              </div>
            </section>

            {/* Seção 3: Ferramentas Mentais (Gratidão, Foco, Brain Dump) */}
            <section className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
              
              {/* Coluna Esquerda: Gratidão & Foco */}
              <div className="flex flex-col gap-8">
                 <GratitudeBox 
                    items={gratitudeItems}
                    onAdd={addGratitude}
                    onDelete={deleteGratitude}
                 />
                 
                 <TomorrowFocus 
                    focusText={tomorrowFocus}
                    setFocusText={setTomorrowFocus}
                 />
              </div>

              {/* Coluna Direita: Brain Dump */}
              <div className="h-full">
                 <BrainDump 
                  items={brainDumpItems}
                  onAddItem={addBrainDumpItem}
                  onToggleItem={toggleBrainDumpItem}
                  onDeleteItem={deleteBrainDumpItem}
                />
              </div>
            </section>
          </main>
        )}

      </div>

      {/* Floating Action Button - Only show on Dashboard */}
      {currentView === 'dashboard' && (
        <button 
          onClick={() => document.querySelector('input')?.focus()}
          className="fixed bottom-8 right-8 bg-ink text-paper w-16 h-16 rounded-full shadow-[4px_4px_0px_rgba(0,0,0,0.3)] hover:translate-y-[2px] hover:shadow-[2px_2px_0px_rgba(0,0,0,0.3)] transition-all flex items-center justify-center z-50 border-2 border-ink"
          title="Adicionar Hábito"
        >
          <Pen className="w-8 h-8" />
        </button>
      )}

    </div>
  );
};

export default App;