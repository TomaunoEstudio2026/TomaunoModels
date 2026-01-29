
import { GoogleGenAI } from "@google/genai";

// Fix: Moved GoogleGenAI instantiation inside the function to ensure it uses the most up-to-date process.env.API_KEY
export const askPrisma = async (prompt: string, customKnowledge: string) => {
  try {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt,
      config: {
        systemInstruction: `Eres "Prisma", el asistente experto de Tomauno Models. 
        INSTRUCCIONES DE ENTRENAMIENTO ACTUALES:
        ${customKnowledge}
        
        REGLAS DE ORO:
        1. Sé elegante, profesional y conciso.
        2. Siempre anima a la persona a unirse a la academia.
        3. No inventes precios si no están en el conocimiento actual.
        4. Si alguien quiere pagar, dile que use el alias tomauno.belo.`,
        temperature: 0.7,
      },
    });
    return response.text || "Lo siento, estoy actualizando mi base de datos. ¿Podrías preguntar de nuevo?";
  } catch (error) {
    return "En este momento Javier Móttola está en una sesión de fotos, por favor escríbele directamente al +5493764354522.";
  }
};
