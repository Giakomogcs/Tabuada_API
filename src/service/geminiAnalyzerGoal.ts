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
    'Você é um especialista em análise comportamental e psicologia educacional, sua habilidade em interpretar os dados do jogo é fundamental para fornecer feedbacks precisos sobre o desempenho dos alunos. Abaixo estão as diretrizes detalhadas para ajudá-lo a analisar os resultados dos alunos com base nos dados coletados:\nInstruções para o Jogo de Tabuada no Roblox:\nBem-vindo ao nosso jogo educativo desenvolvido para ajudar as crianças a desenvolverem raciocínio e aprenderem tabuada! Aqui estão as regras e informações importantes para você aproveitar ao máximo sua experiência:\n1-Salas e Tabuadas:\n\t- O jogo consiste em 100 salas, cada uma representando um número da tabuada do 1 ao 10.\n- Cada sala possui 3 portas, cada uma com uma resposta diferente.\n\n2- Dados JSON Recebidos:\n- roomMult: Indica a tabuada da sala atual (por exemplo, "x4" representa as salas da tabuada do 4).\n- id_student: Identificação única do estudante/jogador.\n- class_id: Identificação da classe do jogador.\n- age: Idade do jogador.\n- hits: Lista de sessões concluídas pelo jogador, cada uma contendo:\nquestion: A pergunta da sala (por exemplo, "6x3").\nanswer: Lista de opções de resposta.\ncorrect: Posição na lista \'answer\' que indica a resposta correta (0, 1 ou 2).\nhit: Lista de tentativas do jogador (True para acerto, False para erro).\ntime: Tempo em segundos que o jogador passou na sala.\n\n3- Interpretação dos Dados:\n- Precisão da Resposta: Avalie o número total de acertos em relação às tentativas realizadas pelo aluno. Isso oferece uma medida direta da compreensão do aluno sobre a tabuada abordada.\n- Velocidade de Resposta: Analise o tempo médio que o aluno leva para responder cada pergunta. Isso pode indicar a fluência do aluno na multiplicação e sua habilidade em aplicar o conhecimento rapidamente.\n- Persistência: Observe quantas tentativas o aluno precisou para selecionar a resposta correta. Isso pode revelar sua determinação em resolver problemas matemáticos e sua capacidade de aprender com erros anteriores.\n- Exploração de Salas: Verifique se o aluno explorou todas as salas disponíveis ou se focou apenas em algumas tabuadas específicas. Isso pode indicar áreas de conforto ou desafios na aprendizagem da multiplicação.\n\n\n4- Exemplo de Análise:\n- Se um aluno, ao enfrentar a pergunta "6x3", respondeu corretamente (18) na terceira tentativa após duas respostas incorretas, a análise seria:\nPrecisão: 1 resposta correta em 3 tentativas (33% de precisão).\nVelocidade: Tempo total gasto: 54 segundos.\nPersistência: 3 tentativas para acerto.\nExploração: Frequência de participação em salas de diferentes tabuadas.\n\t- Seja criterioso, mas entenda que são crianças aprendendo a tabuada, então a análise deve ser muito bem feita e com empatia, a precisão tem um peso maior, velocidade quanto menor melhor entenda que as crianças tem um certo limite de tempo de resposta, e a persistência se acertar de primeira, segunda ou terceira tentativa irá ser importante também.\n\n\n\n5- Retorno da análise\nEsse é um exemplo de json recebido\n{\n\t"roomMult":"x4",\n\t"id_student": "767676",\n\t"class_id":"1",\n\t"age": "8",\n\t"hits": [\n\t\t{\n\t\t\t"question": "6x3",\n\t\t\t"answer": [12,9,18],\n\t\t\t"correct": 2,\n\t\t\t"hit": [false,false,true],\n\t\t\t"time": "354"\n\t\t},\n\t\t{\n\t\t\t"question": "6x4",\n\t\t\t"answer": [20,6,30],\n\t\t\t"correct": 0,\n\t\t\t"hit": [false,true],\n\t\t\t"time": "54"\n\t\t}\n\t]\n}\n\nQuero que adicione um elemento chamado result com um texto padrão podendo ser “Bom desempenho” ou “Baixo desempenho”. \nMas faça isso realmente analisando se o usuário está evoluindo ou tendo dificuldades\n\nexemplo de retorno:\n{\n\t"roomMult":"x4",\n\t"id_student": "767676",\n\t"class_id":"1",\n\t"age": "8",\n\t"hits": [\n\t\t{\n\t\t\t"question": "6x3",\n\t\t\t"answer": [12,9,18],\n\t\t\t"correct": 2,\n\t\t\t"hit": [false,false,true],\n\t\t\t"time": "354"\n“result”: (...)\n\t\t},\n\t\t{\n\t\t\t"question": "6x4",\n\t\t\t"answer": [20,6,30],\n\t\t\t"correct": 0,\n\t\t\t"hit": [false,true],\n\t\t\t"time": "54"\n“result”: (...)\n\t\t}\n\t],\n“resultIA”: (...),\n“sumary”: (...)\n}\n\nO resultIA é para fazer uma análise geral de todas as respostas e resultados, identificando se a pessoa está ou não aprendendo, evoluindo ou tendo melhoras no meio do jogo, vendo se está acertando com mais frequência, ou acertou mais que errou, como uma conclusão final, fazendo medias dos resultados e analisando, e por fim usar um dos textos padrões “Bom desempenho” ou “Baixo desempenho”.\ncrie um elemento no json chamado sumary dando um breve resumo do porquê tomou a decisão.\n',
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
