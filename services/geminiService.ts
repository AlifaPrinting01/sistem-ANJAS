
import { GoogleGenAI, Type } from "@google/genai";

// Initialize Gemini API client directly with process.env.API_KEY
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });

export const getSmartRouteAdvice = async (students: any[], trafficConditions: string) => {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Optimalkan rute jemputan untuk siswa berikut: ${JSON.stringify(students)}. 
      Kondisi lalu lintas: ${trafficConditions}. 
      Berikan urutan penjemputan yang paling efisien dan estimasi waktu sampai di sekolah.`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            optimizedOrder: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
              description: 'IDs of students in optimized order'
            },
            summary: {
              type: Type.STRING,
              description: 'Reasoning for this route'
            },
            estimatedTotalMinutes: {
              type: Type.NUMBER
            }
          },
          required: ["optimizedOrder", "summary", "estimatedTotalMinutes"]
        }
      }
    });

    const text = response.text;
    if (!text) return null;
    return JSON.parse(text);
  } catch (error) {
    console.error("Gemini Error:", error);
    return null;
  }
};
