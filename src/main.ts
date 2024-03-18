import { OpenAI } from "./openai";
import { startCamera, stopCamera } from "./camera";
import { scaleAndStackImagesAndGetBase64 } from "./imageStacker";
import { Speech } from "./speech";

const IMAGE_STACK_SIZE = 1;

let isRunning = false;
let imageStack: HTMLImageElement[] = [];
let imageStackInterval: number | null = null;

let newMessagesWatcherInterval: number | null = null;
let speech: Speech = new Speech();
let openAI = new OpenAI();


function pushNewImageOnStack() {
  const canvas = document.querySelector("canvas")! as HTMLCanvasElement;
  const base64 = canvas.toDataURL("image/jpeg");
  const image = document.createElement("img");
  image.src = base64;

  imageStack.push(image);
  if (imageStack.length > IMAGE_STACK_SIZE) {
    imageStack.shift();
  }
}

async function runLoop() {
  
  if (openAI.isRunning() || speech.isSpeaking())
    return;

  const base64 = scaleAndStackImagesAndGetBase64(imageStack);

  const message = await openAI.makeOpenAIRequest(base64);

  if (!message)
    return;

  await speech.speak(message)

  updatePromptOutput("");
}

export function updatePromptOutput(
  newMessage: string,
  dontAddNewLine?: boolean
) {
  const promptOutput = document.getElementById("promptOutput");
  if (!promptOutput) {
    return;
  }

  promptOutput.innerHTML += newMessage + (dontAddNewLine ? "" : "<br/><br/>");
  promptOutput.scrollTop = promptOutput.scrollHeight; // Auto-scroll to bottom
}


document.addEventListener("DOMContentLoaded", async function () {

  document
    .querySelector("#startButton")!
    .addEventListener("click", function () {

      isRunning = !isRunning;

      if (isRunning) {
        startCamera();

        imageStackInterval = window.setInterval(() => {
          pushNewImageOnStack();
        }, 800);

        newMessagesWatcherInterval = window.setInterval(() => {
          runLoop();
        }, 2000);

        document.querySelector("#startButton")!.textContent = "Stop";
      } else {
        stopCamera();
        speech.stop();

        imageStackInterval && clearInterval(imageStackInterval);
        newMessagesWatcherInterval && clearInterval(newMessagesWatcherInterval);

        document.querySelector("#startButton")!.textContent = "Start";
      }
    });
});
