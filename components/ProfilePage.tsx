import React, { useState } from 'react';
import { UserProfile, Habit, MoodEntry } from '../types';
import { User, Save, Camera, ArrowLeft, Trash2, Award, Calendar, BookOpen, Flame } from 'lucide-react';
import { Tape } from './Tape';

interface ProfilePageProps {
  userProfile: UserProfile;
  onUpdateProfile: (p: UserProfile) => void;
  onBack: () => void;
  habits: Habit[];
  moodData: MoodEntry[];
}

export const ProfilePage: React.FC<ProfilePageProps> = ({
  userProfile,
  onUpdateProfile,
  onBack,
  habits,
  moodData
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState(userProfile);

  const handleSave = () => {
    onUpdateProfile(formData);
    setIsEditing(false);
  };

  const handleResetData = () => {
    if (confirm("ATENÇÃO: Isso apagará TODOS os seus hábitos e registros deste navegador. Tem certeza?")) {
      localStorage.clear();
      window.location.reload();
    }
  };

  // Cálculos Simples de Estatísticas
  const totalHabitsCompleted = habits.reduce((acc, h) => {
    return acc + Object.values(h.completed).filter(v => v > 0).length;
  }, 0);

  const happyDaysCount = moodData.filter(m => m.value === 3).length;

  return (
    <div className="w-full max-w-5xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-500">
      
      {/* Botão Voltar (Estilo Aba de Caderno) */}
      <button 
        onClick={onBack}
        className="mb-8 flex items-center gap-2 text-pencil hover:text-ink hover:-translate-x-1 transition-transform group"
      >
        <ArrowLeft className="w-6 h-6" />
        <span className="font-hand text-xl underline decoration-dashed decoration-pencil/30 group-hover:decoration-ink">Voltar para o Diário</span>
      </button>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12 items-start">
        
        {/* Lado Esquerdo: Identidade */}
        <div className="space-y-8">
          
          {/* Cartão de Identidade (Polaroid Style) */}
          <div className="bg-white p-6 shadow-lg transform -rotate-1 relative">
            <Tape className="top-[-15px] left-[35%] bg-yellow-200/80" />
            
            <div className="flex flex-col items-center">
              {/* Foto / Avatar */}
              <div className="w-48 h-48 bg-gray-100 border-4 border-white shadow-inner mb-6 flex items-center justify-center overflow-hidden relative group">
                {formData.avatarSeed ? (
                   <div className="w-full h-full bg-indigo-100 flex items-center justify-center text-4xl font-title text-indigo-300">
                     {formData.name.charAt(0).toUpperCase()}
                   </div>
                ) : (
                   <User className="w-20 h-20 text-gray-300" />
                )}
                <div className="absolute inset-0 border-2 border-black/5 pointer-events-none"></div>
                {/* Simulando 'trocar foto' (apenas visual por enquanto) */}
                <button className="absolute bottom-2 right-2 p-2 bg-white/80 rounded-full shadow opacity-0 group-hover:opacity-100 transition-opacity">
                    <Camera className="w-4 h-4 text-ink" />
                </button>
              </div>

              {/* Campos Editáveis */}
              <div className="w-full space-y-4 text-center">
                {isEditing ? (
                  <input 
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    className="w-full text-center font-title text-4xl text-ink border-b-2 border-dashed border-pencil/30 focus:border-ink outline-none bg-transparent"
                    placeholder="Seu Nome"
                  />
                ) : (
                  <h1 className="font-title text-4xl text-ink">{userProfile.name || "Viajante Anônimo"}</h1>
                )}

                {isEditing ? (
                  <input 
                    type="text"
                    value={formData.bio}
                    onChange={(e) => setFormData({...formData, bio: e.target.value})}
                    className="w-full text-center font-hand text-xl text-pencil border-b border-pencil/20 focus:border-pencil outline-none bg-transparent italic"
                    placeholder="Um lema ou frase curta..."
                  />
                ) : (
                  <p className="font-hand text-xl text-pencil italic">"{userProfile.bio || "Escrevendo minha própria história..."}"</p>
                )}
              </div>

              {/* Botões de Ação */}
              <div className="mt-8">
                {isEditing ? (
                  <button 
                    onClick={handleSave}
                    className="px-6 py-2 bg-ink text-paper font-hand text-lg rounded shadow-md flex items-center gap-2 hover:bg-black transition-colors"
                  >
                    <Save className="w-4 h-4" /> Salvar Perfil
                  </button>
                ) : (
                  <button 
                    onClick={() => setIsEditing(true)}
                    className="text-sm font-hand text-pencil underline hover:text-ink"
                  >
                    Editar Informações
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Lado Direito: Estatísticas & Configurações */}
        <div className="space-y-8">
            
            {/* Passaporte de Jornada */}
            <div className="bg-white p-8 shadow-md relative hand-drawn-border-bottom">
               {/* Carimbo Visual */}
               <div className="absolute top-4 right-4 w-24 h-24 border-4 border-red-800/20 rounded-full flex items-center justify-center transform -rotate-12 pointer-events-none">
                 <span className="font-title text-red-900/20 text-xl font-bold uppercase tracking-widest text-center">Journal<br/>Flow<br/>Official</span>
               </div>

               <h3 className="font-title text-3xl text-ink mb-6">Passaporte de Jornada</h3>
               
               <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div className="flex flex-col gap-1">
                     <span className="flex items-center gap-2 font-hand text-pencil text-sm uppercase tracking-wide">
                        <Calendar className="w-4 h-4" /> Membro desde
                     </span>
                     <span className="font-title text-2xl text-ink">
                        {new Date(userProfile.joinDate).toLocaleDateString('pt-BR', { month: 'short', year: 'numeric' })}
                     </span>
                  </div>

                  <div className="flex flex-col gap-1">
                     <span className="flex items-center gap-2 font-hand text-pencil text-sm uppercase tracking-wide">
                        <Flame className="w-4 h-4 text-orange-500" /> Recorde Ofensiva
                     </span>
                     <span className="font-title text-2xl text-ink">
                        {userProfile.bestStreak || 0} dias
                     </span>
                  </div>

                  <div className="flex flex-col gap-1">
                     <span className="flex items-center gap-2 font-hand text-pencil text-sm uppercase tracking-wide">
                        <BookOpen className="w-4 h-4" /> Hábitos Feitos
                     </span>
                     <span className="font-title text-2xl text-ink">
                        {totalHabitsCompleted}
                     </span>
                  </div>

                  <div className="flex flex-col gap-1">
                     <span className="flex items-center gap-2 font-hand text-pencil text-sm uppercase tracking-wide">
                        <Award className="w-4 h-4" /> Dias Felizes
                     </span>
                     <span className="font-title text-2xl text-ink">
                        {happyDaysCount}
                     </span>
                  </div>
               </div>
               
               <div className="mt-8 pt-6 border-t border-pencil/20">
                 <p className="font-hand text-ink text-lg leading-relaxed">
                   "A constância é a chave para a transformação. Cada página virada é um novo começo."
                 </p>
               </div>
            </div>

            {/* Zona de Perigo / Configurações */}
            <div className="border-2 border-dashed border-red-200 p-6 rounded bg-red-50/30">
              <h4 className="font-title text-xl text-red-800/70 mb-2">Zona de Risco</h4>
              <p className="font-hand text-pencil text-sm mb-4">
                Deseja recomeçar do zero? Isso apagará todos os seus adesivos, recordes e memórias.
              </p>
              <button 
                onClick={handleResetData}
                className="px-4 py-2 border border-red-300 text-red-700 font-hand rounded hover:bg-red-100 flex items-center gap-2 transition-colors text-sm"
              >
                <Trash2 className="w-4 h-4" />
                Queimar Diário (Resetar Tudo)
              </button>
            </div>

        </div>
      </div>
    </div>
  );
};