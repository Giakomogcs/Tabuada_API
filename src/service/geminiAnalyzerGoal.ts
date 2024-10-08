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
    '\nInstruções para o Jogo de Tabuada no Roblox\n\nBem-vindo ao nosso jogo educativo desenvolvido para ajudar as crianças a desenvolverem raciocínio e aprenderem tabuada! Aqui estão as regras e informações importantes para você aproveitar ao máximo sua experiência:\n\n1- Salas e Tabuadas:\nO jogo consiste em 100 salas, cada uma representando um número da tabuada do 1 ao 10. Cada sala possui 3 portas, cada uma com uma resposta diferente.\n\n2- Dados JSON Recebidos:\nroomMult: Indica a tabuada da sala atual (por exemplo \'x4\' representa as salas da tabuada do 4).\nid_student: Identificação única do estudante/jogador.\nclass_id: Identificação da classe do jogador.\nage: Idade do jogador.\nhits: Lista de sessões concluídas pelo jogador, cada uma contendo:\n    question: A pergunta da sala (por exemplo \'6x3\').\n    answer: Lista de opções de resposta.\n    correct: Posição na lista \'answer\' que indica a resposta correta (0, 1 ou 2).\n    hit: Lista de tentativas do jogador (True para acerto, False para erro).\n    time: Tempo em segundos que o jogador passou na sala.\n\n3- Interpretação dos Dados:\nPrecisão da Resposta: Avalie o número total de acertos em relação às tentativas realizadas pelo aluno. Isso oferece uma medida direta da compreensão do aluno sobre a tabuada abordada.\nVelocidade de Resposta: Analise o tempo médio que o aluno leva para responder cada pergunta. Isso pode indicar a fluência do aluno na multiplicação e sua habilidade em aplicar o conhecimento rapidamente.\nPersistência: Observe quantas tentativas o aluno precisou para selecionar a resposta correta. Isso pode revelar sua determinação em resolver problemas matemáticos e sua capacidade de aprender com erros anteriores.\nExploração de Salas: Verifique se o aluno explorou todas as salas disponíveis ou se focou apenas em algumas tabuadas específicas. Isso pode indicar áreas de conforto ou desafios na aprendizagem da multiplicação.\n\n4- Exemplo de Análise:\nSe um aluno ao enfrentar a pergunta \'6x3\' respondeu corretamente (18) na terceira tentativa após duas respostas incorretas, a análise seria:\n    Precisão: 1 resposta correta em 3 tentativas (33% de precisão).\n    Velocidade: Tempo total gasto: 54 segundos.\n    Persistência: 3 tentativas para acerto.\n    Exploração: Frequência de participação em salas de diferentes tabuadas.\nSeja criterioso, mas entenda que são crianças aprendendo a tabuada, então a análise deve ser muito bem feita e com empatia. A precisão tem um peso maior, a velocidade quanto menor melhor, e a persistência (se acertar de primeira, segunda ou terceira tentativa) será importante também.\n\n5- Retorno da Análise:\nEsse é um exemplo de json recebido:\n{\n    "roomMult": "x6",\n    "id_student": "767676",\n    "class_id": "1",\n    "age": "8",\n    "hits": [\n        {\n            "question": "6x3",\n            "answer": [12, 9, 18],\n            "correct": 2,\n            "hit": [false, false, true],\n            "time": 354\n        },\n        {\n            "question": "6x4",\n            "answer": [20, 6, 30],\n            "correct": 0,\n            "hit": [false, true],\n            "time": 54\n        }\n    ]\n}\nQuero que adicione um elemento chamado result com um texto padrão, podendo ser “Bom desempenho” ou “Baixo desempenho”. Mas faça isso realmente analisando se o usuário está evoluindo ou tendo dificuldades.\nExemplo de retorno:\n{\n    "roomMult":"x6",\n    "id_student": "767676",\n    "class_id":"1",\n    "age": "8",\n    "hits": [\n        {\n            "question": "6x3",\n            "answer": [12, 9, 18],\n            "correct": 2,\n            "hit": [false, false, true],\n            "time": 354,\n            "result": "Baixo desempenho"\n        },\n        {\n            "question": "6x4",\n            "answer": [20, 6, 30],\n            "correct": 0,\n            "hit": [false, true],\n            "time": 54,\n            "result": "Bom desempenho"\n        }\n    ],\n    "resultIA": "Bom desempenho",\n    "summary": "O estudante demonstrou melhora significativa na tabuada do 6, respondendo mais rapidamente e com maior precisão ao longo do jogo. A persistência nas tentativas mostrou-se efetiva."\n}\n\n6- Exemplos de Análises Detalhadas com Diversos Cenários:\n\nExemplo 1 - Baixo Desempenho:\n{\n    "roomMult": "x3",\n    "id_student": "123456",\n    "class_id": "2",\n    "age": "9",\n    "hits": [\n        {\n            "question": "3x4",\n            "answer": [7, 12, 14],\n            "correct": 1,\n            "hit": [false, false, true],\n            "time": 200,\n            "result": "Baixo desempenho"\n        },\n        {\n            "question": "3x5",\n            "answer": [15, 10, 8],\n            "correct": 0,\n            "hit": [false, false, false, true],\n            "time": 300,\n            "result": "Baixo desempenho"\n        }\n    ],\n    "resultIA": "Baixo desempenho",\n    "summary": "O estudante teve dificuldades significativas com a tabuada do 3, apresentando baixa precisão e tempo elevado de resposta. Reforçar a prática nas tabuadas básicas é recomendado."\n}\n\nExemplo 2 - Desempenho Misto:\n{\n    "roomMult": "x2",\n    "id_student": "654321",\n    "class_id": "3",\n    "age": "7",\n    "hits": [\n        {\n            "question": "2x6",\n            "answer": [10, 12, 14],\n            "correct": 1,\n            "hit": [true],\n            "time": 20,\n            "result": "Bom desempenho"\n        },\n        {\n            "question": "2x7",\n            "answer": [12, 14, 16],\n            "correct": 2,\n            "hit": [false, true],\n            "time": 120,\n            "result": "Baixo desempenho"\n        }\n    ],\n    "resultIA": "Baixo desempenho",\n    "summary": "O estudante mostrou boa precisão em algumas perguntas, mas teve dificuldade em outras, especialmente onde o tempo de resposta foi maior. Praticar com mais foco na velocidade de resposta pode ajudar."\n}\n\nExemplo 3 - Melhora Gradual:\n{\n    "roomMult": "x5",\n    "id_student": "789012",\n    "class_id": "4",\n    "age": "10",\n    "hits": [\n        {\n            "question": "5x2",\n            "answer": [8, 10, 12],\n            "correct": 1,\n            "hit": [false, true],\n            "time": 60,\n            "result": "Bom desempenho"\n        },\n        {\n            "question": "5x3",\n            "answer": [15, 12, 18],\n            "correct": 0,\n            "hit": [false, true],\n            "time": 50,\n            "result": "Bom desempenho"\n        }\n    ],\n    "resultIA": "Bom desempenho",\n    "summary": "O estudante mostrou uma boa melhora nas tabuadas do 5, acertando com mais precisão e reduzindo o tempo de resposta ao longo das sessões. Continuar com o ritmo atual de prática é recomendado."\n}\n\nEsses exemplos visam mostrar como diferentes cenários podem ser analisados e interpretados para fornecer feedback útil e construtivo, ajudando a orientar pais e professores sobre como melhor apoiar a aprendizagem dos alunos.\n',
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
