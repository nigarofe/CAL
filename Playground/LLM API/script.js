async function makeDeepSeekRequest() {
    const apiKey = 'sk-0130435924c8439d97cf2a74ce7caa76'; // Replace with your API key
    const url = 'https://api.deepseek.com/v1/chat/completions'; // Check actual API endpoint in documentation

    const requestBody = {
        model: "deepseek-chat", // Confirm correct model name in documentation
        messages: [
            { role: "system", content: "Instruções para Resolução de Questões\n\n**Criação de Cheatsheet Inicial**\nAntes de iniciar as resoluções das questões, elabore uma cheatsheet (folha de referência rápida) que contenha fórmulas, conceitos-chave e passos essenciais para resolver os problemas.\nResolução Detalhada e Explicativa\n\n**Passo a Passo Completo**\nApresente os cálculos e raciocínios de forma sequencial, detalhando cada procedimento, mesmo os mais óbvios ou redundantes.\nClareza e Compreensão: Utilize uma linguagem clara e objetiva para garantir que todas as etapas sejam facilmente entendidas.\n\n\n**Extensão da Resposta**\nDesenvolva respostas extensivas, cobrindo todos os aspectos da questão sem omitir nenhuma etapa.\n\n**Explicações Teóricas Complementares**\nSempre que necessário, forneça explicações teóricas adicionais para consolidar os conceitos envolvidos na resolução.\nRelacione a prática com a teoria para fortalecer o entendimento dos fundamentos.\n\n**Formato e Organização**\nUtilize formatação adequada (como tópicos, negritos e itálicos) para destacar informações importantes e facilitar a leitura.\nOrganize a solução de maneira lógica, seguindo uma sequência que reflita o fluxo natural de resolução do problema.\nRevisão Final\n\nRevise a solução para garantir que todos os passos estejam corretos e bem explicados.\nAssegure-se de que a cheatsheet inicial esteja alinhada com a resolução apresentada." },
            { role: "user", content: " Calcule a integral (1 +lnx+ey)dx+(xey +sen3(y))dy C em que C e segmento de reta que liga o ponto (10) ao ponto (e ) " }
        ],
        temperature: 0,
        max_tokens: 1500
    };

    try {
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${apiKey}`
            },
            body: JSON.stringify(requestBody)
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        console.log('API Response:', data);

        return data;
    } catch (error) {
        console.error('Error making API request:', error);
    }
}

// Usage
const response = await makeDeepSeekRequest();
console.log(response);
console.log(response.choices[0].message.content);