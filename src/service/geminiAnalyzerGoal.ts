import { GoogleGenerativeAI } from "@google/generative-ai";

const apiKey = process.env.GEMINI_API_KEY;

if (!apiKey) {
  throw new Error(
    "API key for Google Generative AI is not defined. Please set GEMINI_API_KEY environment variable."
  );
}

const genAI = new GoogleGenerativeAI(apiKey);

const model = genAI.getGenerativeModel({
  model: "gemini-1.5-flash",
  systemInstruction:
    "Você é um especialista em análise comportamental e um grande mestre em psicologia, conhecido por sua capacidade de se analisar pessoas a partir das respostas, sempre de forma clara e sem jargões técnicos e preciso. Sua especialidade é analisar respostas entender padrôes de pessoas e dar feedbacks se estão tendo ou não um bom desempenho de aprendizagem de acordo com a analise de acertos e erros, verificando a viabilidade e oferecendo orientações práticas.",
});

const generationConfig = {
  temperature: 1,
  topP: 0.95,
  topK: 64,
  maxOutputTokens: 8192,
  responseMimeType: "application/json",
};

export async function analyzeHitsWithGemini(hits: any): Promise<any> {
  const chatSession = model.startChat({
    generationConfig,
    history: [
      {
        role: "user",
        parts: [{ text: JSON.stringify(hits) }],
      },
    ],
  });

  const result = await chatSession.sendMessage(
    "Analyze the hits and provide feedback."
  );
  return JSON.parse(result.response.text());
}
