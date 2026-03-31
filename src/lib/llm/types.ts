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

/** 单次 API 返回的 token 用量（各供应商字段已归一化） */
export interface TokenUsage {
  promptTokens?: number;
  completionTokens?: number;
  totalTokens?: number;
}

export interface LLMResult {
  text: string;
  usage?: TokenUsage;
}

export interface BaseLLMAdapter {
  analyzeImage(base64Data: string, mimeType: string): Promise<LLMResult>;
  generatePRD(analyses: string[]): Promise<LLMResult>;
}
