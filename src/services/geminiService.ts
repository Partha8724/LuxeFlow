import { GoogleGenAI, Type } from "@google/genai";
import { Product } from "../types";

export interface AIRecommendation {
  productIds: string[];
  reasoning: string;
}

export async function getRecommendations(
  browsingHistory: string[],
  allProducts: Product[]
): Promise<AIRecommendation | null> {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    console.warn("No Gemini API key found");
    return null;
  }

  const ai = new GoogleGenAI({ apiKey });

  if (browsingHistory.length === 0) return null;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `You are a luxury fashion and lifestyle curator.
Based on the user's recent interactions with the following product IDs: ${browsingHistory.join(', ')}.
Here is our catalog:
${allProducts.map(p => `ID: ${p.id}, Name: ${p.name}, Category: ${p.category}, Desc: ${p.description}`).join('\n')}

Select up to 3 recommended product IDs from the catalog that complement what they viewed.
Provide a short (1-2 sentences) elegant reasoning.`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            productIds: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
              description: "Array of exactly matching product IDs"
            },
            reasoning: {
              type: Type.STRING,
              description: "Elegant reasoning for the recommendations"
            }
          },
          required: ["productIds", "reasoning"]
        }
      }
    });

    const text = response.text?.trim();
    if (!text) return null;
    return JSON.parse(text) as AIRecommendation;
  } catch (err) {
    console.error("Gemini recommendation failed:", err);
    return null;
  }
}
