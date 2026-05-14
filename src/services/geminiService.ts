import axios from 'axios';
import { Product } from "../types";

export interface AIRecommendation {
  productIds: string[];
  reasoning: string;
}

export async function getRecommendations(
  browsingHistory: string[] | null | undefined,
  allProducts: Product[]
): Promise<AIRecommendation | null> {
  if (!browsingHistory || browsingHistory.length === 0) return null;

  try {
    const res = await axios.post('/api/engine/recommendations', { browsingHistory, allProducts });
    return res.data;
  } catch (err) {
    console.error("Gemini recommendation failed:", err);
    return null;
  }
}
