
import { GoogleGenAI, Type } from "@google/genai";

export const getSmartRouteAdvice = async (students: any[], trafficConditions: string) => {
  // Inisialisasi dilakukan di dalam fungsi untuk memastikan API_KEY terbaru selalu digunakan
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  
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
    
    // Membersihkan teks dari kemungkinan karakter aneh sebelum parsing
    return JSON.parse(text.trim());
  } catch (error) {
    console.error("Gemini AI Optimization Error:", error);
    return null;
  }
};
