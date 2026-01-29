
import { GoogleGenAI } from "@google/genai";

export const askPrisma = async (prompt: string, customKnowledge: string) => {
  try {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    const response = await ai.models.generateContent({
      model: "gemini-3-pro-preview",
      contents: prompt,
      config: {
        tools: [{ googleSearch: {} }],
        systemInstruction: `Eres "Prisma", el asistente de inteligencia artificial exclusivo de Tomauno Models (Agencia de Javier Móttola).
        
        CONOCIMIENTO INTERNO ACTUAL:
        ${customKnowledge}
        
        REGLAS DE INTERACCIÓN:
        1. Tu tono es sofisticado, elegante, minimalista y muy profesional.
        2. Si te preguntan por castings o eventos de moda en la ciudad, utiliza Google Search para dar información real y reciente.
        3. Siempre anima a la persona a sumarse a la academia en Pedro Méndez 2069, Posadas.
        4. Para pagos, el alias oficial es tomauno.belo.
        5. No respondas sobre temas ajenos al modelaje, estética o Tomauno Models.
        6. Si no sabes algo basado en el conocimiento interno, búscalo en la web pero mantén el contexto de la agencia.`,
        temperature: 0.6,
      },
    });

    // Extraemos las URLs de las fuentes si Google Search fue utilizado
    let sources = "";
    if (response.candidates?.[0]?.groundingMetadata?.groundingChunks) {
       const links = response.candidates[0].groundingMetadata.groundingChunks
         .filter((chunk: any) => chunk.web?.uri)
         .map((chunk: any) => `\n- [${chunk.web.title}](${chunk.web.uri})`);
       if (links.length > 0) sources = "\n\nFuentes encontradas:" + links.join("");
    }

    return (response.text || "Lo siento, mi conexión con el estudio está lenta. ¿Podrías repetir?") + sources;
  } catch (error) {
    console.error("Gemini Error:", error);
    return "En este momento Javier Móttola está en una sesión de fotos. Por favor contáctanos al WhatsApp +5493764354522 para una respuesta directa.";
  }
};
