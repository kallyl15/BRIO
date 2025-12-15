import React from 'react';
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';
import { MoodEntry } from '../types';
import { Smile, Meh, Frown } from 'lucide-react';

interface MoodChartProps {
  data: MoodEntry[];
  onToggleMood: (day: number) => void;
}

// Ponto customizado que parece uma marcação de caneta
const CustomizedDot = (props: any) => {
  const { cx, cy, payload, onClick } = props;
  
  if (payload.value === null) return null;

  // Cores baseadas no humor
  let color = '#2d3436'; // Padrão
  if (payload.value === 3) color = '#00b894'; // Verde (Feliz)
  if (payload.value === 2) color = '#0984e3'; // Azul (Neutro)
  if (payload.value === 1) color = '#d63031'; // Vermelho (Triste)

  return (
    <g onClick={() => onClick && onClick(payload.day)} style={{ cursor: 'pointer' }}>
      <circle cx={cx} cy={cy} r="5" fill={color} stroke="none" fillOpacity={0.8} />
      <circle cx={cx} cy={cy} r="8" fill="transparent" stroke={color} strokeWidth="1" strokeDasharray="2 2" />
    </g>
  );
};

export const MoodChart: React.FC<MoodChartProps> = ({ data, onToggleMood }) => {
  return (
    <div className="w-full mt-8">
      <div className="flex items-end mb-2 ml-4">
         <h3 className="font-title text-2xl text-ink rotate-[1deg]">Rastreador de Humor</h3>
         <span className="text-pencil text-sm ml-4 mb-1 italic font-hand">(Clique nos pontos para alterar histórico)</span>
      </div>

      <div className="flex w-full">
        {/* Legenda Esquerda - Alinhada com a coluna de Títulos dos Hábitos (w-64) */}
        <div className="w-64 flex flex-col justify-between items-end pr-4 py-6 text-pencil font-hand text-lg border-r-2 border-dashed border-pencil/20 relative">
           <div className="flex items-center gap-2 text-green-600/70">
             <span>Radiante</span> <Smile className="w-5 h-5" />
           </div>
           <div className="flex items-center gap-2 text-blue-600/70">
             <span>Neutro</span> <Meh className="w-5 h-5" />
           </div>
           <div className="flex items-center gap-2 text-rose-600/70">
             <span>Cansado</span> <Frown className="w-5 h-5" />
           </div>
           
           {/* Linha decorativa vertical */}
           <div className="absolute right-[-2px] top-0 bottom-0 w-[2px] bg-pencil/10"></div>
        </div>

        {/* Área do Gráfico */}
        <div className="flex-1 h-[200px] relative">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart 
              data={data} 
              margin={{ top: 20, right: 10, left: 10, bottom: 5 }}
            >
              <CartesianGrid stroke="#b2bec3" strokeDasharray="3 3" vertical={true} horizontal={true} opacity={0.3} />
              
              <XAxis 
                dataKey="day" 
                hide={true} // Escondemos o eixo X aqui pois já temos os dias na tabela de cima visualmente
                interval={0}
              />
              
              {/* Eixo Y invisível apenas para escala (1 a 3) */}
              <YAxis domain={[0.5, 3.5]} hide={true} />

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
                      <div className="bg-paper border-2 border-ink rounded-lg p-2 shadow-lg font-hand">
                        <p className="text-center font-bold">Dia {payload[0].payload.day}</p>
                        <p className="text-center text-ink">{label}</p>
                      </div>
                    );
                  }
                  return null;
                }}
              />

              <Line
                type="monotone" // Curva suave (Bezier)
                dataKey="value"
                stroke="#2d3436"
                strokeWidth={2.5}
                connectNulls={false} // Não conecta se houver dias vazios no meio, parece mais real
                dot={<CustomizedDot onClick={onToggleMood} />}
                activeDot={{ r: 7, strokeWidth: 0, fill: '#fab1a0' }}
                animationDuration={1000}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};