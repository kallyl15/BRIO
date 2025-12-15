import React, { useState, useMemo } from 'react';
import { ResponsiveContainer, LineChart, Line, BarChart, Bar, AreaChart, Area, RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';
import { MoodEntry, CheckInRecord, CHECKIN_CATEGORIES } from '../types';
import { ChevronLeft, ChevronRight, Moon, Zap, Smile, Activity } from 'lucide-react';

interface MetricsCarouselProps {
  moodData: MoodEntry[];
  sleepData: { day: number; value: number | null }[];
  productivityData: { day: number; value: number }[];
  checkIns: CheckInRecord;
  onToggleMood: (day: number) => void;
}

type MetricType = 'mood' | 'sleep' | 'productivity' | 'balance';

export const MetricsCarousel: React.FC<MetricsCarouselProps> = ({ 
  moodData, 
  sleepData, 
  productivityData, 
  checkIns,
  onToggleMood 
}) => {
  const [currentMetric, setCurrentMetric] = useState<MetricType>('mood');

  // Cálculo da Roda da Vida (Balance)
  const balanceData = useMemo(() => {
    // Inicializa contadores
    const totals: Record<string, number> = {};
    const counts: Record<string, number> = {};
    
    CHECKIN_CATEGORIES.forEach(cat => {
      totals[cat.id] = 0;
      counts[cat.id] = 0;
    });

    // Soma valores
    Object.values(checkIns).forEach(dayRecord => {
      Object.entries(dayRecord).forEach(([catId, val]) => {
        if (totals[catId] !== undefined) {
          // Inverte o estresse: se o valor é 3 (muito estresse), vira 1 (ruim para o equilibrio). 
          // Se é 1 (pouco estresse), vira 3 (bom).
          let adjustedVal = val;
          if (catId === 'stress') {
             adjustedVal = 4 - val; 
          }
          
          totals[catId] += adjustedVal;
          counts[catId] += 1;
        }
      });
    });

    // Calcula média e formata para Recharts
    return CHECKIN_CATEGORIES.map(cat => {
      const count = counts[cat.id] || 0;
      const avg = count > 0 ? totals[cat.id] / count : 0;
      // Normaliza para escala 100 para o gráfico ficar bonito
      const scaled = (avg / 3) * 100;
      
      // Abrevia labels longas
      let label = cat.label;
      if (label.includes('Qualidade')) label = 'Sono';
      if (label.includes('Nível de Energia')) label = 'Energia';
      if (label.includes('Nível de Estresse')) label = 'Calma'; // Invertido conceito visualmente
      if (label.includes('Interação')) label = 'Social';
      if (label.includes('Foco')) label = 'Foco';

      return {
        subject: label,
        A: Math.round(scaled),
        fullMark: 100
      };
    });
  }, [checkIns]);

  const metricsConfig = {
    mood: {
      title: 'Humor',
      icon: Smile,
      color: '#00b894', 
      bg: 'bg-green-50',
      description: 'Baseado no seu registro diário',
      domain: [0.5, 3.5]
    },
    sleep: {
      title: 'Qualidade do Sono',
      icon: Moon,
      color: '#0984e3', 
      bg: 'bg-blue-50',
      description: 'Dados do Check-in diário',
      domain: [0, 4]
    },
    productivity: {
      title: 'Produtividade',
      icon: Zap,
      color: '#e17055', 
      bg: 'bg-orange-50',
      description: 'Hábitos realizados + Foco',
      domain: [0, 100]
    },
    balance: {
      title: 'Roda da Vida',
      icon: Activity,
      color: '#a29bfe',
      bg: 'bg-purple-50',
      description: 'Equilíbrio mensal das áreas',
      domain: [0, 100]
    }
  };

  const metricKeys = Object.keys(metricsConfig) as MetricType[];

  const handleNext = () => {
    const currentIndex = metricKeys.indexOf(currentMetric);
    const nextIndex = (currentIndex + 1) % metricKeys.length;
    setCurrentMetric(metricKeys[nextIndex]);
  };

  const handlePrev = () => {
    const currentIndex = metricKeys.indexOf(currentMetric);
    const prevIndex = (currentIndex - 1 + metricKeys.length) % metricKeys.length;
    setCurrentMetric(metricKeys[prevIndex]);
  };

  const config = metricsConfig[currentMetric];
  const Icon = config.icon;

  const renderChart = () => {
    const commonProps = {
      margin: { top: 20, right: 10, left: -20, bottom: 5 }
    };

    if (currentMetric === 'balance') {
      return (
         <ResponsiveContainer width="100%" height="100%">
            <RadarChart cx="50%" cy="50%" outerRadius="70%" data={balanceData}>
              <PolarGrid stroke="#b2bec3" strokeDasharray="3 3" />
              <PolarAngleAxis dataKey="subject" tick={{ fill: '#636e72', fontFamily: 'Patrick Hand', fontSize: 14 }} />
              <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} axisLine={false} />
              <Radar
                name="Equilíbrio"
                dataKey="A"
                stroke={config.color}
                fill={config.color}
                fillOpacity={0.5}
              />
              <Tooltip 
                content={({ active, payload }) => {
                  if (active && payload && payload.length) {
                    return (
                      <div className="bg-paper border-2 border-ink rounded-lg p-2 shadow-lg font-hand z-50">
                        <p className="text-center font-bold text-ink">{payload[0].payload.subject}</p>
                        <p className="text-center text-ink">{payload[0].value}%</p>
                      </div>
                    );
                  }
                  return null;
                }}
              />
            </RadarChart>
         </ResponsiveContainer>
      );
    }

    if (currentMetric === 'mood') {
      return (
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={moodData} {...commonProps}>
            <CartesianGrid stroke="#b2bec3" strokeDasharray="3 3" vertical={true} horizontal={true} opacity={0.3} />
            <XAxis dataKey="day" hide={true} interval={0} />
            <YAxis domain={config.domain} hide={true} />
            <Tooltip 
              cursor={{ stroke: '#b2bec3', strokeWidth: 2, strokeDasharray: '5 5' }}
              content={({ active, payload }) => {
                if (active && payload && payload.length) {
                  const val = payload[0].value;
                  let label = "Sem registro";
                  if (val === 3) label = "Radiante";
                  if (val === 2) label = "Neutro";
                  if (val === 1) label = "Cansado";
                  return (
                    <div className="bg-paper border-2 border-ink rounded-lg p-2 shadow-lg font-hand z-50">
                      <p className="text-center font-bold">Dia {payload[0].payload.day}</p>
                      <p className="text-center text-ink">{label}</p>
                    </div>
                  );
                }
                return null;
              }}
            />
            <Line
              type="monotone"
              dataKey="value"
              stroke={config.color}
              strokeWidth={3}
              connectNulls={false}
              dot={{ r: 4, fill: config.color, stroke: 'none', cursor: 'pointer', onClick: (_: any, e: any) => onToggleMood(e.payload.day) }}
              activeDot={{ r: 7, strokeWidth: 0, fill: config.color }}
              animationDuration={1000}
            />
          </LineChart>
        </ResponsiveContainer>
      );
    }

    if (currentMetric === 'sleep') {
      return (
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={sleepData} {...commonProps}>
            <CartesianGrid stroke="#b2bec3" strokeDasharray="3 3" vertical={false} horizontal={true} opacity={0.3} />
            <XAxis dataKey="day" hide={true} interval={0} />
            <YAxis domain={config.domain} hide={true} />
            <Tooltip
               cursor={{ fill: 'rgba(0,0,0,0.05)' }}
               content={({ active, payload }) => {
                if (active && payload && payload.length) {
                  const val = payload[0].value;
                  let label = "Sem dados";
                  if (val === 3) label = "Bom (8h+)";
                  if (val === 2) label = "Médio (6-7h)";
                  if (val === 1) label = "Ruim (<6h)";
                  return (
                    <div className="bg-paper border-2 border-ink rounded-lg p-2 shadow-lg font-hand z-50">
                      <p className="text-center font-bold">Dia {payload[0].payload.day}</p>
                      <p className="text-center text-ink">{label}</p>
                    </div>
                  );
                }
                return null;
              }}
            />
            <Bar 
              dataKey="value" 
              fill={config.color} 
              radius={[4, 4, 0, 0]} 
              barSize={12}
              fillOpacity={0.6}
            />
          </BarChart>
        </ResponsiveContainer>
      );
    }

    if (currentMetric === 'productivity') {
      return (
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={productivityData} {...commonProps}>
            <CartesianGrid stroke="#b2bec3" strokeDasharray="3 3" vertical={true} horizontal={true} opacity={0.3} />
            <XAxis dataKey="day" hide={true} interval={0} />
            <YAxis domain={[0, 100]} hide={true} />
            <defs>
              <linearGradient id="colorProd" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={config.color} stopOpacity={0.4}/>
                <stop offset="95%" stopColor={config.color} stopOpacity={0}/>
              </linearGradient>
            </defs>
            <Tooltip 
               content={({ active, payload }) => {
                if (active && payload && payload.length) {
                  return (
                    <div className="bg-paper border-2 border-ink rounded-lg p-2 shadow-lg font-hand z-50">
                      <p className="text-center font-bold">Dia {payload[0].payload.day}</p>
                      <p className="text-center text-ink">{Math.round(payload[0].value as number)}% Produtivo</p>
                    </div>
                  );
                }
                return null;
              }}
            />
            <Area 
              type="monotone" 
              dataKey="value" 
              stroke={config.color} 
              fillOpacity={1} 
              fill="url(#colorProd)" 
              strokeWidth={2}
            />
          </AreaChart>
        </ResponsiveContainer>
      );
    }
  };

  return (
    <div className="w-full mt-8 select-none">
      <div className="flex items-center justify-between mb-4 px-2">
         <div className="flex items-center gap-3">
             <div className={`p-2 rounded-full border border-ink/20 ${config.bg}`}>
                <Icon className="w-6 h-6 text-ink" />
             </div>
             <div>
                 <h3 className="font-title text-2xl text-ink leading-none">{config.title}</h3>
                 <span className="text-pencil text-sm italic font-hand">{config.description}</span>
             </div>
         </div>
         
         {/* Navigation Arrows */}
         <div className="flex items-center gap-2">
             <button onClick={handlePrev} className="p-2 hover:bg-black/5 rounded-full transition-colors text-ink">
                 <ChevronLeft className="w-6 h-6" />
             </button>
             <button onClick={handleNext} className="p-2 hover:bg-black/5 rounded-full transition-colors text-ink">
                 <ChevronRight className="w-6 h-6" />
             </button>
         </div>
      </div>

      <div className="flex w-full h-[250px] bg-white/40 border-2 border-dashed border-pencil/20 rounded-xl p-4 relative">
         {/* Legenda Dinâmica baseada no tipo */}
         <div className="w-12 flex flex-col justify-between items-center py-4 text-xs font-hand text-pencil border-r border-pencil/10 mr-4">
            {currentMetric === 'productivity' || currentMetric === 'balance' ? (
                <>
                    <span>100%</span>
                    <span>50%</span>
                    <span>0%</span>
                </>
            ) : (
                <>
                    <span>+</span>
                    <span>~</span>
                    <span>-</span>
                </>
            )}
         </div>

         <div className="flex-1 relative">
            {renderChart()}
         </div>
      </div>
    </div>
  );
};
