# Viața mea, documentar

## Turning your boring life into a documentary

Have GPT-4 Turbo with Vision narrate your life in the style of [Teleenciclopedia](https://ro.wikipedia.org/wiki/Teleenciclopedia) nature documentaries!

Code is forked from [https://github.com/gregsadetsky/sagittarius](https://github.com/gregsadetsky/sagittarius)

Idea based on [https://github.com/cbh123/narrator](https://github.com/cbh123/narrator)

# Prerequisites

- Microsoft Azure subscription
- [Microsoft Azure Open AI Service](https://learn.microsoft.com/en-us/azure/ai-services/openai/how-to/create-resource) instance, with a [GPT-4 Turbo with Vision deployment](https://learn.microsoft.com/en-us/azure/ai-services/openai/how-to/gpt-with-vision)
- [Microsoft Speech Service](https://learn.microsoft.com/en-us/azure/ai-services/speech-service/overview) instance

## How to build

- clone this repo, cd into it
- duplicate `.env.example` and name the copy `.env`
- fill out all the environment variables
- then, run:
  - `npm install`
  - `npm run dev`
- the demo will be running at [http://localhost:5173](http://localhost:5173)

## Credits

- [https://github.com/gregsadetsky/sagittarius](https://github.com/gregsadetsky/sagittarius)
- [https://github.com/cbh123/narrator](https://github.com/cbh123/narrator)