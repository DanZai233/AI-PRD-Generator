<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

# Run and deploy your AI Studio app

This contains everything you need to run your app locally.

View your app in AI Studio: https://ai.studio/apps/c892f65a-ea91-424f-b287-e69a4dedf115

## Run Locally

**Prerequisites:** Node.js

1. Install dependencies:
   `npm install`
2. Run the app:
   `npm run dev`
3. Open the app in your browser and click the "Settings" button to configure your LLM provider

## LLM Providers

This application supports 12 major LLM providers that can be configured directly from the UI:

### 1. Google Gemini
- **Get API Key**: https://aistudio.google.com/app/apikey
- **Available Models**: gemini-2.5-pro-preview-03-25, gemini-2.5-flash-preview, gemini-2.0-pro
- **Supports Vision**: ✅

### 2. OpenAI
- **Get API Key**: https://platform.openai.com/api-keys
- **Available Models**: gpt-4o, gpt-4o-mini, gpt-4-turbo, gpt-3.5-turbo
- **Supports Vision**: ✅
- **Default Endpoint**: https://api.openai.com/v1

### 3. OpenRouter
- **Get API Key**: https://openrouter.ai/keys
- **Available Models**: 支持自定义模型名称输入；可使用类似 `openai/gpt-4o`、`openai/gpt-4o-mini` 这样的模型标识
- **Supports Vision**: ✅（取决于你选择的具体模型是否支持视觉）
- **Default Endpoint**: https://openrouter.ai/api/v1

### 4. Anthropic Claude
- **Get API Key**: https://console.anthropic.com/
- **Available Models**: claude-3-5-sonnet-20241022, claude-3-5-haiku-20241022, claude-3-opus-20240229
- **Supports Vision**: ✅
- **Default Endpoint**: https://api.anthropic.com

### 5. 火山引擎 Doubao (Volcengine)
- **Get API Key**: https://console.volcengine.com/ark
- **Available Models**: doubao-pro-4k, doubao-pro-32k, doubao-lite-4k, doubao-pro-128k (custom input supported)
- **Supports Vision**: ✅
- **Default Endpoint**: https://ark.cn-beijing.volces.com/api/v3

### 6. 阿里云 通义千问 (Qwen)
- **Get API Key**: https://dashscope.aliyun.com/api
- **Available Models**: qwen-vl-max, qwen-vl-plus, qwen-vl-v1 (custom input supported)
- **Supports Vision**: ✅
- **Default Endpoint**: https://dashscope.aliyuncs.com/compatible-mode/v1

### 7. 百度 文心一言 (Ernie)
- **Get API Key**: https://cloud.baidu.com/doc/WENXINWORKSHOP/s/Ilkkrb0i5
- **Available Models**: ernie-4.0-8k, ernie-3.5-8k, ernie-speed-8k (custom input supported)
- **Supports Vision**: ✅
- **Default Endpoint**: https://aip.baidubce.com/rpc/2.0/ai_custom/v1/wenxinworkshop/chat
- **Note**: API Key format should be `apiKey.secretKey`

### 8. 智谱AI ChatGLM
- **Get API Key**: https://open.bigmodel.cn/usercenter/apikeys
- **Available Models**: glm-4v, glm-4-plus, glm-4 (custom input supported)
- **Supports Vision**: ✅
- **Default Endpoint**: https://open.bigmodel.cn/api/paas/v4

### 9. 月之暗面 Kimi
- **Get API Key**: https://platform.moonshot.cn/console/api-keys
- **Available Models**: moonshot-v1-8k-vision, moonshot-v1-128k-vision, moonshot-v1-32k (custom input supported)
- **Supports Vision**: ✅
- **Default Endpoint**: https://api.moonshot.cn/v1

### 10. 深度求索 DeepSeek
- **Get API Key**: https://platform.deepseek.com/api_keys
- **Available Models**: deepseek-chat, deepseek-coder (custom input supported)
- **Supports Vision**: ❌
- **Default Endpoint**: https://api.deepseek.com

### 11. MiniMax
- **Get API Key**: https://api.minimax.chat/
- **Available Models**: abab6.5s-chat, abab6.5g-chat (custom input supported)
- **Supports Vision**: ✅
- **Default Endpoint**: https://api.minimax.chat/v1

### 12. 零一万物 Yi
- **Get API Key**: https://platform.lingyiwanwu.com/api_keys
- **Available Models**: yi-vision, yi-large, yi-medium (custom input supported)
- **Supports Vision**: ✅
- **Default Endpoint**: https://api.lingyiwanwu.com/v1

## Configuration

All LLM configurations are saved to your browser's localStorage, so your settings persist across sessions. You can:
- Switch between providers anytime
- Select different models (dropdown or custom input for some providers)
- Configure custom API endpoints for most providers
- Update your API keys securely
- Use preset models as quick references for custom input

## Features

- Upload multiple screenshots
- AI-powered image analysis
- Automatic PRD generation
- Support for 12 major LLM providers with vision capabilities
- Configurable LLM providers via UI
- Custom model name input for certain providers
- Custom API endpoint configuration
- Local storage for persistent settings
- Responsive and modern UI

## Usage Tips

1. For providers with custom model input, you can either select from presets or type any available model name
2. Click "Show Details" in the settings panel to access endpoint configuration
3. API keys are stored locally in your browser and never sent to any third party except the selected LLM provider
4. Some providers (like DeepSeek) may not support image analysis - text-based PRD generation will still work
5. Make sure you have sufficient API quota/balance before starting a large PRD generation
