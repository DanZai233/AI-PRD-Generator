import { LLMConfig, BaseLLMAdapter } from "./types";
import { GeminiAdapter } from "./gemini-adapter";
import { DoubaoAdapter } from "./doubao-adapter";
import { OpenAIAdapter } from "./openai-adapter";
import { ClaudeAdapter } from "./claude-adapter";
import { QwenAdapter } from "./qwen-adapter";
import { ErnieAdapter } from "./ernie-adapter";
import { ChatGLMAdapter } from "./chatglm-adapter";
import { KimiAdapter } from "./kimi-adapter";
import { DeepSeekAdapter } from "./deepseek-adapter";
import { MinimaxAdapter } from "./minimax-adapter";
import { YiAdapter } from "./yi-adapter";
import { OpenRouterAdapter } from "./openrouter-adapter";

export function createLLMAdapter(config: LLMConfig): BaseLLMAdapter {
  switch (config.provider) {
    case 'gemini':
      return new GeminiAdapter(
        config.apiKey || process.env.GEMINI_API_KEY || '',
        config.model || 'gemini-2.5-pro-preview-03-25'
      );
    case 'doubao':
      return new DoubaoAdapter(
        config.apiKey || '',
        config.model || 'doubao-pro-4k',
        config.endpoint || 'https://ark.cn-beijing.volces.com/api/v3'
      );
    case 'openai':
      return new OpenAIAdapter(
        config.apiKey || '',
        config.model || 'gpt-4o',
        config.endpoint || 'https://api.openai.com/v1'
      );
    case 'openrouter':
      return new OpenRouterAdapter(
        config.apiKey || '',
        config.model || 'openai/gpt-4o-mini',
        config.endpoint || 'https://openrouter.ai/api/v1'
      );
    case 'claude':
      return new ClaudeAdapter(
        config.apiKey || '',
        config.model || 'claude-3-5-sonnet-20241022',
        config.endpoint || 'https://api.anthropic.com'
      );
    case 'qwen':
      return new QwenAdapter(
        config.apiKey || '',
        config.model || 'qwen-vl-max',
        config.endpoint || 'https://dashscope.aliyuncs.com/compatible-mode/v1'
      );
    case 'ernie':
      return new ErnieAdapter(
        config.apiKey || '',
        config.model || 'ernie-4.0-8k',
        config.endpoint || 'https://aip.baidubce.com/rpc/2.0/ai_custom/v1/wenxinworkshop/chat'
      );
    case 'chatglm':
      return new ChatGLMAdapter(
        config.apiKey || '',
        config.model || 'glm-4v',
        config.endpoint || 'https://open.bigmodel.cn/api/paas/v4'
      );
    case 'kimi':
      return new KimiAdapter(
        config.apiKey || '',
        config.model || 'moonshot-v1-8k-vision',
        config.endpoint || 'https://api.moonshot.cn/v1'
      );
    case 'deepseek':
      return new DeepSeekAdapter(
        config.apiKey || '',
        config.model || 'deepseek-chat',
        config.endpoint || 'https://api.deepseek.com'
      );
    case 'minimax':
      return new MinimaxAdapter(
        config.apiKey || '',
        config.model || 'abab6.5s-chat',
        config.endpoint || 'https://api.minimax.chat/v1'
      );
    case 'yi':
      return new YiAdapter(
        config.apiKey || '',
        config.model || 'yi-vision',
        config.endpoint || 'https://api.lingyiwanwu.com/v1'
      );
    default:
      throw new Error(`Unsupported LLM provider: ${config.provider}`);
  }
}

export type { LLMConfig, BaseLLMAdapter } from "./types";

export const AVAILABLE_PROVIDERS = [
  {
    id: 'gemini',
    name: 'Google Gemini',
    models: ['gemini-2.5-pro-preview-03-25', 'gemini-2.5-flash-preview', 'gemini-2.0-pro'],
    requiresApiKey: true,
    supportsVision: true,
    customModel: false,
  },
  {
    id: 'doubao',
    name: '火山引擎 Doubao',
    models: ['doubao-pro-4k', 'doubao-pro-32k', 'doubao-lite-4k', 'doubao-pro-128k'],
    requiresApiKey: true,
    supportsVision: true,
    customModel: true,
  },
  {
    id: 'openai',
    name: 'OpenAI',
    models: ['gpt-4o', 'gpt-4o-mini', 'gpt-4-turbo', 'gpt-3.5-turbo'],
    requiresApiKey: true,
    supportsVision: true,
    customModel: false,
  },
  {
    id: 'openrouter',
    name: 'OpenRouter',
    // OpenRouter models usually look like: "openai/gpt-4o", "anthropic/claude-3.5-sonnet", etc.
    // Custom model input is enabled, so you can type any model name you have access to.
    models: ['openai/gpt-4o-mini', 'openai/gpt-4o'],
    requiresApiKey: true,
    supportsVision: true,
    customModel: true,
  },
  {
    id: 'claude',
    name: 'Anthropic Claude',
    models: ['claude-3-5-sonnet-20241022', 'claude-3-5-haiku-20241022', 'claude-3-opus-20240229'],
    requiresApiKey: true,
    supportsVision: true,
    customModel: false,
  },
  {
    id: 'qwen',
    name: '阿里云 通义千问',
    models: ['qwen-vl-max', 'qwen-vl-plus', 'qwen-vl-v1'],
    requiresApiKey: true,
    supportsVision: true,
    customModel: true,
  },
  {
    id: 'ernie',
    name: '百度 文心一言',
    models: ['ernie-4.0-8k', 'ernie-3.5-8k', 'ernie-speed-8k'],
    requiresApiKey: true,
    supportsVision: true,
    customModel: true,
  },
  {
    id: 'chatglm',
    name: '智谱AI ChatGLM',
    models: ['glm-4v', 'glm-4-plus', 'glm-4'],
    requiresApiKey: true,
    supportsVision: true,
    customModel: true,
  },
  {
    id: 'kimi',
    name: '月之暗面 Kimi',
    models: ['moonshot-v1-8k-vision', 'moonshot-v1-128k-vision', 'moonshot-v1-32k'],
    requiresApiKey: true,
    supportsVision: true,
    customModel: true,
  },
  {
    id: 'deepseek',
    name: '深度求索 DeepSeek',
    models: ['deepseek-chat', 'deepseek-coder'],
    requiresApiKey: true,
    supportsVision: false,
    customModel: true,
  },
  {
    id: 'minimax',
    name: 'MiniMax',
    models: ['abab6.5s-chat', 'abab6.5g-chat'],
    requiresApiKey: true,
    supportsVision: true,
    customModel: true,
  },
  {
    id: 'yi',
    name: '零一万物 Yi',
    models: ['yi-vision', 'yi-large', 'yi-medium'],
    requiresApiKey: true,
    supportsVision: true,
    customModel: true,
  },
];
