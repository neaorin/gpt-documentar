import { OpenAIClient, AzureKeyCredential, ChatRequestMessage  } from "@azure/openai";

import { updatePromptOutput } from "./main";

const OPEN_AI_SYSTEM_PROMPT = `
Esti un asistent care transformă imaginile pe care le vede într-o narațiune în stilul emisiunii-documentar românească "Teleenciclopedia". 
Narațiunea trebuie sa fie în stilul unui documentar despre natură, dar ca parodie. 
Fiecare paragraf ar trebuie sa fie scurt, de maxim 70 de cuvinte.
Nu te repeta. Nu folosi cuvinte împrumutate din alte limbi.
Nu trebuie să menționezi denumirea Teleenciclopedia, aceasta fiind marcă înregistrată.
Narațiunea trebuie să fie în limba română`;


export class OpenAI {

  requestRunning = false;
  previousOutputMessages: String[] = [];

  isRunning() {
    return this.requestRunning;
  }

  async makeOpenAIRequest(
    imageUrl: string
  ) 
  
  {
    const debugImage = new Image();
    debugImage.src = imageUrl;

    const endpoint = import.meta.env.VITE_AZURE_OPEN_AI_ENDPOINT;
    const client = new OpenAIClient(endpoint, new AzureKeyCredential(import.meta.env.VITE_AZURE_OPEN_AI_KEY));
    const deploymentId = import.meta.env.VITE_AZURE_OPEN_AI_DEPLOYMENT_NAME;
  
    const messages :  ChatRequestMessage[] = [
      {
        role: "system",
        content: OPEN_AI_SYSTEM_PROMPT,
      },
      {
        role: "assistant",
        content: this.previousOutputMessages.join("; "),
      },
      {
        role: "user",
        content: [
          {
            type: "image_url",
            imageUrl: {
              url: imageUrl,
            },
          },
        ],
      },
    ];
  
    this.requestRunning = true;
    const events = await client.getChatCompletions(deploymentId, messages, { maxTokens: 250 });
    this.requestRunning = false;

    const message = events.choices[0].message?.content;
    if (!message)
      return;
  
    updatePromptOutput(message, true);
    this.previousOutputMessages.push(message);
    return message;
  }
  
}

