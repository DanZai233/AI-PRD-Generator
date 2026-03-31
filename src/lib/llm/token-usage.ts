import type { TokenUsage } from "./types";

/** OpenAI 兼容：prompt_tokens / completion_tokens / total_tokens */
export function parseOpenAICompatibleUsage(data: unknown): TokenUsage | undefined {
  if (!data || typeof data !== "object") return undefined;
  const u = (data as Record<string, unknown>).usage;
  if (!u || typeof u !== "object") return undefined;
  const usage = u as Record<string, unknown>;
  const pt = usage.prompt_tokens ?? usage.promptTokens;
  const ct = usage.completion_tokens ?? usage.completionTokens;
  const tt = usage.total_tokens ?? usage.totalTokens;
  const promptTokens = typeof pt === "number" ? pt : undefined;
  const completionTokens = typeof ct === "number" ? ct : undefined;
  let totalTokens = typeof tt === "number" ? tt : undefined;
  if (totalTokens == null && promptTokens != null && completionTokens != null) {
    totalTokens = promptTokens + completionTokens;
  }
  if (promptTokens == null && completionTokens == null && totalTokens == null) return undefined;
  return { promptTokens, completionTokens, totalTokens };
}

/** Anthropic Messages：input_tokens / output_tokens */
export function parseClaudeUsage(data: unknown): TokenUsage | undefined {
  if (!data || typeof data !== "object") return undefined;
  const u = (data as Record<string, unknown>).usage;
  if (!u || typeof u !== "object") return undefined;
  const usage = u as Record<string, unknown>;
  const input = usage.input_tokens;
  const output = usage.output_tokens;
  const promptTokens = typeof input === "number" ? input : undefined;
  const completionTokens = typeof output === "number" ? output : undefined;
  if (promptTokens == null && completionTokens == null) return undefined;
  const totalTokens =
    promptTokens != null && completionTokens != null ? promptTokens + completionTokens : undefined;
  return { promptTokens, completionTokens, totalTokens };
}

/** Google GenAI：usageMetadata */
export function parseGeminiUsageMetadata(meta: unknown): TokenUsage | undefined {
  if (!meta || typeof meta !== "object") return undefined;
  const m = meta as Record<string, unknown>;
  const pt = m.promptTokenCount;
  const ct = m.candidatesTokenCount;
  const tt = m.totalTokenCount;
  const promptTokens = typeof pt === "number" ? pt : undefined;
  const completionTokens = typeof ct === "number" ? ct : undefined;
  let totalTokens = typeof tt === "number" ? tt : undefined;
  if (totalTokens == null && promptTokens != null && completionTokens != null) {
    totalTokens = promptTokens + completionTokens;
  }
  if (promptTokens == null && completionTokens == null && totalTokens == null) return undefined;
  return { promptTokens, completionTokens, totalTokens };
}

/** 合并多次调用的用量（截图分析 N 次 + 生成 PRD 1 次） */
export function sumTokenUsages(usages: (TokenUsage | undefined)[]): TokenUsage | null {
  let promptSum = 0;
  let completionSum = 0;
  let totalSum = 0;
  let hasPrompt = false;
  let hasCompletion = false;
  let hasTotal = false;

  for (const u of usages) {
    if (!u) continue;
    if (u.promptTokens != null) {
      promptSum += u.promptTokens;
      hasPrompt = true;
    }
    if (u.completionTokens != null) {
      completionSum += u.completionTokens;
      hasCompletion = true;
    }
    if (u.totalTokens != null) {
      totalSum += u.totalTokens;
      hasTotal = true;
    }
  }

  if (!hasPrompt && !hasCompletion && !hasTotal) return null;

  let totalTokens: number | undefined;
  if (hasTotal) {
    totalTokens = totalSum;
  } else if (hasPrompt || hasCompletion) {
    totalTokens = promptSum + completionSum;
  }

  return {
    promptTokens: hasPrompt ? promptSum : undefined,
    completionTokens: hasCompletion ? completionSum : undefined,
    totalTokens,
  };
}

const CUMULATIVE_STORAGE_KEY = "llm-token-cumulative-v1";

export interface CumulativeTokenStats {
  promptTokens: number;
  completionTokens: number;
  totalTokens: number;
  runs: number;
}

export function loadCumulativeTokenStats(): CumulativeTokenStats {
  if (typeof localStorage === "undefined") {
    return { promptTokens: 0, completionTokens: 0, totalTokens: 0, runs: 0 };
  }
  try {
    const raw = localStorage.getItem(CUMULATIVE_STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw) as CumulativeTokenStats;
      if (
        typeof parsed.promptTokens === "number" &&
        typeof parsed.completionTokens === "number" &&
        typeof parsed.totalTokens === "number" &&
        typeof parsed.runs === "number"
      ) {
        return parsed;
      }
    }
  } catch {
    /* ignore */
  }
  return { promptTokens: 0, completionTokens: 0, totalTokens: 0, runs: 0 };
}

/** 将「本次」汇总写入本地累计（仅浏览器本地统计，不上传） */
export function addRunToCumulativeStats(run: TokenUsage | null): CumulativeTokenStats {
  const prev = loadCumulativeTokenStats();
  if (!run) return prev;

  const p = run.promptTokens ?? 0;
  const c = run.completionTokens ?? 0;
  const t =
    run.totalTokens ??
    (p > 0 || c > 0 ? p + c : 0);

  const next: CumulativeTokenStats = {
    promptTokens: prev.promptTokens + p,
    completionTokens: prev.completionTokens + c,
    totalTokens: prev.totalTokens + t,
    runs: prev.runs + 1,
  };

  if (typeof localStorage !== "undefined") {
    localStorage.setItem(CUMULATIVE_STORAGE_KEY, JSON.stringify(next));
  }
  return next;
}

const EMPTY_CUMULATIVE: CumulativeTokenStats = {
  promptTokens: 0,
  completionTokens: 0,
  totalTokens: 0,
  runs: 0,
};

/** 清除本机累计统计（localStorage） */
export function clearCumulativeTokenStats(): CumulativeTokenStats {
  if (typeof localStorage !== "undefined") {
    try {
      localStorage.removeItem(CUMULATIVE_STORAGE_KEY);
    } catch {
      /* ignore */
    }
  }
  return { ...EMPTY_CUMULATIVE };
}
