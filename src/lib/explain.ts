import type { ReasonCode } from '@/lib/availability';

export type ExplainInput = {
  roomLabel: string;
  start: number;
  end: number;
  isAvailable: boolean;
  reasonCode: ReasonCode;
};

export type ExplainOutput = {
  explanation: string;
};

export type ExplainAdapter = (input: ExplainInput) => Promise<ExplainOutput>;

const EXPLAINABLE_REASONS: ReadonlySet<ReasonCode> = new Set([
  'AVAILABLE',
  'PAST_START',
  'MAX_DURATION',
  'BLOCKED',
  'OVERLAP',
]);

const FALLBACK_TEXT: Record<ReasonCode, string> = {
  AVAILABLE: 'The room is free for the requested time. You may proceed with booking.',
  PAST_START: 'The requested start time is at or before the current time.',
  MAX_DURATION: 'The requested duration exceeds the maximum allowed.',
  BLOCKED: 'The room is currently blocked and cannot be booked.',
  OVERLAP: 'The requested time overlaps an existing booking.',
  INVALID_FORMAT: 'The input was not valid.',
  OUT_OF_RANGE: 'The requested time is out of range.',
  END_BEFORE_START: 'The end time must be after the start time.',
};

const TIMEOUT_MS = 3000;
const MAX_EXPLANATION_CHARS = 280;

export function validateInput(input: unknown): input is ExplainInput {
  if (typeof input !== 'object' || input === null) return false;
  const r = input as Record<string, unknown>;
  if (typeof r.roomLabel !== 'string' || r.roomLabel.length === 0 || r.roomLabel.length > 40) return false;
  if (typeof r.start !== 'number' || !Number.isInteger(r.start) || r.start < 0 || r.start > 1440) return false;
  if (typeof r.end !== 'number' || !Number.isInteger(r.end) || r.end < 0 || r.end > 1440) return false;
  if (typeof r.isAvailable !== 'boolean') return false;
  if (typeof r.reasonCode !== 'string' || !EXPLAINABLE_REASONS.has(r.reasonCode as ReasonCode)) return false;
  return true;
}

export function validateOutput(output: unknown): output is ExplainOutput {
  if (typeof output !== 'object' || output === null) return false;
  const r = output as Record<string, unknown>;
  if (typeof r.explanation !== 'string') return false;
  if (r.explanation.length === 0 || r.explanation.length > MAX_EXPLANATION_CHARS) return false;
  return true;
}

export function fallbackText(reasonCode: ReasonCode): string {
  return FALLBACK_TEXT[reasonCode] ?? 'No explanation available.';
}

/**
 * Mock adapter — clearly labeled. Builds a deterministic sentence from reasonCode.
 * Does not call any external service and never reads instructions from input text.
 */
export const mockExplainAdapter: ExplainAdapter = async (input) => {
  const label = input.roomLabel;
  const range = `${input.start}-${input.end}`;
  if (input.isAvailable) {
    return { explanation: `${label} is available for ${range}. The slot is free of conflicts.` };
  }
  const base: Record<string, string> = {
    PAST_START: `${label} cannot be booked for ${range}: the start time is at or before now.`,
    MAX_DURATION: `${label} cannot be booked for ${range}: the duration exceeds the maximum.`,
    BLOCKED: `${label} cannot be booked for ${range}: the room is blocked.`,
    OVERLAP: `${label} cannot be booked for ${range}: it overlaps an existing booking.`,
  };
  return { explanation: base[input.reasonCode] ?? fallbackText(input.reasonCode) };
};

function withTimeout(promise: Promise<ExplainOutput>): Promise<ExplainOutput> {
  return new Promise((resolve, reject) => {
    const timer = setTimeout(() => reject(new Error('Explain timeout')), TIMEOUT_MS);
    promise.then(
      (v) => { clearTimeout(timer); resolve(v); },
      (e) => { clearTimeout(timer); reject(e); },
    );
  });
}

export async function explainAvailability(
  input: ExplainInput,
  adapter: ExplainAdapter = mockExplainAdapter,
): Promise<ExplainOutput> {
  if (!validateInput(input)) {
    return { explanation: 'No explanation available.' };
  }
  try {
    const raw = await withTimeout(adapter(input));
    if (validateOutput(raw)) return raw;
    return { explanation: fallbackText(input.reasonCode) };
  } catch {
    return { explanation: fallbackText(input.reasonCode) };
  }
}
