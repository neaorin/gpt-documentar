import * as sdk from "microsoft-cognitiveservices-speech-sdk";
const subscriptionKey = import.meta.env.VITE_AZURE_SPEECH_KEY;
const serviceRegion = import.meta.env.VITE_AZURE_SPEECH_REGION;

declare global {
  var speakingStream: boolean;
}

export class Speech {
  unspokenStreamWords: string[] = [];
  speechConfig: sdk.SpeechConfig;
  synthesizer: sdk.SpeechSynthesizer;
  player: sdk.SpeakerAudioDestination;


  constructor() {

    this.speechConfig = sdk.SpeechConfig.fromSubscription(subscriptionKey, serviceRegion);
    this.speechConfig.speechSynthesisLanguage = "ro-RO";
    this.speechConfig.speechSynthesisVoiceName = "ro-RO-AlinaNeural";
  }

  isSpeaking() {
    return globalThis.speakingStream;
  }

  async speak(message: string) {
    this.player = new sdk.SpeakerAudioDestination();
    this.player.onAudioEnd = s => { globalThis.speakingStream = false; }

    this.synthesizer = new sdk.SpeechSynthesizer(this.speechConfig, sdk.AudioConfig.fromSpeakerOutput(this.player));
    globalThis.speakingStream = true;
    this.synthesizer.speakTextAsync(message, (result => {
      this.synthesizer.close();
    }));
  }

  stop() {
    try {
      this.player?.close();
    }
    catch (e) {
      console.error(e);
    }
  }
}
