export enum AppConfig {
  ModelShowcases = "model_showcases",
  TopUpOptions = "top_up_options",
  Free_Credits_Amount = "free_credits_amount",
  QR_Code_Url = "qr_code_url",
}

export enum OutputFormat {
  Text = "text",
  ChunkedText = "chunked_text",
  Uri = "uri",
}

export enum MessageRole {
  USER = "user",
  SYSTEM = "system",
  ASSISTANT = "assistant",
}

export enum FileExtension {
  Mp3 = "mp3",
  Mp4 = "mp4",
  Webp = "webp",
  Gif = "gif",
  Pdf = "pdf",
  Png = "png",
  Jpeg = "jpeg",
  Jpg = "jpg",
  Wav = "wav",
}

export enum IncompatibleBrowser {
  UCBrowser = "UCBrowser",
  MQQBrowser = "MQQBrowser",
  QQBrowser = "QQBrowser",
  SE360 = "360SE",
  EE360 = "360EE",
}

export enum ModelStatus {
  Online = "online",
  Offline = "offline",
}

export enum ModelProvider {
  Replicate = "r",
  HuggingFace = "h",
  OpenAI = "o",
  Gemini = "g",
  Suno = "s",
  Claude = "c",
  Ernie = "e",
  Midjourney = "m",
  Azure = "a",
}

export enum AuthProvider {
  Google = "google",
  Github = "github",
}
