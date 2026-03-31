import { BaseLLMAdapter, LLMResult } from "./types";
import { parseClaudeUsage } from "./token-usage";

export class ClaudeAdapter implements BaseLLMAdapter {
  private apiKey: string;
  private model: string;
  private endpoint: string;

  constructor(apiKey: string, model: string = "claude-3-5-sonnet-20241022", endpoint: string = "https://api.anthropic.com") {
    this.apiKey = apiKey;
    this.model = model;
    this.endpoint = endpoint;
  }

  private async callAPI(messages: any[]): Promise<LLMResult> {
    const response = await fetch(`${this.endpoint}/v1/messages`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': this.apiKey,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model: this.model,
        messages: messages,
        max_tokens: 4096,
      }),
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(`Claude API 调用失败: ${error}`);
    }

    const data = await response.json();
    return {
      text: data.content?.[0]?.text || "",
      usage: parseClaudeUsage(data),
    };
  }

  async analyzeImage(base64Data: string, mimeType: string): Promise<LLMResult> {
    const messages = [
      {
        role: "user",
        content: [
          {
            type: "image",
            source: {
              type: "base64",
              media_type: mimeType,
              data: base64Data,
            },
          },
          {
            type: "text",
            text: "请详细分析这张应用截图。描述界面上的所有元素、该页面的主要目的、提供的功能以及支持的用户流程。请以Markdown格式输出分析结果。",
          },
        ],
      },
    ];

    return await this.callAPI(messages);
  }

  async generatePRD(analyses: string[]): Promise<LLMResult> {
    const prompt = `我已经分析了一个应用的多张截图。以下是每张截图的详细分析：

${analyses.map((a, i) => `--- 截图 ${i} 分析 ---\n${a}\n`).join('\n')}

基于这些分析，请编写一份全面的产品需求文档（PRD）。PRD应包括：
1. 产品概述
2. 目标用户
3. 核心功能列表
4. 用户流程
5. 逐屏详细说明
6. 非功能性需求

在"逐屏详细说明"部分，请务必使用确切的Markdown语法 \`![截图 0](image_0)\`、\`![截图 1](image_1)\` 等来引用对应的截图，并将该截图的详细说明和功能点放在图片下方。请严格遵守 \`image_0\`, \`image_1\` 这种命名格式，不要加后缀名。请以Markdown格式输出最终的PRD。`;

    const messages = [
      {
        role: "user",
        content: prompt,
      },
    ];

    return await this.callAPI(messages);
  }
}
