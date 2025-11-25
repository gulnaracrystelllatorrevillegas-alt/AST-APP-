import { GoogleGenAI, Type } from "@google/genai";
import { AIRecommendation, TechniqueId } from "../types";

export const getBreathingRecommendation = async (
  emotion: string,
  customText: string
): Promise<AIRecommendation> => {
  try {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    
    const userContext = `Usuario selecciona botón: "${emotion}". Texto adicional opcional: "${customText}".`;
    
    const systemInstruction = `
      Eres un experto en relajación y regulación emocional. Tu objetivo es seleccionar la mejor técnica de respiración basada en el estado actual del usuario.
      
      Las técnicas disponibles son:
      1. RELAX_4_7_8: Para pánico, ansiedad severa o insomnio. Muy sedante.
      2. BOX_BREATHING (Caja): Para nervios, falta de concentración o estrés agudo.
      3. DIAPHRAGMATIC (Diafragmática): Para tensión general, miedo moderado o estrés físico.
      4. SLOW_PACED (Lenta): Para alteración leve o mantenimiento de calma.

      Analiza la entrada del usuario y decide cuál es la mejor opción.
      Genera una explicación breve, empática y directa (máximo 2 frases) de por qué esta técnica ayudará ahora mismo.
    `;

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: userContext,
      config: {
        systemInstruction: systemInstruction,
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            techniqueId: {
              type: Type.STRING,
              enum: [
                TechniqueId.RELAX_4_7_8,
                TechniqueId.BOX_BREATHING,
                TechniqueId.DIAPHRAGMATIC,
                TechniqueId.SLOW_PACED
              ]
            },
            reasoning: {
              type: Type.STRING,
            }
          },
          required: ["techniqueId", "reasoning"]
        }
      }
    });

    const text = response.text;
    if (!text) {
      throw new Error("No response from AI");
    }

    const data = JSON.parse(text) as AIRecommendation;
    return data;

  } catch (error) {
    console.error("Error fetching recommendation:", error);
    // Fallback in case of API error
    return {
      techniqueId: TechniqueId.BOX_BREATHING,
      reasoning: "Parece que hubo un problema de conexión, pero la respiración cuadrada es excelente para centrarte y calmarte en cualquier situación."
    };
  }
};