import { GoogleGenAI } from "@google/genai";
import { Habit, MoodEntry, CheckInRecord } from "../types";

const MODEL_NAME = 'gemini-2.5-flash';

// Helper seguro para obter a API Key sem causar crash se process/process.env não existirem
const getApiKey = (): string => {
  try {
    if (typeof process !== "undefined" && process?.env?.API_KEY) {
      return process.env.API_KEY;
    }
  } catch (e) {
    // Ignora erros de referência silenciosamente
  }
  return "";
};

// Helper para obter o cliente de forma preguiçosa (Lazy Initialization)
const getAiClient = () => {
  const apiKey = getApiKey();
  return new GoogleGenAI({ apiKey });
};

/**
 * O "Escriba Fantasma"
 * Gera uma entrada de diário poética baseada nos dados do dia.
 */
export const generateGhostScribeEntry = async (
  day: number,
  monthName: string,
  habits: Habit[],
  moodData: MoodEntry[],
  checkIns: CheckInRecord
): Promise<string> => {
  
  // Preparar os dados para o prompt
  const mood = moodData.find(m => m.day === day)?.value;
  const moodLabel = mood === 3 ? 'Radiante' : mood === 2 ? 'Neutro' : mood === 1 ? 'Cansado' : 'Sem registro';
  
  const completedHabits = habits
    .filter(h => h.completed[day] === 1)
    .map(h => h.title)
    .join(", ");

  const checkInData = checkIns[day] || {};
  const sleep = checkInData['sleep'];
  const focus = checkInData['focus'];

  const prompt = `
    Atue como um "Escriba Fantasma" de um diário pessoal (Bullet Journal).
    
    Dados do dia ${day} de ${monthName}:
    - Humor: ${moodLabel}
    - Hábitos Completados: ${completedHabits || "Nenhum hábito específico hoje"}
    - Qualidade do Sono (1-3): ${sleep || "N/A"}
    - Foco (1-3): ${focus || "N/A"}

    Tarefa: Escreva uma entrada de diário curta (máximo 3 frases), em primeira pessoa, em Português do Brasil.
    Tom: Reflexivo, poético, calmo e pessoal. Use estilo de escrita manual.
    Não mencione números frios, transforme-os em narrativa (ex: em vez de "Sono 3", diga "Descansei profundamente").
  `;

  try {
    const ai = getAiClient();
    const response = await ai.models.generateContent({
      model: MODEL_NAME,
      contents: prompt,
    });
    return response.text?.trim() || "Hoje o escriba está sem palavras...";
  } catch (error) {
    console.error("Erro no Escriba Fantasma:", error);
    const keyStatus = getApiKey() ? "Chave encontrada" : "Chave ausente";
    return `O escriba está tirando um cochilo... (${keyStatus})`;
  }
};

/**
 * O "Detetive de Padrões"
 * Analisa correlações entre hábitos e métricas.
 */
export const analyzePatternsWithAI = async (
  habits: Habit[],
  moodData: MoodEntry[],
  checkIns: CheckInRecord
): Promise<string> => {
  
  // Simplificar dados para economizar tokens e focar no essencial
  const dataSummary = {
    totalDays: moodData.length,
    habitsList: habits.map(h => h.title),
    moodHistory: moodData.filter(m => m.value !== null).map(m => ({ d: m.day, v: m.value })),
    habitHistory: habits.map(h => ({ 
      title: h.title, 
      days: Object.keys(h.completed).map(Number) 
    })),
    checkInSummary: Object.entries(checkIns).map(([d, val]) => ({ d, ...val }))
  };

  const prompt = `
    Atue como um detetive de padrões comportamentais gentil e observador.
    Analise este JSON de dados de um mês de um usuário:
    ${JSON.stringify(dataSummary)}

    Tarefa: Encontre UMA correlação curiosa, um padrão oculto ou um reforço positivo.
    Exemplos: 
    - "Notei que quando você faz Yoga, seu sono melhora."
    - "Seus dias mais felizes coincidem com leitura."
    - "Apesar do estresse alto no dia 15, você manteve a hidratação!"

    Requisitos:
    - Responda em Português do Brasil.
    - Seja extremamente breve (máximo 20 palavras).
    - Use um tom de "Insight num Post-it".
    - Não use formatação técnica.
  `;

  try {
    const ai = getAiClient();
    const response = await ai.models.generateContent({
      model: MODEL_NAME,
      contents: prompt,
    });
    return response.text?.trim() || "Sem insights por enquanto.";
  } catch (error) {
    console.error("Erro no Detetive:", error);
    return "Estou organizando minhas lupas... (Erro de conexão)";
  }
};

