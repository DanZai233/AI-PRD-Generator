export interface LLMProvider {
  id: string;
  name: string;
  models: string[];
  requiresApiKey: boolean;
  supportsVision: boolean;
  customModel: boolean;
}

export interface LLMConfig {
  provider: string;
  apiKey?: string;
  model?: string;
  endpoint?: string;
}

export interface LLMResponse {
  text: string;
}

export interface BaseLLMAdapter {
  analyzeImage(base64Data: string, mimeType: string): Promise<string>;
  generatePRD(analyses: string[]): Promise<string>;
}