/**
 * O "Meteorologista Mental"
 * Analisa a lista de Brain Dump.
 */
export const analyzeBrainDump = async (
  items: string[]
): Promise<string> => {
  if (items.length === 0) return "Sua mente parece tranquila como um lago sereno.";

  const prompt = `
    Aqui está uma lista de pensamentos soltos ("Brain Dump") de um usuário:
    ${JSON.stringify(items)}

    Tarefa: Atue como um "Meteorologista Mental". Resuma o "clima" da mente dessa pessoa em UMA frase metafórica.
    Exemplos:
    - "Céu nublado com tarefas pendentes, mas raios de criatividade surgindo."
    - "Tempestade de ansiedade passageira."
    - "Brisa leve de produtividade."

    Requisitos:
    - Português do Brasil.
    - Tom calmo, acolhedor e poético.
    - Máximo 15 palavras.
  `;

  try {
    const ai = getAiClient();
    const response = await ai.models.generateContent({
      model: MODEL_NAME,
      contents: prompt,
    });
    return response.text?.trim() || "O vento está mudando...";
  } catch (error) {
    console.error("Erro no Meteorologista:", error);
    return "Interferência no radar mental...";
  }
};

/**
 * O "Correspondente Semanal"
 * Gera uma carta narrativa conectando os pontos da semana.
 */
export const generateWeeklyLetter = async (
  habits: Habit[],
  moodData: MoodEntry[],
  checkIns: CheckInRecord,
  journalEntries: Record<number, string>
): Promise<string> => {
  
  // Pegar dados dos últimos 7 dias (ou do mês atual para simplificar o contexto)
  const today = new Date().getDate();
  const startDay = Math.max(1, today - 7);
  
  const weeklyData = {
    range: `Dia ${startDay} até ${today}`,
    moods: moodData.filter(m => m.day >= startDay && m.day <= today && m.value !== null),
    habitsCompleted: habits.map(h => ({
      title: h.title,
      count: Object.keys(h.completed).filter(d => Number(d) >= startDay && Number(d) <= today).length
    })),
    checkIns: Object.entries(checkIns)
      .filter(([day]) => Number(day) >= startDay && Number(day) <= today)
      .map(([day, data]) => ({ day, ...data })),
    journalSnippets: Object.entries(journalEntries)
      .filter(([day]) => Number(day) >= startDay && Number(day) <= today)
      .map(([day, text]) => `Dia ${day}: ${text.substring(0, 50)}...`)
  };

  const prompt = `
    Atue como um amigo sábio e empático que observou a semana do usuário.
    Analise os dados da última semana:
    ${JSON.stringify(weeklyData)}

    Tarefa: Escreva uma carta pessoal para o usuário.
    
    Diretrizes de Estilo:
    - Comece com "Olá," ou "Querido(a),".
    - NÃO liste dados. Conecte os pontos. Ex: "Vi que terça foi difícil, mas você compensou cuidando do sono na quarta."
    - Seja acolhedor. Se a semana foi ruim, ofereça conforto. Se foi boa, celebre.
    - Mencione correlações entre estresse, hábitos e humor se existirem.
    - Termine com uma mensagem de encorajamento para a próxima semana.
    - Tamanho: Cerca de 3 parágrafos curtos.

    Idioma: Português do Brasil.
  `;

  try {
    const ai = getAiClient();
    const response = await ai.models.generateContent({
      model: MODEL_NAME,
      contents: prompt,
    });
    return response.text?.trim() || "O correio não conseguiu entregar sua carta esta semana...";
  } catch (error) {
    console.error("Erro na Carta Semanal:", error);
    return "O tempo lá fora está tempestuoso, não conseguimos trazer sua carta. (Verifique sua API Key)";
  }
};
